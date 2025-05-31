# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context - REQUIRED READING

**CRITICAL**: At the start of EVERY coding session, you MUST read these folders to understand the project:

### Required Documentation Reading:
1. **`project-documentation/`** - Complete project context including:
   - `pd-overview.md` - Project vision and unique value proposition
   - `pd-business-model.md` - Revenue strategy and market analysis
   - `pd-roles-permissions.md` - ABAC system and role definitions
   - `pd-technical-architecture.md` - Technical stack and system design
   - `pd-workflows.md` - User journeys and operational processes
   - `pd-analytics.md` - Business intelligence requirements
   - `roadmap.md` - Feature prioritization

2. **`project-brainstorming/`** - Schema design decisions including:
   - `sample-schema.md` - Proposed Prisma schema with all models
   - `schema-reasoning.md` - Architectural decision explanations

### Project Summary:
NextPhoton is an "Uber for Educators" platform focused on **micromanagement and outside-classroom monitoring** (80-90% focus) rather than content delivery like competitors. Key roles: Learner, Guardian, Educator, EduCare Manager (ECM), Employee, Intern, Admin.

## Development Commands

### Root-level commands (from `/root/ZenTech/NextPhoton/`):
- `npm run start:all` - Start both client and server in parallel using Turbo
- `npm run build` - Build all packages using Turbo
- `npm run prisma:push` - Push schema changes to database and generate client
- `npm run prisma:migrate` - Create and apply new migration
- `npm run prisma:studio` - Open Prisma Studio for database management

### Client commands (from `client/`):
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test:prisma` - Test Prisma connection

### Server commands (from `server/`):
- `npm run dev` - Start NestJS development server with watch mode
- `npm run build` - Build NestJS application
- `npm run lint` - Run ESLint with auto-fix
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests

## Architecture Overview

### Monorepo Structure
- **Turbo-managed monorepo** with workspaces for `client`, `server`, and `shared/*`
- **Client**: Next.js 15 with App Router, Tailwind CSS v4, TypeScript
- **Server**: NestJS with Express, TypeScript
- **Shared**: Prisma schema, database utilities, shared types

### Key Technologies
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better-auth with Prisma adapter
- **Frontend**: Next.js 15, Radix UI components, React Hook Form with Zod validation, ShadCN
- **Backend**: NestJS framework
- **Styling**: Tailwind CSS v4 with dark mode support
- **State Management**: Zustand

### Database Schema Location
- Primary schema: `shared/prisma/schema.prisma`
- Better-auth models: User, Session, Account, Verification tables
- Database client generated to `node_modules/.prisma/client`

### Multi-tenant Architecture
- Application implements **ABAC (Attribute-Based Access Control)**
- Tenant-specific data isolation supported
- Route access controlled via `lib/routeAccessMap.ts`

### Authentication Flow
- Better-auth configuration in `client/src/lib/auth.ts`
- Email/password authentication enabled
- Session management with database persistence
- Auth client utilities in `client/src/lib/auth-client.ts`

### Important File Locations
- Prisma utilities: `shared/db/index.ts`
- Auth schemas: `client/src/lib/auth-schema.ts`
- Form validation: `client/src/lib/formValidationSchemas.ts`
- Global state: `client/src/statestore/store.ts`

### Development Notes
- Always use `npm` as package manager
- Prisma schema changes require running `npm run prisma:push` from root
- Both client and server can be started simultaneously with `npm run start:all`
- The project uses strict TypeScript enforcement across all packages

### Git & Github Workflow Notes
- And the primary developer himself works with various different repositories simultaneously, so it is always very important to git pull before making any changes, and it is always very important to run git pull before even analyzing the tasks that are about to be performed. 
- Do create a separate branch for the changes that Claude is making. The name of the branch should start from /feature/Claude/[descriptive-name-about-the-feature], if its a bugfix branch, it should be /bigfix/Claude/[descriptiven-ame-about-the-bugfix] and so on
- **IMPORTANT**: Never include "Co-authored by Claude" or Claude website links in commit messages. Write clean, simple commit messages without any Claude attribution or generated-by tags.
