# 10. ROOT LEVEL SPECIAL FILES

Next.js provides special files at the root app level for handling common UI patterns and behaviors.

## Overview

**Location:** `frontend/web/src/app/`

```
app/
├── layout.tsx          # Root layout (all pages)
├── page.tsx            # Homepage (/)
├── loading.tsx         # Global loading UI
├── not-found.tsx       # 404 page
├── template.tsx        # Template wrapper
├── theme-script.tsx    # Theme initialization
└── globals.css.ts      # Global styles
```

---

## 1. layout.tsx - Root Layout

**Purpose:** Global layout wrapper for the entire application

**See:** [01-root-layout.md](./01-root-layout.md) for complete documentation

**Key Features:**
- Global providers (Auth, Apollo, Loading)
- Theme system
- Toast notifications
- Global loader
- Inter font
- Metadata/SEO

---

## 2. page.tsx - Homepage

**File:** `frontend/web/src/app/page.tsx`
**URL:** `/` (root)

**Purpose:** Landing page and application entry point

### Typical Structure:
```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to NextPhoton
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Uber for Educators - Connecting Learners with Quality Education
          </p>
          <div className="flex gap-4">
            <Link href="/sign-up">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/company/about">
              <Button size="lg" variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* Testimonials */}
      {/* Pricing */}
      {/* CTA */}
    </div>
  )
}
```

### Content Sections:
1. **Hero** - Main value proposition
2. **Features** - Key features showcase
3. **How It Works** - Process explanation
4. **Testimonials** - Social proof
5. **Pricing** - Pricing tiers (if public)
6. **CTA** - Sign up call-to-action

### Routing Behavior:
- Authenticated users → Redirect to dashboard
- New users → Show landing page
- Can use middleware for automatic redirects

---

## 3. loading.tsx - Global Loading UI

**File:** `frontend/web/src/app/loading.tsx`

**Purpose:** Displayed while page content is loading (Suspense boundary)

### Implementation:
```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-muted-foreground">Please wait</p>
      </div>
    </div>
  )
}
```

### Features:
- Automatic loading state
- Shown during navigation
- Server component loading
- Streaming SSR support

### When It Appears:
- Page navigation transitions
- Server component data fetching
- Async component loading
- Route segment loading

---

## 4. not-found.tsx - 404 Page

**File:** `frontend/web/src/app/not-found.tsx`

**Purpose:** Displayed when route is not found

### Implementation:
```tsx
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Home size={20} />
              Go Home
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Features:
- Clear error message
- Navigation options
- Visual hierarchy
- Brand consistency

### Triggered By:
- Non-existent routes
- Manually called `notFound()` function
- Invalid dynamic segments

---

## 5. template.tsx - Template Wrapper

**File:** `frontend/web/src/app/template.tsx`

**Purpose:** Similar to layout but re-renders on navigation (creates new instance)

### Difference from Layout:
- **Layout:** Persists across navigation (single instance)
- **Template:** Re-renders on every navigation (new instance each time)

### Use Cases:
- Page transition animations
- Resetting state on navigation
- Enter/exit animations
- Analytics tracking

### Implementation:
```tsx
'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### When to Use:
- ✅ Page transitions
- ✅ Analytics tracking per page
- ✅ Resetting scroll position
- ✅ Form state reset

### When NOT to Use:
- ❌ Persistent state (use layout)
- ❌ Expensive initializations
- ❌ Shared components across pages

---

## 6. theme-script.tsx - Theme Initialization

**File:** `frontend/web/src/app/theme-script.tsx`

**Purpose:** Prevent Flash of Unstyled Content (FOUC) for theme switching

### Implementation:
```tsx
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const theme = localStorage.getItem('theme') || 'system';
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const activeTheme = theme === 'system' ? systemTheme : theme;

            document.documentElement.classList.add(activeTheme);
            document.documentElement.setAttribute('data-theme', activeTheme);
          })();
        `,
      }}
    />
  )
}
```

### Features:
- Runs before page render
- Reads localStorage theme preference
- Respects system preference
- Sets theme class immediately
- Prevents FOUC

### Why It's Needed:
Without this script:
1. Page loads with default theme
2. React hydrates
3. Theme hook runs
4. Theme changes → Flash of wrong theme

With this script:
1. Theme set before render
2. No visual flash
3. Seamless theme experience

### Usage:
```tsx
// In root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 7. globals.css - Global Styles

**File:** `frontend/web/src/app/globals.css` (or `globals.css.ts`)

**Purpose:** Global CSS styles and CSS variable definitions

### Contains:
```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables for themes */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 221.2 83.2% 53.3%;
  --gradient-from: ...;
  --gradient-via: ...;
  --gradient-to: ...;
}

[data-theme="dark"] {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}

/* Custom utility classes */
.main-section-overlay {
  /* Custom overlay styles */
}

.sidebar-theme-gradient {
  /* Sidebar gradient */
}
```

### Theme Variables:
- Colors (background, foreground, primary, etc.)
- Gradients (from, via, to)
- Opacities
- Border colors
- Shadow values

### Global Styles:
- Reset styles
- Typography defaults
- Scrollbar styling
- Selection colors
- Focus states

---

## File Hierarchy

```
Root Layout (layout.tsx)
├── Theme Script (theme-script.tsx)
├── Global Styles (globals.css)
├── Template (template.tsx) [Optional]
│   └── Page Content
│       ├── page.tsx (Homepage)
│       ├── loading.tsx (Loading state)
│       └── not-found.tsx (404 page)
```

---

## Special File Execution Order

1. **theme-script.tsx** - First (before render)
2. **layout.tsx** - Wraps everything
3. **template.tsx** - Wraps page (if exists)
4. **loading.tsx** - Shows during load
5. **page.tsx** - Page content
6. **not-found.tsx** - If route doesn't exist

---

## Best Practices

### ✅ Loading UI:
- Show meaningful loading states
- Match brand styling
- Provide context (what's loading)
- Use skeleton screens for content

### ✅ 404 Page:
- Clear error message
- Easy navigation back
- Search functionality
- Popular pages links

### ✅ Theme Script:
- Keep it minimal
- No external dependencies
- Pure JavaScript
- Fast execution

### ✅ Template vs Layout:
- Use layout for persistent UI
- Use template for animations
- Don't overuse template (performance)

---

## Code References

- `frontend/web/src/app/layout.tsx` - Root layout
- `frontend/web/src/app/page.tsx` - Homepage
- `frontend/web/src/app/loading.tsx` - Global loader
- `frontend/web/src/app/not-found.tsx` - 404 page
- `frontend/web/src/app/template.tsx` - Template wrapper
- `frontend/web/src/app/theme-script.tsx` - Theme initialization
- `frontend/web/src/app/globals.css` - Global styles

---

## Summary

Special files provide:
- ✅ **layout.tsx** - Global app wrapper
- ✅ **page.tsx** - Homepage content
- ✅ **loading.tsx** - Loading states
- ✅ **not-found.tsx** - 404 handling
- ✅ **template.tsx** - Page transitions
- ✅ **theme-script.tsx** - Theme initialization
- ✅ **globals.css** - Global styling

These files work together to create a polished, professional user experience throughout the NextPhoton application.
