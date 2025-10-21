# CreateLearnerForm Component

## Overview
`CreateLearnerForm` is a comprehensive form component for creating learner (student) profiles in the NextPhoton platform. It captures student academic information, target exam goals, guardian details, and additional metadata for complete student onboarding.

## Location
`/components/forms/CreateLearnerForm.tsx`

## Purpose
Provides a multi-section form interface for admins to onboard new learners with complete academic profile, target exam preparation goals, guardian association, and enrollment tracking, integrated with GraphQL mutations and Apollo cache management.

## Key Features

### Form Structure (5 Major Sections)

#### 1. **Basic Information**
- Full Name
- Username (@handle)
- Email Address
- Phone Number (optional)
- Profile Image URL (optional)

#### 2. **Academic Information**
- Academic Level (Middle School, Senior School, Junior College)
- Grade (8th-12th Standard)
- School Name
- Board (CBSE, ICSE, State Board, IB, IGCSE)

#### 3. **Target Exams**
- Target Exams (multi-select): JEE Main, JEE Advanced, NEET, Boards, Olympiads, NTSE, KVPY, CLAT, NDA
- Target Exam Year (current year + future validation)

#### 4. **Guardian Information**
- Guardian Name
- Relation (Father, Mother, Guardian, Uncle, Aunt, Grandparent)
- Guardian Phone
- Guardian Email

