# 3. TEST THEMES LAYOUT

**Location:** `frontend/web/src/app/(dashboard)/test-themes/layout.tsx`

## Purpose

Nested layout within the dashboard specifically for testing and experimenting with theme components and configurations. This is a **sub-layout** that inherits from the dashboard layout and adds its own navigation layer.

## Visual Structure

```
┌─────────────────────────────────────────┐
│   Theme Testing Laboratory (Header)     │
│   Description text                      │
├─────────────────────────────────────────┤
│ Overview | Gradients | Glass | Cards... │ ← Tab Navigation
├─────────────────────────────────────────┤
│                                         │
│         {children}                      │
│         (Container with padding)        │
│                                         │
└─────────────────────────────────────────┘
```

## Layout Hierarchy

```
Dashboard Layout (Sidebar + Navbar)
  └── Test Themes Layout (Header + Tabs)
      └── Individual test pages (children)
```

## Key Components

### 1. **Header Section**
```tsx
<div className="border-b border-border bg-card/50 backdrop-blur-sm">
  <div className="container mx-auto px-6 py-4">
    <h1 className="text-2xl font-bold text-foreground mb-2">
      Theme Testing Laboratory
    </h1>
    <p className="text-muted-foreground text-sm">
      Test and experiment with different theme components and configurations
    </p>
  </div>
</div>
```

**Features:**
- Semi-transparent background (`bg-card/50`)
- Backdrop blur effect
- Border bottom separator
- Container centering with padding

### 2. **Navigation Tabs**
```tsx
<div className="border-b border-border bg-card/30 backdrop-blur-sm">
  <div className="container mx-auto px-6">
    <nav className="flex space-x-8 overflow-x-auto">
      {testRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
            isActive
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  </div>
</div>
```

**Features:**
- Horizontal tab navigation
- Active state highlighting
- Hover effects
- Scrollable on overflow
- Theme-aware colors

### 3. **Content Container**
```tsx
<div className="container mx-auto px-6 py-8">
  {children}
</div>
```

**Features:**
- Centered container
- Padding for spacing
- Holds individual test page content

## Tab Routes

The layout defines 7 test routes:

```typescript
const testRoutes = [
  { href: "/test-themes", label: "Overview", exact: true },
  { href: "/test-themes/gradients", label: "Gradients" },
  { href: "/test-themes/glass-components", label: "Glass Components" },
  { href: "/test-themes/sidebar", label: "Sidebar" },
  { href: "/test-themes/cards", label: "Cards" },
  { href: "/test-themes/buttons", label: "Buttons" },
  { href: "/test-themes/forms", label: "Forms" },
]
```

### Route Details:

1. **Overview** (`/test-themes`)
   - Exact match route
   - Main landing page for theme testing

2. **Gradients** (`/test-themes/gradients`)
   - Test gradient backgrounds
   - Theme-specific color combinations

3. **Glass Components** (`/test-themes/glass-components`)
   - Glassmorphism effects
   - Backdrop blur variations

4. **Sidebar** (`/test-themes/sidebar`)
   - Sidebar variations
   - Navigation styles

5. **Cards** (`/test-themes/cards`)
   - Card component styles
   - Content containers

6. **Buttons** (`/test-themes/buttons`)
   - Button variations
   - Interactive states

7. **Forms** (`/test-themes/forms`)
   - Form inputs
   - Validation states

## Active State Logic

```typescript
const pathname = usePathname()

const isActive = route.exact
  ? pathname === route.href
  : pathname.startsWith(route.href) && route.href !== "/test-themes"
```

**Logic:**
- **Exact routes:** Match pathname exactly (`/test-themes`)
- **Non-exact routes:** Match if pathname starts with href, but not the overview route
- Prevents all tabs from being active on overview page

## Styling & Design

### Background Layers:
```css
Header:  bg-card/50 backdrop-blur-sm (50% opacity)
Tabs:    bg-card/30 backdrop-blur-sm (30% opacity)
Content: No background (inherits from dashboard)
```

### Border System:
```css
border-b border-border (Bottom borders for sections)
border-b-2 (Tab active indicator)
```

### Tab States:

#### Active Tab:
```css
border-primary    (Blue/theme color border)
text-primary      (Blue/theme color text)
```

#### Inactive Tab:
```css
border-transparent       (No border)
text-muted-foreground    (Gray text)
hover:text-foreground    (Dark text on hover)
hover:border-muted       (Gray border on hover)
```

### Responsive Behavior:
```css
overflow-x-auto  (Horizontal scroll on small screens)
whitespace-nowrap (Prevents tab text wrapping)
space-x-8 (Gap between tabs)
```

## Container Configuration

```css
container mx-auto  (Centered responsive container)
px-6              (Horizontal padding)
py-4              (Header vertical padding)
py-8              (Content vertical padding)
```

## Use Cases

This layout is specifically designed for:

1. **Theme Development** - Testing theme color variations
2. **Component Testing** - Visual regression testing
3. **Design System** - Living style guide
4. **UI Exploration** - Experimenting with new designs
5. **Developer Tools** - Internal testing interface

## Client-Side Features

```tsx
"use client"

import { usePathname } from "next/navigation"
```

**Why Client-Side:**
- Uses Next.js navigation hooks
- Dynamic active state calculation
- Interactive tab switching

## Code Reference

**File:** `frontend/web/src/app/(dashboard)/test-themes/layout.tsx:1-72`

## Relationship to Dashboard Layout

This layout is **nested within** the dashboard layout:

```
Root Layout
  └── Dashboard Layout (Sidebar + Navbar)
      └── Test Themes Layout (Header + Tabs)
          └── Test Pages (Overview, Gradients, etc.)
```

**Inheritance:**
- ✅ Gets sidebar from dashboard
- ✅ Gets navbar from dashboard
- ✅ Gets theme system from root
- ✅ Gets auth context from root
- ✅ Adds own header and tabs

## Benefits of Nested Layout

### ✅ **Separation of Concerns**
- Theme testing UI is isolated
- Dashboard chrome remains consistent

### ✅ **Navigation Context**
- Tabs only appear in theme testing section
- Clear visual hierarchy

### ✅ **Code Organization**
- Theme testing logic separate from main app
- Easy to maintain and extend

### ✅ **User Experience**
- Clear indication of theme testing mode
- Dedicated navigation for test pages
- Consistent dashboard wrapper

## Related Files

- `frontend/web/src/app/(dashboard)/layout.tsx` - Parent layout
- `frontend/web/src/app/(dashboard)/test-themes/page.tsx` - Overview page
- `frontend/web/src/app/(dashboard)/test-themes/gradients/page.tsx` - Gradients test
- `frontend/web/src/app/(dashboard)/test-themes/glass-components/page.tsx` - Glass test
- `frontend/web/src/lib/utils.ts` - cn() utility for className merging
