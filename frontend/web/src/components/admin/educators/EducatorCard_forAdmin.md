# EducatorCard_forAdmin Component

## Overview
Card component displaying educator information in a compact, visually appealing layout. Used within EducatorsCardsView_forAdmin to show educators in grid format.

## Location
`/components/admin/educators/EducatorCard_forAdmin.tsx`

## Purpose
Display individual educator as an interactive card with profile image, stats, qualifications, and action buttons.

## Key Features
- Responsive layout (column mobile, row desktop)
- Price tier color-coded badge (9 tier colors)
- Image with fallback to initials avatar
- Stats: Years, Students Taught, Hours Taught
- Action buttons: View Profile, Message, Call
- Subjects footer display

## Dependencies
```typescript
- next/navigation: useRouter
- next/image: Image optimization
- @/lib/utils: getInitials()
- mock-data/educators.json: Type definition
```

## Interactions with Sister Components

### EducatorsCardsView_forAdmin (Parent)
**Relationship**: Child ← Parent
- **Used by**: EducatorsCardsView maps over educators array
- **Data Flow**: Parent passes educator prop to this card
- **Pattern**: Grid container → Individual cards

### EducatorsList_forAdmin (Sister)
**Relationship**: Alternative View
- **Purpose**: List view vs Card view (this component)
- **Data**: Both consume same educator data
- **User Choice**: Admin can switch between views
- **No Direct Interaction**: Independent display components

### EducatorProfile_forAdmin (Navigation Target)
**Relationship**: Card → Profile
- **Trigger**: "View Profile" button click
- **Navigation**: `/admin/educators/${educator.id}`
- **Data Flow**: Passes educator.id via URL
- **Purpose**: Show full educator details

## Interactions with Forms

### CreateEducatorForm (Data Source)
**Relationship**: Indirect via data
- **Flow**: Form creates educator → Card displays it
- **Via**: Mock data or GraphQL cache

### EditEducatorForm (Update Source)
**Relationship**: Indirect via Profile
- **Flow**: Card → Profile → Edit → Updated Card
- **Data Refresh**: Via parent component re-render

## Component Structure

### Helper Function
```typescript
getPriceTagColor(tier: string): Returns color class
- Beginner 1-3: Yellow (black text)
- Intermediate 1-3: Blue (white/black text)
- Premium 1-3: Red (white text)
```

### State
```typescript
imageError: boolean - Tracks image load failure
```

### Props
```typescript
educator: Educator {
  id, name, username, emailFallback, intro,
  qualification, subjects[], levels[], exams[],
  priceTier, yearsWithNextPhoton,
  studentsTaught, hoursTaught, profileImage
}
```

## Layout Sections
1. **Price Badge**: Absolute positioned, color-coded
2. **Image/Avatar**: Left side (mobile top)
3. **Info Section**: Right side (mobile bottom)
   - Name, username/email
   - Intro (2-line clamp)
   - Qualification
   - Levels & Exams tags
   - Stats (3 metrics)
   - Action buttons
   - Subjects footer

## Styling
- Glassmorphism: `bg-white/[0.02]` with backdrop blur
- Hover: Brightens to `bg-white/[0.04]`
- Responsive: Flex column → row at md breakpoint
- Image sizes: 48→56→64 (lg→xl breakpoints)

## User Interactions
1. **Card hover**: Visual feedback
2. **View Profile**: Navigate to profile page
3. **Message/Call**: Placeholder buttons (future)

## Future Enhancements
- Implement Message functionality
- Implement Call functionality
- Add favorite/bookmark feature
- Quick edit button
- Delete confirmation
