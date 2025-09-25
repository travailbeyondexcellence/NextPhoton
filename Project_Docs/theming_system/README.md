# ZenEru Theming System Documentation

## Overview

The ZenEru theming system is a comprehensive, CSS variable-based theming solution that provides:
- 12+ professionally designed themes
- Real-time theme switching without page reload
- Smooth color transitions
- Full Tailwind CSS integration
- Server-side rendering support with flash prevention
- Accessibility-focused high contrast options

## System Architecture

The theming system consists of several key components:

1. **Theme Configuration** (`themes.json`) - Central theme definitions
2. **CSS Variables** - Dynamic color system using CSS custom properties
3. **Tailwind Integration** - Seamless integration with Tailwind utilities
4. **React Components** - User interface for theme selection
5. **Theme Script** - Prevents flash of unstyled content (FOUC)
6. **API Route** - Serves theme data to client
7. **Utility Functions** - Helper functions for theme management

## Key Features

### Dynamic Color System
- All colors are defined as RGB values in CSS variables
- Allows for alpha channel manipulation in Tailwind
- Smooth transitions between themes
- Support for gradients and special effects

### Theme Categories
1. **Light Themes**: Emerald, Celeste, Arctic, Sunset
2. **Dark Themes**: Emerald Night, Midnight, Storm, Monochrome
3. **Sepia/Vintage**: Sepia (classic book-like appearance)
4. **High Contrast**: HiCon (accessibility-focused)
5. **Accent Themes**: Coral Fushia, Rosey

### Required Color Properties
Each theme must define:
- `background` / `foreground` - Main colors
- `card` / `card-foreground` - Card component colors
- `primary` / `primary-foreground` - Primary action colors
- `secondary` / `secondary-foreground` - Secondary action colors
- `accent` / `accent-foreground` - Accent colors
- `muted` / `muted-foreground` - Muted/disabled states
- `border` - Border colors
- `selection` - Text selection color
- `link` / `link-hover` - Link colors
- `destructive` / `destructive-foreground` - Error/delete actions
- `success` / `success-foreground` - Success states
- `warning` / `warning-foreground` - Warning states

### Additional Theme Properties
- `progressGradient` - Gradient colors for progress bars
- `recentEditColor` - Highlight color for recent edits
- `recentEditOpacity` - Opacity for recent edit highlights

## File Structure

```
frontend/web/
├── themes.json                    # Theme definitions
├── app/
│   ├── globals.css               # CSS variable declarations
│   ├── theme-script.tsx          # FOUC prevention script
│   ├── layout.tsx                # Theme script injection
│   └── api/themes/route.ts       # Theme data API
├── components/
│   ├── ThemeToggle.tsx           # Compact theme switcher
│   └── ThemeSelector.tsx         # Full theme selector with preferences
├── hooks/
│   └── useTheme.ts               # Theme management hook
├── lib/
│   └── theme-utils.ts            # Utility functions
└── tailwind.config.js            # Tailwind configuration
```

## Implementation Guide

See individual documentation files for detailed implementation instructions:
- `01-themes-json.md` - Theme configuration structure
- `02-css-variables.md` - CSS variable system
- `03-tailwind-config.md` - Tailwind integration
- `04-theme-script.md` - FOUC prevention
- `05-react-components.md` - Component implementation
- `06-hooks.md` - React hooks usage
- `07-api-route.md` - API endpoint setup
- `08-implementation-steps.md` - Step-by-step implementation guide

## Quick Start

1. Copy all theme system files to your project
2. Add theme configuration to `themes.json`
3. Update `tailwind.config.js` with color mappings
4. Add CSS variables to `globals.css`
5. Inject `ThemeScript` in layout
6. Create API route for themes
7. Add theme selector component
8. Use `useTheme` hook for theme management

## Browser Support

- Modern browsers with CSS variable support
- Graceful degradation for older browsers
- Tested on Chrome, Firefox, Safari, Edge

## Performance Considerations

- Theme data cached in localStorage
- Minimal JavaScript execution
- CSS transitions for smooth changes
- No layout shifts during theme changes
- Optimized for Core Web Vitals