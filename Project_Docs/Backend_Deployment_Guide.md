# Backend Deployment Guide - Session Context

**Created:** October 11, 2025
**Status:** In Progress - Ready to Continue
**Next Session:** Fly.io Deployment Implementation

---

## 📋 Current Progress

### ✅ Completed Tasks

1. **Project Architecture Analysis**
   - Reviewed backend structure at `backend/server_NestJS/`
   - Confirmed NestJS + GraphQL + Apollo Server setup
   - Verified dual API approach (REST + GraphQL)
   - Identified main entry point: `backend/server_NestJS/src/main.ts`

2. **Backend Configuration Review**
   - **Framework:** NestJS (Node.js with TypeScript)
   - **Port:** 963 (development), will use 8080 for Fly.io
   - **API Types:** REST endpoints + GraphQL endpoint
   - **Authentication:** JWT with Passport.js
   - **Database:** PostgreSQL via Prisma ORM
   - **CORS:** Already configured to use `CORS_ORIGIN` env var

3. **Environment Variables Identified**
   - Current (Development):
     - `DATABASE_URL`: postgresql://neondb_owner:npg_1gMUbdQyB3Ol@ep-steep-king-a13wqaa8-pooler.ap-southeast-1.aws.neon.tech/nextphoton_dev?sslmode=require
     - `JWT_SECRET`: xK9#mP2$vL8@nQ5&wR7*bT4!jH6^fA3%sD0~gE1+cY9-uZ2
     - `BACKEND_PORT`: 963
     - `CORS_ORIGIN`: http://localhost:369
     - `FRONTEND_PORT`: 369
     - `NEXT_PUBLIC_API_URL`: http://localhost:963

   - Required for Production:
     - `DATABASE_URL` (Neon production database - need to get this)
     - `JWT_SECRET` (generate new strong secret for production)
     - `PORT`: 8080 (Fly.io standard)
     - `CORS_ORIGIN`: https://[your-vercel-app].vercel.app
     - `FRONTEND_URL`: https://[your-vercel-app].vercel.app
     - `NODE_ENV`: production

### 🔄 Current Task

**Creating Fly.io Configuration Files** - Paused, ready to continue

Files needed:
- `backend/server_NestJS/Dockerfile`
- `backend/server_NestJS/fly.toml`
- `backend/server_NestJS/.dockerignore`
- `Project_Docs/FLY_IO_DEPLOYMENT_GUIDE.md` (comprehensive guide)

---

## 🏗️ Architecture Summary

### Your Tech Stack

```
Production Architecture:
┌────────────────────────────────────────────────────┐
│  Frontend (Vercel)                                 │
│  ├─ Next.js 15 (App Router)                       │
│  ├─ Port: 443 (HTTPS)                             │
│  └─ URL: https://[your-app].vercel.app            │
│                    ↓ HTTPS Requests                │
│  Backend (Fly.io) - TO BE DEPLOYED                 │
│  ├─ NestJS (Node.js + TypeScript)                 │
│  ├─ Apollo Server (GraphQL)                       │
│  ├─ Port: 8080                                     │
│  ├─ REST API: /auth/*, /users/*                   │
│  ├─ GraphQL: /graphql                             │
│  └─ URL: https://[app-name].fly.dev               │
│                    ↓ PostgreSQL SSL                │
│  Database (Neon DB) - ALREADY SET UP              │
│  ├─ PostgreSQL 15                                 │
│  ├─ Region: Asia Southeast (Singapore)            │
│  ├─ Dev DB: nextphoton_dev                        │
│  └─ Prod DB: TBD (need to create/get URL)         │
└────────────────────────────────────────────────────┘
```

### Backend Structure

