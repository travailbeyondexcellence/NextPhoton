import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API Routes for Practice Assignments CRUD Operations
 *
 * This file provides RESTful API endpoints for managing practice assignments:
 * - GET: Retrieve all assignments or get statistics
 * - POST: Create a new assignment
 * - PUT: Update an existing assignment
 * - DELETE: Delete an assignment
 *
 * All operations persist data to the mock-data/practice-assignments.json file
 */

// Path to the mock database JSON file in the mock-data directory
const DB_FILE_PATH = path.join(process.cwd(), 'mock-data', 'practice-assignments.json');

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
 * GET /api/practice-assignments
 * GET /api/practice-assignments?stats=true
 *
 * Fetches all practice assignments from the mock database file
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
      const assignments = jsonData.data;
      const active = assignments.filter(a => a.status === "Assigned" || a.status === "In Progress").length;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const thisWeekCompleted = assignments.filter(a => {
        if (a.status !== "Graded" && a.status !== "Submitted") return false;
        return new Date(a.submittedAt || a.gradedAt || "") >= weekAgo;
      }).length;

      const completedWithScores = assignments.filter(a => a.obtainedMarks !== undefined);
      const averageScore = completedWithScores.length > 0
        ? Math.round(completedWithScores.reduce((sum: number, a: any) =>
            sum + ((a.obtainedMarks / a.totalMarks) * 100), 0) / completedWithScores.length)
        : 0;

      const overdue = assignments.filter(a => a.status === "Overdue").length;

      return NextResponse.json({
        success: true,
        data: {
          active,
          thisWeekCompleted,
          averageScore,
          overdue,
          total: assignments.length
        }
      });
    }

    // Return all assignments
    return NextResponse.json({
      success: true,
      data: jsonData.data,
      count: jsonData.data.length,
      metadata: jsonData.metadata
    });
  } catch (error) {
    console.error('Error reading practice assignments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read practice assignments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/practice-assignments
 *
 * Creates a new practice assignment and saves it to the mock database file
 * Automatically generates an assignment ID and sets timestamps
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const newAssignmentData = await request.json();

    // Validate required fields
    if (!newAssignmentData.title || !newAssignmentData.subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and subject are required'
        },
        { status: 400 }
      );
    }

    // Read existing assignments
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const jsonData: MockDataFile = JSON.parse(fileContents);

    // Generate new assignment ID (find max existing ID and increment)
    const maxId = jsonData.data.reduce((max, assignment) => {
      const idNum = parseInt(assignment.id.replace('pa', ''));
      return idNum > max ? idNum : max;
    }, 0);
    const newAssignmentId = `pa${String(maxId + 1).padStart(3, '0')}`;

    // Create the new assignment with defaults
    const today = new Date().toISOString().split('T')[0];
    const newAssignment = {
      id: newAssignmentId,
      title: newAssignmentData.title,
      description: newAssignmentData.description || '',
      subject: newAssignmentData.subject,
      topic: newAssignmentData.topic || '',
      assignedTo: newAssignmentData.assignedTo || [],
      assignedBy: newAssignmentData.assignedBy || '',
      educatorName: newAssignmentData.educatorName || '',
      createdAt: today,
      dueDate: newAssignmentData.dueDate,
      status: newAssignmentData.status || 'Assigned',
      difficulty: newAssignmentData.difficulty || 'Medium',
      estimatedTime: newAssignmentData.estimatedTime || 30,
      questions: newAssignmentData.questions || [],
      totalMarks: newAssignmentData.totalMarks || 0,
      attempts: 0,
      maxAttempts: newAssignmentData.maxAttempts || 3
    };

    // Add the new assignment to the data array
    jsonData.data.push(newAssignment);

    // Update metadata
    jsonData.metadata.count = jsonData.data.length;
    jsonData.metadata.lastUpdated = new Date().toISOString();

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Practice assignment created successfully',
      data: newAssignment
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating practice assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create practice assignment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/practice-assignments
 *
 * Updates an existing practice assignment in the mock database file
 * Requires id in the request body
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const updatedAssignmentData = await request.json();

    // Validate required fields
    if (!updatedAssignmentData.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Assignment ID is required'
        },
        { status: 400 }
      );
    }

    // Read existing assignments
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const jsonData: MockDataFile = JSON.parse(fileContents);

    // Find the index of the assignment to update
    const assignmentIndex = jsonData.data.findIndex(
      (assignment: any) => assignment.id === updatedAssignmentData.id
    );

    if (assignmentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Assignment with ID ${updatedAssignmentData.id} not found`
        },
        { status: 404 }
      );
    }

    // Update the assignment (merge with existing data)
    jsonData.data[assignmentIndex] = {
      ...jsonData.data[assignmentIndex],
      ...updatedAssignmentData
    };

    // Update metadata
    jsonData.metadata.lastUpdated = new Date().toISOString();

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Practice assignment updated successfully',
      data: jsonData.data[assignmentIndex]
    });
  } catch (error) {
    console.error('Error updating practice assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update practice assignment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/practice-assignments?id=xxx
 *
 * Deletes a practice assignment by ID from the mock database file
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');

    if (!assignmentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Assignment ID is required'
        },
        { status: 400 }
      );
    }

    // Read existing assignments
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const jsonData: MockDataFile = JSON.parse(fileContents);

    // Find and remove the assignment
    const originalLength = jsonData.data.length;
    jsonData.data = jsonData.data.filter((assignment: any) => assignment.id !== assignmentId);

    if (jsonData.data.length === originalLength) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Assignment with ID ${assignmentId} not found`
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
      message: 'Practice assignment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting practice assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete practice assignment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
