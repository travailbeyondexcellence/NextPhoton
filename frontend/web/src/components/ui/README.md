# UI Components (shadcn/ui)

## Overview
This folder contains shadcn/ui component library primitives built on Radix UI.

## Location
`/components/ui/`

## Purpose
Provide accessible, customizable UI primitives for the application.

## Library
These components are from [shadcn/ui](https://ui.shadcn.com/), a collection of re-usable components built with:
- Radix UI (primitives)
- Tailwind CSS (styling)
- class-variance-authority (variants)

## Installation
Components are installed via shadcn/ui CLI:
```bash
npx shadcn-ui@latest add [component-name]
```

## Components List (21 components)

### Form & Input Components
1. **avatar.tsx** - User avatar display
2. **button.tsx** - Button with variants
3. **checkbox.tsx** - Checkbox input
4. **form.tsx** - Form wrapper with react-hook-form
5. **input.tsx** - Text input field
6. **label.tsx** - Form label
7. **radio-group.tsx** - Radio button group
8. **select.tsx** - Dropdown select
9. **slider.tsx** - Range slider
10. **switch.tsx** - Toggle switch
11. **textarea.tsx** - Multi-line text input

### Layout & Container Components
12. **card.tsx** - Card container
13. **scroll-area.tsx** - Scrollable area
14. **separator.tsx** - Visual divider
15. **sheet.tsx** - Side sheet/drawer
16. **sidebar.tsx** - Sidebar navigation
17. **collapsible.tsx** - Collapsible content

### Feedback Components
18. **skeleton.tsx** - Loading skeleton
19. **sonner.tsx** - Toast notifications
20. **tooltip.tsx** - Hover tooltip

### Navigation Components
21. **dropdown-menu.tsx** - Dropdown menu

## Customization
Components can be customized through:
- Tailwind CSS classes
- CSS variables in globals.css
- Variant props
- className overrides

## Documentation
Full component documentation: https://ui.shadcn.com/docs/components

## Usage Pattern
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

<Button variant="default">Click me</Button>
<Input placeholder="Enter text..." />
```

## Theme Integration
Components use CSS variables for theming:
- --background
- --foreground
- --primary
- --secondary
- --muted
- --accent
- --destructive
- --border
- --ring

## Accessibility
All components follow WAI-ARIA guidelines through Radix UI primitives.
