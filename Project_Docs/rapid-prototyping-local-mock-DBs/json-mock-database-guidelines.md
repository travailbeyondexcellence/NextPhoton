# JSON Mock Database Guidelines

## Overview
This document outlines the approach for using JSON files as a mock database during the rapid prototyping phase of NextPhoton development. This strategy enables fast iteration on UI/UX without the overhead of database setup and management.

## Rationale
- **Speed**: No database configuration, migrations, or connection management required
- **Visibility**: Data is human-readable and easily editable for testing
- **Focus**: Allows concentration on frontend features and user experience
- **Flexibility**: Easy to modify data structures during development
- **Simplicity**: Reduces complexity during the MVP phase

## Implementation Structure

### Directory Organization
```
frontend/web/
├── data/                     # Mock database directory
│   ├── users.json           # All users (learners, educators, etc.)
│   ├── educators.json       # Educator-specific data
│   ├── learners.json        # Learner profiles
│   ├── guardians.json       # Guardian information
│   ├── courses.json         # Course listings
│   ├── enrollments.json     # Course enrollments
│   ├── sessions.json        # Learning sessions
│   ├── assessments.json     # Quizzes and tests
│   ├── attendance.json      # Attendance records
│   └── analytics.json       # Analytics data
```

### Data File Structure
Each JSON file should follow a consistent structure:

```json
{
  "metadata": {
    "lastUpdated": "2024-01-20T10:00:00Z",
    "version": "1.0",
    "count": 0
  },
  "data": [
    {
      "id": "unique-id-here",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z",
      // ... entity-specific fields
    }
  ]
}
```

## API Route Implementation

### File Structure
```
frontend/web/app/api/
├── educators/
│   ├── route.ts            # GET all, POST new
│   └── [id]/
│       └── route.ts        # GET one, PATCH update, DELETE
├── learners/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
└── ... (similar for other entities)
```

### CRUD Operations Pattern

#### Create (POST)
1. Read existing JSON file
2. Generate unique ID (use uuid or timestamp-based)
3. Add timestamps (createdAt, updatedAt)
4. Append new record to data array
5. Update metadata.count
6. Write back to file

#### Read (GET)
1. Read JSON file
2. Return filtered/paginated results as needed
3. Support query parameters for filtering

#### Update (PATCH/PUT)
1. Read JSON file
2. Find record by ID
3. Update fields and updatedAt timestamp
4. Write back to file

#### Delete (DELETE)
1. Read JSON file
2. Filter out record by ID
3. Update metadata.count
4. Write back to file

## Code Example

### API Route Handler (Next.js 15 App Router)
```typescript
// app/api/educators/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'educators.json');

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: "1.0",
        count: 0
      },
      data: []
    };
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// GET all educators
export async function GET() {
  await ensureDataFile();
  const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
  const { data } = JSON.parse(fileContent);
  return Response.json({ educators: data });
}

// POST new educator
export async function POST(request: Request) {
  await ensureDataFile();
  const body = await request.json();
  
  const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
  const jsonData = JSON.parse(fileContent);
  
  const newEducator = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body
  };
  
  jsonData.data.push(newEducator);
  jsonData.metadata.count = jsonData.data.length;
  jsonData.metadata.lastUpdated = new Date().toISOString();
  
  await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));
  
  return Response.json(newEducator, { status: 201 });
}
```

## Best Practices

### 1. Data Consistency
- Always validate data before writing
- Maintain consistent ID formats across all entities
- Use ISO 8601 format for all timestamps

### 2. Error Handling
- Handle file read/write errors gracefully
- Return appropriate HTTP status codes
- Provide meaningful error messages

### 3. Performance Considerations
- For large datasets, consider implementing pagination
- Cache frequently accessed data in memory (with TTL)
- Implement debouncing for write operations

### 4. Data Relationships
- Use ID references between related entities
- Implement "populate" functionality to resolve references
- Maintain referential integrity manually

### 5. Migration Path
When transitioning to a real database:
1. Keep the same API route structure
2. Replace file operations with database queries
3. Maintain the same response formats
4. Use the JSON files as seed data for the database

## Utility Functions

### Create a shared utility module:
```typescript
// lib/mockDb.ts
import { promises as fs } from 'fs';
import path from 'path';

export class MockDatabase {
  private dataDir: string;
  
  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
  }
  
  async read(collection: string) {
    const filePath = path.join(this.dataDir, `${collection}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }
  
  async write(collection: string, data: any) {
    const filePath = path.join(this.dataDir, `${collection}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }
  
  // Additional helper methods...
}
```

## Testing Strategy
1. Create separate test data files for testing
2. Reset test data before each test run
3. Test all CRUD operations
4. Validate data integrity after operations

## Security Considerations
- This approach is for development only
- Never expose file system operations in production
- Implement basic validation even in prototype
- Sanitize all inputs to prevent injection attacks

## Transition Plan
1. Design database schema based on finalized JSON structure
2. Create migration scripts to import JSON data
3. Update API routes to use Prisma instead of file operations
4. Maintain backward compatibility during transition
5. Run parallel testing with both systems before switching