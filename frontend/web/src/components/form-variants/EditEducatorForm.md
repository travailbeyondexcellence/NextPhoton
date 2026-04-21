# EditEducatorForm Component

## Overview
`EditEducatorForm` is an update/edit form component for modifying existing educator profiles in the NextPhoton platform. It pre-populates fields with existing educator data and handles updates through GraphQL mutations.

## Location
`/components/form-variants/EditEducatorForm.tsx`

## Purpose
Provides a pre-filled form interface for admins to update educator profiles with all educator-specific data including qualifications, experience, teaching specializations, and pricing information. Maintains the same structure as CreateEducatorForm but handles updates instead of creation.

## Key Features

### Form Structure (4 Major Sections)
Identical to CreateEducatorForm:
1. **Basic Information**
2. **Qualifications & Pricing**
3. **Experience**
4. **Teaching Details**

### Component Props

```typescript
interface EditEducatorFormProps {
  educator: any;  // Existing educator object from database
}
```

**Required Prop**: `educator` object containing all existing educator data.

## Key Differences from CreateEducatorForm

| Feature | CreateEducatorForm | EditEducatorForm |
|---------|-------------------|------------------|
| **Purpose** | Create new educator | Update existing educator |
| **Mutation** | CREATE_EDUCATOR | UPDATE_EDUCATOR |
| **Initial State** | Empty fields | Pre-populated fields |
| **Cache Strategy** | Manual cache update | refetchQueries |
| **Submit Button** | "Create Educator" | "Update Educator" |
| **Secondary Button** | Reset | Cancel (router.back()) |
| **Icon** | Plus/Create icon | Save icon |
| **Educator ID** | Generated at runtime | Passed via props |

## Data Pre-population Logic

### useEffect Hook (Lines 104-130)
Runs when `educator` prop is received:

```typescript
useEffect(() => {
  if (educator) {
    // Extract availability JSON
    const availability = typeof educator.availability === 'object'
      ? educator.availability : {};

    // Parse subjects (handles both array and comma-separated string)
    const subjectsArray = educator.subject
      ? (Array.isArray(educator.subject)
          ? educator.subject
          : educator.subject.split(',').map(s => s.trim()))
      : [];

    // Populate all fields using setValue
    setValue('name', `${educator.firstName} ${educator.lastName}`.trim());
    setValue('username', availability.username || '');
    setValue('emailFallback', educator.email || '');
    setValue('intro', educator.bio || '');
    setValue('qualification', qualifications[0] || '');
    setValue('subjects', subjectsArray);
    setValue('levels', availability.levels || []);
    setValue('exams', availability.exams || []);
    setValue('priceTier', availability.priceTier || '');
    setValue('yearsWithNextPhoton', educator.experience || 0);
    setValue('studentsTaught', availability.studentsTaught || 0);
    setValue('hoursTaught', availability.hoursTaught || 0);
    setValue('profileImage', availability.profileImage || '');
  }
}, [educator, setValue]);
```

### Data Extraction Strategy
1. **availability** field contains JSON with extended data
2. **subjects** can be array or comma-separated string (handles both)
3. **qualifications** can be array or string (handles both)
4. **Fallback values**: Uses `||` operator for missing data

## Dependencies

### External Libraries
```typescript
- react-hook-form: Form state management
- zod: Schema validation (same as CreateEducatorForm)
- @apollo/client: GraphQL mutations
- next/navigation: Router navigation
- lucide-react: Icons (Save, Loader2 icons)
```

### Internal Dependencies
```typescript
- @/lib/apollo: GraphQL queries/mutations
  - UPDATE_EDUCATOR: Mutation
  - GET_EDUCATORS: Query (for refetch)
```

### Schema Validation
Uses identical `educatorSchema` as CreateEducatorForm (code reuse opportunity for refactoring).

## State Management

### Form State (react-hook-form)
- **setValue**: Manual value setter (used in useEffect for pre-population)
- **watch**: Field value observer
- **errors**: Validation errors
- **register**: Field registration
- **handleSubmit**: Form submission handler

### Apollo Mutation State
- **updating** (boolean): Loading state during mutation
- **onCompleted**: Shows success alert, navigates to /admin/educators
- **onError**: Shows error alert
- **refetchQueries**: Automatically refetches GET_EDUCATORS to update list

## Form Behavior

### Update Submission Flow
1. Validates all fields using Zod schema
2. Transforms data to match GraphQL input format
3. **Includes educator.id** in mutation variables
4. Sends UPDATE_EDUCATOR mutation
5. Refetches GET_EDUCATORS query
6. Navigates back to educators list

### Multi-Select Handling
Identical to CreateEducatorForm - uses `handleMultiSelect` function with null-safe array handling.

### Cancel Behavior
- **Button**: "Cancel" instead of "Reset"
- **Action**: `router.back()` - navigates to previous page
- **Purpose**: User can abort edit without changes

## Interactions with Sister Components

### In form-variants Folder
**Relationship**: Currently the only component in folder
- **Future Components**: EditGuardianForm, EditLearnerForm
- **Pattern**: Would follow same UPDATE pattern
- **Shared Code**: Schema could be shared with Create forms

