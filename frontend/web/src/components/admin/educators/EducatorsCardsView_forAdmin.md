# EducatorsCardsView_forAdmin Component

## Overview
Container component that renders educators in a responsive card grid layout.

## Location
`/components/admin/educators/EducatorsCardsView_forAdmin.tsx`

## Purpose
Display educators as cards in grid format, mapping over educators array.

## Key Features
- Grid layout (1 col mobile, 2 col desktop-xl)
- Uses mock data (educatorsData.json)
- Maps and renders EducatorCard for each educator

## Dependencies
```typescript
- EducatorCard_forAdmin: Child component
- mock-data/educators.json: Data source
```

## Interactions with Sister Components

### EducatorCard_forAdmin (Child)
**Relationship**: Parent → Child
- **Renders**: Maps over educators, creates card for each
- **Data Flow**: Passes educator object as prop
- **Pattern**: Container-Presenter

### EducatorsList_forAdmin (Sister - Alternative View)
**Relationship**: Parallel View Mode
- **Same Data**: Both use educator data
- **Different Layout**: Grid (this) vs Table (list)
- **User Toggle**: Switch between views (future feature)

## State
```typescript
educators: Array - Initialized from educatorsData.json
```

## Grid Layout
- Mobile: `grid-cols-1`
- Desktop XL: `grid-cols-2`
- Gap: `gap-6`
- Max width: `1600px`

## Data Flow
```
educatorsData.json → EducatorsCardsView state
                  → map() → EducatorCard × N
```

## Future Enhancements
- Pagination
- Infinite scroll
- Search/filter integration
- Sort options
- View mode toggle (Grid ↔ List)
