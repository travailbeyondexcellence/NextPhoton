# SecondarySidebarDrawer Component

## Overview
`SecondarySidebarDrawer` is an overlay-based secondary navigation drawer that provides extended navigation options for specific sections of the dashboard. It slides in from the left side when triggered by the `DashboardSidebar`, displaying context-specific menu items.

## Location
`/components/SecondarySidebarDrawer/SecondarySidebarDrawer.tsx`

## Purpose
Extends the navigation hierarchy by providing a third level of navigation options. When users click certain items in the `DashboardSidebar`, this drawer opens to reveal detailed sub-options (e.g., analytics reports, messaging options) without cluttering the main sidebar.

## Key Features

### Overlay & Drawer System
- **Modal overlay**: Semi-transparent black backdrop (50% opacity)
- **Slide-in animation**: 300ms smooth transition from left
- **Fixed positioning**: Positioned at `left-72` (adjacent to main sidebar)
- **High z-index**: z-50 (overlay), z-60 (drawer) for proper layering
- **Conditional rendering**: Only renders when `isSecondarySidebarOpen` is true

### Layout Structure
- **Width**: 288px (w-72)
- **Height**: Full viewport height
- **Position**: Left side at 288px offset (next to main sidebar)
- **Glassmorphism**: Backdrop blur with themed gradient
- **Border**: Right border for visual separation

### Header Section
- **Dynamic title**: Changes based on drawer content type
- **Close button**: X icon with smooth hover animations
- **Visual separator**: Bottom border dividing header from content

### Content Area
- **Custom scrollbar**: SimpleBar for consistent scrolling
- **Calculated height**: `calc(100vh - 4rem)` for proper spacing
- **Dynamic rendering**: Content switches based on `secondarySidebarContent` key

## Component Props

```typescript
interface SecondarySidebarDrawerProps {
  className?: string  // Optional additional CSS classes
}
```

## State Management (Zustand Store)

### Store Values
```typescript
{
  isSecondarySidebarOpen: boolean         // Controls visibility
  secondarySidebarContent: string | null  // Determines content type
  closeSecondarySidebar: () => void       // Closes the drawer
}
```

### Opening the Drawer
Triggered by `DashboardSidebar` via:
```typescript
openSecondarySidebar(key: string)  // e.g., "analytics", "messaging"
```

## Content Types

### 1. Analytics ("analytics")
**Title**: "Analytics Options"

**Sections**:
- **Performance Analytics**
  - Overall Performance Dashboard
  - Individual Student Analytics
  - Class-wise Performance
  - Subject-wise Analytics

- **Reports**
  - Generate Performance Report
  - Export Analytics Data
  - Custom Report Builder
  - Scheduled Reports

### 2. Messaging ("messaging")
**Title**: "Messaging Options"

**Sections**:
- **Quick Actions**
  - Compose New Message
  - Broadcast to All
  - Message Templates

- **Message Management**
  - Sent Messages
  - Scheduled Messages
  - Message History
  - Notification Settings

- **Recipients**
  - Message to Educators
  - Message to Learners
  - Message to Guardians
  - Create Groups

### 3. Default
**Title**: "Options"
**Content**: "No options available for this section."

## Helper Functions

### 1. `getDrawerTitle(content: string | null): string`
Maps content keys to user-friendly titles:
- `analytics` → "Analytics Options"
- `messaging` → "Messaging Options"
- `resources` → "Resource Management"
- `settings` → "Advanced Settings"
- Default → "Options"

### 2. `renderSecondaryContent(content, router, closeSecondarySidebar)`
Switches content based on the `secondarySidebarContent` key:
- Renders appropriate menu sections
- Handles navigation and drawer closing
- Returns null for unrecognized content types

### 3. `SecondaryMenuItem` (Internal Component)
Renders individual menu items with:
- Hover effects (scale, translate, shadow)
- Left border accent on hover
- Click handler for navigation
- Automatic drawer closing after navigation

## Interactive Features

### Keyboard Interactions
1. **ESC Key**: Closes the drawer
   - Listener added when drawer opens
   - Removed when drawer closes

### Focus Management
1. **Focus trap**: Drawer receives focus when opened
2. **Prevents body scroll**: While drawer is open
3. **Restores scroll**: When drawer closes

### Click Behaviors
1. **Overlay click**: Closes the drawer
2. **Close button**: Closes the drawer
3. **Menu item click**:
   - Navigates to route
   - Closes the drawer automatically

## Animations & Transitions

### Drawer Animation
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Transform**: translateX (slide effect)
- **States**:
  - Open: `translate-x-0`
  - Closed: `-translate-x-full`

### Menu Item Animations
- **Hover effects** (200ms, ease-out):
  - Background color change
  - Scale to 1.01
  - Translate X by 4px
  - Shadow appearance
  - Left border color change
  - Text color transition

### Close Button Animation
- **Hover effects**:
  - Scale to 1.10
  - Rotate 90 degrees
  - Opacity increase

