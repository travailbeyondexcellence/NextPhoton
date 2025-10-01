/**
 * API Route for Home Tasks CRUD Operations
 *
 * This route handles Create, Update, and Delete operations for home tasks
 * by directly modifying the home-tasks.json file in the mock-data folder.
 *
 * POST /api/home-tasks
 * - Updates the entire tasks array in the JSON file
 * - Request body: { data: HomeTask[] }
 * - Returns: { success: boolean, message: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, message: 'Invalid data format' },
        { status: 400 }
      )
    }

    // Path to the JSON file in the mock-data folder
    const filePath = path.join(process.cwd(), 'mock-data', 'home-tasks.json')

    // Read the existing file to preserve metadata
    const fileContent = await readFile(filePath, 'utf-8')
    const existingData = JSON.parse(fileContent)

    // Update the data while preserving metadata
    const updatedContent = {
      metadata: {
        ...existingData.metadata,
        lastUpdated: new Date().toISOString(),
        count: data.length
      },
      data: data
    }

    // Write the updated content back to the file
    await writeFile(
      filePath,
      JSON.stringify(updatedContent, null, 2),
      'utf-8'
    )

    return NextResponse.json({
      success: true,
      message: 'Tasks updated successfully',
      count: data.length
    })
  } catch (error) {
    console.error('Error updating home tasks:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update tasks' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/home-tasks
 * - Returns the current tasks from the JSON file
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'mock-data', 'home-tasks.json')
    const fileContent = await readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileContent)

    return NextResponse.json({
      success: true,
      data: jsonData.data,
      metadata: jsonData.metadata
    })
  } catch (error) {
    console.error('Error reading home tasks:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to read tasks' },
      { status: 500 }
    )
  }
}
