# 2. DASHBOARD LAYOUT

**Location:** `frontend/web/src/app/(dashboard)/layout.tsx`

## Purpose

Main application dashboard layout with sidebar navigation for authenticated users. This is the primary layout used throughout the NextPhoton application for all role-based dashboards.

## Visual Structure

```
┌─────────────────────────────────────────┐
│         DashboardNavbar (Top)           │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │    Main Content Area         │
│ (Fixed)  │    (Scrollable)              │
│          │                              │
│  288px   │    Dynamic Width             │
│          │    {children}                │
│          │                              │
└──────────┴──────────────────────────────┘
                          └─ SecondarySidebarDrawer (Right)
```

## Key Components

### 1. **SidebarProvider**
- Context provider for sidebar state management
- Controls sidebar open/close state
- Provides `open` state to child components

### 2. **DashboardSidebar** (`@/components/DashboardSidebar`)
- Left navigation sidebar (Fixed position)
- Width: `288px` (72 Tailwind units)
- Features:
  - Role-based menu items
  - Collapsible navigation
  - Smooth slide-in/out animation
  - Glassmorphism styling

### 3. **DashboardNavbar** (`@/components/DashboardNavbar`)
- Top navigation bar
- Features:
  - User profile dropdown
  - Notifications
  - Theme toggle
  - Sidebar toggle button
  - Search functionality

### 4. **SecondarySidebarDrawer** (`@/components/SecondarySidebarDrawer`)
- Right-side drawer for additional options
- Contextual actions and settings

## Styling & Design

### Glassmorphism Effects

#### Sidebar Styling:
```css
- backdrop-blur-xl (Strong blur effect)
- border-r border-white/10 (Semi-transparent border)
- theme-backdrop-blur (Theme-aware blur)
- sidebar-theme-gradient (Custom gradient)
```

#### Background System:
```css
- Fixed background with theme gradient
- Main section overlay for darkening
- Z-index layering for proper stacking
```

### Responsive Behavior

#### Sidebar States:
- **Open (`open = true`):**
  - `translate-x-0` - Visible
  - Main content: `ml-72` (Left margin 288px)

- **Closed (`open = false`):**
  - `-translate-x-full` - Hidden off-screen
  - Main content: `ml-0` (No margin)

#### Transitions:
```css
transition-transform duration-300 ease-in-out
transition-all duration-300
```

### Z-Index Layers:
```
z-0   → Background gradient
z-10  → Main content
z-50  → Sidebar (Fixed)
```

## Layout Structure

### Two-Component Pattern:

#### 1. **Outer Wrapper** - `Layout` Component
```tsx
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
```

**Purpose:**
- Provides `SidebarProvider` context
- Handles client-side mounting to prevent hydration issues
- Waits for client-side render before showing content

#### 2. **Inner Layout** - `LayoutWithSidebar` Component
```tsx
function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="flex w-screen h-screen overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-background" />

      {/* Sidebar */}
      <aside className={cn(...)}>
        <DashboardSidebar />
      </aside>

      {/* Main Content */}
      <div className={`...${open ? "ml-72" : "ml-0"}`}>
        <DashboardNavbar />
        <main className="flex-1 overflow-auto relative z-10">
          <div className="relative min-h-full">
            <div className="main-section-overlay"></div>
            <div className="relative z-10 p-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Secondary Drawer */}
      <SecondarySidebarDrawer />
    </div>
  );
}
```

**Purpose:**
- Uses sidebar state from context
- Renders sidebar, navbar, and content
- Applies conditional styling based on sidebar state

## Routes Using This Layout

```
(dashboard)/
├── admin/                    # Admin dashboard & management
│   ├── academicplans/       # Academic plan management
│   ├── allAdmins/           # Admin user management
│   ├── announcements/       # System announcements
│   ├── classSessions/       # Class session scheduling
│   ├── dailyStudyPlan/      # Daily study plans
│   ├── EducareTasks/        # EduCare task management
│   ├── educators/           # Educator management
│   │   ├── [educatorID]/   # Individual educator details
│   │   └── createNewEducator/ # Create new educator
│   ├── employees/           # Employee management
│   ├── feesManagement/      # Fee collection & tracking
│   ├── guardians/           # Guardian management
│   ├── HomeTasks/           # Home task assignments
│   ├── interns/             # Intern management
│   ├── learners/            # Learner management
│   ├── Notifications/       # Notification center
│   ├── performance/         # Performance analytics
│   │   ├── subject-analytics/
│   │   ├── individual-analytics/
│   │   ├── class-performance/
│   │   ├── scheduled-reports/
│   │   ├── export-data/
│   │   ├── custom-report-builder/
│   │   └── generate-report/
│   ├── studentAttendance/   # Attendance tracking
│   └── testFeatures/        # Feature testing
│
├── educator/                # Educator role dashboard
├── learner/                 # Learner role dashboard
├── guardian/                # Guardian role dashboard
├── employee/                # Employee role dashboard
│
├── profile/                 # User profile page
├── settings/                # User settings
├── help-support/            # Help & support center
├── apollo-demo/             # GraphQL demo page
├── debug/                   # Debug utilities
├── NextPhotonSettings/      # App-wide settings
├── roleMenus/               # Role menu configurations
└── test-themes/             # Theme testing lab (Has own nested layout)
```

## Theme Integration

### CSS Classes Used:
- `theme-backdrop-blur` - Theme-aware backdrop blur
- `theme-border-glass` - Glassmorphism border
- `sidebar-theme-gradient` - Sidebar gradient background
- `main-section-overlay` - Content area darkening overlay

### CSS Variables:
```css
--gradient-from
--gradient-via
--gradient-to
--background-gradient-opacity
--sidebar-gradient-from
--sidebar-gradient-via
--sidebar-gradient-to
--sidebar-gradient-opacity
```

## Overflow Handling

### Container:
```css
overflow-hidden (Prevents body scroll)
h-screen (Full viewport height)
w-screen (Full viewport width)
```

### Sidebar:
```css
overflow-y-auto (Scrollable sidebar content)
h-screen (Full height)
```

### Main Content:
```css
overflow-auto (Scrollable content area)
flex-1 (Takes remaining space)
min-h-full (Minimum full height)
```

## Client-Side Mounting

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

if (!mounted) return null;
```

**Purpose:**
- Prevents hydration mismatch errors
- Ensures client-side only rendering for sidebar state
- Waits for browser environment before rendering

## Code Reference

**File:** `frontend/web/src/app/(dashboard)/layout.tsx:1-73`

## Related Components

- `frontend/web/src/components/DashboardSidebar.tsx` - Sidebar navigation
- `frontend/web/src/components/DashboardNavbar.tsx` - Top navbar
- `frontend/web/src/components/SecondarySidebarDrawer.tsx` - Right drawer
- `frontend/web/src/components/ui/sidebar.tsx` - Sidebar primitives
- `frontend/web/src/lib/utils.ts` - cn() utility for classNames

## Design Patterns

### ✅ Compound Component Pattern
- SidebarProvider + useSidebar hook
- Shared state between sidebar and content

### ✅ Fixed + Fluid Layout
- Fixed sidebar width (288px)
- Fluid main content area

### ✅ Glassmorphism Design
- Backdrop blur effects
- Semi-transparent borders
- Gradient overlays

### ✅ Responsive Animations
- Smooth sidebar transitions
- Content area margin adjustments
- 300ms duration for all animations
