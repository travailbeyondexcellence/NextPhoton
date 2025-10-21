# GlassPanel Component

## Overview
Large glassmorphism panel for sections and content areas with enhanced effects.

## Location
`/components/glass/GlassPanel.tsx`

## Purpose
Provide a larger glassmorphism container for sections, dashboards, and content blocks.

## Key Features
- Enhanced backdrop blur (sm to 2xl)
- Gradient backgrounds (subtle to strong)
- Multiple variants (default, elevated, inset)
- Glass tint overlay support
- Decorative glass overlay
- Theme-adaptive
- rounded-xl corners

## Props
```typescript
variant?: 'default' | 'elevated' | 'inset' (default: 'default')
blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' (default: 'lg')
gradient?: 'subtle' | 'moderate' | 'strong' (default: 'subtle')
children: React.ReactNode (required)
className?: string
...HTMLDivElement attributes
```

## Dependencies
- @/lib/utils: cn() utility

## Blur Levels
- **sm**: backdrop-blur-sm
- **md**: backdrop-blur-md
- **lg**: backdrop-blur-lg (default)
- **xl**: backdrop-blur-xl
- **2xl**: backdrop-blur-2xl (maximum)

## Gradient Levels

### subtle (default)
```
from-card/5 via-card/10 to-background/5
```

### moderate
```
from-card/10 via-card/15 to-background/10
```

### strong
```
from-card/15 via-card/20 to-background/15
```

## Variants

### default
- border border-border/20
- Standard shadow
- Clean appearance

### elevated
- border border-border/30 (more prominent)
- shadow-2xl (dramatic depth)
- Lifted appearance

### inset
- border border-border/10 (subtle)
- shadow-inner (recessed look)
- Embedded appearance

## Layering System
1. Base panel (rounded-xl, p-6, border, shadow)
2. Glass tint overlay (CSS variable)
3. Content wrapper (z-10)
4. Decorative gradient overlay (top-right shine)

## CSS Variables Used
- `--glass-tint`: Custom glass tint color
- `--glass-text-color`: Custom text color for contrast

## Decorative Overlay
```html
<div className="absolute inset-0 rounded-xl
  bg-gradient-to-tr from-white/5 via-transparent to-white/5
  pointer-events-none"
/>
```
Creates top-right to bottom-left shine

## Interactions with Sister Components

### GlassCard (Sister)
**Relationship**: Size variations
- GlassCard: Smaller, individual items
- GlassPanel: Larger, section containers
- Can nest cards inside panels

### GlassButton (Sister)
**Relationship**: Container ← Child
- Buttons inside panels for actions
- Footer actions, CTAs
- Consistent glass design

### GlassModal (Sister)
**Relationship**: Different containers
- Panel: Page sections
- Modal: Overlays
- Similar glass effects

### GlassNavbar (Sister)
**Relationship**: Page layout siblings
- Navbar: Header
- Panel: Content sections
- Complementary containers

## Common Use Cases
- Dashboard sections
- Feature panels
- Settings panels
- Form containers
- Content blocks
- Sidebar panels
- Pricing tables
- Hero sections
- Statistics panels

## Padding
Default: `p-6` (1.5rem)
Can be overridden with className

## Future Enhancements
- Animation presets
- Glow effects
- Border gradient options
- Collapsible variant
- Header/footer slots
- Loading skeleton
- Image backgrounds
- Noise texture