## Interactions with Sister Components

### 1. DashboardNavbar
**Relationship**: Indirect
- No direct interaction
- Part of the same navigation ecosystem
- User flow: Navbar → Sidebar → Secondary Drawer

**User Journey**:
```
1. User opens sidebar via DashboardNavbar toggle
2. User selects menu item with secondary options
3. SecondarySidebarDrawer opens with context-specific content
```

### 2. DashboardSidebar
**Relationship**: Target ← Trigger
- `DashboardSidebar` is the primary trigger for this component
- Menu items with `hasSecondaryDrawer: true` open this drawer
- Data passed via Zustand store

**Data Flow**:
```
DashboardSidebar (menu item click)
  → openSecondarySidebar('analytics')
  → Store updates:
      - isSecondarySidebarOpen = true
      - secondarySidebarContent = 'analytics'
  → SecondarySidebarDrawer re-renders
  → Renders analytics-specific content
```

**Example Interaction**:
1. User clicks "Analytics" in DashboardSidebar
2. `openSecondarySidebar('analytics')` called
3. SecondarySidebarDrawer reads store state
4. Drawer slides in with analytics menu options
5. User selects "Individual Student Analytics"
6. Router navigates to `/admin/performance/individual-analytics`
7. Drawer automatically closes

### 3. Relationship Summary
```
Navigation Hierarchy:
┌─────────────────────────────────────────┐
│ Level 1: DashboardNavbar                │
│   ↓ (toggles sidebar visibility)        │
│ Level 2: DashboardSidebar               │
│   ↓ (triggers drawer with content key)  │
│ Level 3: SecondarySidebarDrawer ← THIS  │
└─────────────────────────────────────────┘
```

## Component Type
- **Client Component**: Marked with `"use client"` directive
- Requires browser APIs (document, keyboard events)
- Interactive state and animations

## Accessibility Features
1. **ARIA attributes**:
   - `role="dialog"`: Identifies as modal dialog
   - `aria-modal="true"`: Indicates modal behavior
   - `aria-label="Secondary options"`: Descriptive label
   - `aria-label="Close secondary sidebar"`: Close button label

2. **Focus management**:
   - Auto-focus on drawer when opened
   - `tabIndex={-1}`: Enables programmatic focus
   - Focus outline removed for visual design

3. **Semantic HTML**:
   - `<aside>` for sidebar semantics
   - `<button>` for interactive elements
   - Proper heading hierarchy

4. **Keyboard support**:
   - ESC key to close
   - Standard button/link interactions

## Styling Approach
- **Tailwind CSS**: Utility-first styling
- **Custom theme classes**:
  - `sidebar-theme-gradient`
  - `theme-backdrop-blur`
  - `theme-border-glass`
- **Glassmorphism**: Modern semi-transparent design
- **Responsive spacing**: Consistent padding and gaps
- **Smooth transitions**: All interactive elements

## Performance Considerations
1. **Conditional rendering**: Component doesn't render when closed
2. **Event cleanup**: Properly removes event listeners
3. **Body scroll management**: Prevents scroll leaks
4. **SimpleBar**: Lightweight custom scrollbar solution

## State Lifecycle

### Opening Sequence
1. `DashboardSidebar` calls `openSecondarySidebar(key)`
2. Store updates state
3. Component re-renders (no longer null)
4. Overlay fades in
5. Drawer slides in from left
6. Focus moves to drawer
7. Body scroll disabled
8. ESC listener attached

### Closing Sequence
1. User clicks overlay, close button, menu item, or presses ESC
2. `closeSecondarySidebar()` called
3. Store updates state
4. Drawer slides out
5. Overlay fades out
6. Component returns null
7. Body scroll restored
8. Event listeners removed

## Extensibility

### Adding New Content Types
To add a new drawer type (e.g., "reports"):

1. **Update titleMap**:
```typescript
reports: "Report Options"
```

2. **Add switch case**:
```typescript
case "reports":
  return (
    <div className="space-y-4">
      {/* Custom content */}
    </div>
  )
```

3. **Update DashboardSidebar menu**:
```typescript
{
  label: "Reports",
  icon: FileText,
  href: "/admin/reports",
  hasSecondaryDrawer: true,
  secondaryDrawerKey: "reports"
}
```

## Usage Context
Rendered at the dashboard layout level, typically alongside `DashboardSidebar`. Works as part of a comprehensive three-tier navigation system for complex applications with deep menu hierarchies.

## Design Patterns
- **Overlay pattern**: Modal-like behavior with backdrop
- **Drawer pattern**: Slide-in panel for contextual content
- **Portal-like rendering**: Fixed positioning outside normal flow
- **Controlled component**: State managed externally via Zustand

## Future Enhancements
- Add swipe gestures for mobile devices
- Support multiple drawer instances simultaneously
- Add drawer resize functionality
- Implement drawer history (back/forward navigation)
- Add breadcrumb trail for navigation context
- Support custom drawer widths per content type
- Add loading states for async content
