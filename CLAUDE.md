# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL INSTRUCTIONS - NEVER VIOLATE THESE RULES ⚠️

### 🚫 NEVER RUN THESE COMMANDS - ABSOLUTELY FORBIDDEN:
1. **NEVER run `bun install`, `npm install`, `yarn install`, or ANY package installation commands**
2. **NEVER run `bun run dev`, `npm run dev`, `yarn dev`, or ANY server startup commands**
3. **NEVER run `bun run start:all` or ANY command that starts servers**
4. **NEVER run build commands that might trigger installations**
5. **NEVER run any background processes or servers**
6. **NEVER run `git pull`, `git push`, or ANY git commands that modify the repository**
7. **NEVER run `bun run prisma:generate`, `bun run prisma:push`, or ANY Prisma commands**
8. **NEVER run ANY terminal commands that modify files, install packages, or change system state**

### ✅ WHAT YOU SHOULD DO INSTEAD:
- **ONLY** write, read, edit, and analyze code
- **ONLY** update configuration files
- **ONLY** provide instructions for the user to run commands
- When testing is needed, **TELL THE USER** what commands to run
- When installations are needed, **TELL THE USER** to run `bun install`
- You MAY run `git diff` to check changes (read-only command)
- You MAY run `git status` to check repository status (read-only command)
- You MAY run `ls`, `cat`, `pwd` and other read-only commands

### 📝 REMEMBER:
- The user will ALWAYS handle running servers
- The user will ALWAYS handle installing packages
- The user will ALWAYS handle git operations (pull, push, etc.)
- The user will ALWAYS handle Prisma commands
- You are ONLY responsible for code changes and configuration
- **NEVER EVER** run installation or server commands under any circumstances
- **ALWAYS** inform the user when commands need to be run

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

### Root-level commands (from repository root):
- `bun install` - Install dependencies in root and all workspaces
- `bun run web` - Start Next.js frontend development server
- `bun run server` - Start NestJS backend development server
- `bun run start:all` - Start both frontend and backend in parallel using Turbo
- `bun run build` - Build all packages using Turbo
- `bun run prisma:generate` - Generate Prisma client from schema
- `bun run prisma:push` - Push schema changes to database and generate client
- `bun run prisma:migrate` - Create and apply new migration
- `bun run prisma:studio` - Open Prisma Studio for database management
- `bun run test:db` - Test database connection

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
```
NextPhoton/
├── frontend/
│   ├── web/                 # Next.js 15 web application
│   ├── desktop/             # (Future) Desktop application
│   └── mobile/              # (Future) Mobile application
├── backend/
│   └── server_NestJS/       # NestJS API server with GraphQL
├── shared/
│   ├── prisma/              # Centralized Prisma schema
│   │   └── schema.prisma    # Single source of truth for database
│   └── db/                  # Database utilities
│       └── index.ts         # Singleton Prisma client
├── Project_Docs/            # Project documentation
├── package.json             # Root workspace configuration
├── turbo.json              # Turbo configuration
└── tsconfig.base.json      # Base TypeScript configuration
```

- **Frontend**: Next.js 15 with App Router, Tailwind CSS v4, TypeScript, Better-Auth
- **Backend**: NestJS with GraphQL, Express, TypeScript, JWT authentication
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

#### Key Prisma Commands (run from root):
- `bun run prisma:generate` - Generate Prisma client
- `bun run prisma:push` - Push schema changes and regenerate client
- `bun run prisma:migrate` - Create new migration
- `bun run prisma:studio` - Open Prisma Studio UI
- `bun run test:db` - Test database connection

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

#### Database & Prisma:
- **Prisma Schema**: `shared/prisma/schema.prisma` - Single source of truth
- **Prisma Client**: `shared/db/index.ts` - Centralized client (ALWAYS import from here)
- **Backend Service**: `backend/server_NestJS/src/prisma/prisma.service.ts` - NestJS wrapper
- **Connection Test**: `shared/db/test-connection.ts` - Database validation

#### Frontend (Next.js):
- **Auth Config**: `frontend/web/src/lib/auth.ts` - Better-auth setup
- **Auth Schemas**: `frontend/web/src/lib/auth-schema.ts` - Authentication types
- **Form Validation**: `frontend/web/src/lib/formValidationSchemas.ts` - Zod schemas
- **Global State**: `frontend/web/src/statestore/store.ts` - Zustand store
- **Route Access**: `frontend/web/src/lib/routeAccessMap.ts` - ABAC route control

#### Backend (NestJS):
- **Main Entry**: `backend/server_NestJS/src/main.ts` - Server bootstrap
- **App Module**: `backend/server_NestJS/src/app.module.ts` - Root module
- **GraphQL Config**: `backend/server_NestJS/src/graphql/*` - GraphQL resolvers
- **Auth Module**: `backend/server_NestJS/src/auth/*` - JWT authentication

### Development Notes

#### Package Management:
- **Package Manager**: Bun (v1.2.21+)
- **Workspaces**: Managed by Bun workspaces in root package.json
- **Dependencies**: Each workspace has its own package.json
- **Installation**: User runs `bun install` from root (NEVER RUN THIS YOURSELF)

#### Database Architecture:
- **Single Schema**: One Prisma schema at `shared/prisma/schema.prisma`
- **Shared Client**: Import from `shared/db/index.ts` everywhere
- **NEVER**: Create separate Prisma clients or duplicate schemas
- **Migrations**: User manages with `bun run prisma:migrate`

#### Development Workflow:
- **Start Frontend**: User runs `bun run web` from root
- **Start Backend**: User runs `bun run server` from root
- **Start Both**: User runs `bun run start:all` from root
- **Generate Types**: User runs `bun run prisma:generate` after schema changes

#### Code Standards:
- Strict TypeScript enforcement
- Elaborate commenting for AI agents and future developers
- Follow existing patterns in codebase
- Use existing libraries (check package.json first)

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
