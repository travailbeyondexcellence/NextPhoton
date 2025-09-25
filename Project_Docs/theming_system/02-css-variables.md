# CSS Variables System

## Overview

The CSS variable system is the foundation of the theming mechanism, providing dynamic color values that can be changed at runtime without page reload.

## CSS Variable Structure

All theme colors are defined as RGB triplets in CSS custom properties (variables) on the `:root` element.

## globals.css Configuration

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Default theme (Emerald) colors - RGB format */
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
  }
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
  
  /* Text selection styling */
  ::selection {
    background-color: rgb(var(--selection) / 0.5);
    color: rgb(var(--foreground));
  }
}
```

## Theme Transition Effects

Smooth transitions when switching themes:

```css
/* Applied temporarily during theme change */
.theme-transition * {
  @apply transition-colors duration-200 ease-in-out;
}
```

## Special Theme Variables

Additional CSS variables for theme-specific features:

```css
/* Progress gradient colors */
--progress-gradient-from: #10b981;
--progress-gradient-to: #059669;

/* Recent edit highlight */
--recent-edit-color: #fef08a4d; /* Includes alpha */
```

## Scrollbar Theming

Custom scrollbar colors that adapt to theme:

```css
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--border)) transparent;
}

*:hover {
  scrollbar-color: rgb(var(--muted)) transparent;
}

/* Webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(var(--border));
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(var(--muted));
}
```

## Typography Theming

Prose content adapts to theme colors:

```css
@layer utilities {
  .prose-reading :where(p) {
    @apply text-justify leading-relaxed;
  }
  
  .prose-reading :where(a) {
    @apply text-link no-underline hover:text-link-hover hover:underline;
  }
  
  .prose-reading :where(pre) {
    @apply bg-muted text-card-foreground;
  }
  
  .prose-reading :where(code):not(:where(pre code)) {
    @apply bg-muted text-foreground px-1 py-0.5 rounded;
  }
  
  .prose-reading :where(strong) {
    @apply text-foreground font-semibold;
  }
  
  .prose-reading :where(hr) {
    @apply border-border;
  }
  
  .prose-reading :where(blockquote) {
    @apply font-serif text-muted-foreground;
  }
}
```

## Form Input Theming

Prevent autofill from breaking theme:

```css
/* Webkit autofill override */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px rgb(var(--card)) inset !important;
  -webkit-text-fill-color: rgb(var(--foreground)) !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Standard autofill */
input:autofill {
  background-color: rgb(var(--card)) !important;
  color: rgb(var(--foreground)) !important;
}
```

## Animation Variables

Special variables for animations:

```css
/* Edit highlight animation */
@keyframes highlightFade {
  0% {
    background-color: var(--recent-edit-color);
    box-shadow: 0 0 8px var(--recent-edit-color);
  }
  100% {
    background-color: transparent;
    box-shadow: 0 0 0px transparent;
  }
}

.edited-text-highlight {
  animation: highlightFade 3s ease-out forwards;
  padding: 2px 6px;
  border-radius: 4px;
}
```

## Dynamic Variable Updates

Variables are updated via JavaScript:

```javascript
// Convert hex to RGB and set variable
const root = document.documentElement;
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
};

// Set CSS variable
root.style.setProperty('--primary', hexToRgb('#059669'));
```

## Variable Scoping

Variables can be scoped to specific components:

```css
/* Component-specific override */
.dark-section {
  --background: 2 44 34;
  --foreground: 209 250 229;
}
```

## Fallback Values

Always provide fallbacks for critical styles:

```css
.important-element {
  /* Fallback if variable undefined */
  background-color: rgb(var(--primary, 5 150 105));
  color: rgb(var(--primary-foreground, 255 255 255));
}
```

## Performance Considerations

1. **CSS variables are performant** - Changes don't trigger layout recalculation
2. **Use transitions sparingly** - Only on color properties
3. **Batch updates** - Change all variables at once
4. **Avoid frequent changes** - Cache theme selection

## Browser Support

CSS variables are supported in all modern browsers:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

For older browsers, provide static fallback theme.

## Best Practices

1. **Always use RGB format** for Tailwind compatibility
2. **Maintain consistency** in variable naming
3. **Document special variables** in comments
4. **Test with CSS disabled** to ensure fallbacks work
5. **Use semantic names** not color names (primary vs blue)
6. **Group related variables** in comments
7. **Validate contrast ratios** after variable changes