####5. **Additional Information**
- Batch ID (optional)
- Enrollment Date (auto-populated with today's date)
- Remark Tags (multi-select): High Potential, Needs Support, Consistent Performer, etc.

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
  - CREATE_LEARNER: Mutation
  - GET_LEARNERS: Query
```

### Schema Validation
```typescript
learnerSchema = z.object({
  // Basic
  name, username, email, phone, profileImage,
  // Academic
  academicLevel, grade, school, board,
  // Targets
  targetExams[], targetExamYear (validated >=currentYear),
  // Guardian
  guardianName, guardianRelation, guardianPhone, guardianEmail,
  // Additional
  batchId, enrollmentDate, remarkTags[]
})
```

## State Management

### Form State (react-hook-form)
- **register**: Field registration
- **handleSubmit**: Form submission handler
- **errors**: Validation errors
- **reset**: Form reset function
- **setValue**: Manual value setter for multi-selects
- **watch**: Field value observer for dynamic UI

### Apollo Mutation State
- **creating** (boolean): Loading state during mutation
- **Cache update**: Automatically updates GET_LEARNERS query cache
- **onCompleted**: Shows success alert, resets form, navigates to /admin/learners
- **onError**: Shows error alert

## Form Behavior

### Advanced Data Transformation
The form uses a sophisticated structure where the `address` field contains extended academic and guardian metadata:

```typescript
addressData = {
  school, board, academicLevel,
  targetExams[], targetExamYear,
  guardianInfo: {
    name, relation, phone, email
  },
  remarkTags[],
  enrollmentDate,
  username
}
```

### Multi-Select Handlers

#### handleExamSelect(exam)
- **Purpose**: Toggle target exam selection
- **Behavior**: Add/remove from targetExams array
- **UI**: Checkbox-based multi-select

#### handleTagSelect(tag)
- **Purpose**: Toggle remark tag selection
- **Behavior**: Add/remove from remarkTags array
- **UI**: Pill/badge button toggles

### Year Validation
- **Minimum**: Current year
- **Maximum**: Current year + 5
- **Purpose**: Ensure target exam year is realistic

### Form Submission
1. Validates all fields using Zod schema
2. Constructs complex addressData object with academic info
3. Splits name into firstName/lastName
4. Sends mutation with nested data structure
5. Updates Apollo cache
6. Navigates to learners list

## Interactions with Sister Components

### 1. CreateEducatorForm (Sister Component)
**Relationship**: Parallel Form
- **Similarity**: Same design pattern, glassmorphism UI
- **Difference**: Learner-specific vs educator-specific fields
- **Shared Pattern**: react-hook-form + Zod + GraphQL
- **No Direct Interaction**: Independent components

### 2. CreateGuardianForm (Sister Component)
**Relationship**: Parallel Form with Data Linkage
- **Similarity**: Identical UI/UX pattern
- **Data Link**: Learner creation includes guardian info
- **Reciprocal Relationship**:
  - CreateGuardianForm includes learner info
  - CreateLearnerForm includes guardian info
  - Both create association metadata
- **Future Integration**: Database links guardian-learner relationship
- **Current**: Creates learner with guardian metadata in address field

**Shared Data Fields**:
- Guardian name, relation, phone, email (in both forms)
- Learner name, grade, school (in both forms)

## Interactions with Parent/Admin Components

### Parent: LearnersList_forAdmin
**Relationship**: Child → Parent Navigation
- **Flow**: Form submission → Navigate to `/admin/learners`
- **Purpose**: Return to learners list after successful creation
- **Data Flow**: New learner appears in list (via cache update)

**Navigation Chain**:
```
Admin Dashboard → LearnersList_forAdmin → CreateLearnerForm
                                        ←  (navigate back on success)
```

### Related Admin Views
- **LearnerCard_forAdmin**: Displays created learner as a card
- **LearnersCardsView_forAdmin**: Shows learner in card grid view

## GraphQL Integration

### Mutation Structure
```typescript
CREATE_LEARNER(input: {
  firstName, lastName, email, phoneNumber,
  dateOfBirth: undefined,  // Optional field
  grade,
  guardianIds: [],  // Linked post-creation
  batchIds: [batchId],  // If provided
  profilePicture,
  address: {
    // Complex JSON structure with academic data
    school, board, academicLevel,
    targetExams[], targetExamYear,
    guardianInfo{}, remarkTags[],
    enrollmentDate, username
  }
})
```

### Cache Management
- **Read**: Fetches existing learners from cache
- **Write**: Appends new learner to cache
- **Benefits**: UI updates instantly without refetch

## Styling Approach

### Design System
- **Glassmorphism**: `bg-white/10 backdrop-blur-sm border border-white/20`
- **Hover Effects**: `hover:bg-white/15`
- **Interactive Tags**: Pill-style toggle buttons with active states
- **Transitions**: `transition-all duration-200`

### Responsive Design
- **Grid Layout**: `grid md:grid-cols-2` and `grid md:grid-cols-3`
- **Adaptive**: Checkboxes wrap to 2 columns for better mobile experience
- **Mobile-first**: Single column on small screens

## UI Components & Patterns

### Tag Selection UI
- **Style**: Pill-shaped buttons with toggle behavior
- **Active State**: `bg-primary/20 text-primary border border-primary/30`
- **Inactive State**: `bg-white/10 text-foreground border border-white/20`
- **Interaction**: Click to toggle on/off

### Available Remark Tags
- High Potential
- Needs Support
- Consistent Performer
- Olympiad Aspirant
- Board Focused
- Competitive Exam Focused
- Attendance Issue
- Improving
- Top Performer

## Accessibility Features
- Icon labels for visual guidance
- Clear section headings
- Checkbox groups with proper labels
- Disabled state for submit button during loading
- Semantic HTML structure
- Clear error messages

## User Experience

### Target Exams Selection
- **Multi-select**: Checkboxes for multiple exams
- **Visual Feedback**: Checked state clearly visible
- **Validation**: Requires at least one exam selected
- **Grid Layout**: 2-column grid for compact display

### Enrollment Date
- **Auto-populated**: Today's date by default
- **Date Picker**: Browser-native date input
- **Format**: YYYY-MM-DD

### Loading States
- Submit button shows spinner during mutation
- Button text changes: "Create Learner" → "Creating..."
- Button disabled during submission

### Validation Feedback
- Real-time validation errors below fields
- Red error text with clear messages
- Target exam year must be current or future
- Phone number optional (unlike guardian form)

## Component Type
- **Client Component**: Marked with `"use client"`
- **Form Component**: Stateful, interactive

## Usage Context
Rendered from admin dashboard when creating a new learner profile. Typically accessed via a "Create Learner" button in the LearnersList_forAdmin view. Often used during student enrollment process.

## Data Relationships

### Learner → Guardian Association
- **Creation Time**: Learner form includes guardian info
- **Storage**: Guardian data embedded in address field (JSON)
- **Future Link**: guardianIds array for database relationships
- **Reciprocal**: Guardian form also includes learner info

### Learner → Batch Association
- **Optional**: Batch ID can be assigned at creation
- **Storage**: batchIds array in GraphQL input
- **Purpose**: Group learners by batch (e.g., JEE 2026 batch)

### Academic Tracking
- **Target Exams**: Array of exam names
- **Target Year**: Determines exam preparation timeline
- **Remark Tags**: Quick labels for learner categorization

## Common Issues & Solutions

### Issue: Target exam year validation failing
- **Check**: Year must be >= current year
- **Solution**: Use current year or future years only

### Issue: Guardian info not saving
- **Check**: addressData structure
- **Solution**: Ensure guardianInfo object properly nested

### Issue: Tags not toggling
- **Check**: handleTagSelect function
- **Solution**: Verify remarkTags array initialization

### Issue: Phone number required error
- **Check**: Phone is optional field
- **Solution**: Use `.optional().or(z.literal(''))` in schema

## Future Enhancements
- Image file upload instead of URL input
- Guardian selection from existing guardian list (dropdown)
- Batch selection dropdown (instead of free text)
- Multiple target exam years (different exams, different years)
- Academic history tracking
- Previous school/grade information
- Date of birth field addition
- Bulk learner import
- Student portal access credentials generation
- Parent/Guardian notification on creation
