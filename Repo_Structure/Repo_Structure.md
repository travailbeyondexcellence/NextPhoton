# Repository Structure Documentation

> **Last Updated**: 2025-10-21 14:30
> **Maintained By**: Claude Code
> **Purpose**: Track and document the evolving structure of the NextPhoton repository

---

## 📋 INSTRUCTIONS FOR CLAUDE

**IMPORTANT**: This file must be kept up-to-date as the repository structure changes.

### When to Update This File

You MUST update this file whenever:
1. New folders are created in the repository
2. Folders are renamed or moved
3. Major file reorganization occurs
4. New component categories are added
5. Existing folders are deleted or merged
6. The user explicitly requests a structure update

### How to Update This File

1. Use the `Edit` tool to update the relevant sections
2. Update the "Last Updated" timestamp at the top
3. Add a changelog entry at the bottom with the date and changes made
4. Ensure the tree structure remains visually consistent and accurate

### Update Process

```bash
# Example commands to inspect current structure
ls -R frontend/web/src/components
tree -L 2 frontend/web/src/components  # if available
find frontend/web/src/components -type d -maxdepth 2
```

After any structural changes, read this file and update it accordingly.

---

## 🌲 Current Repository Structure

### Frontend Components Structure
**Location**: `/frontend/web/src/components`

```
components/
│
├── 📋 forms/ (3 files)
│   ├── CreateEducatorForm.tsx
│   ├── CreateGuardianForm.tsx
│   └── CreateLearnerForm.tsx
│
├── 📝 form-variants/ (1 file)
│   └── EditEducatorForm.tsx
│
├── 🧭 dashboard-navigation/ (6 files - 3 components + 3 docs)
│   ├── DashboardNavbar.tsx
│   ├── DashboardNavbar.md          ← Component documentation
│   ├── DashboardSidebar.tsx
│   ├── DashboardSidebar.md         ← Component documentation
│   ├── SecondarySidebarDrawer.tsx
│   └── SecondarySidebarDrawer.md   ← Component documentation
│
├── 👥 admin/
│   ├── educators/ (4 files)
│   │   ├── EducatorCard_forAdmin.tsx
│   │   ├── EducatorProfile_forAdmin.tsx
│   │   ├── EducatorsCardsView_forAdmin.tsx
│   │   └── EducatorsList_forAdmin.tsx
│   │
│   ├── guardians/ (3 files)
│   │   ├── GuardianCard_forAdmin.tsx
│   │   ├── GuardiansCardsView_forAdmin.tsx
│   │   └── GuardiansList_forAdmin.tsx
│   │
│   └── learners/ (3 files)
│       ├── LearnerCard_forAdmin.tsx
│       ├── LearnersCardsView_forAdmin.tsx
│       └── LearnersList_forAdmin.tsx
│
├── ⏳ loaders/ (4 files)
│   ├── GlobalLoader.tsx
│   ├── LoadingButton.tsx
│   ├── LoadingExample.tsx
│   └── MinimalisticLoader.tsx
│
├── 🎨 theme/ (3 files)
│   ├── ThemeProvider.tsx
│   ├── ThemeSelector.tsx
│   └── ThemeToggle.tsx
│
├── 🔧 utilities/ (2 files)
│   ├── LogoComponent.tsx
│   └── ProfileDropdown.tsx
│
├── ✨ animations/ (4 files)
│   ├── FadeIn.tsx
│   ├── Parallax.tsx
│   ├── ScrollReveal.tsx
│   └── StaggerChildren.tsx
│
├── 🪟 glass/ (6 files)
│   ├── GlassButton.tsx
│   ├── GlassCard.tsx
│   ├── GlassModal.tsx
│   ├── GlassNavbar.tsx
│   ├── GlassPanel.tsx
│   └── index.ts
│
├── 🏠 landing/ (7 files)
│   ├── FeaturesSection.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── Navbar.tsx
│   ├── PageLayout.tsx
│   ├── PricingSection.tsx
│   └── TestimonialsSection.tsx
│
├── 🎨 ui/ (shadcn/ui components)
│   ├── avatar.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── radio-group.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── slider.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   ├── textarea.tsx
│   └── tooltip.tsx
│
└── 🧪 examples/ (1 file)
    └── ApolloExample.tsx
```

