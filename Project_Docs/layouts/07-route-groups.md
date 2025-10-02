# 7. ROUTE GROUPS

Route groups in Next.js (denoted by parentheses in folder names) organize routes without affecting the URL structure. They're used for shared layouts and logical organization.

## Overview

NextPhoton uses **5 route groups**:

```
app/
├── (auth)/          # Authentication flows
├── (dashboard)/     # Main application
├── (onboarding)/    # User onboarding
├── (public)/        # Public-facing pages
└── (features)/      # Type definitions (NOT routes)
```

---

## 1. (auth) - Authentication Routes

**Purpose:** User authentication and account management flows

**Layout:** None (uses root layout only)

**Routes:**
```
(auth)/
├── sign-in/
│   └── page.tsx           # Login page
├── sign-up/
│   └── page.tsx           # Registration page
├── signup/                # Detailed registration flows
│   ├── educator/
│   │   └── page.tsx      # Educator registration
│   ├── employee/
│   │   └── page.tsx      # Employee registration
│   ├── guardian/
│   │   └── page.tsx      # Guardian registration
│   ├── intern/
│   │   └── page.tsx      # Intern registration
│   └── learner/
│       └── page.tsx      # Learner registration
├── forgot-password/
│   └── page.tsx          # Password reset request
└── verify-email/
    └── page.tsx          # Email verification
```

### URLs:
- `/sign-in` - Login
- `/sign-up` - General signup
- `/signup/educator` - Role-specific signup
- `/signup/learner` - Role-specific signup
- `/forgot-password` - Password reset
- `/verify-email` - Email verification

### Design Characteristics:
- Clean, minimal layout
- No persistent navigation
- Focus on forms and authentication UI
- Full-width centered content
- Theme-aware styling

### Related Components:
- Authentication forms
- OAuth providers (if implemented)
- Email verification flows
- Password strength indicators

---

## 2. (dashboard) - Main Application

**Purpose:** Core application interface for authenticated users

**Layout:** `(dashboard)/layout.tsx` (Sidebar + Navbar)

**Routes:**
```
(dashboard)/
├── admin/                  # Admin-only routes
│   ├── academicplans/     # Academic planning
│   ├── educators/         # Educator management
│   ├── learners/          # Learner management
│   ├── guardians/         # Guardian management
│   ├── employees/         # Employee management
│   ├── interns/           # Intern management
│   ├── announcements/     # System announcements
│   ├── classSessions/     # Class scheduling
│   ├── performance/       # Analytics & reporting
│   └── ... (more admin routes)
│
├── educator/              # Educator dashboard
├── learner/               # Learner dashboard
├── guardian/              # Guardian dashboard
├── employee/              # Employee dashboard
│
├── profile/               # User profile
├── settings/              # User settings
├── help-support/          # Help center
├── apollo-demo/           # GraphQL demo
├── debug/                 # Debug tools
├── roleMenus/             # Menu configurations
└── test-themes/           # Theme testing (nested layout)
```

### URLs:
- `/admin/*` - Admin routes
- `/educator/*` - Educator routes
- `/learner/*` - Learner routes
- `/guardian/*` - Guardian routes
- `/profile` - User profile
- `/settings` - User settings

### Design Characteristics:
- Full dashboard layout with sidebar
- Persistent navigation
- Role-based menu items
- Glassmorphism effects
- Collapsible sidebar

### Access Control:
- Role-based routing
- Authentication required
- Permission checks via ABAC system

---

## 3. (onboarding) - User Onboarding

**Purpose:** New user setup and orientation flows

**Layout:** `(onboarding)/layout.tsx` (Minimal/empty)

**Files:**
```
(onboarding)/
├── layout.tsx                # Minimal wrapper
├── educatorOnboarding.tsx    # Educator setup
├── guardianOnboarding.tsx    # Guardian setup
└── learnerOnboarding.tsx     # Learner setup
```

**Note:** Current files are `.tsx` (components), not page routes. May be used as modal/drawer content in signup flows.

### Design Characteristics:
- Minimal chrome
- Step-by-step wizard interface
- Progress indicators
- Role-specific flows