```
backend/server_NestJS/
├── src/
│   ├── main.ts                    # Entry point - bootstraps NestJS app
│   │                              # Configures CORS, port binding (0.0.0.0)
│   │                              # Already Fly.io-ready!
│   │
│   ├── app.module.ts              # Root module
│   │                              # Imports: AuthModule, UsersModule, GraphqlModule
│   │
│   ├── auth/                      # JWT Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts        # login(), register(), validateUser()
│   │   ├── auth.controller.ts     # POST /auth/login, /auth/register
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts    # Validates JWT tokens
│   │   │   └── local.strategy.ts  # Validates email/password
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts  # Protects REST routes
│   │   │   └── gql-jwt-auth.guard.ts  # Protects GraphQL routes
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   │
│   ├── users/                     # User Management (REST API)
│   │   ├── users.module.ts
│   │   ├── users.service.ts       # CRUD operations
│   │   └── users.controller.ts    # GET, POST, PATCH, DELETE /users
│   │
│   ├── graphql/                   # GraphQL API
│   │   ├── graphql.module.ts      # Apollo Server config
│   │   ├── schema.gql             # Auto-generated schema
│   │   ├── resolvers/
│   │   │   ├── user.resolver.ts   # User queries/mutations
│   │   │   └── auth.resolver.ts   # Auth queries/mutations
│   │   └── guards/
│   │       └── gql-auth.guard.ts
│   │
│   └── prisma/
│       └── prisma.service.ts      # Database connection singleton
│
├── dist/                          # Build output (created by 'bun run build')
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── nest-cli.json                  # NestJS CLI configuration

Files to create for Fly.io:
├── Dockerfile                     # Docker build instructions
├── fly.toml                       # Fly.io deployment config
└── .dockerignore                  # Files to exclude from Docker
```

### Key Backend Features

1. **Dual API Approach**
   - REST API for simple operations (login, register, CRUD)
   - GraphQL API for complex queries (flexible data fetching)

2. **Authentication Flow**
   - User sends credentials → `/auth/login`
   - Backend validates → returns JWT token
   - Frontend stores token → includes in `Authorization: Bearer <token>` header
   - Protected routes validate token → extracts user info

3. **Database Layer**
   - Prisma ORM for type-safe database queries
   - Shared schema at `shared/prisma/schema/`
   - Centralized client at `shared/db/index.ts`

4. **Already Production-Ready**
   - ✅ Port binding to `0.0.0.0` (required for Fly.io)
   - ✅ Environment variable configuration
   - ✅ CORS properly configured
   - ✅ JWT authentication implemented
   - ✅ Error handling and validation

---

## 📝 Next Steps for Deployment

### Step 1: Create Configuration Files (Next Session)

1. **Dockerfile** - Multi-stage build with Bun
   - Stage 1: Build (install deps, generate Prisma, build NestJS)
   - Stage 2: Production (slim image, copy built files)
   - Port: 8080
   - Health check included

2. **fly.toml** - Fly.io configuration
   - App name placeholder
   - Region: Singapore (closest to Neon DB)
   - VM: 256MB RAM (free tier)
   - Health checks configured
   - Auto-stop/start for cost savings

3. **.dockerignore** - Exclude unnecessary files
   - node_modules, tests, .env files, documentation

4. **Comprehensive Deployment Guide** - Step-by-step instructions
   - For beginners to NestJS, GraphQL, Apollo, Fly.io
   - Covers every step from account setup to testing

### Step 2: Prepare Production Environment

1. **Create/Get Production Database URL**
   - Option A: Use existing Neon DB, create new production branch
   - Option B: Create new Neon database for production
   - Get connection string

2. **Generate Production JWT Secret**
   ```bash
   openssl rand -base64 32
   ```

3. **Get Vercel Frontend URL**
   - Confirm exact production URL
   - Format: `https://[subdomain].vercel.app`

### Step 3: Fly.io Setup

1. **Install Fly.io CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create Fly.io account** (if needed)
   - Free tier: 3 VMs with 256MB RAM

3. **Login**
   ```bash
   flyctl auth login
   ```

### Step 4: Initialize Fly.io App

