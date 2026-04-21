# GlassButton Component

## Overview
Glassmorphism-styled button with multiple variants and hover effects.

## Location
`/components/glass/GlassButton.tsx`

## Purpose
Provide a modern glassmorphism button with backdrop blur and semi-transparent backgrounds.

## Key Features
- Multiple variants (default, primary, secondary, ghost, destructive)
- 3 sizes (sm, md, lg)
- Optional glow effect on hover
- Backdrop blur effect
- Active scale animation
- Disabled state support
- Theme-aware colors

## Props
```typescript
variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive' (default: 'default')
size?: 'sm' | 'md' | 'lg' (default: 'md')
glowOnHover?: boolean (default: false)
children: React.ReactNode (required)
disabled?: boolean
className?: string
...HTMLButtonAttributes
```

## Dependencies
- @/lib/utils: cn() utility

## Variants

### default
- bg-card/10 with border-border/20
- Neutral glass effect
- Hover: bg-card/15

### primary
- bg-primary/10 with border-primary/20
- Primary color glass tint
- Hover: bg-primary/15
- Optional shadow-primary/25 glow

### secondary
- bg-secondary/10 with border-secondary/20
- Secondary color glass tint
- Hover: bg-secondary/15
- Optional shadow-secondary/25 glow

### ghost
- Transparent background
- Hover reveals glass effect
- No border initially

### destructive
- bg-destructive/10 with border-destructive/20
- Red/destructive glass tint
- Hover: bg-destructive/15

## Sizes
- **sm**: px-3 py-1.5 text-sm
- **md**: px-4 py-2 (base)
- **lg**: px-6 py-3 text-lg

## Interactions with Sister Components

### GlassCard (Sister)
**Relationship**: Similar styling system
- Both use glassmorphism design
- Can be used together (button inside card)
- Consistent visual language

### GlassModal (Sister)
**Relationship**: Often used together
- Buttons commonly used in modals
- Consistent glassmorphism aesthetic
- Action buttons in modal footers

### GlassNavbar (Sister)
**Relationship**: Can be used together
- Buttons in navbar for CTAs
- Consistent glass styling

### GlassPanel (Sister)
**Relationship**: Container ← Button
- Buttons inside panels for actions
- Complementary design system

## Styling Features
- **backdrop-blur-md**: Glass blur effect
- **transform active:scale-95**: Press animation
- **transition-all duration-200**: Smooth transitions
- **rounded-md**: Medium border radius
- **opacity-50 when disabled**: Visual feedback

## Common Use Cases
- Call-to-action buttons
- Form submission buttons
- Navigation buttons
- Modal action buttons
- Hero section CTAs
- Card action buttons

## glowOnHover Feature
When `glowOnHover={true}` and variant is primary/secondary:
- Adds shadow on hover
- shadow-primary/25 for primary variant
- shadow-secondary/25 for secondary variant
- Creates glowing halo effect

## Future Enhancements
- Icon support built-in
- Loading state integration
- Ripple effect animation
- Custom glow colors
- Group button variants
- Icon-only variant
