# Mock Data Directory

This directory contains all mock JSON database files used for development and testing purposes.

## Purpose

All persistent mock data files (JSON format) should be stored in this centralized location. These files act as a mock database that can be read and written to via API routes, allowing data to persist across page refreshes during development.

## Current Files

- **announcements.json** - Mock database for announcements feature
  - Used by: `/api/announcements` API routes
  - Supports: GET, POST, DELETE operations
  - Location in code: `src/mockData/announcements.json`

## Adding New Mock Data Files

When creating new mock database files:

1. Create your JSON file in this directory: `src/mockData/your-feature.json`
2. Create corresponding API routes in: `src/app/api/your-feature/route.ts`
3. Use Node.js `fs` module to read/write to the JSON file
4. Update this README to document your new file

## Example API Route Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'mockData', 'your-feature.json');

export async function GET() {
  const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
  const data = JSON.parse(fileContents);
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const newItem = await request.json();
  const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8');
  const data = JSON.parse(fileContents);
  data.unshift(newItem);
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  return NextResponse.json({ success: true, data: newItem }, { status: 201 });
}
```

## Notes

- These files are for **development only** and should not be used in production
- The real production app will use PostgreSQL database via Prisma ORM
- All files in this directory are version-controlled (committed to git)
- You can manually edit these JSON files to add/modify test data
