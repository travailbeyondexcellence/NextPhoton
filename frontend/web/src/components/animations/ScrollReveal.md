# ScrollReveal Component

## Overview
Reveals content when it scrolls into viewport.

## Location
`/components/animations/ScrollReveal.tsx`

## Purpose
Animate content entrance based on scroll position for engaging user experience.

## Key Features
- Viewport detection with useInView
- Configurable reveal threshold
- Once or repeating animations
- Animation controls for dynamic reveals
- Smooth fade-in with Y offset

## Props
```typescript
children: ReactNode (required)
className?: string
delay?: number (default: 0)
duration?: number (default: 0.6)
once?: boolean (default: true)
```

## Dependencies
- framer-motion: motion, useInView, useAnimation, Variants
- react: useEffect, useRef

## Animation Variants

### Hidden State
- opacity: 0
- y: 75 (below original position)

### Visible State
- opacity: 1
- y: 0 (original position)
- easeOut transition

## Viewport Configuration
```typescript
useInView(ref, {
  once: true,     // Animate only once
  margin: "-100px" // Trigger 100px before entering viewport
})
```

## once Prop Behavior
- **true (default)**: Animates once, stays visible
- **false**: Animates every time entering/leaving viewport

## Interactions with Sister Components

### FadeIn (Sister)
**Relationship**: Different trigger mechanism
- ScrollReveal: Scroll-triggered
- FadeIn: Mount-triggered
- Similar animation pattern (opacity + y offset)

### Parallax (Sister)
**Relationship**: Both scroll-based
- ScrollReveal: One-time reveal
- Parallax: Continuous movement
- Can be combined for layered effects

### StaggerChildren (Sister)
**Relationship**: Can be nested
- Wrap StaggerChildren inside ScrollReveal
- Reveals staggered items when scrolling

## Usage Examples

### Basic Reveal
```tsx
<ScrollReveal>
  <Feature title="Amazing Feature" />
</ScrollReveal>
```

### With Delay
```tsx
<ScrollReveal delay={0.3} duration={0.8}>
  <Card>Content revealed after delay</Card>
</ScrollReveal>
```

### Repeating Animation
```tsx
<ScrollReveal once={false}>
  <div>Animates every time you scroll to it</div>
</ScrollReveal>
```

### Multiple Reveals
```tsx
{features.map((feature, index) => (
  <ScrollReveal key={index} delay={index * 0.2}>
    <FeatureCard {...feature} />
  </ScrollReveal>
))}
```

## Common Use Cases
- Feature sections
- Testimonials
- Pricing cards
- Team member cards
- Timeline events
- Gallery items
- Blog post previews
- Statistics counters

## Interactions with Parent Components
Used within landing pages, marketing pages, and content-heavy pages.

## Margin Trigger
`margin: "-100px"` means:
- Animation triggers 100px BEFORE element enters viewport
- Smoother user experience
- Content already animating when user sees it

## Performance Considerations
- Uses Intersection Observer API
- Efficient viewport detection
- Minimal re-renders
- Safe to use with many elements

## Future Enhancements
- Custom reveal directions
- Custom margin/threshold
- Scale reveal option
- Blur reveal option
- Custom variants
- Sequential reveals
- Progress-based animations
