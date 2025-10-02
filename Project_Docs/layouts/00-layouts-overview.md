# NextPhoton Application Layouts - Complete Overview

This document provides a high-level overview of all layouts in the NextPhoton application. For detailed information about each layout, see the individual documentation files.

## Table of Contents

1. [Root Layout](#1-root-layout) - `01-root-layout.md`
2. [Dashboard Layout](#2-dashboard-layout) - `02-dashboard-layout.md`
3. [Test Themes Layout](#3-test-themes-layout) - `03-test-themes-layout.md`
4. [NextPhoton Settings Layout](#4-nextphoton-settings-layout) - `04-nextphoton-settings-layout.md`
5. [TRAVAIL Exams Layout](#5-travail-exams-layout) - `05-travail-exams-layout.md`
6. [Onboarding Layout](#6-onboarding-layout) - `06-onboarding-layout.md`
7. [Route Groups](#7-route-groups) - `07-route-groups.md`
8. [Standalone Routes](#8-standalone-routes) - `08-standalone-routes.md`
9. [API Routes](#9-api-routes) - `09-api-routes.md`
10. [Special Files](#10-special-files) - `10-special-files.md`
11. [Layout Inheritance](#11-layout-inheritance) - `11-layout-inheritance.md`

---

## Quick Reference

### Layout Count: **6 Layouts**

1. **Root Layout** - Global wrapper for all pages
2. **Dashboard Layout** - Main application interface
3. **Test Themes Layout** - Theme testing interface (nested)
4. **NextPhoton Settings Layout** - Settings interface
5. **TRAVAIL Exams Layout** - Exam interface
6. **Onboarding Layout** - User onboarding (minimal)

### Route Groups: **5 Groups**

- `(auth)` - Authentication flows
- `(dashboard)` - Main application
- `(onboarding)` - User setup
- `(public)` - Public pages
- `(features)` - Type definitions (NOT routes)

### API Endpoints: **10 Endpoints**

RESTful and GraphQL endpoints for data operations

---

## Layout Hierarchy

```
app/
├── layout.tsx (ROOT) ⭐
│   ├── (auth)/ → No layout
│   ├── (dashboard)/ → Dashboard Layout 🎯
│   │   └── test-themes/ → Test Themes Layout (nested)
│   ├── (onboarding)/ → Onboarding Layout
│   ├── (public)/ → No layout
│   ├── NextPhotonSettings/ → Settings Layout
│   ├── TRAVAIL-PRACTISE-EXAMS/ → Exams Layout
│   ├── company/ → No layout
│   ├── legal/ → No layout
│   └── api/ → REST & GraphQL endpoints
```

---

## 1. Root Layout

**File:** `app/layout.tsx`
**Documentation:** [01-root-layout.md](./01-root-layout.md)

### Purpose
Global application wrapper providing core functionality to ALL routes.

### Key Features
- ✅ Inter font from Google Fonts
- ✅ Theme system (Dark/Light mode)
- ✅ Global providers (Loading, Auth, Apollo)
- ✅ Toast notifications
- ✅ Global loader
- ✅ SEO metadata

### Applies To
**All routes** in the application

---

## 2. Dashboard Layout

**File:** `app/(dashboard)/layout.tsx`
**Documentation:** [02-dashboard-layout.md](./02-dashboard-layout.md)

### Purpose
Main application dashboard with sidebar navigation for authenticated users.

### Key Features
- ✅ DashboardSidebar (288px, collapsible)
- ✅ DashboardNavbar (top bar)
- ✅ SecondarySidebarDrawer (right drawer)
- ✅ Glassmorphism effects
- ✅ Theme gradients

### Visual Structure
```
┌─────────────────────────────────┐
│     DashboardNavbar (Top)       │
├──────────┬────────────────────────┤
│ Sidebar  │   Main Content        │
│ (Fixed)  │   (Scrollable)        │
│  288px   │   {children}          │
└──────────┴────────────────────────┘
```

### Routes
- `/admin/*` - Admin dashboard
- `/educator/*`, `/learner/*`, `/guardian/*`, `/employee/*`
- `/profile`, `/settings`, `/help-support`

---

## 3. Test Themes Layout

**File:** `app/(dashboard)/test-themes/layout.tsx`
**Documentation:** [03-test-themes-layout.md](./03-test-themes-layout.md)

### Purpose
Nested layout for testing theme components.

### Key Features
- ✅ Inherits dashboard layout
- ✅ Adds header + tabbed navigation
- ✅ 7 test sections (Overview, Gradients, Glass, etc.)

### Visual Structure
```
┌─────────────────────────────────┐
│  Theme Testing Laboratory       │
├─────────────────────────────────┤
│ Overview | Gradients | Glass... │ ← Tabs
├─────────────────────────────────┤
│        {children}               │
└─────────────────────────────────┘
```

### Routes
- `/test-themes` - Overview
- `/test-themes/gradients`, `/test-themes/glass-components`, etc.

---

## 4. NextPhoton Settings Layout

**File:** `app/NextPhotonSettings/layout.tsx`
**Documentation:** [04-nextphoton-settings-layout.md](./04-nextphoton-settings-layout.md)

### Purpose
Settings interface (reuses dashboard pattern).

### Key Features
- ✅ Same as dashboard layout
- ✅ Simpler gradient system

### Routes
- `/NextPhotonSettings/*`

---

## 5. TRAVAIL Exams Layout

**File:** `app/TRAVAIL-PRACTISE-EXAMS/layout.tsx`
**Documentation:** [05-travail-exams-layout.md](./05-travail-exams-layout.md)

### Purpose
Exam interface with enhanced gradients.

### Key Features
- ✅ Same structure as dashboard
- ✅ Enhanced CSS variable gradients
- ✅ Main section overlay
- ✅ Immersive background

### Routes
- `/TRAVAIL-PRACTISE-EXAMS/*`

---

## 6. Onboarding Layout

**File:** `app/(onboarding)/layout.tsx`
**Documentation:** [06-onboarding-layout.md](./06-onboarding-layout.md)

### Purpose
Minimal layout for user onboarding flows.

### Current State
Empty wrapper (single line file)

### Potential Routes
- Educator, Guardian, Learner onboarding flows

---

## 7. Route Groups

**Documentation:** [07-route-groups.md](./07-route-groups.md)

### Overview
Route groups organize routes without affecting URLs.

### Groups
1. **`(auth)/`** - Authentication pages (no layout)
2. **`(dashboard)/`** - Main app (dashboard layout)
3. **`(onboarding)/`** - User setup (minimal layout)
4. **`(public)/`** - Public pages (no layout)
5. **`(features)/`** - Type definitions (NOT routes)

---

## 8. Standalone Routes

**Documentation:** [08-standalone-routes.md](./08-standalone-routes.md)

### Categories
1. **Company Pages** - `/company/about`, `/company/blog`, etc.
2. **Legal Pages** - `/legal/privacy`, `/legal/terms`, etc.
3. **Logout** - `/logout`

### Characteristics
- Use root layout only
- No additional UI chrome
- SEO-optimized

---

## 9. API Routes

**Documentation:** [09-api-routes.md](./09-api-routes.md)

### Endpoints (10 total)
```
/api/announcements
/api/dailyStudyPlans
/api/educare-tasks
/api/examinations
/api/graphql
/api/home-tasks
/api/practice-assignments
/api/themes
/api/users/:type
```

### Methods
- GET, POST, PUT, DELETE
- REST + GraphQL

### Data Source
- Mock JSON files (development)
- Future: NestJS backend + PostgreSQL

---

## 10. Special Files

**Documentation:** [10-special-files.md](./10-special-files.md)

### Root Level Files
```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Homepage
├── loading.tsx         # Global loading UI
├── not-found.tsx       # 404 page
├── template.tsx        # Template wrapper
├── theme-script.tsx    # Theme initialization
└── globals.css         # Global styles
```

---

## 11. Layout Inheritance

**Documentation:** [11-layout-inheritance.md](./11-layout-inheritance.md)

### Inheritance Tree
```
Root Layout
  ├── Dashboard Layout
  │   └── Test Themes Layout (nested)
  ├── Settings Layout
  ├── Exams Layout
  └── Onboarding Layout
```

### Provider Nesting
```
LoadingProvider
  → AuthProvider
    → ApolloProvider
      → SidebarProvider (dashboard only)
        → Layout Components
```

---

## Design Patterns

### ✅ **Dashboard Pattern** (3 layouts)
- Sidebar + Navbar + Secondary Drawer
- Glassmorphism styling
- Used by: Dashboard, Settings, Exams

### ✅ **Minimal Pattern** (auth/public/company/legal)
- Root layout only
- No additional chrome
- Clean, focused content

### ✅ **Nested Pattern** (test-themes)
- Inherits dashboard layout
- Adds own navigation layer
- Container-based content

---

## Technology Stack

### Frameworks & Libraries
- **Next.js 15** - App Router
- **React 18** - UI library
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety

### State Management
- **Zustand** - Global state
- **Apollo Client** - GraphQL state
- **React Context** - Auth, Loading

### UI Components
- **Radix UI** - Primitives
- **ShadCN** - Component library
- **Lucide Icons** - Icon system

---

## File Structure Summary

```
frontend/web/src/app/
├── layout.tsx                          # Root Layout
├── (dashboard)/
│   ├── layout.tsx                      # Dashboard Layout
│   └── test-themes/layout.tsx          # Test Themes Layout
├── NextPhotonSettings/layout.tsx       # Settings Layout
├── TRAVAIL-PRACTISE-EXAMS/layout.tsx   # Exams Layout
├── (onboarding)/layout.tsx             # Onboarding Layout
├── (auth)/ (no layout)
├── (public)/ (no layout)
├── company/ (no layout)
├── legal/ (no layout)
└── api/ (REST & GraphQL)
```

---

## Quick Start Guide

### Understanding Layout Files

1. **Read:** `01-root-layout.md` - Understand global setup
2. **Read:** `02-dashboard-layout.md` - Main app structure
3. **Read:** `11-layout-inheritance.md` - How layouts compose

### Adding a New Page

```tsx
// 1. Choose route group
app/(dashboard)/my-page/page.tsx

// 2. Layout is automatic
export default function MyPage() {
  // Gets dashboard layout automatically
  return <div>My Page Content</div>
}
```

### Modifying a Layout

1. Find layout file (e.g., `(dashboard)/layout.tsx`)
2. Review documentation (e.g., `02-dashboard-layout.md`)
3. Make changes
4. Test across all routes using that layout

---

## Documentation Maintenance

### When to Update

- ✅ Adding new layouts
- ✅ Modifying existing layouts
- ✅ Adding/removing route groups
- ✅ Changing layout inheritance
- ✅ Adding special files

### How to Update

1. Update relevant `.md` file
2. Update this overview (`00-layouts-overview.md`)
3. Update `11-layout-inheritance.md` if structure changed
4. Commit with clear message

---

## Related Documentation

- **`/Project_Docs/pd-technical-architecture.md`** - Overall architecture
- **`/CLAUDE.md`** - Development guidelines
- **`/README.md`** - Project overview

---

## Support

For questions about layouts:
1. Check individual layout documentation files
2. Review `11-layout-inheritance.md` for composition
3. Check codebase comments in layout files

---

**Last Updated:** October 2, 2025
**Version:** 1.0
**Maintainer:** Development Team
