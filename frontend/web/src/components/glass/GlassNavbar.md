# GlassNavbar Component

## Overview
Glassmorphism navigation bar with enhanced blur effects.

## Location
`/components/glass/GlassNavbar.tsx`

## Purpose
Provide a modern glassmorphism navbar for headers and navigation areas.

## Key Features
- Enhanced backdrop blur (xl)
- Sticky positioning option
- Transparent or semi-opaque backgrounds
- Optional bottom border
- Glass shine effect overlay
- Theme-adaptive
- Smooth transitions

## Props
```typescript
sticky?: boolean (default: true)
transparent?: boolean (default: false)
bordered?: boolean (default: true)
children: React.ReactNode (required)
className?: string
...HTMLElement attributes
```

## Dependencies
- @/lib/utils: cn() utility

## Sticky Behavior
When `sticky={true}` (default):
- position: sticky
- top: 0
- Stays at top when scrolling
- z-index: 40

## Background Options
- **transparent={false}**: bg-background/10 (default)
- **transparent={true}**: bg-background/5 (more transparent)

## Border
When `bordered={true}` (default):
- border-b border-border/10
- Subtle bottom border separation

## Glass Shine Effect
```html
<div className="absolute inset-0 bg-gradient-to-r
  from-transparent via-white/5 to-transparent
  pointer-events-none"
/>
```
Adds horizontal shimmer/shine overlay

## Interactions with Sister Components

### GlassButton (Sister)
**Relationship**: Container ← Child
- Buttons commonly used in navbar
- CTA buttons, auth buttons
- Consistent glass aesthetic

### GlassCard (Sister)
**Relationship**: Independent containers
- Different use cases (navbar vs cards)
- Can both be on same page

### GlassModal (Sister)
**Relationship**: Independent layers
- Navbar: z-40
- Modal: z-50
- Modal appears above navbar

### GlassPanel (Sister)
**Relationship**: Different container types
- Navbar: Horizontal header
- Panel: Content sections
- Complementary uses

## Layering
- z-index: 40 (below modals, above content)
- Relative container for shine effect
- Children rendered inside relative wrapper

## Common Use Cases
- Site header
- Dashboard top navigation
- Landing page navbar
- App navigation bar
- Sticky header with logo, links, buttons

## Typical Structure
```tsx
<GlassNavbar sticky bordered>
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    <Logo />
    <NavLinks />
    <GlassButton variant="primary">Sign In</GlassButton>
  </div>
</GlassNavbar>
```

## Shadow
When `transparent={false}`:
- shadow-sm added for subtle depth

## Future Enhancements
- Scroll-based transparency change
- Expand/collapse animation
- Mobile menu integration
- Blur intensity on scroll
- Color theme integration
- Backdrop saturation option