```bash
cd backend/server_NestJS
flyctl launch --no-deploy
```

- Choose app name
- Choose region (Singapore)
- Decline PostgreSQL (already have Neon)
- Decline Redis

### Step 5: Set Environment Secrets

```bash
flyctl secrets set DATABASE_URL="postgresql://..."
flyctl secrets set JWT_SECRET="..."
flyctl secrets set CORS_ORIGIN="https://..."
flyctl secrets set FRONTEND_URL="https://..."
```

### Step 6: Database Migrations

```bash
# From project root
export DATABASE_URL="[production-database-url]"
bun run prisma:generate
bun run prisma:deployprod
```

### Step 7: Deploy

```bash
cd backend/server_NestJS
flyctl deploy
```

### Step 8: Verify Deployment

```bash
flyctl status
flyctl logs
curl https://[app-name].fly.dev
```

### Step 9: Update Frontend

1. Add Vercel environment variables:
   - `NEXT_PUBLIC_API_URL`: https://[app-name].fly.dev
   - `NEXT_PUBLIC_GRAPHQL_URL`: https://[app-name].fly.dev/graphql

2. Redeploy Vercel frontend

### Step 10: Test End-to-End

- Test REST endpoints
- Test GraphQL queries
- Test frontend login
- Verify JWT authentication works

---

## 🔑 Important Information

### Current Environment Variables

**Development (.env):**
```bash
NODE_ENV=development
DATABASE_URL="postgresql://neondb_owner:npg_1gMUbdQyB3Ol@ep-steep-king-a13wqaa8-pooler.ap-southeast-1.aws.neon.tech/nextphoton_dev?sslmode=require"
JWT_SECRET=xK9#mP2$vL8@nQ5&wR7*bT4!jH6^fA3%sD0~gE1+cY9-uZ2
JWT_EXPIRATION=7d
BACKEND_PORT=963
CORS_ORIGIN=http://localhost:369
FRONTEND_PORT=369
NEXT_PUBLIC_API_URL=http://localhost:963
```

**Production (to be set in Fly.io):**
- DATABASE_URL: [Need production Neon DB URL]
- JWT_SECRET: [Generate new secure secret]
- PORT: 8080 (Fly.io standard)
- CORS_ORIGIN: [Vercel URL]
- FRONTEND_URL: [Vercel URL]
- NODE_ENV: production

### Package Manager

**Using Bun** (not npm/yarn)
- Version: 1.1.38+
- All commands use `bun run` or `bunx`

### Backend Scripts

```bash
# From backend/server_NestJS/
bun run dev          # Start development server
bun run build        # Build for production
bun run start:prod   # Start production server
bun run seed:auth    # Seed auth data

# From project root/
bun run server       # Start backend
bun run web          # Start frontend
bun run start:all    # Start both (Turbo)
bun run prisma:generate      # Generate Prisma client
bun run prisma:push          # Push schema to DB
bun run prisma:deployprod    # Deploy migrations
bun run prisma:studio        # Open Prisma Studio
```

### Main Entry Point Analysis

