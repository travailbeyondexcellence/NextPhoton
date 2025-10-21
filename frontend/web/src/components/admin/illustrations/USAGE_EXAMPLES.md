# SVG Illustrations - Usage Examples

This guide shows how to integrate the centralized SVG illustrations into your admin components.

## Quick Import Reference

```tsx
// Import from specific folders
import { SubjectIcon, PriceTierBadge } from '@/components/admin/illustrations/educator';
import { PaymentStatusIcon, ContactMethodIcon } from '@/components/admin/illustrations/guardian';
import { PerformanceMeter, AttendanceChart } from '@/components/admin/illustrations/learner';
import { ProfileAvatar, StatusBadge } from '@/components/admin/illustrations/shared';

// OR import everything from the root
import {
  SubjectIcon,
  PaymentStatusIcon,
  PerformanceMeter,
  ProfileAvatar,
  StatusBadge
} from '@/components/admin/illustrations';
```

---

## Example 1: Educator Card Integration

**Before (without SVG illustrations):**
```tsx
// EducatorCard_forAdmin.tsx - Line 96-105
<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
  <span>
    <span className="font-medium text-muted-foreground">Levels:</span>{" "}
    {educator.levels.join(", ")}
  </span>
  <span>
    <span className="font-medium text-muted-foreground">Exam Tags:</span>{" "}
    {educator.exams.join(", ")}
  </span>
</div>
```

**After (with SVG illustrations):**
```tsx
import { SubjectIcon, PriceTierBadge } from '@/components/admin/illustrations/educator';
import { ProfileAvatar } from '@/components/admin/illustrations/shared';

// Replace subject text with icons
<div className="flex flex-wrap gap-2">
  {educator.subjects.map((subject) => (
    <div key={subject} className="flex items-center gap-1 text-sm">
      <SubjectIcon subject={subject} size={16} className="text-primary" />
      <span>{subject}</span>
    </div>
  ))}
</div>

// Use PriceTierBadge instead of simple colored div
<div className="absolute top-3 right-3 z-10">
  <PriceTierBadge tier={educator.priceTier} size={40} className="text-primary" />
</div>

// Replace initials placeholder with ProfileAvatar
<ProfileAvatar
  initials={getInitials(educator.name)}
  variant="educator"
  size={96}
/>
```

---

## Example 2: Guardian Card Integration

**File:** `GuardianCard_forAdmin.tsx`

```tsx
import { PaymentStatusIcon, ContactMethodIcon } from '@/components/admin/illustrations/guardian';
import { StatusBadge } from '@/components/admin/illustrations/shared';

// Line 73-77 - Replace text badge with icon
<div className="absolute top-3 right-3 z-10 flex items-center gap-2">
  <PaymentStatusIcon
    status={guardian.paymentInfo.paymentStatus}
    size={32}
  />
  <span className="text-xs font-semibold">{paymentStatus.text}</span>
</div>

// Line 112-116 - Add visual contact method icon
<div className="flex items-center gap-2 text-sm">
  <ContactMethodIcon
    method={guardian.preferredContactMethod}
    size={18}
    className="text-primary"
  />
  <span className="font-medium">{guardian.phone}</span>
  <span className="text-xs text-muted-foreground ml-auto">
    {guardian.preferredContactMethod}
  </span>
</div>
```

---

## Example 3: Learner Card Integration

**File:** `LearnerCard_forAdmin.tsx`

```tsx
import { PerformanceMeter, AttendanceChart } from '@/components/admin/illustrations/learner';
import { StatusBadge } from '@/components/admin/illustrations/shared';

// Line 55-58 - Replace text badge with visual status
<div className="absolute top-3 right-3 z-10">
  <StatusBadge
    status={learner.status}
    size={20}
    showPulse={learner.status === 'active'}
  />
</div>

// Line 111-128 - Replace text stats with visual meters
<div className="px-5 py-3 grid grid-cols-2 gap-3 border-t border-white/10">
  <div className="flex flex-col items-center">
    <AttendanceChart
      percentage={learner.attendance.overall}
      size={64}
    />
    <p className="text-xs text-muted-foreground mt-2">Attendance</p>
  </div>
  <div className="flex flex-col items-center">
    <PerformanceMeter
      score={learner.performance.averageScore}
      trend={learner.performance.trend}
      size={64}
    />
    <p className="text-xs text-muted-foreground mt-2">Performance</p>
  </div>
</div>
```

---

## Example 4: List View Integration

**File:** `EducatorsList_forAdmin.tsx` (hypothetical)

```tsx
import { StatusBadge, ProfileAvatar } from '@/components/admin/illustrations/shared';

// In table row
<tr>
  <td className="flex items-center gap-3">
    <ProfileAvatar
      initials={getInitials(educator.name)}
      variant="educator"
      size={40}
    />
    <span>{educator.name}</span>
  </td>
  <td>
    <StatusBadge
      status="active"
      size={12}
      showPulse={true}
    />
  </td>
  {/* ... */}
</tr>
```

---

## Customization Examples

### Custom Colors
```tsx
// Using Tailwind classes
<SubjectIcon
  subject="Mathematics"
  size={24}
  className="text-blue-500 hover:text-blue-700"
/>

// Using inline styles
<PaymentStatusIcon
  status="paid"
  size={32}
  style={{ color: '#10b981' }}
/>
```

### Responsive Sizing
```tsx
<PerformanceMeter
  score={85}
  trend="improving"
  size={window.innerWidth < 768 ? 48 : 80}
/>

// Or using Tailwind's responsive classes
<div className="w-12 h-12 md:w-20 md:h-20">
  <AttendanceChart percentage={92} size={80} />
</div>
```

### Animation/Hover Effects
```tsx
<div className="transform transition-transform hover:scale-110">
  <StatusBadge status="active" size={16} showPulse={true} />
</div>
```

---

## Best Practices

1. **Consistent Sizing**: Use standard sizes across similar components
   - Small icons: 16-20px
   - Medium icons: 24-32px
   - Large illustrations: 64-96px

2. **Color Consistency**: Let the SVGs use `currentColor` to inherit from parent
   ```tsx
   <div className="text-primary">
     <SubjectIcon subject="Math" /> {/* Inherits primary color */}
   </div>
   ```

3. **Accessibility**: SVGs include aria-label by default, but add context when needed
   ```tsx
   <div aria-describedby="payment-status">
     <PaymentStatusIcon status="paid" />
   </div>
   <span id="payment-status" className="sr-only">Payment completed</span>
   ```

4. **Performance**: Import only what you need
   ```tsx
   // ❌ Avoid
   import * from '@/components/admin/illustrations';

   // ✅ Prefer
   import { SubjectIcon } from '@/components/admin/illustrations/educator';
   ```

---

## Adding New Illustrations

1. Create the SVG component in the appropriate folder
2. Export it from the folder's `index.ts`
3. Add usage example to this file
4. Update the main README.md if it's a new category

Example:
```tsx
// illustrations/educator/TeachingBadge.tsx
export const TeachingBadge = ({ years, size = 32 }) => {
  return <svg>{/* ... */}</svg>;
};

// illustrations/educator/index.ts
export { TeachingBadge } from './TeachingBadge';
```
