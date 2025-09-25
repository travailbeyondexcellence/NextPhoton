# 📦 NextPhoton - Fullstack Multi-Tenant EduCare Management System

A comprehensive monorepo for the NextPhoton EduCare Management Platform - "Uber for Educators" focusing on micromanagement and outside-classroom monitoring. Built with **Next.js 15**, **NestJS**, **Prisma**, and **Bun**.

---

## 📁 Project Structure

```
NextPhoton/
├── frontend/
│   ├── web/                 # Next.js 15 web application
│   ├── desktop/             # (Future) Desktop application  
│   └── mobile/              # (Future) Mobile application
├── backend/
│   └── server_NestJS/       # NestJS API server with GraphQL
├── shared/
│   ├── prisma/              # Centralized database schema
│   │   └── schema.prisma    # Single source of truth
│   └── db/                  # Database utilities
│       └── index.ts         # Singleton Prisma client
├── Project_Docs/            # Complete project documentation
├── package.json             # Root workspace configuration
├── turbo.json              # Turbo monorepo configuration
└── tsconfig.base.json      # Base TypeScript configuration
```

---

## 🚀 Quick Start

### Prerequisites
- **Bun** (v1.2.21+) - [Install from bun.sh](https://bun.sh)
- **PostgreSQL** database
- **Node.js** (v18+)

### Installation

```bash
# Install all dependencies
bun install

# Generate Prisma client
bun run prisma:generate
```

### Development

```bash
# Start frontend only
bun run web

# Start backend only  
bun run server

# Start both frontend and backend
bun run start:all
```

---

## 📦 Key Commands

All commands run from the repository root:

| Command | Description |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun run web` | Start Next.js frontend (port 3000) |
| `bun run server` | Start NestJS backend (port 4000) |
| `bun run start:all` | Start both servers in parallel |
| `bun run prisma:generate` | Generate Prisma client |
| `bun run prisma:push` | Push schema to database |
| `bun run prisma:migrate` | Create new migration |
| `bun run prisma:studio` | Open Prisma Studio UI |
| `bun run test:db` | Test database connection |

---

## 🏗️ Architecture

### Frontend (`frontend/web`)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with dark mode
- **Authentication**: Better-Auth with Prisma adapter
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + ShadCN

### Backend (`backend/server_NestJS`)
- **Framework**: NestJS with Express
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: Class-validator

### Shared (`shared/`)
- **Database Schema**: Single Prisma schema
- **Database Client**: Centralized Prisma client
- **Types**: Shared TypeScript types
- **Utilities**: Common helper functions

---

## 🔐 Access Control

The platform implements **ABAC (Attribute-Based Access Control)** with the following roles:

- **Learner**: Students accessing educational content
- **Guardian**: Parents monitoring learner progress
- **Educator**: Teachers managing classes and content
- **EduCare Manager (ECM)**: Administrative oversight
- **Employee**: Staff members
- **Intern**: Training personnel
- **Admin**: System administrators

---

## 🗄️ Database

### Prisma Configuration
- **Schema Location**: `shared/prisma/schema.prisma`
- **Client Import**: Always import from `shared/db/index.ts`
- **Connection**: PostgreSQL (configure in `.env`)

### Key Models
- User, Session, Account (Authentication)
- LearnerProfile, GuardianProfile, EducatorProfile
- Course, Lesson, Assignment
- SessionBooking, SessionFeedback
- Transaction, PaymentDetails

---

## 🧠 Development Guidelines

### For AI Tools & Developers

1. **Package Manager**: Always use Bun (never npm/yarn)
2. **Imports**: Import Prisma from `shared/db/index.ts` only
3. **File Structure**: Follow existing patterns in codebase
4. **Comments**: Write elaborate comments for AI agents
5. **TypeScript**: Strict mode enforced across all packages
6. **Authentication**: Use Better-Auth in frontend, JWT in backend
7. **Routing**: Follow Next.js App Router conventions

### Important Paths
- Prisma Schema: `shared/prisma/schema.prisma`
- Database Client: `shared/db/index.ts`
- Auth Config: `frontend/web/src/lib/auth.ts`
- Route Access: `frontend/web/src/lib/routeAccessMap.ts`
- NestJS Entry: `backend/server_NestJS/src/main.ts`

---

## 📚 Documentation

Detailed documentation available in `Project_Docs/`:
- `pd-overview.md` - Project vision
- `pd-business-model.md` - Revenue strategy
- `pd-roles-permissions.md` - ABAC system
- `pd-technical-architecture.md` - Technical design
- `pd-workflows.md` - User journeys
- `pd-analytics.md` - Business intelligence

---

## 🚀 Deployment

### Frontend
- Optimized for Vercel deployment
- Environment variables in `.env.local`

### Backend  
- Docker-ready for cloud deployment
- Supports Fly.io, Render, Railway
- Environment variables in `.env`

---

## 🧩 Roadmap

- [ ] Complete GraphQL API implementation
- [ ] Mobile app with React Native
- [ ] Desktop app with Electron
- [ ] Real-time features with WebSockets
- [ ] Advanced analytics dashboard
- [ ] AI-powered learning recommendations

---

## 👥 Team

**Zenith**  
Founder, Paathshala Educare, Next Photon Academy  
EduTech Entrepreneur · Physics Educator · Fullstack Developer

---

## 📄 License

Proprietary - All rights reserved

---

*Built with ❤️ for revolutionizing education management*