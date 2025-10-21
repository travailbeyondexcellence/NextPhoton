# Admin Illustrations - Centralized SVG Components

This directory contains all SVG illustrations and graphics used across the admin section.

## Structure

```
illustrations/
├── educator/       # Educator-specific SVG components
├── guardian/       # Guardian-specific SVG components
├── learner/        # Learner-specific SVG components
└── shared/         # Shared across all admin roles
```

## Organization Rules

| Folder | Purpose | Examples |
|--------|---------|----------|
| `educator/` | SVGs unique to educator cards/profiles | Subject icons, Price tier badges, Teaching stats visuals |
| `guardian/` | SVGs unique to guardian cards/profiles | Payment status icons, Contact method icons, Family illustrations |
| `learner/` | SVGs unique to learner cards/profiles | Performance charts, Attendance gauges, Target exam badges |
| `shared/` | SVGs used by 2+ roles | Avatar placeholders, Status badges, Action icons |

## Usage Examples

### Importing from role-specific folders:
```tsx
import { SubjectIcon } from '@/components/admin/illustrations/educator/SubjectIcons';
import { PaymentStatusIcon } from '@/components/admin/illustrations/guardian/PaymentStatusIcon';
import { PerformanceMeter } from '@/components/admin/illustrations/learner/PerformanceMeter';
```

### Importing from shared folder:
```tsx
import { ProfileAvatar } from '@/components/admin/illustrations/shared/ProfileAvatar';
import { StatusBadge } from '@/components/admin/illustrations/shared/StatusBadge';
```

## Component Guidelines

1. **Props**: All illustration components should accept standard props:
   - `size?: number` - Width/height in pixels (default: 24)
   - `className?: string` - Additional CSS classes
   - `color?: string` - Primary color (optional, uses theme colors by default)

2. **Naming**: Use PascalCase and descriptive names
   - ✅ `PaymentStatusIcon.tsx`
   - ✅ `PerformanceMeter.tsx`
   - ❌ `icon.tsx`
   - ❌ `chart.tsx`

3. **Accessibility**: Include proper ARIA attributes
   ```tsx
   <svg aria-label="Payment status" role="img">
   ```

4. **Theming**: Use CSS variables for colors when possible
   ```tsx
   fill="var(--primary)"
   stroke="var(--foreground)"
   ```

## Adding New Illustrations

1. Determine which folder based on usage
2. Create the component file
3. Export from the appropriate index.ts
4. Import and use in your card/profile component

## Questions?

- If an SVG is used by multiple roles → Put in `shared/`
- If unsure about placement → Start in role-specific, move to `shared/` if reused
