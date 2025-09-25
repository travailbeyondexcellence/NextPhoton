# Tailwind CSS Configuration

## Overview

The Tailwind configuration integrates the CSS variable system to provide theme-aware utility classes throughout the application.

## Complete Configuration

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
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      colors: {
        // Theme colors using CSS variables
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'rgb(var(--secondary-foreground) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-foreground': 'rgb(var(--accent-foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        selection: 'rgb(var(--selection) / <alpha-value>)',
        link: 'rgb(var(--link) / <alpha-value>)',
        'link-hover': 'rgb(var(--link-hover) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        'destructive-foreground': 'rgb(var(--destructive-foreground) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-foreground': 'rgb(var(--success-foreground) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        'warning-foreground': 'rgb(var(--warning-foreground) / <alpha-value>)',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Typography plugin theme integration
            '--tw-prose-body': 'rgb(var(--foreground))',
            '--tw-prose-headings': 'rgb(var(--foreground))',
            '--tw-prose-lead': 'rgb(var(--muted-foreground))',
            '--tw-prose-links': 'rgb(var(--link))',
            '--tw-prose-bold': 'rgb(var(--foreground))',
            '--tw-prose-counters': 'rgb(var(--muted-foreground))',
            '--tw-prose-bullets': 'rgb(var(--muted-foreground))',
            '--tw-prose-hr': 'rgb(var(--border))',
            '--tw-prose-quotes': 'rgb(var(--foreground))',
            '--tw-prose-quote-borders': 'rgb(var(--border))',
            '--tw-prose-captions': 'rgb(var(--muted-foreground))',
            '--tw-prose-code': 'rgb(var(--foreground))',
            '--tw-prose-pre-code': 'rgb(var(--card-foreground))',
            '--tw-prose-pre-bg': 'rgb(var(--muted))',
            '--tw-prose-th-borders': 'rgb(var(--border))',
            '--tw-prose-td-borders': 'rgb(var(--border))',
            // Element-specific styles
            'color': 'rgb(var(--foreground))',
            'a': {
              'color': 'rgb(var(--link))',
              '&:hover': {
                'color': 'rgb(var(--link-hover))',
              },
            },
            'strong': {
              'color': 'rgb(var(--foreground))',
            },
            'h1, h2, h3, h4, h5, h6': {
              'color': 'rgb(var(--foreground))',
            },
            'blockquote': {
              'borderLeftColor': 'rgb(var(--border))',
              'color': 'rgb(var(--muted-foreground))',
            },
            'code': {
              'backgroundColor': 'rgb(var(--muted))',
              'color': 'rgb(var(--foreground))',
              'padding': '0.25rem 0.375rem',
              'borderRadius': '0.25rem',
              'fontWeight': '400',
            },
            'pre': {
              'backgroundColor': 'rgb(var(--muted))',
              'color': 'rgb(var(--card-foreground))',
            },
            '::selection': {
              'backgroundColor': 'rgb(var(--selection))',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

## Key Concepts

### Alpha Value Support

The `<alpha-value>` placeholder allows Tailwind to inject opacity modifiers:

```jsx
// These all work with the theme colors:
<div className="bg-primary">100% opacity</div>
<div className="bg-primary/50">50% opacity</div>
<div className="bg-primary/25">25% opacity</div>
<div className="text-foreground/75">75% opacity text</div>
```

### Color Naming Convention

- Single words use the color name directly: `primary`, `background`
- Multi-word colors use kebab-case: `card-foreground`, `link-hover`
- This matches CSS variable naming for consistency

### Typography Plugin Integration

The typography plugin is configured to use theme colors:

```css
/* Automatically uses theme colors for prose content */
.prose {
  /* Headings use --foreground */
  /* Links use --link and --link-hover */
  /* Borders use --border */
  /* Code blocks use --muted background */
}
```

## Usage Examples

### Basic Color Usage

```jsx
// Background colors
<div className="bg-background">Main background</div>
<div className="bg-card">Card background</div>
<div className="bg-primary">Primary background</div>
<div className="bg-muted">Muted background</div>

// Text colors
<p className="text-foreground">Main text</p>
<p className="text-primary">Primary text</p>
<p className="text-muted-foreground">Muted text</p>

// Border colors
<div className="border border-border">Default border</div>
<div className="border-2 border-primary">Primary border</div>
```

### Opacity Modifiers

```jsx
// Background with opacity
<div className="bg-primary/20">20% opacity background</div>
<div className="bg-accent/50">50% opacity accent</div>

// Text with opacity
<p className="text-foreground/50">50% opacity text</p>

// Border with opacity
<div className="border border-border/30">30% opacity border</div>
```

### Hover States

```jsx
// Color transitions on hover
<button className="bg-primary hover:bg-primary/80">
  Hover for darker
</button>

<a className="text-link hover:text-link-hover">
  Link with hover
</a>

<div className="border-border hover:border-primary transition-colors">
  Border change on hover
</div>
```

### Combined Utilities

```jsx
// Card component
<div className="bg-card text-card-foreground border border-border rounded-lg p-4">
  Card content
</div>

// Button component
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">
  Click me
</button>

// Alert component
<div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded">
  Error message
</div>
```

## Font Configuration

Fonts are also configured with CSS variables:

```javascript
fontFamily: {
  sans: ['var(--font-sans)'],
  serif: ['var(--font-serif)'],
}
```

Usage:
```jsx
<p className="font-sans">Sans serif text</p>
<h1 className="font-serif">Serif heading</h1>
```

## Responsive Design

Theme colors work with all responsive modifiers:

```jsx
<div className="bg-background md:bg-card lg:bg-primary">
  Responsive backgrounds
</div>

<p className="text-foreground md:text-primary lg:text-accent">
  Responsive text colors
</p>
```

## Dark Mode Considerations

Since themes handle dark/light modes, you typically don't need Tailwind's dark mode classes:

```jsx
// Instead of this:
<div className="bg-white dark:bg-black">

// Use theme colors:
<div className="bg-background">
```

## Custom Utilities

You can create custom utilities using theme colors:

```css
@layer utilities {
  .glow-primary {
    box-shadow: 0 0 20px rgb(var(--primary) / 0.5);
  }
  
  .gradient-primary {
    background: linear-gradient(
      to right,
      rgb(var(--primary)),
      rgb(var(--secondary))
    );
  }
}
```

## JIT Mode

Tailwind's JIT mode works seamlessly with the theme system:

```jsx
// Arbitrary values using theme colors
<div className="bg-[rgb(var(--primary)/0.15)]">
  15% opacity primary
</div>
```

## Plugin Support

The theme colors work with Tailwind plugins:

```jsx
// With @tailwindcss/forms
<input className="border-border focus:border-primary" />

// With @tailwindcss/typography
<article className="prose prose-a:text-link">
  Content with themed links
</article>
```

## Best Practices

1. **Use semantic color names** - `bg-primary` not `bg-green`
2. **Leverage opacity modifiers** - `bg-primary/50` instead of separate colors
3. **Maintain consistency** - Use the same color tokens throughout
4. **Test all themes** - Ensure utilities work with all color schemes
5. **Document custom colors** - If adding new theme colors
6. **Use transitions** - Add `transition-colors` for smooth theme changes
7. **Avoid hardcoded colors** - Always use theme colors

## Debugging

To debug theme colors in development:

```jsx
// Show all theme colors
<div className="grid grid-cols-4 gap-2">
  <div className="bg-background p-2">background</div>
  <div className="bg-foreground p-2">foreground</div>
  <div className="bg-primary p-2">primary</div>
  <div className="bg-secondary p-2">secondary</div>
  {/* ... more colors */}
</div>
```

## Performance

- CSS variables are cached by the browser
- No additional CSS is generated for different themes
- Single stylesheet for all themes
- Minimal runtime overhead