# React Components for Theme System

## Overview

The theme system includes several React components that provide user interface for theme selection and management.

## Component Structure

```
components/
├── ThemeToggle.tsx       # Compact dropdown theme switcher
├── ThemeSelector.tsx     # Full theme selector with reading preferences
└── Icons.tsx            # Icon components (PaletteIcon)
```

## ThemeToggle Component

A compact theme switcher with dropdown menu.

### Complete Implementation

```tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { PaletteIcon } from './Icons';
import { useTheme } from '@/hooks/useTheme';
import { getAllThemes } from '@/lib/theme-utils';

export default function ThemeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentTheme, changeTheme, isLoading } = useTheme();
  const themes = getAllThemes();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleThemeChange = (themeKey: string) => {
    changeTheme(themeKey as any);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <PaletteIcon className="w-5 h-5 text-muted-foreground animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        <PaletteIcon className="w-5 h-5 text-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-card border border-border z-50 p-1">
          <div className="grid grid-cols-2 gap-1 max-h-80 overflow-y-auto">
            {themes.map((theme) => (
              <button
                key={theme.key}
                onClick={() => handleThemeChange(theme.key)}
                className={`relative flex h-16 rounded-md border transition-all overflow-hidden group ${
                  currentTheme === theme.key
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground/50 hover:bg-muted hover:text-muted-foreground'
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 w-[20%] border-r border-border"
                  style={{
                    background: `linear-gradient(135deg, ${theme.backgroundColor} 50%, ${theme.primaryColor} 50%)`
                  }}
                />
                <div className="flex-1 px-1 py-1 pl-[calc(20%+9px)] text-left flex flex-col justify-center">
                  <div className="text-[13px] font-medium leading-tight transition-colors">
                    {theme.name}
                  </div>
                  <div className={`text-[9px] leading-tight mt-0.5 transition-colors ${
                    currentTheme === theme.key 
                      ? "text-muted-foreground" 
                      : "text-muted-foreground group-hover:text-foreground/70"
                  }`}>
                    {theme.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Key Features

1. **Dropdown Interface** - Click to open, click outside to close
2. **Visual Preview** - Color gradient showing theme colors
3. **Grid Layout** - 2-column responsive grid
4. **Active State** - Highlights current theme
5. **Hover Effects** - Interactive feedback
6. **Loading State** - Pulse animation while loading
7. **Accessibility** - ARIA labels and keyboard navigation

### Usage

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// In navigation or header
<nav>
  <ThemeToggle />
</nav>
```

## ThemeSelector Component

Advanced theme selector with reading preferences and animations.

### Complete Implementation

```tsx
'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { getAllThemes } from '@/lib/theme-utils';
import { PaletteIcon } from './Icons';
import clsx from 'clsx';
import { useReadingPreferencesContext } from '@/contexts/ReadingPreferencesContext';
import type { FontSize, ContentWidth } from '@/hooks/useReadingPreferences';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme } = useTheme();
  const { fontSize, contentWidth, setFontSize, setContentWidth } = useReadingPreferencesContext();
  const themes = getAllThemes();

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Change theme"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PaletteIcon className="w-5 h-5 text-foreground" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            
            {/* Dropdown */}
            <motion.div 
              className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 p-4"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Theme Grid */}
              <h3 className="text-sm font-medium mb-3">Choose Theme</h3>
              <motion.div className="grid grid-cols-2 gap-2">
                {themes.map((theme, index) => (
                  <motion.button
                    key={theme.key}
                    onClick={() => {
                      changeTheme(theme.key as any);
                      setIsOpen(false);
                    }}
                    className={clsx(
                      'relative flex h-16 rounded-md border transition-all overflow-hidden group',
                      currentTheme === theme.key
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground/50 hover:bg-muted',
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Color Preview */}
                    <div
                      className="absolute inset-y-0 left-0 w-[20%] border-r border-border"
                      style={{
                        background: `linear-gradient(135deg, ${theme.backgroundColor} 50%, ${theme.primaryColor} 50%)`
                      }}
                    />
                    {/* Theme Info */}
                    <div className="flex-1 px-1 py-1 pl-[calc(20%+9px)] text-left flex flex-col justify-center">
                      <div className="text-[13px] font-medium leading-tight">
                        {theme.name}
                      </div>
                      <div className="text-[9px] leading-tight mt-0.5 text-muted-foreground">
                        {theme.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
              
              {/* Reading Preferences */}
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2">Reading Preferences</h4>
                <div className="space-y-2">
                  {/* Font Size */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Font Size</span>
                    <div className="flex gap-1">
                      {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
                        <motion.button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={clsx(
                            "px-2 py-1 text-xs rounded border transition-all",
                            fontSize === size 
                              ? "border-primary bg-primary/10" 
                              : "border-border hover:bg-muted"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size.toUpperCase()}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Content Width */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Width</span>
                    <div className="flex gap-1">
                      {(['narrow', 'normal', 'wide'] as ContentWidth[]).map((width) => (
                        <motion.button
                          key={width}
                          onClick={() => setContentWidth(width)}
                          className={clsx(
                            "px-2 py-1 text-xs rounded border transition-all capitalize",
                            contentWidth === width 
                              ? "border-primary bg-primary/10" 
                              : "border-border hover:bg-muted"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {width}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Additional Features

1. **Framer Motion Animations** - Smooth enter/exit animations
2. **Reading Preferences** - Font size and content width controls
3. **Staggered Animation** - Themes appear sequentially
4. **Backdrop** - Click outside to close
5. **Micro-interactions** - Scale effects on hover/tap

## PaletteIcon Component

Simple icon component for theme buttons.

```tsx
export function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}
```

## Component Variants

### Inline Theme Switcher

```tsx
export function InlineThemeSwitcher() {
  const { currentTheme, changeTheme } = useTheme();
  const themes = getAllThemes();

  return (
    <select
      value={currentTheme}
      onChange={(e) => changeTheme(e.target.value as any)}
      className="bg-card text-foreground border border-border rounded px-2 py-1"
    >
      {themes.map((theme) => (
        <option key={theme.key} value={theme.key}>
          {theme.name}
        </option>
      ))}
    </select>
  );
}
```

### Theme Preview Cards

```tsx
export function ThemePreviewCards() {
  const themes = getAllThemes();
  const { changeTheme, currentTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-4">
      {themes.map((theme) => (
        <button
          key={theme.key}
          onClick={() => changeTheme(theme.key as any)}
          className={clsx(
            "p-4 rounded-lg border-2 transition-all",
            currentTheme === theme.key
              ? "border-primary"
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="h-20 rounded mb-2" 
               style={{ background: theme.backgroundColor }}>
            <div className="h-full w-1/2 rounded-l" 
                 style={{ background: theme.primaryColor }} />
          </div>
          <h3 className="font-medium">{theme.name}</h3>
          <p className="text-sm text-muted-foreground">
            {theme.description}
          </p>
        </button>
      ))}
    </div>
  );
}
```

## Accessibility

### Keyboard Navigation

```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  role="button"
  tabIndex={0}
  aria-label="Select theme"
  aria-pressed={isSelected}
>
```

### Screen Reader Support

```tsx
<div role="group" aria-label="Theme selection">
  <h2 id="theme-heading">Choose a theme</h2>
  <div role="radiogroup" aria-labelledby="theme-heading">
    {themes.map((theme) => (
      <button
        key={theme.key}
        role="radio"
        aria-checked={currentTheme === theme.key}
        aria-label={`${theme.name}: ${theme.description}`}
      >
        {theme.name}
      </button>
    ))}
  </div>
</div>
```

## Testing Components

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('opens dropdown on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Choose Theme')).toBeInTheDocument();
  });

  it('changes theme on selection', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const midnightTheme = screen.getByText('Midnight');
    fireEvent.click(midnightTheme);
    expect(localStorage.getItem('zeneru-theme')).toBe('midnight');
  });
});
```

## Best Practices

1. **Use semantic HTML** - Proper ARIA labels and roles
2. **Handle loading states** - Show feedback during theme changes
3. **Prevent layout shift** - Fixed dimensions for dropdowns
4. **Optimize re-renders** - Use React.memo for theme items
5. **Test all interactions** - Click, keyboard, touch
6. **Provide visual feedback** - Hover, active, selected states
7. **Consider mobile** - Touch-friendly tap targets
8. **Cache theme data** - Avoid repeated fetches