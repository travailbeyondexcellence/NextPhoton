# MinimalisticLoader Component

## Overview
Fast, beautiful, and minimalistic loader with multiple animation variants.

## Location
`/components/loaders/MinimalisticLoader.tsx`

## Purpose
Provide core loading animations for use across the application.

## Key Features
- 6 animation variants (spinner, dots, pulse, bars, orbit, shimmer)
- 3 sizes (sm, md, lg)
- 3 speed options (slow, normal, fast)
- Theme-aware colors
- Optional overlay
- Custom color support
- framer-motion animations
- Optimized performance

## Props
```typescript
variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'orbit' | 'shimmer' (default: 'spinner')
size?: 'sm' | 'md' | 'lg' (default: 'md')
color?: string
showOverlay?: boolean (default: true)
message?: string
speed?: 'slow' | 'normal' | 'fast' (default: 'fast')
```

## Dependencies
- framer-motion: motion, AnimatePresence

## Animation Variants

### Spinner
Classic rotating spinner with border animation
- Single border-t rotation
- Linear easing
- Smooth 360° rotation

### Dots
Three dots with wave animation
- Vertical bounce effect
- Staggered delays
- Opacity pulse

### Pulse
Single circle with scale animation
- Scale and opacity pulse
- EaseInOut easing
- Expanding effect

### Bars
Five vertical bars with height animation
- Staggered height changes
- EaseInOut easing
- Wave pattern

### Orbit
Three orbiting particles
- Rotating around center point
- Different orbit speeds
- Center dot anchor

### Shimmer
Complex multi-layer animation
- Rotating outer ring with gradient
- Pulsing inner circle
- Center logo ("N")
- 3 orbiting particles
- Shimmer gradient effect

## Size Map
- **sm**: w-6 h-6
- **md**: w-8 h-8
- **lg**: w-12 h-12 (w-24 h-24 for shimmer)

## Speed Map
- **slow**: 2s duration
- **normal**: 1.5s duration
- **fast**: 1s duration

## Additional Exports

### CenteredPageLoader
Full-page centered loader
- Theme-aware gradient background
- Large size variant
- Entry animation
- Optional message

### InlineLoader
Inline loader for sections
- No overlay
- Small/medium sizes
- Dots variant default
- Used within components

### ButtonLoader
Minimal spinner for buttons
- Border with transparent top
- Small sizes (4px/5px)
- Inherits button color (border-current)
- 1s rotation

## Interactions with Sister Components

### GlobalLoader (Sister)
**Relationship**: Child ← Parent
- GlobalLoader uses MinimalisticLoader
- Provides variant and size configuration

### LoadingButton (Sister)
**Relationship**: Child ← Parent
- LoadingButton uses ButtonLoader
- Renders inside button during loading

### LoadingExample (Sister)
**Relationship**: Utility ← Demo
- LoadingExample demonstrates MinimalisticLoader
- Shows all variants in action

## Overlay Mode
When `showOverlay={true}`:
- Fixed full-screen overlay
- z-index: 9999
- bg-background/80 with backdrop-blur
- Entry/exit animations (opacity, scale)

## Styling
- Theme-aware with CSS variables (primary, background, foreground)
- Supports custom colors via `color` prop
- Responsive animations
- Smooth transitions

## Performance Optimization
- Lightweight animations
- GPU-accelerated transforms
- Minimal re-renders
- Fast variant switching

## Common Use Cases
- GlobalLoader (shimmer variant)
- LoadingButton (ButtonLoader)
- Inline section loading (InlineLoader)
- Full-page loading (CenteredPageLoader)

## Future Enhancements
- More variants (ring, grid, wave)
- Custom animation patterns
- Lottie animation support
- Accessibility improvements
- Reduced motion support
