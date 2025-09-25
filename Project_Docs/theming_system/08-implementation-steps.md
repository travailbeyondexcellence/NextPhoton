# Step-by-Step Implementation Guide

## Overview

This guide provides a complete walkthrough for implementing the ZenEru theming system in your project from scratch.

## Prerequisites

- Next.js 14+ project
- Tailwind CSS installed
- TypeScript configured (recommended)

## Step 1: Create Theme Configuration

### 1.1 Create themes.json

Create `themes.json` in your project root:

```json
{
  "colorDefinitions": {
    "_comment": "Each theme needs these color values defined",
    "required": [
      "background", "foreground", "card", "cardForeground",
      "primary", "primaryForeground", "secondary", "secondaryForeground",
      "accent", "accentForeground", "muted", "mutedForeground",
      "border", "selection", "link", "linkHover",
      "destructive", "destructiveForeground",
      "success", "successForeground",
      "warning", "warningForeground"
    ]
  },
  "themes": {
    "emerald": {
      "name": "🌿 Emerald",
      "description": "Fresh green theme",
      "order": 1,
      "colors": {
        "background": "#eafff2",
        "foreground": "#09090b",
        // ... add all required colors
      }
    }
    // ... add more themes
  }
}
```

## Step 2: Configure Tailwind CSS

### 2.1 Update tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        // ... add all color mappings
      },
    },
  },
  plugins: [],
}
```

## Step 3: Set Up CSS Variables

### 3.1 Update globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Default theme colors (Emerald) */
    --background: 234 255 242;
    --foreground: 9 9 11;
    --card: 230 255 232;
    --card-foreground: 24 24 27;
    --primary: 5 150 105;
    --primary-foreground: 255 255 255;
    /* ... add all variables */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
  
  ::selection {
    background-color: rgb(var(--selection) / 0.5);
    color: rgb(var(--foreground));
  }
}

/* Theme transition effect */
.theme-transition * {
  @apply transition-colors duration-200 ease-in-out;
}
```

## Step 4: Create Theme Script

### 4.1 Create app/theme-script.tsx

```tsx
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const savedTheme = localStorage.getItem('app-theme') || 'emerald';
            const themeToCssClass = {
              'emerald': 'emerald',
              // ... add theme mappings
            };
            
            const cssClassName = themeToCssClass[savedTheme] || savedTheme;
            document.documentElement.classList.add('theme-' + cssClassName);
            
            // Load and apply theme colors
            fetch('/api/themes')
              .then(res => res.json())
              .then(data => {
                const theme = data.themes?.[savedTheme];
                if (theme && theme.colors) {
                  const root = document.documentElement;
                  Object.entries(theme.colors).forEach(([key, value]) => {
                    const hexValue = value.replace('#', '');
                    const r = parseInt(hexValue.substring(0, 2), 16);
                    const g = parseInt(hexValue.substring(2, 4), 16);
                    const b = parseInt(hexValue.substring(4, 6), 16);
                    const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    root.style.setProperty(cssVarName, r + ' ' + g + ' ' + b);
                  });
                }
              })
              .catch(() => {
                console.error('Failed to load theme data');
              });
          } catch (e) {
            console.error('Theme initialization error:', e);
          }
        `,
      }}
    />
  );
}
```

## Step 5: Update Layout

### 5.1 Modify app/layout.tsx

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeScript from './theme-script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

## Step 6: Create API Route

### 6.1 Create app/api/themes/route.ts

```typescript
import { NextResponse } from 'next/server';
import themes from '@/themes.json';

export async function GET() {
  return NextResponse.json(themes);
}
```

## Step 7: Create Utility Functions

### 7.1 Create lib/theme-utils.ts

```typescript
import themes from '@/themes.json';

export interface Theme {
  key: string;
  name: string;
  description: string;
  backgroundColor: string;
  primaryColor: string;
}

export function getAllThemes(): Theme[] {
  const themesData = (themes as any).themes || {};
  return Object.entries(themesData)
    .sort((a: any, b: any) => (a[1].order || 0) - (b[1].order || 0))
    .map(([key, theme]: [string, any]) => ({
      key,
      name: theme.name,
      description: theme.description,
      backgroundColor: theme.colors.background,
      primaryColor: theme.colors.primary,
    }));
}
```

## Step 8: Create Theme Hook

### 8.1 Create hooks/useTheme.ts

```typescript
import { useState, useEffect, useCallback } from 'react';
import { getAllThemes } from '@/lib/theme-utils';

