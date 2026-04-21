# LearnersCardsView_forAdmin Component

## Overview
Container for learner cards in grid layout.

## Location
`/components/admin/learners/LearnersCardsView_forAdmin.tsx`

## Purpose
Render learners in responsive card grid.

## Key Features
- Grid: 1→2 columns
- Maps over learners array
- Uses mock data

## Interactions with Sister Components

### LearnerCard_forAdmin (Child)
**Relationship**: Parent → Child - Maps and renders cards

### LearnersList_forAdmin (Sister)
**Relationship**: Alternative view mode

## Data Flow
learnersData.json → state → map() → LearnerCard × N
