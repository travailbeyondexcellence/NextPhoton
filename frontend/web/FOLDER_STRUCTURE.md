# NextPhoton Frontend Folder Structure

## Current Directory Structure

```
frontend/web/src/
├── app/                         # Next.js 15 App Router
│   ├── (auth)/                 # Authentication routes (grouped)
│   │   ├── [[...sign-in]]/    # Dynamic sign-in route
│   │   ├── signup/             # Registration pages
│   │   │   ├── educator/
│   │   │   ├── employee/
│   │   │   ├── guardian/
│   │   │   ├── intern/
│   │   │   └── learner/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   │
│   ├── (dashboard)/            # Protected dashboard routes (grouped)
│   │   ├── admin/              # Admin dashboard
│   │   ├── educator/           # Educator dashboard
│   │   ├── employee/           # Employee dashboard
│   │   ├── guardian/           # Guardian dashboard
│   │   ├── learner/            # Learner dashboard
│   │   └── roleMenus/          # Role-specific menus
│   │
│   ├── (features)/             # Feature modules (grouped)
│   │   ├── AcademicPlans/
│   │   ├── Announcements/
│   │   ├── ClassSessions/
│   │   ├── DailyStudyPlans/
│   │   ├── EduCareTasks/
│   │   ├── HomeTasks/
│   │   ├── NextPhotonSettings/
│   │   ├── Notifications/
│   │   └── Performance/
│   │
│   ├── (onboarding)/           # Onboarding flows (grouped)
│   │   ├── educatorOnboarding.tsx/
│   │   ├── guardianOnboarding.tsx/
│   │   └── learnerOnboarding.tsx/
│   │
│   ├── (public)/               # Public pages (grouped)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── faqs/
│   │   ├── privacy/
│   │   └── terms/
│   │
│   ├── api/                    # API routes
│   │   ├── themes/
│   │   └── users/
│   │
│   ├── sign-in/                # Alternative sign-in route
│   ├── test-graphql/           # GraphQL testing page
│   ├── layout.tsx              # Root layout
│   ├── not-found.tsx           # 404 page
│   └── ⚠️ **page.tsx (MISSING)**  # Landing page
│
├── components/                  # Reusable components
│   ├── ui/                     # UI components (shadcn/ui)
│   ├── DashboardSidebar.tsx
│   ├── DashboardNavbar.tsx
│   ├── LogoComponent.tsx
│   └── glass.tsx               # Glassmorphism components
│
├── lib/                        # Utilities and configurations
│   ├── auth-client.ts          # Authentication client
│   ├── auth-schema.ts          # Auth validation schemas
│   ├── formValidationSchemas.ts
│   ├── routeAccessMap.ts       # ABAC route control
│   └── utils.ts
│
├── hooks/                      # Custom React hooks
│   ├── use-session.tsx
│   └── use-toast.ts
│
├── contexts/                   # React contexts
│   └── AuthContext.tsx
│
└── statestore/                 # Global state (Zustand)
    └── store.ts
```

## ⚠️ IMPORTANT: No Landing Page Found!

**The application is missing a landing page (`frontend/web/src/app/page.tsx`)**

When users visit the root URL (`/`), there's no page to display. We need to create:
1. `frontend/web/src/app/page.tsx` - Main landing page

## Route Structure

### Public Routes
- `/` - Landing page (MISSING - needs to be created)
- `/sign-in` or `/signin` - Sign in page
- `/signup` - Sign up page with role selection
- `/signup/[role]` - Role-specific signup
- `/about` - About page
- `/contact` - Contact page
- `/faqs` - FAQs
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Protected Routes (requires authentication)
- `/admin` - Admin dashboard
- `/educator` - Educator dashboard
- `/learner` - Learner dashboard
- `/guardian` - Guardian dashboard
- `/employee` - Employee dashboard

### Feature Routes (nested under dashboards)
- `/[role]/academic-plans`
- `/[role]/announcements`
- `/[role]/class-sessions`
- `/[role]/daily-study-plans`
- `/[role]/tasks`
- `/[role]/notifications`
- `/[role]/performance`
- `/[role]/settings`

## Files to Create for Landing Page

1. **Main Landing Page**: `frontend/web/src/app/page.tsx`
2. **Hero Section Component**: `frontend/web/src/components/landing/HeroSection.tsx`
3. **Features Section**: `frontend/web/src/components/landing/FeaturesSection.tsx`
4. **Testimonials**: `frontend/web/src/components/landing/TestimonialsSection.tsx`
5. **Pricing**: `frontend/web/src/components/landing/PricingSection.tsx`
6. **CTA Section**: `frontend/web/src/components/landing/CTASection.tsx`
7. **Footer**: `frontend/web/src/components/landing/Footer.tsx`

## Animation Components to Create (with Framer Motion)

1. **Fade In Animation**: `frontend/web/src/components/animations/FadeIn.tsx`
2. **Slide In Animation**: `frontend/web/src/components/animations/SlideIn.tsx`
3. **Scale Animation**: `frontend/web/src/components/animations/Scale.tsx`
4. **Parallax Effect**: `frontend/web/src/components/animations/Parallax.tsx`
5. **Stagger Children**: `frontend/web/src/components/animations/StaggerChildren.tsx`
6. **Scroll Reveal**: `frontend/web/src/components/animations/ScrollReveal.tsx`

## Next Steps

1. Run `bun install` to install Framer Motion
2. Create the landing page structure
3. Implement animation components
4. Add animations to existing pages
5. Create smooth page transitions