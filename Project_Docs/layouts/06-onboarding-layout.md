# 6. ONBOARDING LAYOUT

**Location:** `frontend/web/src/app/(onboarding)/layout.tsx`

## Purpose

Minimal layout for user onboarding flows. Provides a clean, distraction-free environment for new user registration and setup processes.

## Current Implementation

**Status:** Empty/Minimal (Single line file)

The onboarding layout file currently contains only:
```tsx
export default function OnboardingLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
```

## Routes Using This Layout

```
(onboarding)/
├── educatorOnboarding.tsx    # Educator setup flow
├── guardianOnboarding.tsx    # Guardian setup flow
└── learnerOnboarding.tsx     # Learner setup flow
```

**Note:** These files appear to be TypeScript files (.tsx) rather than page routes, suggesting they may be components used elsewhere.

## Design Philosophy

### ✅ **Minimal Chrome**
- No sidebar
- No persistent navigation
- No dashboard UI elements

### ✅ **Focus on Content**
- Full-width content area
- Clean background
- Step-by-step flow emphasis

### ✅ **Inherits from Root**
- Gets authentication context
- Gets theme system
- Gets global providers
- Gets toast notifications

## Typical Onboarding Layout Pattern

For a more complete onboarding experience, this layout would typically include:

```tsx
export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Optional: Progress indicator */}
      {/* Optional: Logo/branding */}

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Optional: Footer with help links */}
    </div>
  );
}
```

## Potential Enhancements

### 1. **Progress Indicator**
```tsx
<OnboardingProgress currentStep={step} totalSteps={5} />
```
- Visual step tracker
- Shows user's position in onboarding flow
- Provides context and reduces anxiety

### 2. **Branding Header**
```tsx
<header className="border-b border-border py-4">
  <div className="container mx-auto px-4">
    <Logo />
  </div>
</header>
```
- Company logo
- Minimal branding
- Optional help/support link

### 3. **Step Navigation**
```tsx
<nav className="flex justify-between mt-8">
  <Button onClick={goBack}>Back</Button>
  <Button onClick={goNext}>Next</Button>
</nav>
```
- Back/Next buttons
- Skip options
- Save and continue later

### 4. **Role-Specific Layouts**
```tsx
// Different layouts for different user types
const layoutConfig = {
  educator: { theme: 'blue', icon: '👨‍🏫' },
  learner: { theme: 'green', icon: '👨‍🎓' },
  guardian: { theme: 'purple', icon: '👨‍👩‍👧‍👦' }
}
```

## Current Usage

Based on the file structure, onboarding components exist as:
- `educatorOnboarding.tsx`
- `guardianOnboarding.tsx`
- `learnerOnboarding.tsx`

These are likely:
1. **Imported components** used in signup flows
2. **Multi-step form components**
3. **Modal/drawer content** for onboarding

## Recommended Structure

For a complete onboarding system:

```
(onboarding)/
├── layout.tsx                 # Minimal layout
├── [role]/                    # Dynamic role-based routes
│   ├── step-1/
│   │   └── page.tsx          # Step 1: Basic info
│   ├── step-2/
│   │   └── page.tsx          # Step 2: Preferences
│   ├── step-3/
│   │   └── page.tsx          # Step 3: Setup
│   └── complete/
│       └── page.tsx          # Completion page
└── components/
    ├── OnboardingProgress.tsx
    ├── OnboardingHeader.tsx
    └── OnboardingNavigation.tsx
```

## Layout Inheritance

```
Root Layout (Auth, Theme, Providers)
  └── Onboarding Layout (Minimal wrapper)
      └── Onboarding Pages (Step-by-step content)
```

**What it gets:**
- ✅ Theme system (Dark/Light mode)
- ✅ Authentication context
- ✅ Toast notifications
- ✅ Global loader
- ✅ Apollo GraphQL client

**What it doesn't add:**
- ❌ No sidebar
- ❌ No navbar
- ❌ No additional chrome

## Styling Considerations

### Clean Background:
```css
min-h-screen      # Full viewport height
bg-background     # Theme-aware background color
```

### Centered Content:
```css
container mx-auto  # Centered responsive container
px-4 py-8         # Comfortable padding
```

### Focus States:
```css
# Emphasized form inputs
# Clear call-to-action buttons
# Helpful validation messages
```

## Best Practices for Onboarding

### 1. **Progressive Disclosure**
- Show information as needed
- Don't overwhelm with too many fields
- Use multi-step forms

### 2. **Clear Progress**
- Show current step
- Indicate total steps
- Allow going back

### 3. **Help & Support**
- Tooltips for complex fields
- Help links readily available
- Contact support option

### 4. **Save Progress**
- Allow saving incomplete onboarding
- Resume where left off
- Don't force completion in one session

### 5. **Role-Appropriate Content**
- Different flows for educators vs. learners
- Collect role-specific information
- Set appropriate defaults

## Code Reference

**File:** `frontend/web/src/app/(onboarding)/layout.tsx` (Currently minimal)

## Related Files

- `frontend/web/src/app/(onboarding)/educatorOnboarding.tsx`
- `frontend/web/src/app/(onboarding)/guardianOnboarding.tsx`
- `frontend/web/src/app/(onboarding)/learnerOnboarding.tsx`
- `frontend/web/src/app/(auth)/signup/[role]/page.tsx` - Signup pages that may use onboarding

## Future Development

To fully implement onboarding:

1. ✅ Convert `.tsx` files to proper page routes
2. ✅ Add step-based routing structure
3. ✅ Implement progress tracking
4. ✅ Add role-specific onboarding flows
5. ✅ Create reusable onboarding components
6. ✅ Add data persistence (save progress)
7. ✅ Implement skip/later options
8. ✅ Add completion animations/celebrations