**backend/server_NestJS/src/main.ts:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - already configured for env var
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:369',
    credentials: true,
  });

  // Port - supports Fly.io PORT env var
  const PORT = process.env.BACKEND_PORT || process.env.PORT || 963;

  // Binding - 0.0.0.0 for external access (Fly.io ready!)
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL Playground: http://localhost:${PORT}/graphql`);
}
```

**Key Points:**
- ✅ Already binds to 0.0.0.0 (required for Fly.io)
- ✅ Supports PORT env var (Fly.io uses this)
- ✅ CORS configurable via env var
- ✅ No code changes needed!

---

## 🎓 Learning Notes (For User)

### NestJS Concepts

**What is NestJS?**
- Enterprise Node.js framework
- Built with TypeScript
- Similar to Angular but for backend
- Uses decorators (@Module, @Controller, @Injectable, etc.)

**Key Components:**
- **Modules:** Organize features (AuthModule, UsersModule)
- **Controllers:** Handle HTTP requests (REST endpoints)
- **Services:** Business logic (database operations, validation)
- **Providers:** Injectable dependencies (PrismaService, JwtService)
- **Guards:** Protect routes (JwtAuthGuard for authentication)

### GraphQL Concepts

**What is GraphQL?**
- Query language for APIs
- Alternative to REST
- Clients specify exactly what data they need

**REST vs GraphQL:**
```
REST:                          GraphQL:
GET /users                     query { users { id name } }
GET /users/1                   query { user(id: 1) { name } }
GET /users/1/posts             query { user(id: 1) { posts { title } } }
```

**Benefits:**
- No over-fetching (get only what you need)
- Single endpoint
- Strong typing
- Built-in documentation

### Apollo Server

**What is Apollo?**
- GraphQL server implementation
- Used in your NestJS backend
- Provides GraphQL Playground (testing UI)
- Integrates with NestJS via `@nestjs/apollo` and `@nestjs/graphql`

**In your backend:**
- Endpoint: `/graphql`
- Playground: Available in development
- Auto-generates schema from TypeScript resolvers

### Fly.io Concepts

**What is Fly.io?**
- Platform for deploying applications globally
- Uses Docker containers
- Runs apps on "machines" (lightweight VMs)
- Similar to Heroku but more flexible

**Key Features:**
- Global deployment (multiple regions)
- Auto-scaling
- Health checks
- Secrets management
- Free tier available

**How it works:**
1. You provide Dockerfile
2. Fly.io builds image
3. Deploys to machines in chosen region(s)
4. Routes traffic with SSL/TLS

---

## 📚 Reference Documents

### Project Documentation

Located in `Project_Docs/`:

1. **BACKEND_ARCHITECTURE_GUIDE.md** - Detailed backend overview
   - NestJS architecture explanation
   - Authentication system
   - GraphQL implementation
   - Database layer
   - Study path for beginners

2. **THE_NEXT_PHOTON_PROJECT_GUIDE.md** - Comprehensive project guide
   - Chapters on NestJS, GraphQL, Apollo
   - Written by project team
   - Tailored to this codebase

3. **CLAUDE.md** - Development guidelines
   - ⚠️ NEVER run: `bun install`, `bun run dev`, server commands
   - ⚠️ ALWAYS let user run these commands
   - Git workflow guidelines
   - Commit message format (no Claude attribution)

4. **CodingSOP.md** - Coding standards
   - Production-ready patterns
   - Common mistakes to avoid
   - TypeScript strict mode
   - Build checklist

### External Resources

**NestJS:**
- Docs: https://docs.nestjs.com
- First Steps: https://docs.nestjs.com/first-steps
- Controllers: https://docs.nestjs.com/controllers
- Providers: https://docs.nestjs.com/providers

**GraphQL:**
- Learn GraphQL: https://graphql.org/learn/
- Apollo Server: https://www.apollographql.com/docs/apollo-server/

**Fly.io:**
- Docs: https://fly.io/docs/
- Launch Guide: https://fly.io/docs/hands-on/launch-app/
- Deployment: https://fly.io/docs/apps/deploy/

**Prisma:**
- Docs: https://www.prisma.io/docs
- Deployment: https://www.prisma.io/docs/guides/deployment

---

## ⚠️ Important Reminders

### DO NOT Run These Commands (Per CLAUDE.md)

❌ `bun install` - User runs this
❌ `bun run dev` - User runs this
❌ `bun run server` - User runs this
❌ `bun run start:all` - User runs this
❌ `npm install`, `yarn install` - Never
❌ Any package installation commands
❌ Any server startup commands
❌ Any Prisma generation commands (`bun run prisma:generate`)

### What You CAN Do

✅ Read files
✅ Write/edit code
✅ Create configuration files
✅ Analyze architecture
✅ Provide instructions for user to run commands
✅ Run read-only git commands (`git status`, `git diff`)
✅ Run `ls`, `cat`, `pwd` (read-only)

### Git Workflow

- ✅ Create feature branches: `/feature/Claude/[description]`
- ✅ Create bugfix branches: `/bugfix/Claude/[description]`
- ❌ NEVER include "Co-authored by Claude" in commits
- ❌ NEVER include Claude website links in commits
- ✅ Write clean, simple commit messages

---

## 🎯 When Resuming Next Session

### Quick Start Commands

```bash
# 1. Check current status
cd /home/teamzenith/ZenCo/NextPhoton
git status
git pull  # Make sure you're up to date

