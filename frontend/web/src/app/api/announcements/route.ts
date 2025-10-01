import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the mock database JSON file
// All mock JSON database files are stored in src/mockData/
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'mockData', 'announcements.json');

/**
 * GET /api/announcements
 * Fetches all announcements from the mock database file
 */
export async function GET() {
  try {
    // Read the JSON file
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const announcements = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      data: announcements,
      count: announcements.length
    });
  } catch (error) {
    console.error('Error reading announcements:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read announcements',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/announcements
 * Creates a new announcement and saves it to the mock database file
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const newAnnouncement = await request.json();

    // Validate required fields
    if (!newAnnouncement.title || !newAnnouncement.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and content are required'
        },
        { status: 400 }
      );
    }

    // Read existing announcements
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const announcements = JSON.parse(fileContents);

    // Add the new announcement to the beginning of the array
    announcements.unshift(newAnnouncement);

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(announcements, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      data: newAnnouncement
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create announcement',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/announcements
 * Updates an existing announcement in the mock database file
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const updatedAnnouncement = await request.json();

    // Validate required fields
    if (!updatedAnnouncement.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Announcement ID is required'
        },
        { status: 400 }
      );
    }

    if (!updatedAnnouncement.title || !updatedAnnouncement.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Title and content are required'
        },
        { status: 400 }
      );
    }

    // Read existing announcements
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const announcements = JSON.parse(fileContents);

    // Find the index of the announcement to update
    const index = announcements.findIndex((a: any) => a.id === updatedAnnouncement.id);

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Announcement with ID ${updatedAnnouncement.id} not found`
        },
        { status: 404 }
      );
    }

    // Update the announcement and set updatedAt timestamp
    updatedAnnouncement.updatedAt = new Date().toISOString();
    announcements[index] = updatedAnnouncement;

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(announcements, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedAnnouncement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update announcement',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/announcements
 * Deletes an announcement by ID from the mock database file
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
          message: 'Announcement ID is required'
        },
        { status: 400 }
      );
    }

    // Read existing announcements
    const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const announcements = JSON.parse(fileContents);

    // Find and remove the announcement
    const filteredAnnouncements = announcements.filter((a: any) => a.id !== id);

    if (filteredAnnouncements.length === announcements.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Announcement with ID ${id} not found`
        },
        { status: 404 }
      );
    }

    // Write back to the file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(filteredAnnouncements, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete announcement',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
