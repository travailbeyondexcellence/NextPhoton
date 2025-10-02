# 11. LAYOUT INHERITANCE & VISUALIZATION

This document provides a comprehensive view of how layouts inherit and compose throughout the NextPhoton application.

## Layout Hierarchy Tree

```
┌─────────────────────────────────────────────────────────────┐
│                    ROOT LAYOUT                              │
│                  app/layout.tsx                             │
│                                                             │
│  Providers: Loading, Auth, Apollo                          │
│  Global: Toasts, Loader, Theme, Font                       │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┬───────────────────┬──────────────┬─────────────┐
                │                       │                   │              │             │
        ┌───────▼───────┐       ┌──────▼──────┐    ┌──────▼─────┐  ┌─────▼────┐  ┌────▼────┐
        │  (dashboard)  │       │NextPhoton   │    │  TRAVAIL   │  │ (auth)   │  │ company │
        │    Layout     │       │  Settings   │    │   Exams    │  │ (public) │  │  legal  │
        │               │       │   Layout    │    │   Layout   │  │(onboard) │  │ logout  │
        └───────┬───────┘       └─────────────┘    └────────────┘  └──────────┘  └─────────┘
                │                                                    No Layout     No Layout
        ┌───────┴───────┐
        │               │
    ┌───▼───┐    ┌─────▼──────┐
    │ Pages │    │test-themes │
    │       │    │   Layout   │
    └───────┘    └────────────┘
                       │
                 ┌─────▼──────┐
                 │ Test Pages │
                 └────────────┘
```

---

## Layout Composition Patterns

### Pattern 1: Full Dashboard Experience

```
Root Layout
  → Dashboard Layout (Sidebar + Navbar)
      → Page Content
```

**Used By:**
- `/admin/*`
- `/educator/*`
- `/learner/*`
- `/guardian/*`
- `/profile`, `/settings`, `/help-support`

**Components:**
- DashboardSidebar (Left, 288px, collapsible)
- DashboardNavbar (Top)
- SecondarySidebarDrawer (Right)
- Main content area (scrollable)

---

### Pattern 2: Dashboard with Nested Layout

```
Root Layout
  → Dashboard Layout (Sidebar + Navbar)
      → Test Themes Layout (Header + Tabs)
          → Test Page Content
```

**Used By:**
- `/test-themes/*`

**Additional Components:**
- Theme testing header
- Tabbed navigation (7 tabs)
- Container-based content area

---

### Pattern 3: Settings Experience

```
Root Layout
  → NextPhoton Settings Layout (Sidebar + Navbar)
      → Settings Page
```

**Used By:**
- `/NextPhotonSettings/*`

**Note:** Nearly identical to dashboard layout, different route group

---

### Pattern 4: Exam Experience

```
Root Layout
  → TRAVAIL Exams Layout (Enhanced gradients)
      → Exam Page
```

**Used By:**
- `/TRAVAIL-PRACTISE-EXAMS/*`

**Enhanced Features:**
- Full CSS variable gradients
- Enhanced glassmorphism
- Main section overlay

---

### Pattern 5: Minimal/Clean

```
Root Layout
  → Page Content
```

**Used By:**
- `/(auth)/*` - Authentication pages
- `/(public)/*` - Public pages
- `/company/*` - Company pages
- `/legal/*` - Legal documents
- `/logout` - Logout handler

**Characteristics:**
- No additional layout chrome
- Clean, focused content
- Full-width pages

---

### Pattern 6: Onboarding Flow

```
Root Layout
  → Onboarding Layout (Empty/Minimal)
      → Onboarding Steps
```

**Used By:**
- `/(onboarding)/*`

**Current:** Empty wrapper (future step-based navigation)

---

## Component Inheritance Map

### What Each Layout Provides

#### Root Layout Provides:
```
✅ Inter font
✅ Theme system (Dark/Light)
✅ LoadingProvider
✅ AuthProvider
✅ ApolloProvider
✅ GlobalLoader
✅ ToastContainer
✅ Toaster (Sonner)
✅ Global CSS
✅ Metadata/SEO
```

#### Dashboard Layout Adds:
```
✅ SidebarProvider
✅ DashboardSidebar
✅ DashboardNavbar
✅ SecondarySidebarDrawer
✅ Glassmorphism styling
✅ Responsive sidebar behavior
✅ Theme gradients
```

#### Test Themes Layout Adds:
```
✅ Theme testing header
✅ Tabbed navigation
✅ Container wrapper
✅ Active tab highlighting
```

#### NextPhoton Settings Layout Adds:
```
✅ Same as dashboard
✅ (Simpler gradient system)
```

#### TRAVAIL Exams Layout Adds:
```
✅ Same as dashboard
✅ Enhanced CSS variable gradients
✅ Main section overlay
✅ Full viewport background
```

---

## Provider Nesting Visualization

```
<html>
  <ThemeScript />
  <body>
    <LoadingProvider>
      <AuthProvider>
        <ApolloProvider>
          <SidebarProvider>              ← Only in dashboard layouts
            <Layout Components>
              {children}
            </Layout Components>
          </SidebarProvider>
          <GlobalLoader />
        </ApolloProvider>
      </AuthProvider>
    </LoadingProvider>
    <ToastContainer />
    <Toaster />
  </body>
</html>
```

