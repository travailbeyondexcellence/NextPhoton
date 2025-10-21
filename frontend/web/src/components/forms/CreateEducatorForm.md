# CreateEducatorForm Component

## Overview
`CreateEducatorForm` is a comprehensive form component for creating new educator profiles in the NextPhoton platform. It handles all educator-specific data including qualifications, experience, teaching specializations, and pricing information.

## Location
`/components/forms/CreateEducatorForm.tsx`

## Purpose
Provides a multi-section form interface for admins to onboard new educators with complete profile information, integrated with GraphQL mutations for data persistence and Apollo cache management.

## Key Features

### Form Structure (4 Major Sections)

#### 1. **Basic Information**
- Full Name
- Username (@handle)
- Email Address
- Profile Image URL (optional)
- Introduction/Bio

#### 2. **Qualifications & Pricing**
- Qualification (e.g., "M.Sc. Physics, IIT Delhi")
- Price Tier Selection (9 tiers: Beginner 1-3, Intermediate 1-3, Premium 1-3)
- Visual tier indicator with color coding

#### 3. **Experience**
- Years with NextPhoton
- Students Taught (count)
- Hours Taught (count)

#### 4. **Teaching Details**
- **Subjects**: Multi-select checkboxes (Physics, Chemistry, Mathematics, Biology, Computer Science, English)
- **Levels**: Multi-select checkboxes (Senior School, Junior College, JEE Advanced, NEET, Boards, Olympiads)
- **Exams**: Multi-select checkboxes (JEE Main, JEE Advanced, NEET, Boards, Olympiads, NTSE, KVPY)

## Dependencies

### External Libraries
```typescript
- react-hook-form: Form state management
- zod: Schema validation
- @hookform/resolvers/zod: Zod integration
- @apollo/client: GraphQL mutations
- next/navigation: Router navigation
- lucide-react: Icons
```

### Internal Dependencies
```typescript
- @/lib/apollo: GraphQL queries/mutations
  - CREATE_EDUCATOR: Mutation
  - GET_EDUCATORS: Query
```

### Schema Validation
```typescript
educatorSchema = z.object({
  name, username, emailFallback, intro,
  qualification, subjects[], levels[], exams[],
  priceTier, yearsWithNextPhoton, studentsTaught, hoursTaught,
  profileImage (optional)
})
```

## State Management

### Form State (react-hook-form)
- **register**: Field registration
- **handleSubmit**: Form submission handler
- **errors**: Validation errors
- **reset**: Form reset function
- **setValue**: Manual value setter
- **watch**: Field value observer

### Apollo Mutation State
- **creating** (boolean): Loading state during mutation
- **Cache update**: Automatically updates GET_EDUCATORS query cache
- **onCompleted**: Shows success alert, resets form, navigates to /admin/educators
- **onError**: Shows error alert

## Form Behavior

### Multi-Select Handling
```typescript
handleMultiSelect(field, value):
  - Toggles value in array
  - Used for: subjects, levels, exams
```

### Price Tier Visual Feedback
- Dynamic color badge based on selected tier
- Color palette:
  - Beginner: Yellow shades (#F3E090 → #FFB303)
  - Intermediate: Blue shades (#51D9EB → #024EA6)
  - Premium: Red shades (#F9618C → #BA0419)

### Form Submission
1. Validates all fields using Zod schema
2. Generates unique educator ID
3. Transforms data to match GraphQL input format
4. Splits name into firstName/lastName
5. Sends mutation to backend
6. Updates Apollo cache
7. Navigates to educators list

## Interactions with Sister Components

### 1. CreateGuardianForm (Sister Component)
**Relationship**: Parallel Form
- **Similarity**: Same design pattern, validation approach
- **Difference**: Different data schema (guardian vs educator)
- **Shared Pattern**: All use react-hook-form + Zod + GraphQL
- **No Direct Interaction**: Independent components

### 2. CreateLearnerForm (Sister Component)
**Relationship**: Parallel Form
- **Similarity**: Identical UI/UX pattern
- **Difference**: Learner-specific fields (academic level, target exams)
- **Shared Pattern**: Multi-section glassmorphism design
- **No Direct Interaction**: Independent components

## Interactions with Parent/Admin Components

### Parent: EducatorsList_forAdmin
**Relationship**: Child → Parent Navigation
- **Flow**: Form submission → Navigate to `/admin/educators`
- **Purpose**: Return to educators list after successful creation
- **Data Flow**: New educator appears in list (via cache update)

**Navigation Chain**:
```
Admin Dashboard → EducatorsList_forAdmin → CreateEducatorForm
                                        ←  (navigate back on success)
```

### Related Admin Views
- **EducatorCard_forAdmin**: Displays created educator as a card
- **EducatorsCardsView_forAdmin**: Shows educator in card grid view
- **EducatorProfile_forAdmin**: Full profile view of created educator

## GraphQL Integration

### Mutation Structure
```typescript
CREATE_EDUCATOR(input: {
  firstName, lastName, email,
  subject (comma-separated),
  qualifications[],
  experience,
  bio,
  availability: {
    username, levels[], exams[], priceTier,
    studentsTaught, hoursTaught, profileImage
  }
})
```

### Cache Management
- **Read**: Fetches existing educators from cache
- **Write**: Appends new educator to cache
- **Benefits**: UI updates instantly without refetch

## Styling Approach

### Design System
- **Glassmorphism**: `bg-white/10 backdrop-blur-sm border border-white/20`
- **Hover Effects**: `hover:bg-white/15 hover:border-white/30`
- **Focus States**: `focus:ring-2 focus:ring-primary`
- **Transitions**: `transition-all duration-200`

### Responsive Design
- **Grid Layout**: `grid md:grid-cols-2` (stacks on mobile)
- **Mobile-first**: Single column on small screens
- **Form Sections**: Distinct glassmorphic cards

## Accessibility Features
- Icon labels for visual guidance
- Clear error messages
- Disabled state for submit button during loading
- Keyboard-friendly checkboxes
- Semantic HTML structure

## User Experience

### Loading States
- Submit button shows spinner during mutation
- Button text changes: "Create Educator" → "Creating..."
- Button disabled during submission

### Validation Feedback
- Real-time validation errors below fields
- Red error text with clear messages
- Schema-based validation (Zod)

### Form Actions
- **Reset**: Clears all fields to default values
- **Submit**: Validates → Mutates → Navigates

## Component Type
- **Client Component**: Marked with `"use client"`
- **Form Component**: Stateful, interactive

## Usage Context
Rendered from admin dashboard when creating a new educator profile. Typically accessed via a "Create Educator" button in the EducatorsList_forAdmin view.

## Common Issues & Solutions

### Issue: Form not submitting
- **Check**: Validation errors in console
- **Solution**: Ensure all required fields filled

### Issue: Cache not updating
- **Check**: Apollo cache configuration
- **Solution**: Mutation includes update function

### Issue: Image URL validation failing
- **Check**: URL format and domain
- **Solution**: Must be valid URL with proper domain (not example.*)

## Future Enhancements
- Image file upload instead of URL input
- Bulk educator import
- Draft save functionality
- Rich text editor for introduction
- Integration with email verification system
