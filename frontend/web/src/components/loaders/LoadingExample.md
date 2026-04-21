# LoadingExample Component

## Overview
Demo component demonstrating various loading system patterns.

## Location
`/components/loaders/LoadingExample.tsx`

## Purpose
Provide reference implementation and examples for using the global loading system.

## Key Features
- 5 different loading pattern examples
- Interactive buttons to trigger each pattern
- Current loading state display
- Usage instructions documentation
- Real-time demonstrations

## Dependencies
- @/contexts/LoadingContext: useLoading hook
- @/hooks/useAsyncAction: Async action hook
- sonner: toast notifications

## Examples Demonstrated

### Example 1: Manual Loading Control
```typescript
startLoading('key', 'message')
// ... async operation
stopLoading('key')
```
**Use Case**: Fine-grained control over loading state

### Example 2: withLoading Wrapper
```typescript
await withLoading(
  async () => { /* operation */ },
  'key',
  'message'
)
```
**Use Case**: Automatic loading for async functions

### Example 3: useAsyncAction Hook
```typescript
const { execute } = useAsyncAction(
  async (params) => { /* operation */ },
  { loadingMessage, onSuccess, onError }
)
```
**Use Case**: Hook-based async operations with built-in handling

### Example 4: Form Submission
Shows form submission with loading state and toast feedback.

### Example 5: Multiple Concurrent Operations
Demonstrates managing multiple loading keys simultaneously.

## Interactions with Sister Components

### GlobalLoader (Sister)
**Relationship**: Demo ← Utility
- LoadingExample triggers GlobalLoader through LoadingContext
- Demonstrates GlobalLoader in action

### LoadingButton (Sister)
**Relationship**: Could use together
- Examples could be enhanced with LoadingButton
- Currently uses standard buttons

### MinimalisticLoader (Sister)
**Relationship**: Demo ← Utility
- Examples indirectly use MinimalisticLoader via GlobalLoader

## Interactions with Parent Components

### LoadingContext (Provider)
**Relationship**: Consumer ← Provider
- Uses useLoading hook from context
- Demonstrates context API patterns

## UI Components
- Grid layout for examples
- Cards for each example
- Live loading state indicator
- Instructions section
- Syntax highlighting for code patterns

## Best Practices Documented
1. Always use finally block to stop loading
2. Use unique loading keys
3. Provide meaningful loading messages
4. Handle errors properly
5. Prevent concurrent operations

## Usage Context
- Documentation/demo pages
- Developer onboarding
- Testing loading patterns
- Reference during development

## Future Enhancements
- Copy code snippets
- CodeSandbox integration
- More complex examples
- Video demonstrations
- Performance metrics