---

## 4. (public) - Public Pages

**Purpose:** Publicly accessible content (no authentication required)

**Layout:** None (uses root layout only)

**Routes:**
```
(public)/
└── faqs/
    └── page.tsx    # Frequently Asked Questions
```

### URLs:
- `/faqs` - FAQ page

### Potential Future Routes:
- `/pricing` - Pricing information
- `/features` - Feature showcase
- `/testimonials` - User testimonials
- `/demo` - Product demo

### Design Characteristics:
- Clean, marketing-focused
- No authentication required
- SEO-optimized
- Call-to-action emphasis

---

## 5. (features) - Type Definitions

**Purpose:** Type definitions and shared utilities (NOT actual routes)

**Important:** This is NOT a route group for pages. It contains TypeScript type definitions.

**Structure:**
```
(features)/
├── AcademicPlans/
│   └── (type definitions)
├── Announcements/
│   └── announcement-types.ts    ✅ Type definitions
├── Attendance/
│   └── (type definitions)
├── ClassSessions/
│   └── (type definitions)
├── DailyStudyPlans/
│   └── (type definitions)
├── EduCareTasks/
│   └── educare-task-types.ts   ✅ Type definitions
├── HomeTasks/
│   └── (type definitions)
├── LearningActivities/
│   └── (type definitions)
├── NextPhotonSettings/
│   └── (type definitions)
├── Notifications/
│   └── (type definitions)
└── Performance/
    └── (type definitions)
```

### Purpose:
- **Type Safety** - TypeScript interfaces and types
- **Code Organization** - Feature-specific types grouped together
- **Import Convenience** - Centralized type imports

### Example:
```typescript
// Import types from features
import { type Announcement } from '@/app/(features)/Announcements/announcement-types'
import { type EduCareTask } from '@/app/(features)/EduCareTasks/educare-task-types'
```

### NOT Routes:
These do NOT create pages at URLs like `/features/announcements`. They're organizational folders for type definitions.

---

## Route Group Benefits

### 1. **URL Cleanliness**
```
✅ /sign-in (from (auth)/sign-in)
❌ /auth/sign-in (without route group)
```

### 2. **Layout Sharing**
All routes in `(dashboard)/` share the same sidebar/navbar layout without nesting URLs.

### 3. **Code Organization**
Logical grouping of related routes:
- Auth flows together
- Dashboard routes together
- Public pages together

### 4. **Selective Layouts**
Different route groups can have different layouts:
- `(auth)` - No layout (clean)
- `(dashboard)` - Full dashboard layout
- `(public)` - Marketing layout (if added)

### 5. **Access Control**
Easy to apply middleware/guards to entire route groups:
```typescript
// Middleware can check route groups
if (pathname.startsWith('/admin')) {
  // Require admin role
}
```

---

## Route Group Patterns

### Authentication Pattern:
```
(auth)/ → No persistent UI → Clean auth forms
```

### Application Pattern:
```
(dashboard)/ → Full UI chrome → Sidebar + Navbar
```

### Marketing Pattern:
```
(public)/ → Marketing UI → CTAs + SEO
```

### Utility Pattern:
```
(features)/ → Not routes → Type definitions
```

---

## Summary Table

| Route Group | Layout | Purpose | Authentication | URL Prefix |
|------------|--------|---------|----------------|------------|
| `(auth)` | None | Login/Signup | Not required | None |
| `(dashboard)` | Sidebar+Navbar | Main app | Required | None |
| `(onboarding)` | Minimal | User setup | Required | None |
| `(public)` | None | Public pages | Not required | None |
| `(features)` | N/A | Type definitions | N/A | N/A (not routes) |

---

## Code References

- `frontend/web/src/app/(auth)/` - Authentication routes
- `frontend/web/src/app/(dashboard)/` - Dashboard routes
- `frontend/web/src/app/(onboarding)/` - Onboarding flows
- `frontend/web/src/app/(public)/` - Public pages
- `frontend/web/src/app/(features)/` - Type definitions
