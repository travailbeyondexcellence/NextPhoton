# GlobalLoader Component

## Overview
Full-screen loading overlay that displays during async operations.

## Location
`/components/loaders/GlobalLoader.tsx`

## Purpose
Provide a modern, animated loading overlay with backdrop blur for global loading states.

## Key Features
- Full-screen overlay with backdrop blur
- Multiple loader variants (spinner, dots, pulse, bars, orbit, shimmer)
- Loading message display
- Smooth fade in/out transitions with framer-motion
- Optional progress bar for extended operations
- Minimum display duration to prevent flashing
- Uses LoadingContext for state management

## Props
```typescript
variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'orbit' | 'shimmer' (default: 'shimmer')
showProgress?: boolean (default: false)
minDisplayDuration?: number (default: 150ms)
```

## Dependencies
- @/contexts/LoadingContext: useLoading hook
- framer-motion: AnimatePresence, motion
- MinimalisticLoader: Core loader component

## State Management
```typescript
isLoading: boolean - From LoadingContext
loadingMessage: string - From LoadingContext
shouldShow: boolean - Local state with min display duration
progress: number - Simulated progress (0-100)
```

## Interactions with Sister Components

### MinimalisticLoader (Sister)
**Relationship**: Child ← Parent
- GlobalLoader renders MinimalisticLoader
- Passes variant, size, showOverlay props
- MinimalisticLoader provides actual loader animations

### LoadingButton (Sister)
**Relationship**: Independent loaders
- LoadingButton: Button-level loading
- GlobalLoader: Application-level loading
- Both can be active simultaneously

### LoadingExample (Sister)
**Relationship**: Demo ← Utility
- LoadingExample demonstrates how to use GlobalLoader
- Shows useLoading hook patterns

## Interactions with Parent Components

### LoadingContext (Provider)
**Relationship**: Consumer ← Provider
- Reads isLoading, loadingMessage from context
- Automatically shows/hides based on context state

## Additional Exports

### PageTransitionLoader
- Slim progress bar for route changes
- Fixed at top of viewport
- z-index: 10000

### SkeletonLoader
- Content placeholder during loading
- Variants: text, rectangular, circular
- Configurable width/height

## Animation Details
- Entry: opacity 0→1, scale 0.9→1 (200ms)
- Exit: opacity 1→0, scale 1→0.9 (200ms)
- Progress bar: Caps at 90% until complete

## Future Enhancements
- Next.js 13+ App Router route change detection
- Custom loader variants
- Configurable z-index
- Accessibility improvements (ARIA attributes)
