# FadeIn Component

## Overview
Wrapper component that animates children with fade-in effect from specified direction.

## Location
`/components/animations/FadeIn.tsx`

## Purpose
Provide reusable fade-in animations for any content with directional control.

## Key Features
- Fade-in with directional offset (up, down, left, right)
- Configurable delay and duration
- Supports all framer-motion props
- Easy-to-use wrapper component
- Smooth easeOut easing

## Props
```typescript
children: ReactNode (required)
delay?: number (default: 0)
duration?: number (default: 0.5)
className?: string
direction?: "up" | "down" | "left" | "right" (default: "up")
...motionProps: All framer-motion MotionProps
```

## Dependencies
- framer-motion: motion, MotionProps

## Direction Offsets
- **up**: y: 40 (animates from below)
- **down**: y: -40 (animates from above)
- **left**: x: 40 (animates from right)
- **right**: x: -40 (animates from left)

## Animation Details
**Initial State**:
- opacity: 0
- Position offset based on direction

**Animated State**:
- opacity: 1
- x: 0, y: 0

**Transition**:
- easeOut easing
- Configurable duration
- Configurable delay

## Interactions with Sister Components

### ScrollReveal (Sister)
**Relationship**: Similar purpose, different trigger
- FadeIn: Animates on mount
- ScrollReveal: Animates on scroll into view
- Both use opacity + offset pattern

### StaggerChildren (Sister)
**Relationship**: Can be used together
- FadeIn: Individual element animation
- StaggerChildren: Animates multiple children
- Can wrap FadeIn inside StaggerItem

### Parallax (Sister)
**Relationship**: Independent animations
- FadeIn: One-time entrance animation
- Parallax: Continuous scroll-based animation
- Different use cases

## Usage Examples

### Basic Fade-In
```tsx
<FadeIn>
  <h1>Welcome</h1>
</FadeIn>
```

### With Delay and Direction
```tsx
<FadeIn direction="left" delay={0.2} duration={0.8}>
  <Card>Content</Card>
</FadeIn>
```

### Multiple Sequential Elements
```tsx
<FadeIn delay={0}>
  <h1>First</h1>
</FadeIn>
<FadeIn delay={0.2}>
  <p>Second</p>
</FadeIn>
<FadeIn delay={0.4}>
  <button>Third</button>
</FadeIn>
```

## Common Use Cases
- Hero section titles
- Card entrance animations
- List item animations
- Modal content
- Page transitions
- Feature highlights

## Interactions with Parent Components
Used within any page or component that needs entrance animations.

## Future Enhancements
- Custom easing functions
- Bounce/spring animations
- Scale effect option
- Blur effect option
- Preset animation combinations
