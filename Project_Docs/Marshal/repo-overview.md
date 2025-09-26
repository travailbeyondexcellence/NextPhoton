● NextPhoton Project Architecture Overview

  Based on my analysis of the codebase, here's how NextPhoton is structured and
  working:

  🏗️ Monorepo Architecture

  The project uses a Bun workspace monorepo with Turborepo for orchestration:
  - Frontend: Next.js 15 web app (port 369)
  - Backend: NestJS server with REST + GraphQL (port 963)
  - Shared: Centralized Prisma schema and database client

  📊 Database Layer (Shared)

  The database architecture is centralized in shared/:
  - Multi-file Prisma Schema: Split across domain files (auth, roles, user-profiles,
  academic, etc.)
  - Single Prisma Client: shared/db/index.ts provides a singleton client used by both
  frontend and backend
  - PostgreSQL Database: All data persisted in Postgres
  - Better-auth Models: User, Session, Account, Verification tables for authentication

  🎨 Frontend (Next.js 15)

  The frontend at frontend/web/ uses:
  - Next.js 15 App Router with Server Components
  - Authentication: Custom JWT auth client (lib/auth-client.ts) communicating with
  NestJS
  - State Management: Zustand for global state
  - UI Components: Radix UI primitives + Tailwind CSS v4
  - Forms: React Hook Form + Zod validation
  - Themes: Multiple themes (light/dark/sepia/celeste/photon) with CSS variables
  - Auth Context: Global auth provider wrapping the app

  Key frontend flows:
  1. User signs up/in through auth pages
  2. Auth client sends credentials to NestJS backend
  3. JWT token stored in localStorage
  4. Protected routes check authentication state
  5. API calls include Bearer token in headers

  🚀 Backend (NestJS)

  The backend at backend/server_NestJS/ provides:
  - Dual API: REST endpoints + GraphQL schema
  - JWT Authentication: Passport.js with Local and JWT strategies
  - Prisma Integration: Uses shared Prisma client through PrismaService
  - Modular Architecture: Separate modules for Auth, Users, GraphQL
  - CORS Enabled: Allows frontend communication

  Backend modules:
  - AuthModule: JWT generation, user registration/login
  - UsersModule: User CRUD operations
  - GraphQLModule: Apollo Server with code-first schema
  - PrismaService: Wraps shared Prisma client

  🔄 Data Flow

  1. Frontend → Backend: HTTP requests with JWT in Authorization header
  2. Backend → Database: Through shared Prisma client
  3. Authentication: JWT tokens with 7-day expiration, auto-refresh every 6 hours
  4. Session Management: Sessions stored in database, linked to users

  🔐 Authentication Architecture

  The auth flow works as follows:
  1. User registers/logs in via frontend forms
  2. Frontend sends credentials to backend/auth/login or /register
  3. Backend validates credentials, generates JWT
  4. JWT + user data returned to frontend
  5. Frontend stores token in localStorage
  6. Subsequent requests include Bearer {token} header
  7. Backend validates JWT on protected routes

  📁 Project Structure

  NextPhoton/
  ├── shared/                  # Shared resources
  │   ├── prisma/schema/      # Multi-file Prisma schemas
  │   └── db/index.ts         # Centralized Prisma client
  ├── frontend/web/           # Next.js application
  │   ├── src/app/           # App router pages
  │   ├── src/lib/           # Utilities & auth client
  │   ├── src/components/    # React components
  │   └── src/contexts/      # React contexts (AuthContext)
  ├── backend/server_NestJS/  # NestJS server
  │   └── src/
  │       ├── auth/          # Authentication module
  │       ├── users/         # Users module
  │       ├── graphql/       # GraphQL resolvers
  │       └── prisma/        # Prisma service wrapper
  └── turbo.json             # Turborepo config

  🎯 Key Features

  - Multi-role System: Learner, Guardian, Educator, ECM, Employee, Intern, Admin
  - ABAC: Attribute-based access control for fine-grained permissions
  - Real-time Updates: GraphQL subscriptions capability
  - Theme System: Multiple UI themes with persistence
  - Responsive Design: Mobile-friendly interface

  🔧 Development Workflow

  1. Run bun install at root to install all dependencies
  2. Start backend: bun run server (port 963)
  3. Start frontend: bun run web (port 369)
  4. Or both: bun run start:all
  5. Database changes: Edit schema files → bun run prisma:push

  The project implements an "Uber for Educators" platform focusing on micromanagement
  and outside-classroom monitoring rather than content delivery. The architecture
  supports multi-tenancy, real-time communication, and comprehensive role-based access
   control.
