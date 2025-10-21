# DashboardNavbar Component

## Overview
`DashboardNavbar` is a horizontal top navigation bar component that provides the main header for the dashboard interface. It uses glassmorphism design patterns to create a modern, semi-transparent appearance.

## Location
`/components/DashboardNavbar/DashboardNavbar.tsx`

## Purpose
This component serves as the primary top-level navigation element in the dashboard, providing quick access to essential UI controls and user settings.

## Key Features

### Layout Structure
- **Fixed height**: 64px (h-16)
- **Full width**: Spans the entire viewport width
- **Glassmorphism styling**: Semi-transparent backdrop with blur effects
- **Border bottom**: Subtle separation from content below
- **Z-index**: 40 (ensures it stays above most content)

### Left Section
- **SidebarTrigger**: Button to toggle the DashboardSidebar visibility
  - Styled with glassmorphism hover effects
  - Provides mobile-friendly sidebar control
- **Dashboard Title**: Static "Dashboard" text label

### Right Section
- **ThemeSelector**: Component for switching between color themes
- **ProfileDropdown**: User profile menu and account options

## Dependencies

### Component Dependencies
```typescript
- ThemeSelector from "@/components/ThemeSelector"
- ProfileDropdown from "@/components/ProfileDropdown"
- GlassNavbar from "@/components/glass"
- SidebarTrigger from "@/components/ui/sidebar"
```

### Styling
- Uses Tailwind CSS utility classes
- Custom theme classes: `theme-border-glass`, `theme-backdrop-blur`, `dashboard-header-gradient`
- Glassmorphism design pattern for modern UI appearance

## Interactions with Sister Components

### 1. DashboardSidebar
**Relationship**: Controller → Target
- The `SidebarTrigger` button in DashboardNavbar controls the visibility of `DashboardSidebar`
- When clicked, it toggles the sidebar's open/closed state
- Works in conjunction with the shadcn/ui Sidebar provider context
- Essential for responsive mobile navigation where sidebar needs to collapse

### 2. SecondarySidebarDrawer
**Relationship**: Indirect (through user flow)
- No direct code interaction
- User flow: DashboardNavbar → DashboardSidebar → SecondarySidebarDrawer
- The navbar enables sidebar access, which can then trigger the secondary drawer
- All three components work together to create a multi-level navigation hierarchy

## Component Type
- **Client Component**: Marked with `"use client"` directive
- Supports interactive UI elements and event handlers

## Visual Design
- Glassmorphism aesthetic with backdrop blur
- Gradient background via `dashboard-header-gradient` class
- Smooth transitions on interactive elements
- Responsive spacing with gap utilities

## Usage Context
This component is typically rendered at the top of dashboard layouts, providing consistent navigation across all dashboard pages. It remains fixed or sticky at the top to ensure persistent access to sidebar controls and user settings.

## State Management
- No internal state
- Relies on context providers for sidebar state (SidebarProvider from shadcn/ui)
- Child components (ThemeSelector, ProfileDropdown) manage their own state

## Accessibility
- Semantic HTML structure
- Interactive elements are properly clickable
- Visual hierarchy with clear sections
