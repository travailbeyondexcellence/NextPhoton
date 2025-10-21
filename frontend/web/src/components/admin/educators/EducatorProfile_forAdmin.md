# EducatorProfile_forAdmin Component

## Overview
Full profile view displaying comprehensive educator information.

## Location
`/components/admin/educators/EducatorProfile_forAdmin.tsx`

## Purpose
Show complete educator details including profile, stats, subjects, levels, exams, and qualification.

## Key Features
- Accepts educatorId prop
- Finds educator from mock data
- Responsive grid layout
- Image with fallback to initials
- Stats display (years, students, hours)
- Subjects with icons
- Levels and exams tags
- "Educator Not Found" fallback

## Dependencies
```typescript
- next/image: Image
- lucide-react: User, Atom, Dice5 icons
- @/lib/utils: getInitials()
- mock-data/educators.json: Data source
```

## Props
```typescript
interface EducatorProfileProps {
  educatorId: string
}
```

## Interactions with Sister Components

### EducatorCard_forAdmin (Trigger Source)
**Relationship**: Card → Profile
- **Trigger**: "View Profile" button in card
- **Data**: educator.id passed via URL
- **Navigation**: `/admin/educators/${id}`

### EducatorsList_forAdmin (Trigger Source)
**Relationship**: List → Profile
- **Trigger**: Click on educator row
- **Data**: educator.id passed via URL
- **Navigation**: `/admin/educators/${id}`

### EditEducatorForm (Edit Target)
**Relationship**: Profile → Edit Form
- **Trigger**: "Edit" button (future implementation)
- **Data**: Pass full educator object
- **Navigation**: `/admin/educators/edit/${id}`
- **Return**: After save, back to profile

## Component Structure

### Profile Overview Section
- Image (120×120) or initials avatar
- Name, username, intro
- Gradient banner with tagline

### Stats Section
- Years with NextPhoton
- Students Taught
- Hours Taught
- Grid layout (3 columns)

### Subjects Section
- Subject icons (Atom, Dice5 placeholder)
- Grid display
- Visual icons for each subject

### Teaching Details
- Qualification
- Levels (tags)
- Target Exams (tags)

## Layout Grid
```
grid lg:grid-cols-2 gap-4
- Profile Overview + Banner
- Stats + Subjects
```

## Data Lookup
```typescript
educators.find(edu => edu.id === educatorId)
```

## Error Handling
If educator not found:
- Shows centered error card
- "Educator Not Found" message
- Displays the searched ID

## Styling
- Glassmorphism cards
- Primary color accents
- Responsive text sizes (base→lg→xl)
- Icon badges with themed backgrounds

## Future Enhancements
- Edit button implementation
- Activity timeline
- Performance charts
- Student feedback
- Schedule view
- Contact information section
- Back button to list
