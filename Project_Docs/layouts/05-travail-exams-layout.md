# 5. TRAVAIL PRACTISE EXAMS LAYOUT

**Location:** `frontend/web/src/app/TRAVAIL-PRACTISE-EXAMS/layout.tsx`

## Purpose

Dedicated layout for the TRAVAIL Practice Exams system. Uses the dashboard pattern with enhanced theme gradients and glassmorphism effects for an immersive exam-taking experience.

## Visual Structure

```
┌─────────────────────────────────────────┐
│         DashboardNavbar (Top)           │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │    Exam Content Area         │
│ (Fixed)  │    (Scrollable)              │
│ Theme    │                              │
│ Gradient │    Dynamic Width             │
│          │    {children}                │
│          │                              │
└──────────┴──────────────────────────────┘
                          └─ SecondarySidebarDrawer (Right)
```

## Key Differences from Standard Dashboard

While similar to the dashboard layout, this layout includes:

### ✅ **Enhanced Background Gradients**
- Full CSS variable-based gradient system
- Custom opacity controls
- Theme-aware color transitions

### ✅ **Main Section Overlay**
- `.main-section-overlay` div for content darkening
- Better visual separation for exam content

### ✅ **Extended Background System**
- Fixed background gradient covering entire viewport
- Layered overlays for depth

## Code Structure

