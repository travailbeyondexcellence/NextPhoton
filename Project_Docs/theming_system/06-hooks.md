# React Hooks for Theme Management

## Overview

The theme system provides custom React hooks for managing theme state and preferences throughout the application.

## useTheme Hook

The primary hook for theme management.

### Complete Implementation

```tsx
import { useState, useEffect, useCallback } from 'react';
import { getAllThemes } from '@/lib/theme-utils';

export type ThemeKey = 'emerald' | 'emnight' | 'celeste' | 'hicon' | 'arctic' | 'mono' | 
  'sunset' | 'sepia' | 'coral' | 'midnight' | 'rosegarden' | 'storm';

// Map theme keys to CSS class names
const themeToCssClass: Record<string, string> = {
  'emerald': 'emerald',
  'emnight': 'emerald-night',
  'celeste': 'celeste',
  'hicon': 'hicon',
  'arctic': 'arctic',
  'mono': 'monochrome',
  'sunset': 'sunset',
  'sepia': 'sepia',
  'coral': 'coral-fushia',
  'midnight': 'midnight',
  'rosegarden': 'rosey',
  'storm': 'storm'
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('emerald');
  const [isLoading, setIsLoading] = useState(true);

  const changeTheme = useCallback(async (newTheme: ThemeKey) => {
    try {
      // Fetch themes data
      const response = await fetch('/api/themes');
      const data = await response.json();
      
      const theme = data.themes?.[newTheme];
      
      if (!theme || !theme.colors) {
        console.error('Invalid theme:', newTheme);
        return;
      }

      const root = document.documentElement;
      
      // Add transition class for smooth change
      root.classList.add('theme-transition');

      // Apply new theme colors
      Object.entries(theme.colors).forEach(([key, value]) => {
        const hexValue = value as string;
        const rgbValue = hexValue.replace('#', '');
        const r = parseInt(rgbValue.substring(0, 2), 16);
        const g = parseInt(rgbValue.substring(2, 4), 16);
        const b = parseInt(rgbValue.substring(4, 6), 16);
        
        // Convert camelCase to kebab-case
        const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVarName, `${r} ${g} ${b}`);
      });

      // Set recent edit color and opacity
      if (theme.recentEditColor) {
        const opacity = Math.round(theme.recentEditOpacity * 255)
          .toString(16)
          .padStart(2, '0');
        root.style.setProperty(
          '--recent-edit-color', 
          `${theme.recentEditColor}${opacity}`
        );
      }

      // Set progress gradient colors
      if (theme.progressGradient) {
        root.style.setProperty('--progress-gradient-from', theme.progressGradient.from);
        root.style.setProperty('--progress-gradient-to', theme.progressGradient.to);
      }

      // Update theme class
      document.documentElement.className = 
        document.documentElement.className.replace(/theme-[\w-]+/g, '');
      const cssClassName = themeToCssClass[newTheme] || newTheme;
      document.documentElement.classList.add(`theme-${cssClassName}`);

      // Save to localStorage
      localStorage.setItem('zeneru-theme', newTheme);
      setCurrentTheme(newTheme);

      // Dispatch theme change event
      window.dispatchEvent(
        new CustomEvent('themechange', { detail: { theme: newTheme } })
      );

      // Remove transition class after animation
      setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 200);
    } catch (error) {
      console.error('Failed to change theme:', error);
    }
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('zeneru-theme') as ThemeKey;
    if (savedTheme && getAllThemes().some(t => t.key === savedTheme)) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme('emerald');
    }
    setIsLoading(false);
  }, []);

  return { currentTheme, changeTheme, isLoading };
}
```

### Hook Features

1. **State Management** - Tracks current theme and loading state
2. **Theme Persistence** - Saves to localStorage
3. **Smooth Transitions** - Adds transition class during change
4. **Error Handling** - Validates theme data
5. **Event Dispatching** - Notifies other components
6. **Type Safety** - Fully typed theme keys

### Usage Examples

```tsx
// Basic usage
function MyComponent() {
  const { currentTheme, changeTheme, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  return (
    <div>
      <p>Current theme: {currentTheme}</p>
      <button onClick={() => changeTheme('midnight')}>
        Switch to Midnight
      </button>
    </div>
  );
}

// With theme cycling
function ThemeCycler() {
  const { currentTheme, changeTheme } = useTheme();
  const themes = getAllThemes();

  const cycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.key === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex].key as ThemeKey);
  };

  return (
    <button onClick={cycleTheme}>
      Next Theme
    </button>
  );
}
```

## useThemeListener Hook

Listen to theme changes from other components or tabs.

```tsx
export function useThemeListener(callback: (theme: ThemeKey) => void) {
  useEffect(() => {
    // Listen to custom event
    const handleThemeChange = (event: CustomEvent) => {
      callback(event.detail.theme);
    };

    // Listen to storage changes (other tabs)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'zeneru-theme' && event.newValue) {
        callback(event.newValue as ThemeKey);
      }
    };

    window.addEventListener('themechange', handleThemeChange as any);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('themechange', handleThemeChange as any);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [callback]);
}

// Usage
function ThemeAwareComponent() {
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('emerald');

  useThemeListener((newTheme) => {
    setActiveTheme(newTheme);
    console.log('Theme changed to:', newTheme);
  });

  return <div>Active theme: {activeTheme}</div>;
}
```

