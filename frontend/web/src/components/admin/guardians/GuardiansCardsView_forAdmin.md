# GuardiansCardsView_forAdmin Component

## Overview
Container for guardian cards in grid layout.

## Location
`/components/admin/guardians/GuardiansCardsView_forAdmin.tsx`

## Purpose
Render guardians in responsive card grid.

## Key Features
- Grid: 1→2 columns (mobile→xl)
- Maps over guardians array
- Uses mock data

## Interactions with Sister Components

### GuardianCard_forAdmin (Child)
**Relationship**: Parent → Child - Maps and renders cards

### GuardiansList_forAdmin (Sister)
**Relationship**: Alternative view mode

## Data Flow
guardiansData.json → state → map() → GuardianCard × N
