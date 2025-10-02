# CSS Variables System

## Overview

The CSS variable system is the foundation of the NextPhoton theming mechanism, providing dynamic color values that can be changed at runtime for both modern and glass theme systems.

## CSS Variable Structure

All theme colors are defined as RGB triplets in CSS custom properties (variables) on the `:root` element, with additional variables for glass morphism effects.

## globals.css Configuration

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Default theme colors - RGB format */
    --background: 234 255 242;
    --foreground: 9 9 11;
    --card: 230 255 232;
    --card-foreground: 24 24 27;
    --primary: 5 150 105;
    --primary-foreground: 255 255 255;
    --secondary: 16 185 129;
    --secondary-foreground: 255 255 255;
    --accent: 52 211 153;
    --accent-foreground: 2 44 34;
    --muted: 212 255 216;
    --muted-foreground: 107 114 128;
    --border: 195 255 200;
    --selection: 167 243 208;
    --link: 5 150 105;
    --link-hover: 4 120 87;
    --destructive: 220 38 38;
    --destructive-foreground: 255 255 255;
    --success: 5 150 105;
    --success-foreground: 255 255 255;
    --warning: 217 119 6;
    --warning-foreground: 255 255 255;
    
    /* Glass theme specific variables */
    --glass-opacity: 0.1;
    --glass-border-opacity: 0.2;
    --glass-blur: 12;
    --glass-hover-opacity: 0.15;
    --glass-active-opacity: 0.2;
    
    /* Gradient variables for glass themes */
    --gradient-from: 17 24 39;
    --gradient-via: 30 58 138;
    --gradient-to: 91 33 182;
    
    /* Sidebar variables */
    --sidebar-gradient-from: 45 55 72;
    --sidebar-gradient-via: 45 55 72;
    --sidebar-gradient-to: 26 32 44;
    --sidebar-gradient-opacity: 1;
    --sidebar-text-color: var(--foreground);
    
    /* Dashboard header variables */
    --dashboard-header-gradient-from: 45 55 72;
    --dashboard-header-gradient-via: 45 55 72;
    --dashboard-header-gradient-to: 26 32 44;
    --dashboard-header-gradient-opacity: 0.75;
    --dashboard-header-text-color: var(--foreground);
  }
}
```

## Theme-Specific Styling

### Modern Themes
Modern themes use solid colors without transparency effects:

```css
/* Modern theme component styling */
[data-theme-type="modern"] .component {
  background: rgb(var(--card));
  color: rgb(var(--card-foreground));
  border: 1px solid rgb(var(--border));
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Modern theme sidebar */
[data-theme-type="modern"] .sidebar-theme-gradient {
  background: rgb(var(--card)) !important;
  color: rgb(var(--foreground)) !important;
}
```

### Glass Themes
Glass themes apply morphism effects using CSS variables:

```css
/* Glass theme component styling */
[data-theme-type="glass"] .glass {
  background: rgb(var(--card) / var(--glass-opacity));
  backdrop-filter: blur(calc(var(--glass-blur) * 1px));
  -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 1px));
  border: 1px solid rgb(var(--border) / var(--glass-border-opacity));
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Glass theme sidebar with gradient */
[data-theme-type="glass"] .sidebar-theme-gradient {
  background: linear-gradient(135deg, 
    rgb(var(--sidebar-gradient-from) / var(--sidebar-gradient-opacity)) 0%, 
    rgb(var(--sidebar-gradient-via) / var(--sidebar-gradient-opacity)) 50%, 
    rgb(var(--sidebar-gradient-to) / var(--sidebar-gradient-opacity)) 100%) !important;
  color: var(--sidebar-text-color) !important;
}
```

## RGB Format Explanation

Colors are stored as space-separated RGB values (e.g., `234 255 242`) instead of hex or full rgb() format. This enables:

1. **Alpha channel support in Tailwind**:
   ```jsx
   <div className="bg-primary/50">50% opacity primary color</div>
   ```

2. **Dynamic opacity values**:
   ```css
   background-color: rgb(var(--primary) / 0.5);
   ```

## Variable Naming Convention

- All variables use kebab-case
- Prefixed with double dash (`--`)
- Semantic naming for clarity
- Foreground suffix for text colors on that background
- Glass-specific variables prefixed with `--glass-`
- Gradient variables use `-from`, `-via`, `-to` suffixes

## Core CSS Utilities

```css
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Glass theme gradient background */
  [data-theme-type="glass"] body::before {
    content: "";
    position: fixed;
    inset: 0;
    background: linear-gradient(to bottom right,
      rgb(var(--gradient-from)),
      rgb(var(--gradient-via)),
      rgb(var(--gradient-to)));
    opacity: var(--background-gradient-opacity, 0.75);
    z-index: -1;
  }
  
  /* Text selection styling */
  ::selection {
    background-color: rgb(var(--selection) / 0.5);
    color: rgb(var(--foreground));
  }
}
```

## Theme-Aware Component Classes

### Glass Effect Classes
```css
/* Base glass effect */
.glass {
  /* Modern theme fallback */
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
}

[data-theme-type="glass"] .glass {
  background: rgb(var(--card) / var(--glass-opacity));
  backdrop-filter: blur(calc(var(--glass-blur) * 1px));
  border: 1px solid rgb(var(--border) / var(--glass-border-opacity));
}

/* Glass button with theme awareness */
.glass-button {
  /* Modern theme style */
  background: transparent;
  color: rgb(var(--foreground));
  border: 1px solid rgb(var(--border));
}

[data-theme-type="glass"] .glass-button {
  background: rgb(var(--primary) / 0.1);
  color: rgb(var(--primary));
  backdrop-filter: blur(calc(var(--glass-blur) * 1px));
}
```

### Hover States
```css
/* Modern theme hover */
[data-theme-type="modern"] .hover\:bg-sidebar-accent:hover {
  background-color: rgb(var(--accent)) !important;
  color: rgb(var(--accent-foreground)) !important;
}

/* Glass theme hover with transparency */
[data-theme-type="glass"] .hover\:bg-sidebar-accent:hover {
  background-color: rgb(var(--accent) / 0.2) !important;
  color: var(--sidebar-text-color) !important;
}
```

## Theme Transition Effects

Smooth transitions when switching themes:

```css
/* Applied temporarily during theme change */
.theme-transition * {
  transition: color 200ms ease-in-out, 
              background-color 200ms ease-in-out, 
              border-color 200ms ease-in-out;
}

/* Prevent layout shifts during transitions */
.theme-transition {
  overflow: hidden;
}
```

## Dynamic Theme Application

Variables are set dynamically via JavaScript:

```javascript
// From theme-utils.ts
root.style.setProperty('--primary', hexToRgb('#059669'));
root.style.setProperty('--glass-blur', theme.glass.blurIntensity.toString());
root.style.setProperty('--sidebar-text-color', hexToRgb(theme.sidebar.textColor));
```

## Performance Considerations

1. **CSS Variables are performant** - No re-parsing of stylesheets
2. **Backdrop filters can be expensive** - Limit usage on low-end devices
3. **Transitions are GPU accelerated** - Use transform and opacity when possible
4. **Reduce repaints** - Batch CSS variable updates

## Browser Compatibility

- CSS Variables: All modern browsers
- Backdrop-filter: Chrome 76+, Safari 9+, Firefox 103+
- For older browsers, glass effects gracefully degrade to solid colors

## Best Practices

1. **Always provide fallbacks** for glass effects
2. **Use semantic variable names** for maintainability
3. **Test color contrast** in both theme systems
4. **Minimize specificity** in theme-aware selectors
5. **Document custom properties** in code comments