## useThemeColors Hook

Access current theme colors directly.

```tsx
export function useThemeColors() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const { currentTheme } = useTheme();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch('/api/themes');
        const data = await response.json();
        const theme = data.themes?.[currentTheme];
        
        if (theme?.colors) {
          setColors(theme.colors);
        }
      } catch (error) {
        console.error('Failed to fetch theme colors:', error);
      }
    };

    fetchColors();
  }, [currentTheme]);

  return colors;
}

// Usage
function ColorDisplay() {
  const colors = useThemeColors();

  return (
    <div>
      <div style={{ backgroundColor: colors.primary }}>
        Primary Color
      </div>
      <div style={{ backgroundColor: colors.accent }}>
        Accent Color
      </div>
    </div>
  );
}
```

## usePreferredTheme Hook

Detect user's system theme preference.

```tsx
export function usePreferredTheme() {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersDark;
}

// Usage with auto theme
function AutoTheme() {
  const prefersDark = usePreferredTheme();
  const { changeTheme } = useTheme();

  useEffect(() => {
    // Apply theme based on system preference
    changeTheme(prefersDark ? 'midnight' : 'emerald');
  }, [prefersDark, changeTheme]);

  return null;
}
```

## useThemeTransition Hook

Manage theme transition animations.

```tsx
export function useThemeTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
    document.documentElement.classList.add('theme-transition');
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    document.documentElement.classList.remove('theme-transition');
  }, []);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(endTransition, 200);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, endTransition]);

  return { isTransitioning, startTransition, endTransition };
}

// Usage
function AnimatedThemeSwitch() {
  const { changeTheme } = useTheme();
  const { startTransition } = useThemeTransition();

  const handleThemeChange = async (theme: ThemeKey) => {
    startTransition();
    await changeTheme(theme);
  };

  return (
    <button onClick={() => handleThemeChange('midnight')}>
      Switch with Animation
    </button>
  );
}
```

## useThemeSync Hook

Synchronize theme across multiple tabs/windows.

```tsx
export function useThemeSync() {
  const { currentTheme, changeTheme } = useTheme();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zeneru-theme' && e.newValue) {
        const newTheme = e.newValue as ThemeKey;
        if (newTheme !== currentTheme) {
          changeTheme(newTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentTheme, changeTheme]);

  // Broadcast theme changes
  const broadcastTheme = useCallback((theme: ThemeKey) => {
    localStorage.setItem('zeneru-theme', theme);
    // Trigger storage event for same-tab sync
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'zeneru-theme',
        newValue: theme,
        url: window.location.href,
      })
    );
  }, []);

  return { broadcastTheme };
}
```

## Custom Hook Composition

Combine multiple hooks for complex functionality.

```tsx
export function useAdvancedTheme() {
  const theme = useTheme();
  const colors = useThemeColors();
  const prefersDark = usePreferredTheme();
  const { isTransitioning } = useThemeTransition();
  const { broadcastTheme } = useThemeSync();

  const changeThemeWithBroadcast = useCallback(async (newTheme: ThemeKey) => {
    await theme.changeTheme(newTheme);
    broadcastTheme(newTheme);
  }, [theme, broadcastTheme]);

  return {
    ...theme,
    colors,
    prefersDark,
    isTransitioning,
    changeTheme: changeThemeWithBroadcast,
  };
}
```

## Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads saved theme from localStorage', () => {
    localStorage.setItem('zeneru-theme', 'midnight');
    const { result } = renderHook(() => useTheme());
    expect(result.current.currentTheme).toBe('midnight');
  });

  it('changes theme', async () => {
    const { result } = renderHook(() => useTheme());
    
    await act(async () => {
      await result.current.changeTheme('celeste');
    });

    expect(result.current.currentTheme).toBe('celeste');
    expect(localStorage.getItem('zeneru-theme')).toBe('celeste');
  });
});
```

## Performance Optimization

```tsx
// Memoize theme data
export function useThemeMemo() {
  const { currentTheme } = useTheme();
  
  const themeData = useMemo(() => {
    return getAllThemes().find(t => t.key === currentTheme);
  }, [currentTheme]);

  return themeData;
}

// Debounce theme changes
export function useDebouncedTheme(delay = 300) {
  const { changeTheme } = useTheme();
  
  const debouncedChange = useMemo(
    () => debounce(changeTheme, delay),
    [changeTheme, delay]
  );

  return { changeTheme: debouncedChange };
}
```

## Best Practices

1. **Always handle loading states** - Show feedback during theme loads
2. **Validate theme keys** - Ensure theme exists before applying
3. **Use TypeScript** - Type-safe theme keys prevent errors
4. **Cache theme data** - Avoid repeated API calls
5. **Handle errors gracefully** - Fallback to default theme
6. **Test edge cases** - Invalid themes, network failures
7. **Optimize re-renders** - Use useCallback and useMemo
8. **Document hook behavior** - Clear API documentation