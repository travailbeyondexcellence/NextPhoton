# HeroSection Component

## Overview
Hero section for landing page with animated content and glassmorphism design.

## Location
`/components/landing/HeroSection.tsx`

## Purpose
Create compelling first impression with animated hero content, CTAs, and visual effects.

## Key Features
- Full-height hero section (min-h-screen)
- Animated background gradient
- Floating particles animation
- FadeIn and StaggerChildren animations
- CTA buttons
- Statistics/social proof
- Lucide icons (ArrowRight, Play, Star, Users, etc.)
- Deterministic particle positioning (SSR-safe)

## Dependencies
- framer-motion
- next/link
- FadeIn animation
- StaggerChildren animation
- LogoComponent
- lucide-react icons

## Background Effects
- Radial gradient animation
- Cycling through multiple gradient positions
- 10s duration infinite loop

## Particle System
- 20 floating particles
- Pseudo-random positioning (consistent SSR)
- Individual animation durations and delays

## Interactions with Sister Components

### FeaturesSection (Sister)
**Relationship**: Sequential sections
- HeroSection first
- FeaturesSection follows

### Navbar (Sister)
**Relationship**: Header above hero
- Navbar sticky at top
- Hero below navbar

### PageLayout (Sister)
**Relationship**: Child ← Parent
- Hero rendered inside PageLayout

## Common Use Cases
- Landing page
- Homepage
- Product page
- Marketing campaigns
