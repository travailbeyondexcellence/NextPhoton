# EducatorsList_forAdmin Component

## Overview
Main list/table view for educators with full CRUD operations via GraphQL.

## Location
`/components/admin/educators/EducatorsList_forAdmin.tsx`

## Purpose
Primary admin interface for managing educators with create, read, update, delete capabilities.

## Key Features
- Apollo GraphQL integration
- GET_EDUCATORS query with aggressive fetch policy
- DELETE_EDUCATOR mutation with cache management
- Edit/Delete actions per row
- Image validation logic

## Dependencies
```typescript
- @apollo/client: useQuery, useMutation
- @/lib/apollo: GET_EDUCATORS, DELETE_EDUCATOR
- @/lib/utils: getInitials(), isValidImageUrl()
- next/image, next/navigation
- lucide-react: Icons (Pencil, Trash2, Loader2)
```

## Interactions with Sister Components

### EducatorCard_forAdmin & EducatorsCardsView_forAdmin (Sisters)
**Relationship**: Alternative View Mode
- **Same Purpose**: Display educators
- **Different UI**: Table (this) vs Cards (them)
- **Future**: View toggle to switch between

### EducatorProfile_forAdmin (Navigation Target)
**Relationship**: List → Profile
- **Trigger**: Click on educator row/name
- **Navigation**: `/admin/educators/${id}`
- **Purpose**: View full details

## Interactions with Forms

### CreateEducatorForm (Data Creator)
**Relationship**: Form → List
- **Trigger**: "Create Educator" button
- **Navigation**: `/admin/educators/create`
- **Data Flow**: Form submits → GraphQL cache updated → List refetches
- **Result**: New educator appears in list

### EditEducatorForm (Data Updater)
**Relationship**: List → Form → List
- **Trigger**: Edit button (Pencil icon)
- **Navigation**: `/admin/educators/edit/${id}`
- **Data Passed**: educator object
- **Return Flow**: Form updates → refetchQueries → List refreshes

## GraphQL Integration

### GET_EDUCATORS Query
```typescript
fetchPolicy: 'network-only' // Fresh data on mount
nextFetchPolicy: 'cache-first' // Then use cache
notifyOnNetworkStatusChange: true
errorPolicy: 'all'
```

### DELETE_EDUCATOR Mutation
```typescript
update(cache): Modifies cache to remove deleted educator
onCompleted: Shows success alert
onError: Shows error alert
```

**Cache Strategy**:
```
cache.modify({
  fields: {
    educators: Filter out deleted educator by ID
  }
})
```

## State Management
```typescript
imageErrors: Set<string> - Track failed image loads per educator
loading: boolean - Query loading state
error: ApolloError | undefined
data: { educators: Educator[] }
```

## Helper Function
```typescript
isValidImageUrl(url): Validates URL structure
- Checks for valid URL format
- Rejects example.* domains
- Returns boolean
```

## User Actions
1. **View**: Click row → Navigate to profile
2. **Edit**: Click pencil → Navigate to edit form
3. **Delete**: Click trash → Confirm → Mutation → Cache update

## Fetch Strategy
- **Initial Load**: `network-only` for fresh data
- **Subsequent**: `cache-first` for performance
- **After Create/Update**: Auto-refetch via cache/refetchQueries

## Future Enhancements
- Bulk delete
- Search/filter
- Pagination
- Sort by columns
- Export to CSV
- View mode toggle
