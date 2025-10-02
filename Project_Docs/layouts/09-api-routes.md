# 9. API ROUTES

API routes in Next.js provide backend functionality through Route Handlers. These are server-side endpoints that handle HTTP requests.

## Overview

**Location:** `frontend/web/src/app/api/`

NextPhoton has **10 API endpoints** organized by feature:

```
api/
├── announcements/route.ts
├── dailyStudyPlans/route.ts
├── educare-tasks/route.ts
├── examinations/route.ts
├── graphql/route.ts
├── home-tasks/route.ts
├── practice-assignments/route.ts
├── themes/route.ts
└── users/
    └── [type]/route.ts
```

---

## API Endpoints

### 1. Announcements API
**File:** `api/announcements/route.ts`
**URL:** `/api/announcements`

**Methods:**
- `GET` - Fetch all announcements
- `POST` - Create new announcement
- `PUT` - Update existing announcement
- `DELETE` - Delete announcement by ID (query param)

**Data Source:** `frontend/web/src/mockData/announcements.json`

**Example Usage:**
```typescript
// Fetch all announcements
const response = await fetch('/api/announcements')
const { success, data, count } = await response.json()

// Create announcement
await fetch('/api/announcements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newAnnouncement)
})

// Update announcement
await fetch('/api/announcements', {
  method: 'PUT',
  body: JSON.stringify(updatedAnnouncement)
})

// Delete announcement
await fetch(`/api/announcements?id=${announcementId}`, {
  method: 'DELETE'
})
```

---

### 2. Daily Study Plans API
**File:** `api/dailyStudyPlans/route.ts`
**URL:** `/api/dailyStudyPlans`

**Methods:**
- `GET` - Fetch daily study plans
- `POST` - Create new study plan
- `PUT` - Update study plan
- `DELETE` - Delete study plan

**Data Source:** `frontend/web/src/mockData/dailyStudyPlans.json`

---

### 3. EduCare Tasks API
**File:** `api/educare-tasks/route.ts`
**URL:** `/api/educare-tasks`

**Methods:**
- `GET` - Fetch tasks (supports `?stats=true` for statistics)
- `POST` - Create new task
- `PUT` - Update existing task
- `DELETE` - Delete task by taskId (query param)

**Special Features:**
- Statistics endpoint: `/api/educare-tasks?stats=true`
- Returns active, pending, completed, overdue counts
- Calculates average progress

**Utility Functions:** `frontend/web/src/lib/educare-tasks-utils.ts`

**Example Usage:**
```typescript
// Fetch all tasks
const response = await fetch('/api/educare-tasks')
const { success, data } = await response.json()

// Fetch statistics
const statsResponse = await fetch('/api/educare-tasks?stats=true')
const { success, data: stats } = await statsResponse.json()
// stats: { active, pending, completed, overdue, averageProgress, total }

// Delete task
await fetch(`/api/educare-tasks?taskId=${taskId}`, {
  method: 'DELETE'
})
```

---

### 4. Examinations API
**File:** `api/examinations/route.ts`
**URL:** `/api/examinations`

**Methods:**
- `GET` - Fetch examinations
- `POST` - Create new examination
- `PUT` - Update examination
- `DELETE` - Delete examination

**Data Source:** `frontend/web/src/mockData/examinations.json`

---

### 5. GraphQL API
**File:** `api/graphql/route.ts`
**URL:** `/api/graphql`

**Methods:**
- `POST` - GraphQL query/mutation endpoint

**Purpose:**
- Unified GraphQL endpoint
- Handles both queries and mutations
- Apollo Client integration

**Client Setup:** `frontend/web/src/lib/apollo/client.ts`

**Example Usage:**
```typescript
import { useQuery, gql } from '@apollo/client'

const GET_EDUCATORS = gql`
  query GetEducators {
    educators {
      id
      firstName
      lastName
      email
    }
  }
`

const { data, loading, error } = useQuery(GET_EDUCATORS)
```

---

### 6. Home Tasks API
**File:** `api/home-tasks/route.ts`
**URL:** `/api/home-tasks`

**Methods:**
- `GET` - Fetch home tasks
- `POST` - Create home task
- `PUT` - Update home task
- `DELETE` - Delete home task

---

### 7. Practice Assignments API
**File:** `api/practice-assignments/route.ts`
**URL:** `/api/practice-assignments`

**Methods:**
- `GET` - Fetch practice assignments
- `POST` - Create assignment
- `PUT` - Update assignment
- `DELETE` - Delete assignment

---

### 8. Themes API
**File:** `api/themes/route.ts`
**URL:** `/api/themes`

**Methods:**
- `GET` - Fetch available themes
- `POST` - Save theme preferences

**Purpose:**
- Theme management
- User theme preferences
- Custom theme configurations

---

