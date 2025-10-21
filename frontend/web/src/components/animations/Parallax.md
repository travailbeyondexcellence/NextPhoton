# Parallax Component

## Overview
Creates parallax scrolling effect for children elements.

## Location
`/components/animations/Parallax.tsx`

## Purpose
Provide depth and visual interest through scroll-based parallax animations.

## Key Features
- Smooth parallax scrolling
- Configurable speed multiplier
- Custom scroll offset range
- Ref-based scroll tracking
- Y-axis transform animations

## Props
```typescript
children: ReactNode (required)
className?: string
speed?: number (default: 0.5)
offset?: [string, string] (default: ["start end", "end start"])
```

## Dependencies
- framer-motion: motion, useScroll, useTransform, MotionValue
- react: useRef

## How It Works
1. Creates a ref for the target element
2. Tracks scroll progress using useScroll
3. Transforms scroll progress to Y position
4. Applies Y transform to create parallax effect

## Speed Calculation
```typescript
y = [-100 * speed, +100 * speed]
```
- **speed: 0.5**: -50px to +50px movement
- **speed: 1**: -100px to +100px movement
- **speed: 0.2**: -20px to +20px movement

## Scroll Offset
Default: `["start end", "end start"]`
- Starts when element's start reaches viewport end
- Ends when element's end reaches viewport start

## Interactions with Sister Components

### FadeIn (Sister)
**Relationship**: Can be combined
- Parallax: Continuous scroll animation
- FadeIn: One-time entrance
- Use FadeIn to wrap Parallax for combined effects

### ScrollReveal (Sister)
**Relationship**: Complementary effects
- Parallax: Continuous movement
- ScrollReveal: Reveal on scroll
- Both use scroll tracking

### StaggerChildren (Sister)
**Relationship**: Independent animations
- Parallax: Scroll-based
- StaggerChildren: Mount-based
- Different triggers

## Additional Export

### ParallaxText
Scrolling text marquee effect.

**Props**:
```typescript
text: string (required)
className?: string
baseVelocity?: number (default: 5)
```

**Features**:
- Horizontal scrolling text
- Repeats text 4 times for seamless loop
- Velocity-based animation
- Uses scrollY for progress tracking

**Usage**:
```tsx
<ParallaxText
  text="Scroll Effect • "
  baseVelocity={10}
/>
```

## Usage Examples

### Basic Parallax
```tsx
<Parallax speed={0.5}>
  <img src="/background.jpg" alt="bg" />
</Parallax>
```

### Fast Movement
```tsx
<Parallax speed={2}>
  <div>Fast moving content</div>
</Parallax>
```

### Custom Offset
```tsx
<Parallax
  speed={0.8}
  offset={["start start", "end end"]}
>
  <Section />
</Parallax>
```

## Common Use Cases
- Background images with depth
- Hero section backgrounds
- Decorative elements
- Landing page sections
- Marketing pages
- Portfolio showcases

## Performance Considerations
- Uses GPU-accelerated transforms
- Minimal re-renders
- Efficient scroll listeners
- Should be used sparingly for performance

## Future Enhancements
- X-axis parallax option
- Rotation based on scroll
- Scale based on scroll
- Opacity based on scroll
- 3D transforms
- Horizontal scroll support
