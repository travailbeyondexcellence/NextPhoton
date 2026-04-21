# Vercel Deployment Guide - Mock Data Mode

This guide explains the hybrid deployment approach for NextPhoton, allowing the frontend to be deployed to Vercel with mock data while keeping all backend infrastructure intact.

## Overview

The application now supports two operational modes:

### 1. **Vercel Production Mode** (Mock Data - Read Only)
- Environment: `NEXT_PUBLIC_USE_MOCK_DATA=true`
- Data Source: JSON files in `frontend/web/src/mockData/`
- CRUD Operations: Disabled (read-only)
- Use Case: Team demos, UI/UX showcase

### 2. **Local Development Mode** (Full CRUD)
- Environment: `NEXT_PUBLIC_USE_MOCK_DATA=false`
- Data Source: API routes (e.g., `/api/announcements`)
- CRUD Operations: Fully functional
- Use Case: Active development with file-based mock database

## Architecture

```
┌─────────────────────────────────────────┐
│         Environment Detection           │
│   (NEXT_PUBLIC_USE_MOCK_DATA flag)     │
└───────────┬──────────────┬──────────────┘
            │              │
    ┌───────▼──────┐  ┌───▼──────────┐
    │   VERCEL     │  │  LOCAL DEV   │
    │  Read-only   │  │  Full CRUD   │
    └───────┬──────┘  └───┬──────────┘
            │              │
    ┌───────▼──────────────▼──────────┐
    │    mockDataProvider.ts          │
    │  (Conditional Data Fetching)    │
    └───────┬──────────────┬──────────┘
            │              │
    ┌───────▼──────┐  ┌───▼──────────┐
    │ Import JSON  │  │  fetch()     │
    │   Directly   │  │ API Routes   │
    └──────────────┘  └──────────────┘
```

## Files Structure

```
frontend/web/
├── .env.local                     # Local dev config (USE_MOCK_DATA=false)
├── .env.production                # Vercel config (USE_MOCK_DATA=true)
├── src/
│   ├── lib/
│   │   ├── config.ts             # Environment configuration
│   │   └── mockDataProvider.ts  # Conditional data fetching
│   └── mockData/
│       ├── announcements.json
│       ├── dailyStudyPlans.json
│       ├── examinations.json
│       ├── educators.json
│       ├── learners.json
│       ├── guardians.json
│       └── users.json
└── vercel.json                    # Vercel build configuration
```

## Usage in Components

### Example: Fetching Announcements

```typescript
import { getAnnouncements, isCRUDAvailable } from '@/lib/mockDataProvider';

export default async function AnnouncementsPage() {
  // Fetch data - automatically uses correct source based on environment
  const response = await getAnnouncements();

  if (!response.success) {
    return <div>Error: {response.error}</div>;
  }

  return (
    <div>
      <h1>Announcements</h1>

      {/* Conditionally show Create button only in local dev */}
      {isCRUDAvailable() && (
        <button onClick={handleCreate}>Create New</button>
      )}

      {response.data.map(announcement => (
        <div key={announcement.id}>
          <h2>{announcement.title}</h2>
          <p>{announcement.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example: Fetching Educators

```typescript
import { getEducators } from '@/lib/mockDataProvider';

export default async function EducatorsPage() {
  const response = await getEducators();

  return (
    <div>
      {response.data?.map(educator => (
        <div key={educator.id}>
          <h3>{educator.firstName} {educator.lastName}</h3>
          <p>{educator.subject}</p>
        </div>
      ))}
    </div>
  );
}
```

### Available Functions

```typescript
// Data Fetching
await getAnnouncements()      // Get all announcements
await getDailyStudyPlans()    // Get all study plans
await getExaminations()       // Get all examinations
await getEducators()          // Get all educators
await getLearners()           // Get all learners
await getGuardians()          // Get all guardians
await getUsers()              // Get all users

// CRUD Operations (Local Dev Only)
await createAnnouncement(data)
await updateAnnouncement(data)
await deleteAnnouncement(id)

// Helper Functions
isCRUDAvailable()  // Returns true in local dev, false on Vercel
getDataMode()      // Returns 'mock' or 'api'
```

## Environment Variables

### `.env.local` (Local Development)
```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=http://localhost:963
NEXT_PUBLIC_APP_URL=http://localhost:369
```

### `.env.production` (Vercel)
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_API_URL=https://your-backend.fly.dev
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
SKIP_ENV_VALIDATION=true
```

## Deployment Steps

### 1. Local Testing with Mock Data

Test Vercel mode locally:

```bash
# Set environment variable
export NEXT_PUBLIC_USE_MOCK_DATA=true

# Build the project
cd frontend/web
bun run build

# Start production server
bun run start
```

### 2. Deploy to Vercel

```bash
# From project root
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Verify Deployment

After deployment:
1. Open your Vercel URL
2. Check browser console for: `🔧 Environment Configuration`
3. Verify `USE_MOCK_DATA: true`
4. Test data loading (announcements, educators, learners)
5. Confirm CRUD buttons are hidden/disabled

## What's NOT Affected

This implementation **does NOT modify** any of the following:

✅ NestJS backend code
✅ GraphQL resolvers, queries, mutations
✅ Apollo Client setup
✅ Prisma schema and database config
✅ PostgreSQL/Neon DB references
✅ Authentication services
✅ API route files

All backend infrastructure remains intact and ready for future integration.

## Switching Back to Backend

When ready to use the real backend:

1. Update `.env.production`:
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_API_URL=https://your-nestjs-backend.fly.dev
   ```

2. Components will automatically start using GraphQL/Apollo queries

3. No code changes required in components using `mockDataProvider`

## Troubleshooting

### Build Fails on Vercel

**Issue**: Prisma trying to generate client
**Solution**: Check `vercel.json` has `PRISMA_SKIP_POSTINSTALL_GENERATE=true`

### CRUD Operations Not Working Locally

**Issue**: `.env.local` has wrong setting
**Solution**: Ensure `NEXT_PUBLIC_USE_MOCK_DATA=false`

### Data Not Showing on Vercel

**Issue**: JSON import failing
**Solution**: Check all JSON files are valid and in `mockData/` folder

## Next Steps

1. Deploy to Vercel for team review
2. Gather feedback on UI/UX
3. Continue local development with CRUD operations
4. When backend is ready, switch `USE_MOCK_DATA=false` on Vercel
5. Deploy NestJS backend to Fly.io
6. Connect to Neon DB
7. Full-stack application ready!

## Support

For issues or questions:
- Check this guide first
- Review `frontend/web/src/lib/config.ts` for environment settings
- Check browser console for configuration logs
- Verify `.env` files are correctly set
