# GlassCard Component

## Overview
Glassmorphism card component with customizable blur, opacity, and gradient effects.

## Location
`/components/glass/GlassCard.tsx`

## Purpose
Provide a versatile glassmorphism card for content sections, features, and layouts.

## Key Features
- Customizable backdrop blur (none, sm, md, lg, xl)
- Adjustable opacity (low, medium, high)
- Optional gradient overlay
- Hover lift effect (hover variant)
- Theme-adaptive
- Glass tint overlay support
- Semi-transparent borders

## Props
```typescript
variant?: 'default' | 'hover' | 'static' (default: 'default')
blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
opacity?: 'low' | 'medium' | 'high' (default: 'medium')
gradient?: boolean (default: false)
children: React.ReactNode (required)
className?: string
...HTMLDivElement attributes
```

## Dependencies
- @/lib/utils: cn() utility

## Blur Levels
- **none**: No backdrop blur
- **sm**: backdrop-blur-sm (subtle)
- **md**: backdrop-blur-md (default)
- **lg**: backdrop-blur-lg (strong)
- **xl**: backdrop-blur-xl (very strong)

## Opacity Levels
- **low**: bg-card/5 (very transparent)
- **medium**: bg-card/10 (default)
- **high**: bg-card/20 (more opaque)

## Variants

### default
Standard glass card with no special effects

### hover
- Hover lift: -translate-y-0.5
- Enhanced shadow on hover
- Interactive feel

### static
Same as default, explicit non-interactive

## gradient Feature
When `gradient={true}`:
- Adds bg-gradient-to-br from-card/10 to-background/5
- Additional white/5 gradient overlay
- Depth and dimension

## CSS Variables Used
- `--glass-tint`: Custom glass tint color
- `--glass-text-color`: Custom text color for contrast

## Interactions with Sister Components

### GlassButton (Sister)
**Relationship**: Container ← Child
- Cards often contain GlassButtons
- Consistent glassmorphism design
- Buttons for card actions

### GlassModal (Sister)
**Relationship**: Similar structure
- Both use glass overlays
- Both support tint variables
- Different use cases (card vs modal)

### GlassPanel (Sister)
**Relationship**: Similar purpose
- GlassCard: Smaller content blocks
- GlassPanel: Larger sections
- Can be nested

### GlassNavbar (Sister)
**Relationship**: Independent containers
- Different use cases
- Consistent glass styling

## Layering System
1. Base card (rounded-lg, border, shadow)
2. Glass tint overlay (CSS variable)
3. Gradient overlay (if enabled)
4. Content (z-10, relative)

## Common Use Cases
- Feature cards
- Pricing tiers
- Team member cards
- Testimonial cards
- Product cards
- Dashboard widgets
- Info panels

## Shadow Effect
Default: `shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]`
Hover: `shadow-[0_12px_40px_0_rgba(31,38,135,0.25)]`

## Future Enhancements
- Border gradient options
- Animation presets
- Click/active states
- Skeleton loading state
- Image background support
- Noise texture overlay