### 9. Users API (Dynamic)
**File:** `api/users/[type]/route.ts`
**URL:** `/api/users/:type`

**Dynamic Segment:** `[type]` can be:
- `educators`
- `learners`
- `guardians`
- `employees`
- `interns`
- `admins`

**Methods:**
- `GET` - Fetch users by type
- `POST` - Create user of specific type
- `PUT` - Update user
- `DELETE` - Delete user

**Example URLs:**
```
/api/users/educators
/api/users/learners
/api/users/guardians
```

---

## API Response Format

### Standard Success Response:
```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "message": "Operation successful"
}
```

### Standard Error Response:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

---

## Data Flow Architecture

```
Frontend Component
       ↓
  fetch('/api/...')
       ↓
Next.js Route Handler (api/*/route.ts)
       ↓
Mock Database (JSON file or GraphQL resolver)
       ↓
Response (JSON)
```

### Current State (Development):
```
API Route → Mock JSON Files → File System
```

### Future State (Production):
```
API Route → NestJS Backend → PostgreSQL Database
```

---

## Mock Database Structure

**Location:** `frontend/web/src/mockData/`

```
mockData/
├── announcements.json         # Announcement data
├── dailyStudyPlans.json      # Study plan data
├── examinations.json         # Examination data
└── README.md                 # Documentation
```

**Note:** Not all API routes have corresponding JSON files yet. Some use in-memory data or GraphQL resolvers.

---

## API Implementation Patterns

### 1. File-Based CRUD (Announcements)
```typescript
// Read JSON file
const fileContents = fs.readFileSync(DB_FILE_PATH, 'utf8')
const data = JSON.parse(fileContents)

// Write JSON file
fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
```

### 2. Utility-Based CRUD (EduCare Tasks)
```typescript
import { getAllTasks, createTask, updateTask, deleteTask } from '@/lib/educare-tasks-utils'

export async function GET() {
  const tasks = await getAllTasks()
  return NextResponse.json({ success: true, data: tasks })
}
```

### 3. GraphQL-Based (Educators, Guardians, Learners)
```typescript
// Uses Apollo Client with local/remote resolvers
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client'
```

---

## Error Handling

### Validation Errors:
```typescript
if (!data.requiredField) {
  return NextResponse.json(
    { success: false, error: 'Validation failed', message: 'Field required' },
    { status: 400 }
  )
}
```

### Not Found Errors:
```typescript
if (!foundItem) {
  return NextResponse.json(
    { success: false, error: 'Not found', message: 'Item not found' },
    { status: 404 }
  )
}
```

### Server Errors:
```typescript
catch (error) {
  console.error('Error:', error)
  return NextResponse.json(
    { success: false, error: 'Server error', message: error.message },
    { status: 500 }
  )
}
```

---

## Request/Response Types

### TypeScript Types:
```typescript
// Request
import { NextRequest, NextResponse } from 'next/server'

// GET handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  ...
}

// POST handler
export async function POST(request: NextRequest) {
  const body = await request.json()
  ...
}
```

---

## CORS & Headers

Currently using default Next.js API route behavior (same-origin).

For future external API access:
```typescript
export async function GET() {
  const response = NextResponse.json(data)

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

  return response
}
```

---

## Migration Path

### Current (Development):
```
Next.js API Routes → Mock JSON Files
```

### Future (Production):
```
Next.js API Routes → NestJS Backend GraphQL → PostgreSQL
```

**Migration Strategy:**
1. Keep API route URLs the same
2. Change backend implementation
3. Update from mock data to database queries
4. Add authentication/authorization
5. Add rate limiting
6. Add caching layer

---

## Security Considerations

### Future Enhancements:
1. **Authentication** - JWT verification on protected routes
2. **Authorization** - Role-based access control
3. **Rate Limiting** - Prevent abuse
4. **Input Validation** - Zod schemas
5. **SQL Injection Prevention** - Parameterized queries
6. **CSRF Protection** - Token validation

---

## Testing

### Example Test:
```typescript
describe('Announcements API', () => {
  test('GET /api/announcements returns announcements', async () => {
    const response = await fetch('/api/announcements')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
})
```

---

## Code References

- `frontend/web/src/app/api/announcements/route.ts:1-217`
- `frontend/web/src/app/api/educare-tasks/route.ts`
- `frontend/web/src/app/api/graphql/route.ts`
- `frontend/web/src/lib/educare-tasks-utils.ts` - EduCare CRUD utilities
- `frontend/web/src/lib/apollo/` - GraphQL client setup
- `frontend/web/src/mockData/` - Mock database files

---

## Summary

NextPhoton's API layer provides:
- ✅ RESTful endpoints for CRUD operations
- ✅ GraphQL endpoint for complex queries
- ✅ Mock data for development
- ✅ Type-safe responses
- ✅ Consistent error handling
- ✅ Easy migration path to production backend
