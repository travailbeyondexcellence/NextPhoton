# CreateGuardianForm Component

## Overview
`CreateGuardianForm` is a comprehensive form component for creating guardian/parent profiles in the NextPhoton platform. It captures guardian details, address information, learner associations, contact preferences, payment methods, and communication preferences.

## Location
`/components/forms/CreateGuardianForm.tsx`

## Purpose
Provides a multi-section form interface for admins to onboard guardians (parents/caretakers) with complete profile information, contact preferences, and payment setup, integrated with GraphQL mutations and Apollo cache management.

## Key Features

### Form Structure (6 Major Sections)

#### 1. **Basic Information**
- Full Name
- Relation to Learner (Father, Mother, Guardian, Uncle, Aunt, Grandparent, Other)
- Email Address
- Occupation
- Primary Phone Number
- Alternate Phone (optional)
- Profile Image URL (optional)

#### 2. **Address Information**
- Street Address
- City
- State (dropdown with all Indian states)
- PIN Code (6-digit validation)

#### 3. **Learner Information**
- Learner Name
- Grade (8th-12th Standard)
- School Name
- Purpose: Associate guardian with learner during creation

#### 4. **Contact Preferences**
- Preferred Contact Method (Phone, WhatsApp, Email, SMS)
- Preferred Contact Time (Morning, Afternoon, Evening slots)

#### 5. **Payment Information**
- Payment Method (Online, Bank Transfer, Cheque, Cash)
- Billing Cycle (Monthly, Quarterly, Semester, Annual)

#### 6. **Communication Preferences**
- Academic Updates (checkbox)
- Attendance Alerts (checkbox)
- Performance Reports (checkbox)
- Payment Reminders (checkbox)
- General Notifications (checkbox)

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
  - CREATE_GUARDIAN: Mutation
  - GET_GUARDIANS: Query
```

### Schema Validation
```typescript
guardianSchema = z.object({
  // Basic
  name, relation, email, phone, alternatePhone, occupation, profileImage,
  // Address
  street, city, state, pincode,
  // Learner
  learnerName, learnerGrade, learnerSchool,
  // Preferences
  preferredContactMethod (enum), preferredContactTime,
  // Payment
  paymentMethod (enum), billingCycle (enum),
  // Communication (all boolean)
  academicUpdates, attendanceAlerts, performanceReports,
  paymentReminders, generalNotifications
})
```

## State Management

### Form State (react-hook-form)
- **register**: Field registration
- **handleSubmit**: Form submission handler
- **errors**: Validation errors
- **reset**: Form reset function
- **watch**: Field value observer

### Apollo Mutation State
- **creating** (boolean): Loading state during mutation
- **Cache update**: Automatically updates GET_GUARDIANS query cache
- **onCompleted**: Shows success alert, resets form, navigates to /admin/guardians
- **onError**: Shows error alert

## Form Behavior

### Advanced Data Transformation
The form uses a sophisticated data structure where the `address` field contains extended JSON data:

```typescript
addressData = {
  street, city, state, pincode,
  alternatePhone,
  preferredContactTime,
  assignedLearners: [{
    learnerName, grade, school, relation
  }],
  paymentInfo: {
    method, billingCycle, paymentStatus: 'pending'
  },
  communicationPreferences: {
    academicUpdates, attendanceAlerts,
    performanceReports, paymentReminders,
    generalNotifications
  }
}
```

### Enum Validations
- **preferredContactMethod**: 'phone' | 'whatsapp' | 'email' | 'sms'
- **paymentMethod**: 'online' | 'bank-transfer' | 'cheque' | 'cash'
- **billingCycle**: 'monthly' | 'quarterly' | 'semester' | 'annual'

### PIN Code Validation
- **Regex**: `/^[1-9][0-9]{5}$/`
- **Rules**: 6 digits, cannot start with 0

### Form Submission
1. Validates all fields using Zod schema
2. Constructs complex addressData object
3. Splits name into firstName/lastName
4. Sends mutation with nested data structure
5. Updates Apollo cache
6. Navigates to guardians list

## Interactions with Sister Components

### 1. CreateEducatorForm (Sister Component)
**Relationship**: Parallel Form
- **Similarity**: Same design pattern, glassmorphism UI
- **Difference**: Guardian-specific fields vs educator-specific
- **Shared Pattern**: react-hook-form + Zod validation
- **No Direct Interaction**: Independent components

### 2. CreateLearnerForm (Sister Component)
**Relationship**: Parallel Form with Data Linkage
- **Similarity**: Identical UI/UX pattern
- **Data Link**: Guardian creation includes learner info
- **Future Integration**: Guardian-Learner relationship in database
- **Current**: Creates guardian with learner metadata
- **Shared Pattern**: Both forms handle guardian-learner association

## Interactions with Parent/Admin Components

### Parent: GuardiansList_forAdmin
**Relationship**: Child → Parent Navigation
- **Flow**: Form submission → Navigate to `/admin/guardians`
- **Purpose**: Return to guardians list after successful creation
- **Data Flow**: New guardian appears in list (via cache update)

**Navigation Chain**:
```
Admin Dashboard → GuardiansList_forAdmin → CreateGuardianForm
                                         ←  (navigate back on success)
