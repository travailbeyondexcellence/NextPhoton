# GlassModal Component

## Overview
Modal dialog with glassmorphism effects and backdrop blur.

## Location
`/components/glass/GlassModal.tsx`

## Purpose
Provide an elegant modal dialog with glass design for overlays and dialogs.

## Key Features
- Glassmorphism design
- Backdrop blur overlay
- Click-outside-to-close
- Multiple size options
- Smooth animations (fade-in, zoom-in)
- Theme-adaptive
- Glass tint support
- z-index: 50 layering

## Props
```typescript
isOpen: boolean (required)
onClose: () => void (required)
children: React.ReactNode (required)
className?: string
size?: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
```

## Dependencies
- @/lib/utils: cn() utility

## Sizes
- **sm**: max-w-sm (~24rem)
- **md**: max-w-md (~28rem) - default
- **lg**: max-w-lg (~32rem)
- **xl**: max-w-xl (~36rem)

## Modal Structure
1. **Fixed backdrop** (inset-0, z-50)
   - bg-black/30 backdrop-blur-sm
   - onClick triggers onClose

2. **Modal content** (centered)
   - bg-background/20 backdrop-blur-2xl
   - border-border/30
   - rounded-xl shadow-2xl
   - p-6

3. **Layered effects**
   - Glass tint overlay (CSS variable)
   - Gradient overlay (white/10 to transparent)
   - Content (z-10)

## Animations
```
animate-in fade-in zoom-in-95 duration-300
```
- Fades in from 0 to 1 opacity
- Zooms from 95% to 100% scale
- 300ms duration

## CSS Variables Used
- `--glass-tint`: Custom glass tint color
- `--glass-text-color`: Custom text color

## Interactions with Sister Components

### GlassButton (Sister)
**Relationship**: Often used together
- Buttons in modal footer
- Close button in modal header
- Action buttons (Cancel, Confirm)

### GlassCard (Sister)
**Relationship**: Similar structure
- Both use layered glass effects
- Modal can contain GlassCards
- Consistent design language

### GlassPanel (Sister)
**Relationship**: Can contain each other
- Modal content can be GlassPanel
- Nested glassmorphism

## Click-Outside Behavior
Backdrop div has `onClick={onClose}`
- Clicking outside modal closes it
- Common modal UX pattern
- Can be disabled by removing onClick

## Common Use Cases
- Confirmation dialogs
- Forms in overlay
- Image lightbox
- Alert dialogs
- Settings panels
- User profile editor
- Delete confirmations

## Accessibility Considerations
**Missing (Future)**:
- Escape key to close
- Focus trap
- ARIA attributes (role="dialog", aria-modal)
- Focus management

## Future Enhancements
- Escape key support
- Focus trap
- ARIA attributes
- Animation variants
- Header/footer components
- Close button built-in
- Overlay click disable option
- Scroll lock
- Prevent body scroll
