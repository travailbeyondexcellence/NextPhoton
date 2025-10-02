import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API Routes for EduCare Tasks CRUD Operations
 *
 * This file provides RESTful API endpoints for managing EduCare tasks:
 * - GET: Retrieve all tasks or get statistics
 * - POST: Create a new task
 * - PUT: Update an existing task
 * - DELETE: Delete a task
 *
 * All operations persist data to the mock-data/educare-tasks.json file
 */

// Path to the mock database JSON file in the mock-data directory
const DB_FILE_PATH = path.join(process.cwd(), 'mock-data', 'educare-tasks.json');

/**
 * Interface for the JSON file structure
 */
interface MockDataFile {
  metadata: {
    lastUpdated: string;
    version: string;
    count: number;
    description: string;
  };
  data: any[];
}

/**
 * GET /api/educare-tasks
 * GET /api/educare-tasks?stats=true
 *
 * Fetches all educare tasks from the mock database file
 * If stats=true query param is provided, returns statistics instead
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const getStats = searchParams.get('stats') === 'true';

    // Read the JSON file
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const jsonData: MockDataFile = JSON.parse(fileContents);

    // If stats requested, calculate and return statistics
    if (getStats) {
      const tasks = jsonData.data;
      const active = tasks.filter(t => t.status === 'Active').length;
      const pending = tasks.filter(t => t.status === 'Pending Review').length;
      const completed = tasks.filter(t => t.status === 'Completed').length;
      const overdue = tasks.filter(t => t.status === 'Overdue').length;
      const averageProgress = tasks.length > 0
        ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
        : 0;

      return NextResponse.json({
        success: true,
        data: {
          active,
          pending,
          completed,
          overdue,
          averageProgress,
          total: tasks.length
        }
      });
    }

    // Return all tasks
    return NextResponse.json({
      success: true,
      data: jsonData.data,
      count: jsonData.data.length,
      metadata: jsonData.metadata
    });
  } catch (error) {
    console.error('Error reading educare tasks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read educare tasks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/educare-tasks
 *
 * Creates a new educare task and saves it to the mock database file
 * Automatically generates a task ID and sets timestamps
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const newTaskData = await request.json();

    // Validate required fields
    if (!newTaskData.title || !newTaskData.description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and description are required'
        },
        { status: 400 }
      );
    }

    // Read existing tasks
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const jsonData: MockDataFile = JSON.parse(fileContents);

    // Generate new task ID (find max existing ID and increment)
    const maxId = jsonData.data.reduce((max, task) => {
      const idNum = parseInt(task.taskId.replace('ect', ''));
      return idNum > max ? idNum : max;
    }, 0);
    const newTaskId = `ect${String(maxId + 1).padStart(3, '0')}`;

    // Create the new task with defaults
    const now = new Date().toISOString().split('T')[0];
    const newTask = {
      taskId: newTaskId,
      title: newTaskData.title,
      description: newTaskData.description,
      status: newTaskData.status || 'Active',
      priority: newTaskData.priority || 'Medium',
      category: newTaskData.category || 'Academic Support',
      studentName: newTaskData.studentName,
      studentId: newTaskData.studentId || '',
      className: newTaskData.className,
      assignedTo: {
        id: newTaskData.assignedToId || '',
        name: newTaskData.assignedToName,
        role: newTaskData.assignedToRole
      },
      createdBy: newTaskData.createdBy || 'Admin',
      dueDate: newTaskData.dueDate,
      createdAt: now,
      updatedAt: now,
      progress: 0,
      impact: newTaskData.impact || 'Medium',
      tags: newTaskData.tags || [],
      followUpRequired: newTaskData.followUpRequired || false,
      parentNotificationSent: newTaskData.parentNotificationSent || false,
      comments: [],
      subtasks: []
    };

    // Add the new task to the data array
    jsonData.data.push(newTask);

    // Update metadata
    jsonData.metadata.count = jsonData.data.length;
    jsonData.metadata.lastUpdated = new Date().toISOString();

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'EduCare task created successfully',
      data: newTask
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating educare task:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create educare task',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/educare-tasks
 *
 * Updates an existing educare task in the mock database file
 * Requires taskId in the request body
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const updatedTaskData = await request.json();

    // Validate required fields
    if (!updatedTaskData.taskId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Task ID is required'
        },
        { status: 400 }
      );
    }

    // Read existing tasks
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const jsonData: MockDataFile = JSON.parse(fileContents);

    // Find the index of the task to update
    const taskIndex = jsonData.data.findIndex(
      (task: any) => task.taskId === updatedTaskData.taskId
    );

    if (taskIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Task with ID ${updatedTaskData.taskId} not found`
        },
        { status: 404 }
      );
    }

    // Update the task and set updatedAt timestamp
    const now = new Date().toISOString().split('T')[0];
    jsonData.data[taskIndex] = {
      ...jsonData.data[taskIndex],
      ...updatedTaskData,
      updatedAt: now
    };

    // Update metadata
    jsonData.metadata.lastUpdated = new Date().toISOString();

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'EduCare task updated successfully',
      data: jsonData.data[taskIndex]
    });
  } catch (error) {
    console.error('Error updating educare task:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update educare task',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/educare-tasks?taskId=xxx
 *
 * Deletes an educare task by ID from the mock database file
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Task ID is required'
        },
        { status: 400 }
      );
    }

    // Read existing tasks
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const jsonData: MockDataFile = JSON.parse(fileContents);

    // Find and remove the task
    const originalLength = jsonData.data.length;
    jsonData.data = jsonData.data.filter((task: any) => task.taskId !== taskId);

    if (jsonData.data.length === originalLength) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Task with ID ${taskId} not found`
        },
        { status: 404 }
      );
    }

    // Update metadata
    jsonData.metadata.count = jsonData.data.length;
    jsonData.metadata.lastUpdated = new Date().toISOString();

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'EduCare task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting educare task:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete educare task',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