```

### Related Admin Views
- **GuardianCard_forAdmin**: Displays created guardian as a card
- **GuardiansCardsView_forAdmin**: Shows guardian in card grid view

## GraphQL Integration

### Mutation Structure
```typescript
CREATE_GUARDIAN(input: {
  firstName, lastName, email, phoneNumber,
  relationship, occupation,
  address: {
    // Complex JSON structure with all extended data
    street, city, state, pincode,
    assignedLearners[], paymentInfo{},
    communicationPreferences{}
  },
  emergencyContact: true,  // Default
  learnerIds: [],  // Linked post-creation
  preferredContactMethod
})
```

### Cache Management
- **Read**: Fetches existing guardians from cache
- **Write**: Appends new guardian to cache
- **Benefits**: UI updates instantly without refetch

## Styling Approach

### Design System
- **Glassmorphism**: `bg-white/10 backdrop-blur-sm border border-white/20`
- **Hover Effects**: `hover:bg-white/15`
- **Interactive Elements**: Icon-labeled radio buttons for better UX
- **Transitions**: `transition-all duration-200`

### Responsive Design
- **Grid Layout**: `grid md:grid-cols-2` (stacks on mobile)
- **Full-width fields**: Street address spans 2 columns
- **Mobile-first**: Single column on small screens

## Accessibility Features
- Icon labels for visual guidance
- Clear descriptions for communication preferences
- Radio button groups for single-choice fields
- Checkbox groups for multi-choice preferences
- Semantic HTML structure
- Clear error messages

## User Experience

### Contact Preferences UX
- **Visual Icons**: Each contact method has an icon (Phone, WhatsApp, Email, SMS)
- **Radio Buttons**: Single selection for clarity
- **Time Slots**: Predefined time ranges for consistency

### Communication Preferences UX
- **Toggle Switches**: Checkboxes for on/off preferences
- **Descriptions**: Each preference has explanatory text
- **Defaults**: All preferences enabled by default
- **Grouped Layout**: Related preferences visually grouped

### Loading States
- Submit button shows spinner during mutation
- Button text changes: "Create Guardian" → "Creating..."
- Button disabled during submission

### Validation Feedback
- Real-time validation errors below fields
- Red error text with clear messages
- Schema-based validation (Zod)

## Component Type
- **Client Component**: Marked with `"use client"`
- **Form Component**: Stateful, interactive

## Usage Context
Rendered from admin dashboard when creating a new guardian profile. Typically accessed via a "Create Guardian" button in the GuardiansList_forAdmin view. Often used in conjunction with learner onboarding.

## Data Relationships

### Guardian → Learner Association
- **Creation Time**: Guardian form includes learner info
- **Storage**: Learner data embedded in address field (JSON)
- **Future Link**: learnerIds array for database relationships
- **Purpose**: Track which learners guardian is responsible for

### Payment Tracking
- **Method**: Stored in address.paymentInfo
- **Billing Cycle**: Determines payment frequency
- **Status**: Initialized as 'pending'

## Common Issues & Solutions

### Issue: PIN code validation failing
- **Check**: Ensure 6 digits, first digit non-zero
- **Solution**: Use regex `/^[1-9][0-9]{5}$/`

### Issue: Communication preferences not saving
- **Check**: Checkbox values in form state
- **Solution**: Default values set to true

### Issue: Learner association not working
- **Check**: addressData structure
- **Solution**: assignedLearners array properly formatted

## Future Enhancements
- Multi-learner association (add multiple learners)
- Image file upload instead of URL input
- Auto-fill address based on PIN code
- Payment gateway integration
- SMS/Email verification
- Bulk guardian import
- Guardian portal access credentials generation
