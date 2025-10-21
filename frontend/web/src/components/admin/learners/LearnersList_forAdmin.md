# LearnersList_forAdmin Component

## Overview
Main list view with GraphQL CRUD for learners.

## Location
`/components/admin/learners/LearnersList_forAdmin.tsx`

## Purpose
Admin interface for managing learners with full CRUD operations.

## Key Features
- GET_LEARNERS query
- DELETE_LEARNER mutation
- Table/list layout
- Shows academic info and guardian associations
- Edit/Delete actions

## Interactions with Sister Components

### LearnersCardsView_forAdmin (Sister)
**Relationship**: Table vs Cards view

### CreateLearnerForm (Creator)
**Relationship**: Form → List
- "Create Learner" button → Navigate
- Form submits → Cache update → List refetches

### EditLearnerForm (Future)
**Relationship**: List → Form → List
- Edit button → Navigate with learner data
- Update → Refetch → List refreshes

## Interactions with Guardians

### Bidirectional Relationship
- Learners have guardians
- Guardians have learners
- Synced via GraphQL

### CreateGuardianForm
**Relationship**: Cross-entity
- Guardian form includes learner info
- Learner form includes guardian info

## GraphQL Integration
network-only → cache-first, similar to other admin lists
