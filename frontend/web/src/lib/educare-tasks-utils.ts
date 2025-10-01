/**
 * EduCare Tasks CRUD Utilities
 *
 * This module provides functions to perform CRUD operations on EduCare tasks
 * using the mock JSON data file as a persistent storage layer.
 *
 * Note: In production, these functions would be replaced with actual API calls
 * to the backend server. For development purposes, we're using a JSON file
 * to simulate database persistence.
 */

import { type EduCareTask } from "@/app/(features)/EduCareTasks/educareTasksDummyData"
import fs from 'fs'
import path from 'path'

// Path to the mock data JSON file
const MOCK_DATA_PATH = path.join(process.cwd(), 'mock-data', 'educare-tasks.json')

/**
 * Interface for the JSON file structure
 */
interface MockDataFile {
  metadata: {
    lastUpdated: string
    version: string
    count: number
    description: string
  }
  data: EduCareTask[]
}

/**
 * Read all tasks from the JSON file
 * @returns Array of all EduCare tasks
 */
export async function getAllTasks(): Promise<EduCareTask[]> {
  try {
    const fileContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8')
    const jsonData: MockDataFile = JSON.parse(fileContent)
    return jsonData.data
  } catch (error) {
    console.error('Error reading educare tasks:', error)
    return []
  }
}

/**
 * Get a single task by ID
 * @param taskId - The ID of the task to retrieve
 * @returns The task object or null if not found
 */
export async function getTaskById(taskId: string): Promise<EduCareTask | null> {
  const tasks = await getAllTasks()
  return tasks.find(task => task.taskId === taskId) || null
}

/**
 * Create a new task
 * @param taskData - The task data to create
 * @returns The created task with generated ID
 */
export async function createTask(taskData: Omit<EduCareTask, 'taskId' | 'createdAt' | 'updatedAt' | 'progress' | 'comments' | 'subtasks'>): Promise<EduCareTask> {
  try {
    const fileContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8')
    const jsonData: MockDataFile = JSON.parse(fileContent)

    // Generate new task ID
    const maxId = jsonData.data.reduce((max, task) => {
      const idNum = parseInt(task.taskId.replace('ect', ''))
      return idNum > max ? idNum : max
    }, 0)
    const newTaskId = `ect${String(maxId + 1).padStart(3, '0')}`

    // Create the new task with defaults
    const now = new Date().toISOString().split('T')[0]
    const newTask: EduCareTask = {
      ...taskData,
      taskId: newTaskId,
      createdAt: now,
      updatedAt: now,
      progress: 0,
      comments: [],
      subtasks: []
    }

    // Add to data array
    jsonData.data.push(newTask)

    // Update metadata
    jsonData.metadata.count = jsonData.data.length
    jsonData.metadata.lastUpdated = new Date().toISOString()

    // Write back to file
    fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(jsonData, null, 2), 'utf-8')

    return newTask
  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }
}

/**
 * Update an existing task
 * @param taskId - The ID of the task to update
 * @param updates - Partial task data to update
 * @returns The updated task or null if not found
 */
export async function updateTask(taskId: string, updates: Partial<EduCareTask>): Promise<EduCareTask | null> {
  try {
    const fileContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8')
    const jsonData: MockDataFile = JSON.parse(fileContent)

    // Find the task index
    const taskIndex = jsonData.data.findIndex(task => task.taskId === taskId)

    if (taskIndex === -1) {
      return null
    }

    // Update the task
    const now = new Date().toISOString().split('T')[0]
    jsonData.data[taskIndex] = {
      ...jsonData.data[taskIndex],
      ...updates,
      updatedAt: now
    }

    // Update metadata
    jsonData.metadata.lastUpdated = new Date().toISOString()

    // Write back to file
    fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(jsonData, null, 2), 'utf-8')

    return jsonData.data[taskIndex]
  } catch (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task')
  }
}

/**
 * Delete a task
 * @param taskId - The ID of the task to delete
 * @returns True if deleted, false if not found
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const fileContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8')
    const jsonData: MockDataFile = JSON.parse(fileContent)

    // Find the task index
    const taskIndex = jsonData.data.findIndex(task => task.taskId === taskId)

    if (taskIndex === -1) {
      return false
    }

    // Remove the task
    jsonData.data.splice(taskIndex, 1)

    // Update metadata
    jsonData.metadata.count = jsonData.data.length
    jsonData.metadata.lastUpdated = new Date().toISOString()

    // Write back to file
    fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(jsonData, null, 2), 'utf-8')

    return true
  } catch (error) {
    console.error('Error deleting task:', error)
    throw new Error('Failed to delete task')
  }
}

/**
 * Calculate statistics from the tasks
 * @returns Object containing task statistics
 */
export async function getTaskStatistics() {
  const tasks = await getAllTasks()

  const active = tasks.filter(t => t.status === 'Active').length
  const pending = tasks.filter(t => t.status === 'Pending Review').length
  const completed = tasks.filter(t => t.status === 'Completed').length
  const overdue = tasks.filter(t => t.status === 'Overdue').length
  const averageProgress = tasks.length > 0
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0

  return {
    active,
    pending,
    completed,
    overdue,
    averageProgress,
    total: tasks.length
  }
}
