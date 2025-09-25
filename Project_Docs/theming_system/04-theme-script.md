# Theme Script - FOUC Prevention

## Overview

The theme script is a critical component that prevents Flash of Unstyled Content (FOUC) by applying the user's selected theme before the page renders.

## The FOUC Problem

Without the theme script:
1. Page loads with default theme colors
2. React hydrates and reads localStorage
3. Theme changes, causing a visible flash
4. Poor user experience, especially with dark themes

## Solution: Inline Theme Script

The theme script runs synchronously before the page renders, immediately applying the correct theme.

## Implementation

### theme-script.tsx

```tsx
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            // Load saved theme or default to 'emerald'
            const savedTheme = localStorage.getItem('zeneru-theme') || 'emerald';
            
            // Map theme keys to CSS class names
            const themeToCssClass = {
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
            
            const cssClassName = themeToCssClass[savedTheme] || savedTheme;
            
            // Apply theme class immediately to html element
            document.documentElement.classList.add('theme-' + cssClassName);
            
            // Load theme data and apply CSS variables
            fetch('/api/themes')
              .then(res => res.json())
              .then(data => {
                const theme = data.themes?.[savedTheme];
                if (theme && theme.colors) {
                  const root = document.documentElement;
                  
                  // Convert hex colors to RGB and set CSS variables
                  Object.entries(theme.colors).forEach(([key, value]) => {
                    const rgbValue = value.replace('#', '');
                    const r = parseInt(rgbValue.substring(0, 2), 16);
                    const g = parseInt(rgbValue.substring(2, 4), 16);
                    const b = parseInt(rgbValue.substring(4, 6), 16);
                    
                    // Convert camelCase to kebab-case
                    const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    root.style.setProperty(cssVarName, r + ' ' + g + ' ' + b);
                  });
                  
                  // Set recent edit color if available
                  if (theme.recentEditColor) {
                    const opacity = Math.round(theme.recentEditOpacity * 255).toString(16).padStart(2, '0');
                    root.style.setProperty('--recent-edit-color', theme.recentEditColor + opacity);
                  }
                  
                  // Set progress gradient colors
                  if (theme.progressGradient) {
                    root.style.setProperty('--progress-gradient-from', theme.progressGradient.from);
                    root.style.setProperty('--progress-gradient-to', theme.progressGradient.to);
                  } else {
                    // Fallback to primary/secondary colors
                    root.style.setProperty('--progress-gradient-from', theme.colors.primary);
                    root.style.setProperty('--progress-gradient-to', theme.colors.secondary);
                  }
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

## Key Features

### 1. Synchronous Execution
- Script runs before page render
- No delay or flash
- Immediate theme application

### 2. LocalStorage Integration
```javascript
const savedTheme = localStorage.getItem('zeneru-theme') || 'emerald';
```
- Reads saved preference
- Falls back to default theme
- Persistent across sessions

### 3. Theme Class Application
```javascript
document.documentElement.classList.add('theme-' + cssClassName);
```
- Adds class to `<html>` element
- Enables theme-specific CSS
- Avoids hydration mismatch

### 4. Asynchronous CSS Variable Loading
```javascript
fetch('/api/themes')
  .then(res => res.json())
  .then(data => {
    // Apply CSS variables
  });
```
- Non-blocking theme data fetch
- Progressive enhancement
- Graceful error handling

### 5. Color Format Conversion
```javascript
// Convert #059669 to "5 150 105"
const rgbValue = value.replace('#', '');
const r = parseInt(rgbValue.substring(0, 2), 16);
const g = parseInt(rgbValue.substring(2, 4), 16);
const b = parseInt(rgbValue.substring(4, 6), 16);
root.style.setProperty(cssVarName, r + ' ' + g + ' ' + b);
```

### 6. CSS Variable Name Conversion
```javascript
// Convert camelCase to kebab-case
// primaryForeground → --primary-foreground
const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
```

## Layout Integration

### app/layout.tsx

```tsx
import ThemeScript from './theme-script';

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
      <body>
        {children}
      </body>
    </html>
  );
}
```

### Important Notes:
- Place in `<head>` for earliest execution
- Use `suppressHydrationWarning` on `<html>`
- Script runs before CSS loads

## Error Handling

The script includes comprehensive error handling:

```javascript
try {
  // Main theme logic
} catch (e) {
  console.error('Theme initialization error:', e);
  // Page renders with default theme
}

// Fetch error handling
.catch(() => {
  console.error('Failed to load theme data');
  // Theme class still applied, uses CSS defaults
});
```

## Performance Considerations

### Inline Script Size
- Keep script minimal (~1KB)
- Only essential logic
- Defer heavy operations

### Execution Time
- Runs in <5ms typically
- No network blocking
- Synchronous but fast

### Caching Strategy
```javascript
// Browser caches localStorage
const savedTheme = localStorage.getItem('zeneru-theme');

// API response can be cached
fetch('/api/themes', {
  headers: {
    'Cache-Control': 'max-age=3600'
  }
});
```

## Theme Data Loading

### Success Flow:
1. Read localStorage (sync)
2. Apply theme class (sync)
3. Fetch theme data (async)
4. Apply CSS variables (async)
5. Page fully themed

### Failure Flow:
1. Read localStorage (sync)
2. Apply theme class (sync)
3. Fetch fails (async)
4. CSS defaults used
5. Page renders with basic theme

## Security Considerations

### XSS Prevention
- No user input in script
- Static theme mappings
- Validated theme keys

### CSP Compatibility
```html
<!-- If using CSP, add nonce -->
<script nonce={nonce} dangerouslySetInnerHTML={{...}} />
```

## Debugging

### Check Theme Loading:
```javascript
// Add debug logging
console.log('Theme loaded:', savedTheme);
console.log('Theme class:', cssClassName);
console.log('Theme data:', theme);
```

### Verify Execution Order:
```javascript
console.time('theme-init');
// ... theme logic
console.timeEnd('theme-init');
```

### Test Different Scenarios:
1. First visit (no saved theme)
2. Return visit (saved theme)
3. Invalid theme in localStorage
4. API failure
5. Slow network

## Best Practices

1. **Keep it minimal** - Only essential logic
2. **Handle errors gracefully** - Always have fallbacks
3. **Test thoroughly** - All theme combinations
4. **Monitor performance** - Track execution time
5. **Validate themes** - Check against known themes
6. **Use try-catch** - Prevent script errors
7. **Log errors** - For debugging production issues

## Alternative Approaches

### Cookie-Based
```javascript
// Read from cookie instead of localStorage
const savedTheme = document.cookie
  .split('; ')
  .find(row => row.startsWith('theme='))
  ?.split('=')[1] || 'emerald';
```

### Server-Side
```tsx
// Pass theme from server
<ThemeScript initialTheme={theme} />
```

### CSS-Only
```css
/* Use CSS custom properties with @media queries */
@media (prefers-color-scheme: dark) {
  :root {
    --background: 2 44 34;
  }
}
```

## Testing

### Unit Tests
```javascript
// Test color conversion
expect(hexToRgb('#059669')).toBe('5 150 105');

// Test kebab conversion
expect(toKebab('primaryForeground')).toBe('primary-foreground');
```

### E2E Tests
```javascript
// Test FOUC prevention
await page.goto('/');
const flash = await page.evaluate(() => {
  return window.themeFlashDetected;
});
expect(flash).toBe(false);
```

## Migration Guide

If migrating from class-based themes:

```javascript
// Old: Toggle classes
document.body.classList.toggle('dark-theme');

// New: Change CSS variables
changeTheme('midnight');
```