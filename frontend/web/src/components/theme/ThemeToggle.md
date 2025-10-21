# ThemeToggle Component

## Overview
Quick toggle button for switching between dark and light themes.

## Location
`/components/theme/ThemeToggle.tsx`

## Purpose
Provide one-click dark/light mode toggle.

## Key Features
- Button with sun/moon icon
- Toggles between dark and light
- Visual feedback
- Uses next-themes hook

## Interactions with Sister Components

### ThemeProvider (Provider)
**Relationship**: Consumer ← Provider
- Reads current theme
- Uses setTheme() to toggle

### ThemeSelector (Sister)
**Relationship**: Alternative control
- ThemeToggle: Quick binary toggle
- ThemeSelector: Full theme selection
- Both update same context

## Usage
Placed in headers, navbars for quick theme switching.

## Future
- Add system theme option
- Animate icon transition
- Remember user preference