```tsx
"use client";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { SecondarySidebarDrawer } from "@/components/SecondarySidebarDrawer";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <SidebarProvider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </SidebarProvider>
  );
}

function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="flex w-screen h-screen overflow-hidden relative">
      {/* Background gradient that extends to full content */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(to bottom right,
            rgb(var(--gradient-from)),
            rgb(var(--gradient-via)),
            rgb(var(--gradient-to)))`,
          opacity: `var(--background-gradient-opacity, 0.75)`
        }}
      />

      {/* Sidebar with theme gradient */}
      <aside
        className={`
          sidebar fixed top-0 left-0 h-screen p-0 w-72 z-50
          transition-transform duration-300 ease-in-out
          backdrop-blur-xl border-r border-white/10
          overflow-y-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: `linear-gradient(135deg,
            rgb(var(--sidebar-gradient-from) / var(--sidebar-gradient-opacity, 1)) 0%,
            rgb(var(--sidebar-gradient-via) / var(--sidebar-gradient-opacity, 1)) 50%,
            rgb(var(--sidebar-gradient-to) / var(--sidebar-gradient-opacity, 1)) 100%)`
        }}
      >
        <DashboardSidebar />
      </aside>

      {/* Main content area */}
      <div
        className={`
          relative w-screen flex flex-col min-h-screen
          transition-all duration-300
          ${open ? "ml-72" : "ml-0"}
        `}
      >
        <DashboardNavbar />
        <main className="flex-1 overflow-auto relative z-10">
          <div className="relative min-h-full">
            {/* Main section background overlay */}
            <div className="main-section-overlay"></div>
            {/* Glass panel wrapper for content */}
            <div className="relative z-10 p-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      <SecondarySidebarDrawer />
    </div>
  );
}
```

## Background System

### Three-Layer Approach:

#### 1. **Base Gradient** (z-0)
```tsx
<div
  className="fixed inset-0 z-0"
  style={{
    background: `linear-gradient(to bottom right,
      rgb(var(--gradient-from)),
      rgb(var(--gradient-via)),
      rgb(var(--gradient-to)))`,
    opacity: `var(--background-gradient-opacity, 0.75)`
  }}
/>
```

**Purpose:**
- Full viewport coverage
- Theme-aware colors via CSS variables
- Adjustable opacity

#### 2. **Main Section Overlay**
```html
<div class="main-section-overlay"></div>
```

**Purpose:**
- Additional darkening/lightening layer
- Content area background styling
- Defined in `globals.css`

#### 3. **Content Container** (z-10)
```html
<div class="relative z-10 p-6">
  {children}
</div>
```

**Purpose:**
- Content on top of overlays
- Padding for spacing
- Relative positioning for z-index stacking

## Sidebar Gradient System

```tsx
style={{
  background: `linear-gradient(135deg,
    rgb(var(--sidebar-gradient-from) / var(--sidebar-gradient-opacity, 1)) 0%,
    rgb(var(--sidebar-gradient-via) / var(--sidebar-gradient-opacity, 1)) 50%,
    rgb(var(--sidebar-gradient-to) / var(--sidebar-gradient-opacity, 1)) 100%)`
}}
```

**Features:**
- 135-degree diagonal gradient
- Three color stops (from, via, to)
- Individual opacity control per color
- Smooth transitions between theme changes

## CSS Variables Used

### Background Gradients:
```css
--gradient-from              # Start color (RGB)
--gradient-via               # Middle color (RGB)
--gradient-to                # End color (RGB)
--background-gradient-opacity # Overall opacity (0-1)
```

### Sidebar Gradients:
```css
--sidebar-gradient-from      # Start color (RGB)
--sidebar-gradient-via       # Middle color (RGB)
--sidebar-gradient-to        # End color (RGB)
--sidebar-gradient-opacity   # Overall opacity (0-1)
```

## Routes Using This Layout

```
TRAVAIL-PRACTISE-EXAMS/
├── admin/
│   ├── TRAVAIL-PRACTISE/
│   │   └── page.tsx       # Practice exam management
│   └── TRAVAIL-EXAMS/
│       └── page.tsx       # Actual exam interface
└── page.tsx               # (If exists) Exam landing page
```

## Z-Index Layering

```
z-0   → Background gradient (Fixed)
z-10  → Main content area
z-50  → Sidebar (Fixed)
```

**Strategy:**
- Background always behind everything
- Sidebar on top for accessibility
- Content in the middle layer

## Styling Details

### Container:
```css
relative                 # Positioning context
flex w-screen h-screen  # Full viewport flexbox
overflow-hidden         # Prevent body scroll
```

### Sidebar:
```css
fixed top-0 left-0      # Fixed positioning
h-screen w-72           # Full height, 288px width
z-50                    # Top layer
backdrop-blur-xl        # Strong blur effect
border-r border-white/10 # Semi-transparent border
overflow-y-auto         # Scrollable content
```

### Main Content:
```css
relative                # Positioning context
w-screen               # Full width
flex flex-col          # Vertical flexbox
min-h-screen           # Minimum full height
transition-all duration-300  # Smooth transitions
```

### Content Area:
```css
flex-1                 # Fill remaining space
overflow-auto          # Scrollable
relative z-10          # Above background
```

## Exam-Specific Features

This layout is optimized for exam-taking:

1. **Immersive Background** - Full gradient creates focused environment
2. **Minimal Distractions** - Clean layout without unnecessary chrome
3. **Sidebar Access** - Quick access to exam navigation/resources
4. **Overlay System** - Visual depth for better content hierarchy
5. **Smooth Transitions** - Professional animations

## Client-Side Rendering

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

if (!mounted) return null;
```

**Reason:**
- Sidebar state requires client-side JavaScript
- Prevents hydration mismatch errors
- Ensures consistent rendering

## Code Reference

**File:** `frontend/web/src/app/TRAVAIL-PRACTISE-EXAMS/layout.tsx:1-87`

## Related Files

- `frontend/web/src/components/DashboardSidebar.tsx` - Sidebar navigation
- `frontend/web/src/components/DashboardNavbar.tsx` - Top navbar
- `frontend/web/src/components/SecondarySidebarDrawer.tsx` - Right drawer
- `frontend/web/src/app/globals.css` - CSS variables and `.main-section-overlay`
- `frontend/web/src/components/ui/sidebar.tsx` - Sidebar primitives

## Comparison with Other Layouts

| Feature | TRAVAIL Exams | Dashboard | NextPhoton Settings |
|---------|--------------|-----------|-------------------|
| Background Gradient | ✅ Full CSS Variables | ✅ CSS Variables | ❌ Simple `bg-white/5` |
| Sidebar Gradient | ✅ CSS Variables | ✅ CSS Variables | ❌ `bg-white/5` |
| Main Overlay | ✅ Yes | ✅ Yes | ❌ No |
| Z-Index Layers | 3 (0, 10, 50) | 3 (0, 10, 50) | 2 (content, sidebar) |
| Use Case | Exams/Tests | Main App | Settings |

## Design Rationale

### Why Enhanced Gradients?

1. **Brand Identity** - TRAVAIL exams get distinct visual treatment
2. **Focus Mode** - Immersive background helps concentration
3. **Visual Hierarchy** - Clear separation between UI and content
4. **Theme Consistency** - Follows same theme system as rest of app
5. **Professional Look** - Polished appearance for assessment platform
