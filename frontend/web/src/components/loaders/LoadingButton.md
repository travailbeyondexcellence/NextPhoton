# LoadingButton Component

## Overview
Button component with built-in loading state support.

## Location
`/components/loaders/LoadingButton.tsx`

## Purpose
Provide a button that shows a loader and disables interaction during async operations.

## Key Features
- Built-in loading state
- Multiple button variants (primary, secondary, outline, ghost, destructive)
- Multiple sizes (sm, md, lg)
- Optional loading text override
- Icon support
- Disabled state during loading
- Focus ring styles

## Props
```typescript
isLoading?: boolean
loadingText?: string
variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
size?: 'sm' | 'md' | 'lg'
icon?: React.ReactNode
showLoader?: boolean (default: true)
```

## Dependencies
- MinimalisticLoader: ButtonLoader component
- @/lib/utils: cn() utility

## Variants
- **primary**: bg-primary with hover effect
- **secondary**: bg-secondary with hover effect
- **outline**: Border with transparent bg
- **ghost**: Transparent with hover bg
- **destructive**: Red/destructive colors

## Sizes
- **sm**: px-3 py-1.5 text-sm
- **md**: px-4 py-2 text-base
- **lg**: px-6 py-3 text-lg

## Interactions with Sister Components

### MinimalisticLoader (Sister)
**Relationship**: Child ← Parent
- LoadingButton uses ButtonLoader from MinimalisticLoader
- ButtonLoader renders small spinner during loading

### GlobalLoader (Sister)
**Relationship**: Independent loaders
- LoadingButton: Component-level loading
- GlobalLoader: Application-level loading
- Different use cases, both can coexist

## Additional Export

### AsyncButton
Wraps async operations with automatic loading state.

**Props**:
```typescript
onClick?: () => Promise<void> | void
loadingMessage?: string
```

**Features**:
- Automatically sets isLoading during async operations
- Error handling with try/catch
- Prevents multiple concurrent clicks
- Finally block ensures loading state cleanup

**Usage**:
```tsx
<AsyncButton
  onClick={async () => await saveData()}
  loadingMessage="Saving..."
  variant="primary"
>
  Save Changes
</AsyncButton>
```

## Styling
- Tailwind CSS utilities
- Focus ring with ring-offset
- Transition-all for smooth state changes
- Cursor-wait during loading
- Opacity-50 when disabled

## Common Use Cases
- Form submissions
- Data mutations
- API calls
- File uploads
- Delete confirmations

## Future Enhancements
- Pulse animation on success
- Error state variant
- Progress indicator
- Confirmation dialog integration