# 2. Review this document
cat Project_Docs/Backend_Deployment_Guide.md

# 3. Navigate to backend
cd backend/server_NestJS

# 4. Check existing files
ls -la
```

### What to Do First

1. **Review this document** - Refresh context
2. **Gather production credentials:**
   - Neon DB production URL
   - Generate JWT secret
   - Confirm Vercel URL
3. **Create deployment files:**
   - Dockerfile
   - fly.toml
   - .dockerignore
4. **Follow deployment guide**

### Questions to Answer Next Session

- [ ] Do you have a production Neon DB? Or create new branch?
- [ ] What is your Vercel frontend URL?
- [ ] Do you have Fly.io account? Or need to create?
- [ ] Preferred Fly.io region? (Singapore recommended)
- [ ] Preferred app name on Fly.io?

---

## 📊 Todo List Status

### Completed ✅
1. Examine project structure and backend architecture
2. Review backend configuration (NestJS, GraphQL, Apollo)
3. Identify environment variables and dependencies

### In Progress 🔄
4. Create fly.io configuration files (Paused - ready to continue)

### Pending ⏳
5. Set up fly.io account and CLI
6. Configure environment variables in fly.io
7. Deploy backend to fly.io
8. Update frontend to connect to fly.io backend
9. Test the deployment

---

## 💡 Key Insights

1. **Your backend is already Fly.io-ready!**
   - No code changes needed to main.ts
   - CORS already configurable via env var
   - Port binding already correct (0.0.0.0)

2. **You have excellent documentation**
   - BACKEND_ARCHITECTURE_GUIDE.md is comprehensive
   - Project guide covers all concepts
   - Good comments in code

3. **Well-structured monorepo**
   - Shared Prisma schema
   - Centralized database client
   - Clear separation of concerns

4. **Production-ready architecture**
   - JWT authentication implemented
   - Proper error handling
   - Validation with DTOs
   - Guards for route protection

5. **Beginner-friendly approach needed**
   - Explain NestJS concepts
   - Explain GraphQL vs REST
   - Explain Apollo Server role
   - Explain Fly.io deployment process
   - Step-by-step with context at each step

---

## 📞 Support Information

### If Issues Arise

1. **Backend Architecture Questions:**
   - Read: `Project_Docs/BACKEND_ARCHITECTURE_GUIDE.md`
   - Chapters 19-24 in project guide

2. **Deployment Issues:**
   - Check Fly.io status: https://status.fly.io/
   - Check Neon status: https://neonstatus.com/
   - Review Fly.io docs: https://fly.io/docs/

3. **Database Issues:**
   - Test connection: `bun run test:db`
   - Open Prisma Studio: `bun run prisma:studio`
   - Check Neon dashboard

4. **Build Issues:**
   - Review: `CodingSOP.md`
   - Check TypeScript errors
   - Verify dependencies in package.json

---

**Session End Time:** Ready to continue
**Next Session:** Create Fly.io configuration files and begin deployment
**Estimated Time for Next Session:** 1-2 hours for complete deployment

---

**Document Status:** Active Reference
**Last Updated:** October 11, 2025
**Project:** NextPhoton EduCare Management System
**Team:** Team Zenith