export type ThemeKey = 'emerald' | 'midnight'; // Add all theme keys

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('emerald');
  const [isLoading, setIsLoading] = useState(true);

  const changeTheme = useCallback(async (newTheme: ThemeKey) => {
    try {
      const response = await fetch('/api/themes');
      const data = await response.json();
      const theme = data.themes?.[newTheme];
      
      if (!theme || !theme.colors) {
        console.error('Invalid theme:', newTheme);
        return;
      }

      const root = document.documentElement;
      root.classList.add('theme-transition');

      // Apply theme colors
      Object.entries(theme.colors).forEach(([key, value]) => {
        const hexValue = value as string;
        const rgbValue = hexValue.replace('#', '');
        const r = parseInt(rgbValue.substring(0, 2), 16);
        const g = parseInt(rgbValue.substring(2, 4), 16);
        const b = parseInt(rgbValue.substring(4, 6), 16);
        const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVarName, `${r} ${g} ${b}`);
      });

      // Save to localStorage
      localStorage.setItem('app-theme', newTheme);
      setCurrentTheme(newTheme);

      setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 200);
    } catch (error) {
      console.error('Failed to change theme:', error);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeKey;
    if (savedTheme && getAllThemes().some(t => t.key === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
    setIsLoading(false);
  }, []);

  return { currentTheme, changeTheme, isLoading };
}
```

## Step 9: Create Theme Toggle Component

### 9.1 Create components/ThemeToggle.tsx

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { getAllThemes } from '@/lib/theme-utils';

export default function ThemeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentTheme, changeTheme, isLoading } = useTheme();
  const themes = getAllThemes();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (isLoading) {
    return <div className="p-2">Loading...</div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        🎨 Theme
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-card border border-border z-50 p-2">
          {themes.map((theme) => (
            <button
              key={theme.key}
              onClick={() => {
                changeTheme(theme.key as any);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-muted ${
                currentTheme === theme.key ? 'bg-primary/10' : ''
              }`}
            >
              <div className="font-medium">{theme.name}</div>
              <div className="text-sm text-muted-foreground">{theme.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Step 10: Use Theme Toggle

### 10.1 Add to your navigation

```tsx
import ThemeToggle from '@/components/ThemeToggle';

export default function Navigation() {
  return (
    <nav className="flex justify-between items-center p-4">
      <div>Logo</div>
      <ThemeToggle />
    </nav>
  );
}
```

## Step 11: Test Your Implementation

### 11.1 Testing Checklist

- [ ] Page loads without flash of unstyled content
- [ ] Theme persists on page refresh
- [ ] All colors update when changing themes
- [ ] Smooth transitions between themes
- [ ] Works in different browsers
- [ ] Mobile responsive
- [ ] Keyboard accessible

### 11.2 Debug Commands

```javascript
// In browser console
localStorage.getItem('app-theme'); // Check saved theme
document.documentElement.style.getPropertyValue('--primary'); // Check CSS variable
document.documentElement.classList; // Check theme class
```

## Step 12: Add More Themes

### 12.1 Adding a New Theme

1. Add theme to `themes.json`:
```json
"midnight": {
  "name": "🌙 Midnight",
  "description": "Dark theme for night reading",
  "order": 2,
  "colors": {
    "background": "#020617",
    "foreground": "#f1f5f9",
    // ... all colors
  }
}
```

2. Add to TypeScript types:
```typescript
export type ThemeKey = 'emerald' | 'midnight' | 'your-new-theme';
```

3. Add to theme class mapping:
```javascript
const themeToCssClass = {
  'emerald': 'emerald',
  'midnight': 'midnight',
  'your-new-theme': 'your-new-theme',
};
```

## Common Issues and Solutions

### Issue: Flash of Unstyled Content
**Solution:** Ensure ThemeScript is in `<head>` and runs synchronously.

### Issue: Theme doesn't persist
**Solution:** Check localStorage key consistency across all files.

### Issue: Colors not updating
**Solution:** Verify hex to RGB conversion and CSS variable names.

### Issue: TypeScript errors
**Solution:** Ensure all theme keys are in the ThemeKey type.

### Issue: Hydration mismatch
**Solution:** Add `suppressHydrationWarning` to `<html>` element.

## Performance Tips

1. **Minimize theme data size** - Only include necessary properties
2. **Cache theme data** - Use appropriate cache headers
3. **Lazy load theme selector** - Use dynamic imports for large components
4. **Optimize animations** - Use CSS transitions, not JavaScript
5. **Batch DOM updates** - Update all CSS variables at once

## Production Checklist

- [ ] All themes tested
- [ ] Accessibility verified
- [ ] Performance optimized
- [ ] Error handling in place
- [ ] Fallback theme configured
- [ ] Cache headers set
- [ ] Security headers configured
- [ ] Monitoring in place
- [ ] Documentation updated
- [ ] Tests written

## Next Steps

1. **Customize themes** - Adjust colors to match your brand
2. **Add theme preview** - Show theme colors before selection
3. **Implement auto-theme** - Switch based on system preference
4. **Add theme creator** - Let users create custom themes
5. **Export/import themes** - Share themes between users