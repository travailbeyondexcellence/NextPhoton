# GuardianCard_forAdmin Component

## Overview
Card component displaying guardian/parent information with associated learner details.

## Location
`/components/admin/guardians/GuardianCard_forAdmin.tsx`

## Purpose
Display individual guardian as card with contact info, address, payment method, and assigned learners.

## Key Features
- Responsive card layout
- Image with initials fallback
- Contact preferences display
- Payment method badge
- Assigned learners list
- Address information

## Interactions with Sister Components

### GuardiansCardsView_forAdmin (Parent)
**Relationship**: Child ← Parent - Rendered by parent container in grid

### GuardiansList_forAdmin (Sister - Alternative View)
**Relationship**: Parallel - Table view vs Card view

### CreateGuardianForm (Data Source)
**Relationship**: Indirect - Form creates guardians displayed in card

## Props
Shows: name, relation, email, phone, occupation, address, assigned learners, contact preferences, payment method

## Layout
Flex column→row at md, similar to EducatorCard pattern
