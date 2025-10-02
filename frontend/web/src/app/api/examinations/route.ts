import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the mock database JSON file
// All mock JSON database files are stored in src/mockData/
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'mockData', 'examinations.json');

/**
 * GET /api/examinations
 * Fetches all examinations from the mock database file
 */
export async function GET() {
  try {
    // Read the JSON file
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const examinations = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      data: examinations,
      count: examinations.length
    });
  } catch (error) {
    console.error('Error reading examinations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read examinations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/examinations
 * Creates a new examination and saves it to the mock database file
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const newExamination = await request.json();

    // Validate required fields
    if (!newExamination.title || !newExamination.subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and subject are required'
        },
        { status: 400 }
      );
    }

    // Read existing examinations
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const examinations = JSON.parse(fileContents);

    // Add the new examination to the beginning of the array
    examinations.unshift(newExamination);

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(examinations, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Examination created successfully',
      data: newExamination
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating examination:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create examination',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/examinations
 * Updates an existing examination in the mock database file
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const updatedExamination = await request.json();

    // Validate required fields
    if (!updatedExamination.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Examination ID is required'
        },
        { status: 400 }
      );
    }

    if (!updatedExamination.title || !updatedExamination.subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and subject are required'
        },
        { status: 400 }
      );
    }

    // Read existing examinations
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const examinations = JSON.parse(fileContents);

    // Find the index of the examination to update
    const index = examinations.findIndex((e: any) => e.id === updatedExamination.id);

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Examination with ID ${updatedExamination.id} not found`
        },
        { status: 404 }
      );
    }

    // Update the examination (preserve createdAt, update other fields)
    const originalCreatedAt = examinations[index].createdAt;
    examinations[index] = {
      ...updatedExamination,
      createdAt: originalCreatedAt
    };

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(examinations, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Examination updated successfully',
      data: examinations[index]
    });
  } catch (error) {
    console.error('Error updating examination:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update examination',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/examinations
 * Deletes an examination by ID from the mock database file
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Examination ID is required'
        },
        { status: 400 }
      );
    }

    // Read existing examinations
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const examinations = JSON.parse(fileContents);

    // Find and remove the examination
    const filteredExaminations = examinations.filter((e: any) => e.id !== id);

    if (filteredExaminations.length === examinations.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Examination with ID ${id} not found`
        },
        { status: 404 }
      );
    }

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(filteredExaminations, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Examination deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting examination:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete examination',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
