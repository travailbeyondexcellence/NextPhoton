# Dashboard Navigation Architecture

> **Last Updated**: 2025-10-21
> **Components**: DashboardNavbar, DashboardSidebar, SecondarySidebarDrawer
> **Purpose**: Visual architecture documentation for the three-tier navigation system

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Component Hierarchy](#component-hierarchy)
3. [Data Flow Architecture](#data-flow-architecture)
4. [User Interaction Sequences](#user-interaction-sequences)
5. [State Management](#state-management)
6. [Technical Dependencies](#technical-dependencies)
7. [Event Flow Diagrams](#event-flow-diagrams)

---

## 🏗️ System Overview

The dashboard navigation system implements a **three-tier architecture** with progressive disclosure:

```mermaid
graph TB
    subgraph "Navigation System"
        L[Dashboard Layout] --> N[Tier 1: DashboardNavbar]
        L --> S[Tier 2: DashboardSidebar]
        S --> D[Tier 3: SecondarySidebarDrawer]
    end

    subgraph "State Management"
        Z[Zustand Store] -.->|open/setOpen| S
        Z -.->|selectedCategory| D
    end

    subgraph "UI Controls"
        N --> T[SidebarTrigger]
        N --> TS[ThemeSelector]
        N --> P[ProfileDropdown]
    end

    T -.->|toggle| Z

    style L fill:#e1f5ff
    style N fill:#fff4e6
    style S fill:#e8f5e9
    style D fill:#f3e5f5
    style Z fill:#ffe0b2
```

**Navigation Tiers:**
- **Tier 1 (Navbar)**: Top-level controls (hamburger, theme, profile)
- **Tier 2 (Sidebar)**: Main navigation menu (Admin, Educators, Guardians, Learners)
- **Tier 3 (Drawer)**: Category-specific sub-navigation (appears on hover/click)

---

## 🌳 Component Hierarchy

```mermaid
graph TD
    Root[App Root Layout] --> LP[LoadingProvider]
    LP --> SP[SidebarProvider]
    SP --> DL[Dashboard Layout]

    DL --> Navbar[DashboardNavbar]
    DL --> Sidebar[DashboardSidebar]
    DL --> Drawer[SecondarySidebarDrawer]
    DL --> Main[Main Content Area]

    subgraph "DashboardNavbar Components"
        Navbar --> Trigger[SidebarTrigger]
        Navbar --> Theme[ThemeSelector]
        Navbar --> Profile[ProfileDropdown]
    end

    subgraph "DashboardSidebar Components"
        Sidebar --> Logo[LogoComponent]
        Sidebar --> NavItems[Navigation Items]
        NavItems --> AdminNav[Admin]
        NavItems --> EduNav[Educators]
        NavItems --> GuardNav[Guardians]
        NavItems --> LearnNav[Learners]
    end

    subgraph "SecondarySidebarDrawer Content"
        Drawer --> AdminContent[Admin Category Content]
        Drawer --> EduContent[Educators Category Content]
        Drawer --> GuardContent[Guardians Category Content]
        Drawer --> LearnContent[Learners Category Content]
    end

    style DL fill:#e3f2fd
    style Navbar fill:#fff3e0
    style Sidebar fill:#e8f5e9
    style Drawer fill:#f3e5f5
```

**Component Relationships:**
- **Parent → Child**: Layout wraps all navigation components
- **Sibling Communication**: Via Zustand store (sidebar state)
- **Event Propagation**: Click/Hover → State Update → UI Re-render

---

## 🔄 Data Flow Architecture

### Props & State Flow

```mermaid
flowchart TD
    subgraph "Context Providers"
        SP[SidebarProvider<br/>from shadcn/ui]
        ZS[Zustand Store<br/>useSidebarStore]
    end

    subgraph "DashboardNavbar Data"
        NT[No Props] --> NH[useSidebar Hook]
        NH --> NTrigger[SidebarTrigger<br/>Controls sidebar]
    end

    subgraph "DashboardSidebar Data"
        ST[No Props] --> SH[useSidebar Hook]
        SH --> SOpen{open: boolean}
        SOpen --> SRender[Conditional Rendering]

        SH2[useSidebarStore Hook] --> SCat{selectedCategory}
        SCat --> SHover[Hover State]
    end

    subgraph "SecondarySidebarDrawer Data"
        DT[No Props] --> DH[useSidebarStore Hook]
        DH --> DCat{selectedCategory}
        DCat --> DRender[Category-based Content]

        DH2[useSidebar Hook] --> DOpen{open: boolean}
        DOpen --> DShow[Show if sidebar open]
    end

    SP -.->|provides| NH
    SP -.->|provides| SH
    SP -.->|provides| DH2

    ZS -.->|provides| SH2
    ZS -.->|provides| DH

    style SP fill:#bbdefb
    style ZS fill:#ffe0b2
```

### State Updates Flow

```mermaid
flowchart LR
    A[User Action] --> B{Action Type}

    B -->|Click Hamburger| C[SidebarTrigger]
    C --> D[useSidebar.setOpen]
    D --> E[SidebarProvider State]
    E --> F[DashboardSidebar<br/>Re-renders]

    B -->|Hover Nav Item| G[Navigation Item]
    G --> H[setSelectedCategory]
    H --> I[Zustand Store]
    I --> J[SecondarySidebarDrawer<br/>Re-renders]

    B -->|Mouse Leave| K[Sidebar Container]
    K --> L[setSelectedCategory null]
    L --> I

    style E fill:#c8e6c9
    style I fill:#fff9c4
```

---

## 👆 User Interaction Sequences

### Sequence 1: Opening Sidebar

```mermaid
sequenceDiagram
    participant U as User
    participant N as DashboardNavbar
    participant T as SidebarTrigger
    participant P as SidebarProvider
    participant S as DashboardSidebar

    U->>N: Clicks hamburger icon
    N->>T: Click event
    T->>P: setOpen(!open)
    P->>P: Update state
    P->>S: Trigger re-render
    S->>S: Animate translate-x
    Note over S: Sidebar slides in from left
    S-->>U: Sidebar visible
```

### Sequence 2: Navigating with Secondary Drawer

```mermaid
sequenceDiagram
    participant U as User
    participant S as DashboardSidebar
    participant Z as Zustand Store
    participant D as SecondarySidebarDrawer
    participant R as Router

    U->>S: Hovers over "Admin"
    S->>Z: setSelectedCategory('admin')
    Z->>D: selectedCategory updated
    D->>D: Render admin content
    Note over D: Drawer appears with admin submenu
    D-->>U: Shows submenu options

    U->>D: Clicks "All Admins"
    D->>R: router.push('/admin/allAdmins')
    R->>R: Navigate to page
    D->>Z: setSelectedCategory(null)
    Note over D: Drawer closes
```

### Sequence 3: Theme Change Flow

```mermaid
sequenceDiagram
    participant U as User
    participant N as DashboardNavbar
    participant T as ThemeSelector
    participant TH as ThemeProvider
    participant APP as Application

    U->>N: Clicks theme selector
    N->>T: Open dropdown
    T-->>U: Show theme options

    U->>T: Selects "Midnight Blue"
    T->>TH: setTheme('midnight-blue')
    TH->>TH: Update theme context
    TH->>APP: Trigger re-render
    APP->>APP: Apply new CSS variables
    Note over APP: All components update<br/>with new theme colors
```

---

## 🔧 State Management

### Zustand Store Structure

```mermaid
graph TB
    subgraph "useSidebarStore"
        State[Store State]
        State --> SC[selectedCategory: string | null]
        State --> SSC[setSelectedCategory: function]
    end

    subgraph "State Values"
        SC --> Null[null - No drawer]
        SC --> Admin["'admin' - Admin drawer"]
        SC --> Edu["'educators' - Educators drawer"]
        SC --> Guard["'guardians' - Guardians drawer"]
        SC --> Learn["'learners' - Learners drawer"]
    end

    subgraph "Actions"
        SSC --> Set[Set category on hover]
        SSC --> Clear[Clear on mouse leave]
        SSC --> Navigate[Clear on navigation]
    end

    style State fill:#fff3e0
```

### State Transitions

```mermaid
stateDiagram-v2
    [*] --> SidebarClosed

    SidebarClosed --> SidebarOpen : Click SidebarTrigger
    SidebarOpen --> SidebarClosed : Click SidebarTrigger

    state SidebarOpen {
        [*] --> NoDrawer
        NoDrawer --> AdminDrawer : Hover Admin
        NoDrawer --> EducatorsDrawer : Hover Educators
        NoDrawer --> GuardiansDrawer : Hover Guardians
        NoDrawer --> LearnersDrawer : Hover Learners

        AdminDrawer --> NoDrawer : Mouse Leave
        EducatorsDrawer --> NoDrawer : Mouse Leave
        GuardiansDrawer --> NoDrawer : Mouse Leave
        LearnersDrawer --> NoDrawer : Mouse Leave

        AdminDrawer --> [*] : Click submenu item
        EducatorsDrawer --> [*] : Click submenu item
        GuardiansDrawer --> [*] : Click submenu item
        LearnersDrawer --> [*] : Click submenu item
    }
```

---

## 🔌 Technical Dependencies

```mermaid
graph LR
    subgraph "DashboardNavbar"
        N1[DashboardNavbar.tsx]
        N1 --> N2[@/components/ui/sidebar]
        N1 --> N3[@/components/theme/ThemeSelector]
        N1 --> N4[@/components/utilities/ProfileDropdown]
        N1 --> N5[@/components/glass/GlassNavbar]
    end

    subgraph "DashboardSidebar"
        S1[DashboardSidebar.tsx]
        S1 --> S2[@/components/ui/sidebar]
        S1 --> S3[@/components/utilities/LogoComponent]
        S1 --> S4[zustand]
        S1 --> S5[next/navigation]
        S1 --> S6[lucide-react]
    end

    subgraph "SecondarySidebarDrawer"
        D1[SecondarySidebarDrawer.tsx]
        D1 --> D2[@/components/ui/sidebar]
        D1 --> D3[@/components/ui/sheet]
        D1 --> D4[zustand]
        D1 --> D5[next/navigation]
        D1 --> D6[lucide-react]
    end

    subgraph "External Libraries"
        shadcn[shadcn/ui]
        zustand[Zustand]
        nextjs[Next.js]
        lucide[Lucide Icons]
    end

    N2 --> shadcn
    S2 --> shadcn
    D2 --> shadcn
    D3 --> shadcn

    S4 --> zustand
    D4 --> zustand

    S5 --> nextjs
    D5 --> nextjs

    S6 --> lucide
    D6 --> lucide

    style shadcn fill:#e1f5fe
    style zustand fill:#fff9c4
    style nextjs fill:#e8f5e9
    style lucide fill:#f3e5f5
```

---

## ⚡ Event Flow Diagrams

### Complete User Journey

```mermaid
flowchart TD
    Start[User Opens Dashboard] --> CheckSidebar{Sidebar Open?}

    CheckSidebar -->|No| ClickHamburger[Click Hamburger Icon]
    CheckSidebar -->|Yes| SidebarVisible[Sidebar Visible]

    ClickHamburger --> OpenSidebar[Sidebar Slides In]
    OpenSidebar --> SidebarVisible

    SidebarVisible --> HoverItem{Hover Nav Item?}

    HoverItem -->|Yes| ShowDrawer[Secondary Drawer Appears]
    HoverItem -->|No| Wait[Wait for Action]

    ShowDrawer --> DrawerContent[Category-specific Content Shows]
    DrawerContent --> UserAction{User Action?}

    UserAction -->|Click Submenu| Navigate[Navigate to Page]
    UserAction -->|Mouse Leave| CloseDrawer[Drawer Closes]
    UserAction -->|Click Different Item| ChangeCategory[Switch Category]

    Navigate --> CloseDrawer
    ChangeCategory --> ShowDrawer

    CloseDrawer --> Wait

    Wait --> ClickHamburger2{Close Sidebar?}
    ClickHamburger2 -->|Yes| CloseSidebar[Sidebar Slides Out]
    ClickHamburger2 -->|No| HoverItem

    CloseSidebar --> End[Navigation Complete]
    Navigate --> End

    style Start fill:#c8e6c9
    style End fill:#ffcdd2
    style ShowDrawer fill:#fff9c4
    style Navigate fill:#e1bee7
```

### Responsive Behavior Flow

```mermaid
flowchart LR
    subgraph "Desktop View"
        D1[Sidebar: Fixed Left] --> D2[Navbar: Top Bar]
        D2 --> D3[Drawer: Absolute Position]
        D3 --> D4[All Three Visible]
    end

    subgraph "Mobile View"
        M1[Sidebar: Hidden by Default] --> M2[Navbar: Full Width]
        M2 --> M3[Hamburger: Visible]
        M3 --> M4[Click Opens Sidebar]
        M4 --> M5[Overlay Background]
    end

    subgraph "Transitions"
        T1[transform: translateX] --> T2[transition: 300ms]
        T2 --> T3[ease-in-out]
    end

    style D4 fill:#e8f5e9
    style M5 fill:#fff3e0
```

---

## 📊 Navigation Menu Structure

```mermaid
graph TD
    Root[Dashboard Root] --> Admin[Admin]
    Root --> Educators[Educators]
    Root --> Guardians[Guardians]
    Root --> Learners[Learners]

    Admin --> A1[All Admins]
    Admin --> A2[Employees]
    Admin --> A3[Interns]
    Admin --> A4[Fees Management]

    Educators --> E1[All Educators]
    Educators --> E2[Create Educator]
    Educators --> E3[Educator Profile]

    Guardians --> G1[All Guardians]
    Guardians --> G2[Create Guardian]

    Learners --> L1[All Learners]
    Learners --> L2[Create Learner]

    style Root fill:#e3f2fd
    style Admin fill:#ffecb3
    style Educators fill:#c8e6c9
    style Guardians fill:#f8bbd0
    style Learners fill:#d1c4e9
```

---

## 🎨 Component Communication Pattern

```mermaid
graph TB
    subgraph "Communication Layers"
        Layer1[Layer 1: Direct Props]
        Layer2[Layer 2: Context/Provider]
        Layer3[Layer 3: Zustand Store]
        Layer4[Layer 4: Router Events]
    end

    Layer1 --> Example1[Parent → Child Props]
    Layer2 --> Example2[SidebarProvider → useSidebar]
    Layer3 --> Example3[Store → selectedCategory]
    Layer4 --> Example4[Navigation → URL Change]

    subgraph "Usage in Navigation"
        U1[DashboardNavbar] -.->|Layer 2| U2[SidebarTrigger]
        U3[DashboardSidebar] -.->|Layer 3| U4[SecondarySidebarDrawer]
        U5[All Components] -.->|Layer 4| U6[Next.js Router]
    end

    style Layer1 fill:#e1f5fe
    style Layer2 fill:#f3e5f5
    style Layer3 fill:#fff9c4
    style Layer4 fill:#ffccbc
```

---

## 📝 Summary

### Architecture Highlights

✅ **Three-Tier Design**: Progressive disclosure pattern (Navbar → Sidebar → Drawer)
✅ **State Management**: Hybrid approach (SidebarProvider + Zustand)
✅ **Responsive**: Mobile-first with transform animations
✅ **Type-Safe**: Full TypeScript integration
✅ **Accessible**: Keyboard navigation and ARIA support
✅ **Themeable**: Integrates with theme system

### Key Design Patterns

- **Provider Pattern**: SidebarProvider wraps layout
- **Custom Hook Pattern**: useSidebar, useSidebarStore
- **Render Props Pattern**: Conditional rendering based on state
- **Observer Pattern**: State changes trigger re-renders
- **Progressive Disclosure**: Three-tier navigation reveals details gradually

### Performance Optimizations

- **CSS Transforms**: Hardware-accelerated animations
- **Conditional Rendering**: Only render active drawer content
- **Event Delegation**: Efficient hover/click handling
- **Lazy Loading**: Components load on-demand
- **Memoization**: Prevent unnecessary re-renders

---

**Last Updated**: 2025-10-21
**Documentation Version**: 1.0
**Maintained By**: Development Team
