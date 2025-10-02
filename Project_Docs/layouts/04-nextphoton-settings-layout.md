# 4. NEXTPHOTON SETTINGS LAYOUT

**Location:** `frontend/web/src/app/NextPhotonSettings/layout.tsx`

## Purpose

Application-wide settings layout that **reuses the exact same dashboard pattern** as the main dashboard layout. Provides the same sidebar, navbar, and glassmorphism effects for the settings section.

## Visual Structure

```
┌─────────────────────────────────────────┐
│         DashboardNavbar (Top)           │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │    Settings Content          │
│ (Fixed)  │    (Scrollable)              │
│          │                              │
│  288px   │    Dynamic Width             │
│          │    {children}                │
│          │                              │
└──────────┴──────────────────────────────┘
                          └─ SecondarySidebarDrawer (Right)
```

## Relationship to Dashboard Layout

This layout is **nearly identical** to the dashboard layout but located in a different route group.

### Similarities:
- ✅ Same sidebar component (`DashboardSidebar`)
- ✅ Same navbar component (`DashboardNavbar`)
- ✅ Same secondary drawer (`SecondarySidebarDrawer`)
- ✅ Same sidebar provider context
- ✅ Same glassmorphism effects
- ✅ Same responsive behavior
- ✅ Same animation timings

### Differences:
- Slightly simpler background gradient system
- Uses `bg-white/5` instead of theme CSS variables
- Border styling: `border-white/10` instead of theme classes

## Code Structure

```tsx
"use client";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { SecondarySidebarDrawer } from "@/components/SecondarySidebarDrawer";
import { useState, useEffect } from "react";

// Outer wrapper with SidebarProvider
export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <SidebarProvider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </SidebarProvider>
  );
}

// Layout with glassmorphism effects
function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar with glass effect */}
      <aside
        className={`
          sidebar fixed top-0 left-0 h-screen p-0 w-72 z-50
          transition-transform duration-300 ease-in-out
          bg-white/5 backdrop-blur-xl border-r border-white/10
          overflow-y-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <DashboardSidebar />
      </aside>

      {/* Main content area */}
      <div
        className={`
          w-screen flex flex-col min-h-screen
          transition-all duration-300
          ${open ? "ml-72" : "ml-0"}
        `}
      >
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="relative">
            {children}
          </div>
        </main>
      </div>

      {/* Secondary Sidebar Drawer */}
      <SecondarySidebarDrawer />
    </div>
  );
}
```

## Routes Using This Layout

```
NextPhotonSettings/
└── page.tsx  # Main settings page
```

**Note:** Currently only contains a single page, but structured to support future settings pages.

## Styling Details

### Sidebar Styling:
```css
bg-white/5           (5% white opacity background)
backdrop-blur-xl     (Extra large blur)
border-r             (Right border)
border-white/10      (10% white opacity border)
```

### Main Container:
```css
flex w-screen h-screen  (Full viewport layout)
overflow-hidden         (Prevent body scroll)
```

### Content Area:
```css
flex-1          (Takes remaining space)
p-6             (24px padding)
overflow-auto   (Scrollable content)
```

### Responsive Classes:
```css
transition-transform duration-300 ease-in-out  (Sidebar slide animation)
transition-all duration-300                     (Content area transition)
${open ? "translate-x-0" : "-translate-x-full"} (Sidebar visibility)
${open ? "ml-72" : "ml-0"}                      (Content margin adjustment)
```

## Why a Separate Layout?

Even though this layout is nearly identical to the dashboard layout, it exists separately because:

1. **Route Organization** - Settings are at root level, not in `(dashboard)/`
2. **Future Flexibility** - May need settings-specific customizations
3. **Clear Separation** - Settings vs. main app distinction
4. **Independent Navigation** - Could have different sidebar items for settings

## Client-Side Mounting

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

if (!mounted) return null;
```

**Purpose:**
- Prevents hydration mismatch errors
- Ensures client-side only rendering
- Required for sidebar state management

## Two-Component Pattern

### 1. **Outer Component** (`Layout`)
- Provides `SidebarProvider` context
- Handles client-side mounting
- Prevents SSR hydration issues

### 2. **Inner Component** (`LayoutWithSidebar`)
- Consumes sidebar state via `useSidebar()` hook
- Renders actual layout structure
- Applies conditional styling

## Comparison with Dashboard Layout

| Feature | NextPhoton Settings | Dashboard |
|---------|-------------------|-----------|
| Sidebar Component | ✅ Same | ✅ Same |
| Navbar Component | ✅ Same | ✅ Same |
| Secondary Drawer | ✅ Same | ✅ Same |
| Background Gradient | Simpler (`bg-white/5`) | Theme CSS variables |
| Border Style | `border-white/10` | `theme-border-glass` |
| Layout Structure | ✅ Identical | ✅ Identical |
| Animation Timing | ✅ Same (300ms) | ✅ Same (300ms) |
| Responsive Behavior | ✅ Same | ✅ Same |

## Code Reference

**File:** `frontend/web/src/app/NextPhotonSettings/layout.tsx:1-64`

## Related Files

- `frontend/web/src/app/(dashboard)/layout.tsx` - Similar dashboard layout
- `frontend/web/src/components/DashboardSidebar.tsx` - Sidebar component
- `frontend/web/src/components/DashboardNavbar.tsx` - Navbar component
- `frontend/web/src/components/SecondarySidebarDrawer.tsx` - Drawer component
- `frontend/web/src/components/ui/sidebar.tsx` - Sidebar primitives

## Future Enhancements

Potential settings-specific features:

1. **Settings Sidebar** - Dedicated settings navigation menu
2. **Breadcrumbs** - Settings section breadcrumb navigation
3. **Save/Cancel Actions** - Persistent action bar for settings
4. **Settings Tabs** - Tabbed interface for different settings categories
5. **Theme Customization** - Live theme preview in settings
