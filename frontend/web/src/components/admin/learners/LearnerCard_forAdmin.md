# LearnerCard_forAdmin Component

## Overview
Card component displaying learner/student information.

## Location
`/components/admin/learners/LearnerCard_forAdmin.tsx`

## Purpose
Display individual learner with academic info, target exams, and guardian details.

## Key Features
- Academic level, grade, school, board
- Target exams with year
- Guardian information
- Remark tags (High Potential, Needs Support, etc.)
- Image with initials fallback

## Interactions with Sister Components

### LearnersCardsView_forAdmin (Parent)
**Relationship**: Child ← Parent - Rendered in grid

### LearnersList_forAdmin (Sister)
**Relationship**: Alternative view (Cards vs Table)

### CreateLearnerForm (Data Source)
**Relationship**: Form creates learners shown in card

## Props
Shows: name, username, email, academic level, grade, school, board, target exams, guardian info, tags

## Guardian Display
Shows associated guardian name, relation, contact info
