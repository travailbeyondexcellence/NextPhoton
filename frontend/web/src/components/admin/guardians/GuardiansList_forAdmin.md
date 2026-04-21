# GuardiansList_forAdmin Component

## Overview
Main list view with GraphQL CRUD for guardians.

## Location
`/components/admin/guardians/GuardiansList_forAdmin.tsx`

## Purpose
Admin interface for managing guardians with full CRUD operations.

## Key Features
- GET_GUARDIANS query
- DELETE_GUARDIAN mutation
- Table/list layout
- Edit/Delete actions
- Shows guardian-learner relationships

## Interactions with Sister Components

### GuardiansCardsView_forAdmin (Sister - Alternative View)
**Relationship**: Table vs Cards view

### CreateGuardianForm (Creator)
**Relationship**: Form → List
- "Create Guardian" button → Navigate to form
- Form submits → Cache update → List refetches

### EditGuardianForm (Future)
**Relationship**: List → Form → List
- Edit button → Navigate with guardian data
- Update → Refetch → List refreshes

## Interactions with Learners

### Bidirectional Relationship
- Guardians have assigned learners
- Learners have associated guardians
- Data synced via GraphQL

### CreateLearnerForm
**Relationship**: Cross-entity
- Learner form includes guardian info
- Guardian form includes learner info

## GraphQL Integration
Similar to EducatorsList: network-only → cache-first pattern