### Relationship to forms/ Folder

#### CreateEducatorForm (Parallel Component)
**Relationship**: Edit Variant of Create Form
- **Similarity**: 95% identical UI/UX and code structure
- **Difference**:
  - Create: Empty → Submit → CREATE mutation
  - Edit: Pre-filled → Submit → UPDATE mutation
- **Code Reuse**: Schema, field options, multi-select logic all duplicated
- **Refactoring Opportunity**: Could extract shared logic into hooks/utils

**Data Flow**:
```
CreateEducatorForm → Creates educator
                  ↓
           EducatorsList_forAdmin
                  ↓
           EducatorProfile_forAdmin (View)
                  ↓
           EditEducatorForm → Updates educator
                  ↓
           EducatorsList_forAdmin (Refreshed)
```

## Interactions with Parent/Admin Components

### Parent: EducatorProfile_forAdmin
**Relationship**: Child Form ← Parent View
- **Trigger**: "Edit" button in profile view
- **Data Passed**: educator object as prop
- **Navigation**: Profile → Edit Form → Back to List

**Flow**:
```
EducatorProfile_forAdmin
  ↓ (user clicks "Edit")
EditEducatorForm (receives educator prop)
  ↓ (user submits)
Navigate to /admin/educators
```

### Related Admin Views
- **EducatorsList_forAdmin**: Displays updated educator in list (refetch)
- **EducatorsCardsView_forAdmin**: Shows updated educator card (refetch)
- **EducatorProfile_forAdmin**: Shows updated profile details

## GraphQL Integration

### Mutation Structure
```typescript
UPDATE_EDUCATOR(
  id: educator.id,  // ← Key difference from CREATE
  input: {
    firstName, lastName, email,
    subject (comma-separated),
    qualifications[],
    experience,
    bio,
    availability: {
      username, levels[], exams[], priceTier,
      studentsTaught, hoursTaught, profileImage
    }
  }
)
```

### Cache Management Strategy
- **Method**: refetchQueries instead of manual cache update
- **Why**: Ensures data consistency across all views
- **Query**: GET_EDUCATORS refetched automatically
- **Trade-off**: Slight performance cost vs guaranteed consistency

## Styling Approach
Identical to CreateEducatorForm - Glassmorphism design system.

## Accessibility Features
Same as CreateEducatorForm with additional:
- Clear "Cancel" vs "Update" action distinction
- Save icon for visual feedback
- Disabled state during update operation

## User Experience

### Pre-fill Feedback
- **Instant**: Fields populate immediately on mount
- **Visual Confirmation**: User sees existing data
- **Edit Safety**: Can verify data before changes

### Loading States
- Submit button shows spinner during mutation
- Button text changes: "Update Educator" → "Updating..."
- Save icon → Loader2 spinner
- Button disabled during submission

### Cancel vs Reset
- **Cancel**: Returns to previous page (no changes saved)
- **Reset**: Not available in edit form (use Cancel instead)
- **Rationale**: Edit forms typically navigate back rather than clear

## Component Type
- **Client Component**: Marked with `"use client"`
- **Controlled Component**: Receives `educator` prop
- **Form Component**: Stateful, interactive

## Usage Context
Rendered from educator profile view when admin clicks "Edit Educator" button. Receives existing educator data as prop and allows modifications.

## Common Issues & Solutions

### Issue: Form fields not pre-populating
- **Check**: educator prop is defined and not null
- **Check**: useEffect dependency array includes educator and setValue
- **Solution**: Ensure educator object has expected structure

### Issue: Subjects not displaying correctly
- **Check**: educator.subject format (array vs string)
- **Solution**: Code handles both formats with conditional parsing

### Issue: Availability data missing
- **Check**: educator.availability is object, not string
- **Solution**: Parsing logic checks typeof before accessing

### Issue: Update not reflecting in list
- **Check**: refetchQueries configuration
- **Solution**: Ensure GET_EDUCATORS is being refetched

## Code Reuse & Refactoring Opportunities

### Shared Code with CreateEducatorForm
1. **Schema**: educatorSchema (identical)
2. **Options**: subjectOptions, levelOptions, examOptions, priceTiers
3. **Multi-select logic**: handleMultiSelect function
4. **Validation rules**: Zod schema
5. **UI Structure**: Almost identical JSX

### Potential Refactoring
```typescript
// Shared schema
export { educatorSchema } from './educatorSchema';

// Shared component
<EducatorFormFields
  register={register}
  errors={errors}
  watch={watch}
  handleMultiSelect={handleMultiSelect}
/>

// Wrapper components
<CreateEducatorForm /> // Uses CREATE mutation
<EditEducatorForm educator={educator} /> // Uses UPDATE mutation
```

## Future Enhancements
- Extract shared logic into custom hook (useEducatorForm)
- Shared form component with mode prop ('create' | 'edit')
- Change tracking (highlight modified fields)
- Confirmation dialog on cancel if changes made
- Optimistic UI updates
- Version history / audit trail
- Batch update multiple educators
- Image upload instead of URL
- Auto-save draft functionality
- Field-level update (partial updates)
