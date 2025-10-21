# Navbar Component

## Overview
Navigation bar for landing pages with dropdown menus and mobile support.

## Location
`/components/landing/Navbar.tsx`

## Purpose
Provide comprehensive navigation for public-facing landing pages.

## Key Features
- Desktop dropdown menus
- Mobile hamburger menu
- Sticky positioning
- Active route highlighting
- Theme selector integration
- Logo display
- Multi-level navigation structure
- Animated dropdowns
- Icon-based menu items

## Dependencies
- next/link
- next/navigation: usePathname
- framer-motion: AnimatePresence
- ThemeSelector component
- LogoComponent
- lucide-react icons
- @/lib/utils: cn()

## Navigation Structure
- **Product**: Features, Pricing, Testimonials, Demo
- **About Us**: Company, Team
- **Resources**: Documentation, Help, Community, Contact
- **Legal**: Privacy, Terms, Security, Compliance

## State Management
```typescript
mobileMenuOpen: boolean
activeDropdown: string | null
```

## Interactions with Sister Components

### Footer (Sister)
**Relationship**: Header ← → Footer
- Navbar: Top navigation
- Footer: Bottom navigation
- Mirror link structure

### HeroSection (Sister)
**Relationship**: Header above content
- Navbar at top
- Hero below

### ThemeSelector (Child)
**Relationship**: Parent ← Child
- Navbar renders ThemeSelector
- Theme switching in navbar

### LogoComponent (Child)
**Relationship**: Parent ← Child
- Navbar displays logo
- Links to homepage

## Mobile Menu
- Hamburger icon toggle
- Full-screen overlay
- Animated slide-in
- Close button (X icon)

## Common Use Cases
- All landing pages
- Public pages
- Marketing pages