---

## Z-Index Layers

### Dashboard Layouts (3 layers):
```
z-0   → Background gradient (fixed)
z-10  → Main content area
z-50  → Sidebar (fixed)
```

### All Other Layouts (1 layer):
```
z-auto → Content (default stacking)
```

---

## Responsive Behavior by Layout

### Dashboard Layouts:
```css
/* Sidebar States */
Open:   translate-x-0, ml-72 (content)
Closed: -translate-x-full, ml-0 (content)

/* Breakpoints */
All screens: Slide-in/out animation (300ms)
```

### Other Layouts:
```css
/* Standard responsive container */
container mx-auto px-6 py-8
```

---

## Styling Inheritance

### CSS Variables Cascade:

```
Root Level (globals.css)
  ├── --background
  ├── --foreground
  ├── --primary
  ├── --gradient-from/via/to
  ├── --sidebar-gradient-from/via/to
  └── ... (all theme variables)

Dashboard Layouts Use:
  ✅ All root variables
  ✅ Gradient variables
  ✅ Custom overlay classes

Other Layouts Use:
  ✅ Only root variables
  ❌ No custom overlay classes
```

---

## Layout Selection Flow Chart

```
Is page authenticated?
  │
  ├─ NO → Use minimal layout
  │         └─ (auth), (public), company, legal
  │
  └─ YES → Which role/section?
            │
            ├─ Admin/User Dashboard
            │   └─ Dashboard Layout
            │       └─ Is theme testing?
            │           ├─ YES → Test Themes Layout
            │           └─ NO  → Direct page
            │
            ├─ Settings
            │   └─ NextPhoton Settings Layout
            │
            ├─ Exams
            │   └─ TRAVAIL Exams Layout
            │
            └─ Onboarding
                └─ Onboarding Layout
```

---

## Layout File Locations

```
app/
├── layout.tsx                               # Root (All)
├── (dashboard)/
│   ├── layout.tsx                          # Dashboard
│   └── test-themes/
│       └── layout.tsx                      # Test Themes (nested)
├── NextPhotonSettings/
│   └── layout.tsx                          # Settings
├── TRAVAIL-PRACTISE-EXAMS/
│   └── layout.tsx                          # Exams
└── (onboarding)/
    └── layout.tsx                          # Onboarding
```

---

## Performance Considerations

### Layout Persistence:
- ✅ **Layouts** persist across navigation (single instance)
- ✅ **Templates** re-render on navigation (new instance)

### Mount/Unmount:
```
Navigation within same layout:
  - Layout: ❌ Does not re-mount
  - Page:   ✅ Re-mounts

Navigation between layouts:
  - Old layout: ✅ Unmounts
  - New layout: ✅ Mounts
  - Page:       ✅ Mounts
```

### Client-Side Mounting:
Dashboard layouts use client-side mounting:
```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

**Reason:** Prevents hydration mismatch with sidebar state

---

## Migration & Future Considerations

### Adding New Layouts:
1. Create layout file in appropriate route group
2. Import shared components (Sidebar, Navbar, etc.)
3. Add theme variables if needed
4. Update this documentation

### Removing Layouts:
1. Merge routes into existing layouts
2. Remove layout file
3. Update route group structure
4. Test navigation flows

### Modifying Shared Components:
Components used across layouts:
- DashboardSidebar
- DashboardNavbar
- SecondarySidebarDrawer

**Impact:** Changes affect all dashboard-style layouts

---

## Summary Table

| Layout | File Path | Sidebar | Navbar | Gradients | Nested | Routes |
|--------|-----------|---------|--------|-----------|--------|--------|
| Root | app/layout.tsx | ❌ | ❌ | ❌ | No | All |
| Dashboard | (dashboard)/layout.tsx | ✅ | ✅ | ✅ | No | Dashboard/* |
| Test Themes | (dashboard)/test-themes/layout.tsx | ✅ | ✅ | ✅ | Yes | test-themes/* |
| Settings | NextPhotonSettings/layout.tsx | ✅ | ✅ | Simple | No | Settings/* |
| Exams | TRAVAIL-PRACTISE-EXAMS/layout.tsx | ✅ | ✅ | Enhanced | No | Exams/* |
| Onboarding | (onboarding)/layout.tsx | ❌ | ❌ | ❌ | No | Onboarding/* |

---

## Code References

- `frontend/web/src/app/layout.tsx` - Root layout
- `frontend/web/src/app/(dashboard)/layout.tsx` - Dashboard layout
- `frontend/web/src/app/(dashboard)/test-themes/layout.tsx` - Test themes
- `frontend/web/src/app/NextPhotonSettings/layout.tsx` - Settings
- `frontend/web/src/app/TRAVAIL-PRACTISE-EXAMS/layout.tsx` - Exams
- `frontend/web/src/app/(onboarding)/layout.tsx` - Onboarding
- `frontend/web/src/components/DashboardSidebar.tsx` - Shared sidebar
- `frontend/web/src/components/DashboardNavbar.tsx` - Shared navbar
