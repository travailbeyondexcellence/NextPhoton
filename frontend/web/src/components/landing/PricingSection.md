# PricingSection Component

## Overview
Pricing tiers section for landing pages.

## Location
`/components/landing/PricingSection.tsx`

## Purpose
Display pricing plans with features, prices, and CTAs.

## Key Features
- Multiple pricing tiers
- Feature lists per tier
- CTA buttons
- Highlight popular plan
- Animated cards
- ScrollReveal animations
- Icons for features

## Typical Pricing Tiers
- Starter/Free
- Professional/Pro
- Enterprise

## Dependencies
- framer-motion
- ScrollReveal animation
- lucide-react icons
- GlassCard or similar card component

## Card Structure
- Tier name
- Price (monthly/yearly)
- Feature list with checkmarks
- CTA button
- Optional "Popular" badge

## Interactions with Sister Components

### FeaturesSection (Sister)
**Relationship**: Sequential landing sections
- FeaturesSection → PricingSection typical flow

### Footer (Sister)
**Relationship**: Often precedes footer

### GlassCard (Possible)
**Relationship**: May use for pricing cards

## Common Use Cases
- Landing pages
- Pricing pages
- Product pages
- Sales funnels
