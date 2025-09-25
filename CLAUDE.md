# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL INSTRUCTIONS - NEVER VIOLATE THESE RULES ⚠️

### 🚫 NEVER RUN THESE COMMANDS - ABSOLUTELY FORBIDDEN:
1. **NEVER run `bun install`, `npm install`, `yarn install`, or ANY package installation commands**
2. **NEVER run `bun run dev`, `npm run dev`, `yarn dev`, or ANY server startup commands**
3. **NEVER run `bun run start:all` or ANY command that starts servers**
4. **NEVER run build commands that might trigger installations**
5. **NEVER run any background processes or servers**

### ✅ WHAT YOU SHOULD DO INSTEAD:
- **ONLY** write, read, edit, and analyze code
- **ONLY** update configuration files
- **ONLY** provide instructions for the user to run commands
- When testing is needed, **TELL THE USER** what commands to run
- When installations are needed, **TELL THE USER** to run `bun install`

### 📝 REMEMBER:
- The user will ALWAYS handle running servers
- The user will ALWAYS handle installing packages
- You are ONLY responsible for code changes and configuration
- **NEVER EVER** run installation or server commands under any circumstances

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

### Package Manager: Bun
This project uses **Bun** as the package manager. Install Bun from https://bun.sh

### Root-level commands (from `/root/ZenTech/NextPhoton/`):
- `bun install` or `bun run install:all` - Install all dependencies in all workspaces
- `bun install.js` - Cross-platform install script
- `bun run start:all` - Start both frontend and backend in parallel using Turbo
- `bun run build` - Build all packages using Turbo
- `bunx prisma push --schema=shared/prisma` - Push schema changes to database
- `bunx prisma migrate dev --schema=shared/prisma` - Create and apply migration
- `bunx prisma studio --schema=shared/prisma` - Open Prisma Studio

### Frontend commands (from `frontend/web/`):
- `bun run dev` - Start Next.js development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run test:prisma` - Test Prisma connection

### Backend commands (from `backend/server_NestJS/`):
- `bun run dev` - Start NestJS development server with watch mode
- `bun run build` - Build NestJS application
- `bun run lint` - Run ESLint with auto-fix
- `bun run test` - Run Jest tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:e2e` - Run end-to-end tests

## Architecture Overview

### Monorepo Structure
- **Turbo-managed monorepo** with workspaces:
  - `frontend/web` - Next.js application
  - `backend/server_NestJS` - NestJS server
  - `shared/*` - Shared utilities and Prisma schema
- **Frontend**: Next.js 15 with App Router, Tailwind CSS v4, TypeScript
- **Backend**: NestJS with Express, TypeScript
- **Shared**: Prisma schema, database utilities, shared types

### Key Technologies
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better-auth with Prisma adapter
- **Frontend**: Next.js 15, Radix UI components, React Hook Form with Zod validation, ShadCN
- **Backend**: NestJS framework
- **Styling**: Tailwind CSS v4 with dark mode support
- **State Management**: Zustand

### Database Schema Location & Prisma Architecture
- **Primary schema**: `shared/prisma/schema.prisma` - Single source of truth
- **Centralized client**: `shared/db/index.ts` - Singleton Prisma client for entire monorepo
- **Better-auth models**: User, Session, Account, Verification tables
- **Database client**: Generated to `node_modules/.prisma/client` from shared schema

#### ✅ CORRECT Prisma Setup (NextPhoton Architecture):
```
shared/
├── prisma/schema.prisma          # Single schema source
└── db/
    ├── index.ts                  # Centralized Prisma client
    └── test-connection.ts        # Connection validation tests
backend/server_NestJS/src/prisma/prisma.service.ts  # Imports from shared/db/index
frontend/web/src/lib/prisma.ts                      # Imports from shared/db/index
```

#### ❌ WRONG Approach (Never Do This):
```
frontend/web/prisma/schema.prisma           # ❌ Separate schema
backend/server_NestJS/prisma/schema.prisma  # ❌ Duplicate schema  
frontend/web/lib/prisma.ts                  # ❌ Separate client
backend/server_NestJS/prisma.service.ts     # ❌ Separate client
```

#### Key Prisma Commands:
- `bunx prisma generate --schema=shared/prisma` - Generate client from shared schema
- `bun run prisma:push` - Push schema + generate client
- `bun run test:db` - Validate Prisma connection and setup
- `bunx prisma studio --schema=shared/prisma` - Open database management UI

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
- **Prisma client**: `shared/db/index.ts` - ALWAYS import from here
- **Prisma service**: `backend/server_NestJS/src/prisma/prisma.service.ts` - NestJS wrapper
- **Prisma tests**: `shared/db/test-connection.ts` - Connection validation
- Auth schemas: `frontend/web/src/lib/auth-schema.ts`
- Form validation: `frontend/web/src/lib/formValidationSchemas.ts`
- Global state: `frontend/web/src/statestore/store.ts`

### Development Notes
- Always use `bun` as package manager (BUT NEVER RUN INSTALL COMMANDS YOURSELF)
- **Prisma Architecture**: Use centralized client from `shared/db/index.ts` - NEVER create separate Prisma clients
- Prisma schema changes: TELL USER to run `bun run prisma:push` from root
- Testing Prisma: TELL USER to run `bun run test:db` after schema changes
- Starting servers: TELL USER to run `bun run start:all` - NEVER RUN IT YOURSELF
- The project uses strict TypeScript enforcement across all packages

## ⚠️ FINAL REMINDER - CRITICAL ⚠️
**NEVER EVER RUN:**
- `bun install` or any installation commands
- `bun run dev` or any server startup commands
- `bun run start:all` or any development server commands
- ANY command that installs packages or starts servers

**THE USER WILL ALWAYS RUN THESE COMMANDS - NOT YOU!**

### Elaborate Commenting
- Write code with alaborate comments as and when possible
- Future developers as well as AI Agents rely heavily on the comments you are writing, hence be very delberate, explicit and clear in commenting

### Git & Github Workflow Notes
- And the primary developer himself works with various different repositories simultaneously, so it is always very important to git pull before making any changes, and it is always very important to run git pull before even analyzing the tasks that are about to be performed. 
- Do create a separate branch for the changes that Claude is making. The name of the branch should start from /feature/Claude/[descriptive-name-about-the-feature], if its a bugfix branch, it should be /bigfix/Claude/[descriptiven-ame-about-the-bugfix] and so on
- **IMPORTANT**: Never include "Co-authored by Claude" or Claude website links in commit messages. Write clean, simple commit messages without any Claude attribution or generated-by tags.
