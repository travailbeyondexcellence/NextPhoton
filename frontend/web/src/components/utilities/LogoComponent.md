# LogoComponent Component

## Overview
SVG-based logo component with theme-aware colors and optional text.

## Location
`/components/utilities/LogoComponent.tsx`

## Purpose
Display NextPhoton logo with dynamic colors based on current theme.

## Key Features
- SVG implementation
- Theme-aware gradient colors
- Configurable size
- Optional text display
- Fallback handling

## Props
```typescript
width?: number (default: 48)
height?: number (default: 48)
className?: string
showText?: boolean (default: false)
textClassName?: string
```

## Dependencies
- @/hooks/useTheme: Get current theme
- glass-themes.json: Theme color configuration

## Color System
Reads gradient colors from theme JSON:
- gradientStart through gradientEnd
- ringColor1-4
- detailColor1-3
- textColor

## Interactions with Sister Components

### ProfileDropdown (Sister)
**Relationship**: Independent utilities
- No direct interaction
- Both in utilities folder
- Both used in navigation

## Interactions with Parent Components

### DashboardSidebar (Parent)
**Relationship**: Child ← Parent
- Rendered in sidebar header
- showText: true (displays with logo)
- Clickable, navigates to home
- Hover animations applied by parent

## Usage Context
- Sidebar headers
- Login pages
- Landing pages
- Anywhere branding needed

## Future
- Multiple logo variants
- Animated logo option
- Custom color overrides
