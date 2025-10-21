# PageLayout Component

## Overview
Layout wrapper for landing pages providing consistent structure.

## Location
`/components/landing/PageLayout.tsx`

## Purpose
Provide consistent layout structure for all landing pages with header and footer.

## Key Features
- Wraps page content
- Includes Navbar
- Includes Footer
- Main content area
- Consistent spacing and structure

## Typical Structure
```tsx
<PageLayout>
  <Navbar />
  <main>
    {children}
  </main>
  <Footer />
</PageLayout>
```

## Dependencies
- Navbar component
- Footer component

## Props
```typescript
children: React.ReactNode (required)
className?: string
```

## Interactions with Sister Components

### Navbar (Child)
**Relationship**: Parent → Child
- PageLayout renders Navbar at top

### Footer (Child)
**Relationship**: Parent → Child
- PageLayout renders Footer at bottom

### HeroSection (Child)
**Relationship**: Parent → Child
- Children rendered in main area

### FeaturesSection (Child)
**Relationship**: Parent → Child
- Children rendered in main area

## Common Use Cases
- Landing pages
- Marketing pages
- Public pages
- About pages
- Product pages

## Layout Pattern
Provides standard three-part layout:
1. Header (Navbar)
2. Content (children)
3. Footer (Footer)
