# Footer Component

## Overview
Site footer with links, social media, and company information.

## Location
`/components/landing/Footer.tsx`

## Purpose
Provide comprehensive footer navigation and information for landing pages.

## Key Features
- Multi-column link sections (Product, Company, Resources, Legal)
- Social media links
- Logo display
- Contact information
- Animated hover effects
- Responsive grid layout

## Dependencies
- framer-motion
- next/link
- LogoComponent
- lucide-react icons (Facebook, Twitter, LinkedIn, Instagram, Mail, Phone, MapPin)

## Link Categories
- **Product**: Features, Pricing, Testimonials, Demo
- **Company**: About, Careers, Blog, Press
- **Resources**: Documentation, Help Center, Community, Contact
- **Legal**: Privacy, Terms, Security, Compliance

## Social Links
- Facebook
- Twitter
- LinkedIn
- Instagram

## Interactions with Sister Components

### Navbar (Sister)
**Relationship**: Header ← → Footer
- Navbar: Top navigation
- Footer: Bottom navigation
- Complementary link structure

### PageLayout (Sister)
**Relationship**: Child ← Parent
- Footer typically rendered inside PageLayout

## Common Use Cases
- All landing pages
- Marketing pages
- Public-facing pages
