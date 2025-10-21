# ThemeSelector Component

## Overview
Component allowing users to select from available themes.

## Location
`/components/theme/ThemeSelector.tsx`

## Purpose
Provide UI for selecting predefined themes (dark/light variants).

## Key Features
- Dropdown/selector UI
- Shows available themes
- Applies selected theme
- Uses next-themes useTheme hook

## Interactions with Sister Components

### ThemeProvider (Provider)
**Relationship**: Consumer ← Provider
- Reads theme context from ThemeProvider
- Uses setTheme() from context

### ThemeToggle (Sister)
**Relationship**: Alternative control
- ThemeSelector: Full theme selection
- ThemeToggle: Quick dark/light toggle
- Both modify same theme context

## Interactions with Parent Components

### DashboardNavbar (Parent)
**Relationship**: Child ← Parent
- Rendered in navbar
- Positioned in top-right area
- Allows theme changes while browsing

## Usage
Used in dashboards and settings for theme customization.
