# StaggerChildren Component

## Overview
Animates multiple children with staggered delays for sequential entrance effects.

## Location
`/components/animations/StaggerChildren.tsx`

## Purpose
Create cascading entrance animations for lists, grids, and grouped content.

## Key Features
- Staggered child animations
- Configurable stagger delay
- Configurable initial delay
- Container-based animation control
- Fade + slide + scale effect

## Props
```typescript
children: ReactNode (required)
className?: string
staggerDelay?: number (default: 0.1)
delayStart?: number (default: 0)
```

## Dependencies
- framer-motion: motion, Variants

## Container Variants
```typescript
hidden: { opacity: 0 }
visible: {
  opacity: 1,
  transition: {
    staggerChildren: 0.1,  // Delay between each child
    delayChildren: 0       // Delay before first child
  }
}
```

## Interactions with Sister Components

### StaggerItem (Companion)
**Relationship**: Parent ← Child
- StaggerChildren: Container
- StaggerItem: Individual child wrapper
- MUST use together for proper staggering

### FadeIn (Sister)
**Relationship**: Similar purpose
- StaggerChildren: Multiple elements
- FadeIn: Single element
- StaggerChildren more efficient for lists

### ScrollReveal (Sister)
**Relationship**: Can be combined
- Wrap StaggerChildren in ScrollReveal
- Reveals all items when scrolled into view
- Then staggers their animations

### Parallax (Sister)
**Relationship**: Independent animations
- StaggerChildren: Mount-based
- Parallax: Scroll-based
- Different use cases

## Additional Export

### StaggerItem
Individual child wrapper for StaggerChildren.

**Props**:
```typescript
children: ReactNode (required)
className?: string
```

**Variants**:
```typescript
hidden: {
  opacity: 0,
  y: 20,
  scale: 0.95
}
visible: {
  opacity: 1,
  y: 0,
  scale: 1,
  transition: {
    duration: 0.5,
    ease: "easeOut"
  }
}
```

## Usage Examples

### Basic Stagger
```tsx
<StaggerChildren>
  <StaggerItem><Card>Item 1</Card></StaggerItem>
  <StaggerItem><Card>Item 2</Card></StaggerItem>
  <StaggerItem><Card>Item 3</Card></StaggerItem>
</StaggerChildren>
```

### Custom Delays
```tsx
<StaggerChildren staggerDelay={0.2} delayStart={0.5}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <ItemCard {...item} />
    </StaggerItem>
  ))}
</StaggerChildren>
```

### With ScrollReveal
```tsx
<ScrollReveal>
  <StaggerChildren staggerDelay={0.15}>
    {features.map(feature => (
      <StaggerItem key={feature.id}>
        <FeatureCard {...feature} />
      </StaggerItem>
    ))}
  </StaggerChildren>
</ScrollReveal>
```

## Common Use Cases
- Feature grids
- Product catalogs
- Team member grids
- Service listings
- Navigation menus
- Card galleries
- Icon lists
- Benefits sections

## Animation Timeline
Example with 3 items, staggerDelay: 0.1, delayStart: 0:
```
0.0s: Container fades in
0.0s: Item 1 starts animating
0.1s: Item 2 starts animating
0.2s: Item 3 starts animating
0.5s: All animations complete
```

## Best Practices
1. Always wrap children in StaggerItem
2. Use with lists of 2-12 items (optimal)
3. Keep staggerDelay between 0.05-0.2s
4. Reduce staggerDelay for longer lists
5. Don't nest StaggerChildren deeply

## Performance
- Efficient with framer-motion variants
- GPU-accelerated transforms
- Scales well up to ~20 items
- Consider virtualization for 100+ items

## Future Enhancements
- Auto-calculate staggerDelay based on child count
- Reverse stagger option
- Custom stagger patterns (wave, random, spiral)
- Bi-directional stagger
- Grid-aware staggering
- Different animations per item
