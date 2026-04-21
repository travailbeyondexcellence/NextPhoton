# DashboardSidebar Component

## Overview
`DashboardSidebar` is the primary left-side navigation component for the dashboard. It renders a hierarchical menu structure with collapsible sections, smooth animations, and the ability to trigger a secondary sidebar drawer for extended navigation options.

## Location
`/components/DashboardSidebar/DashboardSidebar.tsx`

## Purpose
Provides the main navigation interface for the dashboard, displaying menu items organized by groups with support for nested navigation, collapsible sections, and integration with the secondary sidebar for complex navigation hierarchies.

## Key Features

### Layout Structure
- **Fixed header**: Contains the LogoComponent (64px height, h-16)
- **Scrollable content area**: Uses SimpleBar for custom scrollbars
- **Full height**: Spans entire viewport height
- **Responsive design**: Adapts to mobile and desktop viewports

### Header Section
- **LogoComponent**: Clickable logo with text, navigates to home page
- **Hover animations**: Scale and rotation effects on hover
- **Fixed positioning**: Remains visible while content scrolls
- **Themed background**: `bg-sidebar-accent/20` with backdrop blur

### Menu Structure
- **Grouped navigation**: Items organized by category (from adminMenu)
- **Collapsible sections**: Menu items with children can expand/collapse
- **Regular menu items**: Single-level navigation links
- **Secondary drawer triggers**: Special items that open SecondarySidebarDrawer
- **Visual separators**: Between menu groups for clear organization

### Interactive Features

#### 1. Collapsible Menu Items
- Expand/collapse with smooth transitions
- Show Plus (+) icon when collapsed, Minus (-) when expanded
- State managed in `openStates` array
- Nested children displayed with indentation

#### 2. Regular Navigation Links
- Active state highlighting (bg-sidebar-accent)
- Smooth hover effects with scale and shadow
- Icon + label layout
- Path-based active state detection

#### 3. Secondary Drawer Triggers
- Items with `hasSecondaryDrawer: true` property
- ChevronRight icon indicator
- Calls `openSecondarySidebar()` from Zustand store
- Navigates to route AND opens secondary drawer

### Animation & Transitions
- **Hover effects**: Translate, scale, opacity changes (200ms duration)
- **Icon animations**: Scale and rotation on hover
- **Smooth easing**: ease-out for natural motion
- **Active state**: Visual feedback for current route

## Dependencies

### Component Dependencies
```typescript
- LogoComponent from "./LogoComponent"
- Sidebar components from "@/components/ui/sidebar"
- Collapsible from "@/components/ui/collapsible"
- Separator from "@/components/ui/separator"
- SimpleBar from 'simplebar-react'
```

### State Management
```typescript
- useStore from "@/statestore/store"
  - openSecondarySidebar(): Opens the secondary drawer
- Local state:
  - mounted: Hydration check for theme
  - isMobile: Responsive behavior flag
  - openStates: Tracks collapse state of menu items
```

### Data Source
```typescript
- adminMenu from "@/app/(dashboard)/roleMenus/adminMenu"
  - Defines menu structure and items
  - Groups, items, children, icons, labels
```

### Router
```typescript
- usePathname(): Current route for active state
- useRouter(): Programmatic navigation
```

### Theme
```typescript
- useTheme() from next-themes
  - Conditional styling based on dark/light mode
```

## Internal State

### 1. `mounted` (boolean)
- Prevents hydration mismatches with theme
- Waits for client-side mounting before rendering

### 2. `isMobile` (boolean)
- Detects viewport width < 768px
- Used for responsive behavior adjustments

### 3. `openStates` (boolean[][])
- 2D array tracking collapse state
- Indexed by [groupIndex][itemIndex]
- Persists expand/collapse preferences during session

## Menu Item Types

### Type 1: Collapsible Items (with children)
```typescript
{
  label: string
  icon: LucideIcon
  children: MenuItem[]
}
```
- Renders CollapsibleTrigger
- Shows Plus/Minus indicator
- Displays nested children when expanded

### Type 2: Secondary Drawer Items
```typescript
{
  label: string
  icon: LucideIcon
  href: string
  hasSecondaryDrawer: true
  secondaryDrawerKey: string
}
```
- Triggers secondary sidebar on click
- Shows ChevronRight indicator
- Navigates to href after opening drawer

### Type 3: Regular Links
```typescript
{
  label: string
  icon: LucideIcon
  href: string
}
```
- Direct navigation links
- Active state based on pathname
- Simple click-to-navigate behavior

## Interactions with Sister Components

### 1. DashboardNavbar
**Relationship**: Target ← Controller
- `DashboardNavbar` contains `SidebarTrigger`
- SidebarTrigger controls this component's visibility
- Works through shadcn/ui SidebarProvider context
- Responsive: Sidebar collapses on mobile, triggered by navbar button

**Data Flow**:
```
DashboardNavbar (SidebarTrigger) → SidebarProvider Context → DashboardSidebar (visibility)
```

### 2. SecondarySidebarDrawer
**Relationship**: Trigger → Target
- `DashboardSidebar` can open `SecondarySidebarDrawer`
- Menu items with `hasSecondaryDrawer` property trigger the drawer
- Uses Zustand store for state management
- Passes `secondaryDrawerKey` to determine drawer content

**Data Flow**:
```
DashboardSidebar (menu item click)
  → useStore.openSecondarySidebar(key)
  → SecondarySidebarDrawer (opens with specific content)
```

**Example Flow**:
1. User clicks "Analytics" menu item (hasSecondaryDrawer: true)
2. DashboardSidebar calls `openSecondarySidebar('analytics')`
3. SecondarySidebarDrawer reads store state and renders analytics options
4. Router navigates to analytics route

## Component Type
- **Client Component**: Marked with `"use client"` directive
- Requires browser APIs (window, document)
- Interactive state and event handlers

## Styling Approach
- **Tailwind CSS**: Utility-first styling
- **Theme variables**: Custom theme classes for consistency
- **Glassmorphism**: Backdrop blur and transparency effects
- **Smooth transitions**: 200ms duration, ease-out timing
- **Responsive design**: Mobile-first approach

## Performance Optimizations
- **Conditional rendering**: Returns null until mounted (prevents hydration issues)
- **SimpleBar**: Lightweight custom scrollbar library
- **Memoization opportunity**: Could benefit from React.memo for menu items

## Accessibility Considerations
- Semantic HTML structure
- Keyboard navigation support (built into shadcn/ui components)
- Active state indicators for screen readers
- Clear visual hierarchy

## Usage Context
Rendered as the main navigation sidebar in dashboard layouts, typically wrapped in a `SidebarProvider` from shadcn/ui. Works in conjunction with `DashboardNavbar` and `SecondarySidebarDrawer` to create a comprehensive three-tier navigation system.

## Navigation Hierarchy
```
Level 1: DashboardNavbar (top bar with sidebar toggle)
Level 2: DashboardSidebar (main navigation) ← This Component
Level 3: SecondarySidebarDrawer (extended options)
```

## Theme Integration
- Dynamically styled based on current theme (dark/light)
- Uses `theme-backdrop-blur` and `theme-border-glass` classes
- Header background adapts to theme: gray-950 (dark) / gray-200 (light)
- Smooth transitions when theme changes

## Future Enhancements
- Add search/filter functionality for large menus
- Implement menu item badges for notifications
- Add keyboard shortcuts for navigation
- Persist collapse states in localStorage
- Add drag-and-drop menu reordering for customization
