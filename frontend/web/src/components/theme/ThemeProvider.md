# ThemeProvider Component

## Overview
Wrapper component providing theme context to entire application using next-themes.

## Location
`/components/theme/ThemeProvider.tsx`

## Purpose
Enable theme switching (dark/light/system) across the application.

## Key Features
- Wraps app with NextThemesProvider
- Default: system theme
- Enables system preference detection
- Uses class attribute for theme switching

## Interactions with Sister Components

### ThemeSelector (Consumer)
**Relationship**: Provider → Consumer
- ThemeProvider enables theme context
- ThemeSelector uses context to get/set themes

### ThemeToggle (Consumer)
**Relationship**: Provider → Consumer
- ThemeToggle uses context for quick dark/light toggle

## Props
```typescript
children: ReactNode
...props: Passed to NextThemesProvider
```

## Configuration
- attribute: "class" (adds class to html element)
- defaultTheme: "system"
- enableSystem: true

## Usage Context
Wrapped at root layout level, provides context to all children.

## Dependencies
- next-themes: ThemeProvider