---

## 📊 Folder Organization Principles

### Component Documentation Standard
Components in the `dashboard-navigation/` folder include companion `.md` files that document:
- Component purpose and functionality
- Dependencies and interactions
- State management
- Relationships with sister components
- Usage examples

**Format**: For each component `ComponentName.tsx`, there should be a `ComponentName.md` file in the same folder explaining how it works and interacts with other components.

### Folder Categories

| Folder | Purpose | Contains |
|--------|---------|----------|
| `forms/` | User creation forms | Create forms for all user types (Educator, Guardian, Learner) |
| `form-variants/` | Form variations | Edit/update forms and form variants |
| `dashboard-navigation/` | Dashboard navigation system | Navbar, Sidebar, Drawer components + docs |
| `admin/` | Admin-specific views | Organized by user type (educators, guardians, learners) |
| `loaders/` | Loading states & spinners | All loading-related UI components |
| `theme/` | Theme management | Theme provider, selector, toggle components |
| `utilities/` | Shared utilities | Reusable utility components used across features |
| `animations/` | Animation wrappers | Reusable animation components |
| `glass/` | Glassmorphism UI | Glass-styled components |
| `landing/` | Landing page sections | Marketing/public-facing page components |
| `ui/` | UI primitives | shadcn/ui component library |
| `examples/` | Example/demo components | Reference implementations |

---

## 🔄 Changelog

### 2025-10-21 (15:00) - Component Documentation Complete
- **Documented 19 components** with individual .md files
- **Documentation Pattern**: ComponentName.tsx → ComponentName.md
- **Folders Documented**:
  - ✅ `forms/` (3 .md files)
  - ✅ `form-variants/` (1 .md file)
  - ✅ `dashboard-navigation/` (3 .md files)
  - ✅ `admin/educators/` (4 .md files)
  - ✅ `admin/guardians/` (3 .md files)
  - ✅ `admin/learners/` (3 .md files)
  - ✅ `theme/` (3 .md files)
  - ✅ `utilities/` (2 .md files)
- **Total**: 22 documentation files created
- **Content**: Each .md file explains:
  - Component purpose and features
  - Dependencies and props
  - Interactions with sister components (same folder)
  - Interactions with parent components (different folders)
  - Interactions with child components
  - Data flow and state management
  - Common issues and future enhancements

### 2025-10-21 (14:30) - Component Reorganization Refinement
- **Created `form-variants/` folder** for form variations
  - Moved `EditEducatorForm.tsx` from `forms/` to `form-variants/`
  - `forms/` now contains only creation forms (3 files)
  - `form-variants/` contains edit/update forms (1 file)
- **Renamed `shared/` to `utilities/`** for clarity
  - Better reflects the purpose of utility components
  - Contains: LogoComponent.tsx, ProfileDropdown.tsx
- Updated folder organization table to reflect new structure

### 2025-10-21 (Initial) - Initial Structure Documentation
- **Initial structure documentation created**
- Organized root components into logical folders:
  - Created `forms/` for all form components
  - Created `dashboard-navigation/` with component documentation files (.md)
  - Created `admin/` with subfolders for educators, guardians, learners
  - Created `loaders/` for loading components
  - Created `theme/` for theme-related components
  - Created `shared/` for utility components
- Documented existing folders (animations, glass, landing, ui, examples)
- Established documentation standard: `.tsx` + `.md` companion files for complex components

---

## 📝 Notes

- All file moves were done using `git mv` to preserve git history
- Component documentation files (.md) are stored alongside their respective components
- The admin folder uses a nested structure to group related views by user type
- This structure follows a feature-based organization pattern for better scalability

---

## 🎯 Future Considerations

- Consider adding `.md` documentation files for other complex component folders
- May need to create additional admin subfolders as the application grows
- Consider adding a `hooks/` folder for custom React hooks if needed
- May benefit from a `layouts/` folder for page layout components
