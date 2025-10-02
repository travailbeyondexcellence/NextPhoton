import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the mock database JSON file
// All mock JSON database files are stored in src/mockData/
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'mockData', 'dailyStudyPlans.json');

/**
 * GET /api/dailyStudyPlans
 * Fetches all daily study plans from the mock database file
 */
export async function GET() {
  try {
    // Read the JSON file
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const dailyStudyPlans = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      data: dailyStudyPlans,
      count: dailyStudyPlans.length
    });
  } catch (error) {
    console.error('Error reading daily study plans:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read daily study plans',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dailyStudyPlans
 * Creates a new daily study plan and saves it to the mock database file
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const newPlan = await request.json();

    // Validate required fields
    if (!newPlan.title || !newPlan.date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and date are required'
        },
        { status: 400 }
      );
    }

    // Read existing plans
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const dailyStudyPlans = JSON.parse(fileContents);

    // Add the new plan to the beginning of the array
    dailyStudyPlans.unshift(newPlan);

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dailyStudyPlans, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Daily study plan created successfully',
      data: newPlan
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating daily study plan:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create daily study plan',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/dailyStudyPlans
 * Updates an existing daily study plan in the mock database file
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const updatedPlan = await request.json();

    // Validate required fields
    if (!updatedPlan.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Plan ID is required'
        },
        { status: 400 }
      );
    }

    if (!updatedPlan.title || !updatedPlan.date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and date are required'
        },
        { status: 400 }
      );
    }

    // Read existing plans
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const dailyStudyPlans = JSON.parse(fileContents);

    // Find the index of the plan to update
    const index = dailyStudyPlans.findIndex((p: any) => p.id === updatedPlan.id);

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Daily study plan with ID ${updatedPlan.id} not found`
        },
        { status: 404 }
      );
    }

    // Update the plan (preserve createdAt, update other fields)
    const originalCreatedAt = dailyStudyPlans[index].createdAt;
    dailyStudyPlans[index] = {
      ...updatedPlan,
      createdAt: originalCreatedAt,
      updatedAt: new Date().toISOString()
    };

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dailyStudyPlans, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Daily study plan updated successfully',
      data: dailyStudyPlans[index]
    });
  } catch (error) {
    console.error('Error updating daily study plan:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update daily study plan',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dailyStudyPlans
 * Deletes a daily study plan by ID from the mock database file
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
          message: 'Plan ID is required'
        },
        { status: 400 }
      );
    }

    // Read existing plans
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const dailyStudyPlans = JSON.parse(fileContents);

    // Find and remove the plan
    const filteredPlans = dailyStudyPlans.filter((p: any) => p.id !== id);

    if (filteredPlans.length === dailyStudyPlans.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Daily study plan with ID ${id} not found`
        },
        { status: 404 }
      );
    }

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(filteredPlans, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Daily study plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting daily study plan:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete daily study plan',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
