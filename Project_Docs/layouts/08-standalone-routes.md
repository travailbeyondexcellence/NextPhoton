# 8. STANDALONE ROUTES

Standalone routes are pages that exist outside of route groups and use only the root layout without additional layout layers.

## Overview

NextPhoton has **2 categories** of standalone routes:

```
app/
├── company/    # Company information pages
├── legal/      # Legal documents
└── logout/     # Logout handler
```

---

## 1. Company Pages

**Purpose:** Company information and marketing content

**Layout:** Root layout only (no additional chrome)

**Routes:**
```
company/
├── about/
│   └── page.tsx       # About NextPhoton
├── blog/
│   └── page.tsx       # Company blog
├── careers/
│   └── page.tsx       # Career opportunities
└── press/
    └── page.tsx       # Press releases & media
```

### URLs:
- `/company/about` - Company information
- `/company/blog` - Blog articles
- `/company/careers` - Job openings
- `/company/press` - Press kit & media

### Design Characteristics:
- Clean, marketing-focused design
- No persistent app navigation
- SEO-optimized content
- Call-to-action buttons
- Company branding emphasis

### Content Examples:

#### About Page:
- Company mission & vision
- Team information
- Company history
- Values & culture

#### Blog Page:
- Educational content
- Product updates
- Industry insights
- Use cases & success stories

#### Careers Page:
- Open positions
- Company culture
- Benefits & perks
- Application process

#### Press Page:
- Press releases
- Media kit
- Logo assets
- Contact information

### Typical Structure:
```tsx
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <nav className="container mx-auto px-6 py-4">
          {/* Logo & Navigation */}
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Content */}
      </main>

      <footer className="border-t border-border mt-20">
        {/* Footer */}
      </footer>
    </div>
  );
}
```

---

## 2. Legal Pages

**Purpose:** Legal documents and compliance information

**Layout:** Root layout only

**Routes:**
```
legal/
├── compliance/
│   └── page.tsx       # Compliance information
├── privacy/
│   └── page.tsx       # Privacy policy
├── security/
│   └── page.tsx       # Security practices
└── terms/
    └── page.tsx       # Terms of service
```

### URLs:
- `/legal/compliance` - Regulatory compliance
- `/legal/privacy` - Privacy policy
- `/legal/security` - Security measures
- `/legal/terms` - Terms of service

### Design Characteristics:
- Simple, readable typography
- Table of contents for long documents
- Last updated date
- Print-friendly layout
- Clear section headings

### Content Examples:

#### Privacy Policy:
- Data collection practices
- Data usage
- Third-party services
- User rights
- Cookie policy

#### Terms of Service:
- User obligations
- Service usage rules
- Account termination
- Liability disclaimers
- Dispute resolution

#### Security Page:
- Security measures
- Data encryption
- Compliance certifications
- Incident response
- Best practices

#### Compliance Page:
- GDPR compliance
- FERPA compliance (education-specific)
- COPPA compliance (for minors)
- SOC 2 certification
- Industry standards

### Typical Structure:
```tsx
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: October 2, 2025
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* Legal content */}
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Logout Route

**Purpose:** Handle user logout and session termination

**Location:** `app/logout/page.tsx`

**URL:** `/logout`

### Functionality:
```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const handleLogout = async () => {
      await logout()
      router.push('/sign-in')
    }

    handleLogout()
  }, [logout, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Logging out...</p>
      </div>
    </div>
  )
}
```

### Features:
- Clears authentication tokens
- Resets user session
- Redirects to login page
- Shows loading state

---

## Other Potential Standalone Routes

### Root Level Pages:

```
app/
├── page.tsx           # Homepage (/)
├── loading.tsx        # Global loading UI
├── not-found.tsx      # 404 page
└── error.tsx          # Global error boundary
```

---

## Design Patterns

### 1. **Marketing Pages** (Company routes)
- Hero sections
- Feature highlights
- Social proof
- Call-to-action buttons
- Newsletter signup

### 2. **Legal Pages** (Legal routes)
- Long-form content
- Table of contents
- Anchor links
- Print styles
- Accessibility focus

### 3. **Utility Pages** (Logout, etc.)
- Minimal UI
- Loading states
- Redirect logic
- Clear messaging

---

## Styling Approach

### Company Pages:
```css
/* Hero section */
bg-gradient-to-br from-primary/10 to-background

/* Content sections */
container mx-auto px-6 py-12

/* Cards */
bg-card border border-border rounded-lg
```

### Legal Pages:
```css
/* Content wrapper */
container mx-auto px-6 py-12 max-w-4xl

/* Typography */
prose prose-slate dark:prose-invert

/* Headings */
text-3xl font-bold mb-4
```

---

## SEO Considerations

### Meta Tags:
```tsx
export const metadata: Metadata = {
  title: 'About Us - NextPhoton',
  description: 'Learn about NextPhoton, the Uber for Educators...',
  openGraph: {
    title: 'About NextPhoton',
    description: '...',
    images: ['/og-about.png'],
  },
}
```

### Structured Data:
```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "NextPhoton",
    ...
  })}
</script>
```

---

## Navigation

### Linking to Standalone Routes:
```tsx
import Link from 'next/link'

// From anywhere in the app
<Link href="/company/about">About Us</Link>
<Link href="/legal/privacy">Privacy Policy</Link>
```

### Footer Links:
```tsx
<footer className="border-t border-border mt-20">
  <div className="container mx-auto px-6 py-8">
    <div className="grid grid-cols-4 gap-8">
      <div>
        <h3 className="font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
          <li><Link href="/company/about">About</Link></li>
          <li><Link href="/company/careers">Careers</Link></li>
          <li><Link href="/company/press">Press</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Legal</h3>
        <ul className="space-y-2">
          <li><Link href="/legal/privacy">Privacy</Link></li>
          <li><Link href="/legal/terms">Terms</Link></li>
          <li><Link href="/legal/security">Security</Link></li>
        </ul>
      </div>
    </div>
  </div>
</footer>
```

---

## Benefits of Standalone Routes

### ✅ **URL Clarity**
- Clean, semantic URLs
- `/company/about` vs `/dashboard/company/about`

### ✅ **No Unnecessary Chrome**
- No sidebar on marketing pages
- No dashboard UI on legal pages

### ✅ **SEO Optimization**
- Public pages without authentication
- Optimized for search engines

### ✅ **Code Organization**
- Clear separation of concerns
- Easy to find and maintain

---

## Summary Table

| Route Category | Authentication | Layout | Purpose |
|---------------|---------------|--------|---------|
| `/company/*` | Not required | Root only | Marketing & info |
| `/legal/*` | Not required | Root only | Legal docs |
| `/logout` | Required | Root only | Logout handler |

---

## Code References

- `frontend/web/src/app/company/about/page.tsx` - About page
- `frontend/web/src/app/company/blog/page.tsx` - Blog page
- `frontend/web/src/app/company/careers/page.tsx` - Careers page
- `frontend/web/src/app/company/press/page.tsx` - Press page
- `frontend/web/src/app/legal/privacy/page.tsx` - Privacy policy
- `frontend/web/src/app/legal/terms/page.tsx` - Terms of service
- `frontend/web/src/app/legal/security/page.tsx` - Security page
- `frontend/web/src/app/legal/compliance/page.tsx` - Compliance page
- `frontend/web/src/app/logout/page.tsx` - Logout handler
