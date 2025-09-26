# NextPhoton Architecture Documentation

## System Architecture Overview

NextPhoton is a modern monorepo application built with a microservices-oriented architecture, featuring a clear separation between frontend, backend, and shared resources.

```
┌─────────────────────────────────────────────────────────────┐
│                         NextPhoton                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Frontend   │    │   Backend    │    │    Shared    │ │
│  │              │    │              │    │              │ │
│  │  Next.js 15  │◄──►│   NestJS     │◄──►│   Prisma     │ │
│  │  Better-Auth │    │   GraphQL    │    │   Database   │ │
│  │  Tailwind    │    │   JWT Auth   │    │   Types      │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │        │
│         └────────────────────┼────────────────────┘        │
│                              ▼                             │
│                        PostgreSQL                          │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
NextPhoton/
├── frontend/                    # Client applications
│   ├── web/                    # Primary web application
│   │   ├── src/
│   │   │   ├── app/           # Next.js 15 app router
│   │   │   ├── components/    # React components
│   │   │   ├── lib/          # Utilities and configurations
│   │   │   └── statestore/   # Global state management
│   │   └── package.json
│   ├── desktop/               # Future: Electron app
│   └── mobile/               # Future: React Native app
│
├── backend/                    # Server applications
│   └── server_NestJS/         # Primary API server
│       ├── src/
│       │   ├── app.module.ts # Root module
│       │   ├── main.ts       # Entry point
│       │   ├── auth/         # Authentication module
│       │   ├── graphql/      # GraphQL resolvers
│       │   └── prisma/       # Database service
│       └── package.json
│
├── shared/                     # Shared resources
│   ├── prisma/
│   │   └── schema.prisma     # Single database schema
│   └── db/
│       └── index.ts          # Singleton Prisma client
│
└── Project_Docs/              # Documentation
```

## Technology Stack

### Frontend Technologies
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Authentication**: Better-Auth
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI + ShadCN
- **Type Safety**: TypeScript

### Backend Technologies
- **Framework**: NestJS
- **API Layer**: GraphQL (Apollo Server)
- **Database ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: Class-validator
- **Runtime**: Node.js

### Infrastructure
- **Package Manager**: Bun
- **Monorepo Tool**: Turbo
- **Database**: PostgreSQL
- **Type System**: TypeScript (strict mode)

## Data Flow Architecture

```
User Request
     │
     ▼
[Next.js Frontend]
     │
     ├─► Static Pages (SSG)
     │
     ├─► Dynamic Pages (SSR/CSR)
     │      │
     │      ▼
     │   [Better-Auth]
     │      │
     │      ▼
     │   [API Route/GraphQL Query]
     │      │
     └──────┼────────►
            │
     [NestJS Backend]
            │
            ├─► [JWT Validation]
            │
            ├─► [GraphQL Resolver]
            │
            ├─► [Business Logic]
            │
            └─► [Prisma ORM]
                    │
                    ▼
              [PostgreSQL DB]
```

## Authentication Architecture

### Frontend Authentication (Better-Auth)
```typescript
// frontend/web/src/lib/auth.ts
User Login → Better-Auth → Session Creation → Cookie Storage
                ↓
         Prisma Adapter → Database Session
```

### Backend Authentication (JWT)
```typescript
// backend/server_NestJS/src/auth/*
Request → JWT Token → Passport Strategy → User Context
             ↓
        Token Validation → Access Granted/Denied
```

## Database Architecture

### Centralized Schema Management
- Single schema file: `shared/prisma/schema.prisma`
- Shared client: `shared/db/index.ts`
- Used by both frontend and backend

### Key Database Models
```
User ─────┬─► Session
          ├─► Account
          └─► Profile (Learner/Guardian/Educator)
                 │
                 ├─► Course
                 ├─► Assignment
                 ├─► SessionBooking
                 └─► Transaction
```

## Access Control (ABAC)

### Role Hierarchy
```
Admin
  │
  ├── EduCare Manager (ECM)
  │     │
  │     ├── Employee
  │     └── Intern
  │
  ├── Educator
  ├── Guardian
  └── Learner
```

### Permission Matrix
- **Route-based**: Defined in `frontend/web/src/lib/routeAccessMap.ts`
- **API-based**: Implemented via NestJS guards
- **Resource-based**: Tenant isolation at database level

## Development Workflow

### Local Development Setup
1. **Install Dependencies**: `bun install`
2. **Generate Prisma Client**: `bun run prisma:generate`
3. **Database Setup**: `bun run prisma:push`
4. **Start Development**:
   - Frontend: `bun run web`
   - Backend: `bun run server`
   - Both: `bun run start:all`

### Build Pipeline
```
Source Code → TypeScript Compilation → Bundle → Optimize → Deploy
     │              │                      │         │
     └── Type Check ┴── Lint ──────────────┴── Test ─┘
```

## Deployment Architecture

### Frontend Deployment (Vercel)
```
Git Push → Vercel Build → Edge Network → Global CDN
              │
              └─► Environment Variables
                  └─► Database Connection
```

### Backend Deployment (Docker/Cloud)
```
Git Push → Docker Build → Container Registry → Cloud Platform
              │                                  (Fly.io/Render)
              └─► Environment Configuration
                  └─► Database Connection
```

## Performance Optimizations

### Frontend
- Server-side rendering for initial load
- Static generation for marketing pages
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Tailwind CSS purging

### Backend
- GraphQL query optimization
- Prisma query batching
- Connection pooling
- Caching strategies
- Rate limiting

## Security Measures

### Application Security
- JWT token validation
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention (Prisma)

### Data Security
- Password hashing (bcrypt)
- Session management
- Tenant data isolation
- Environment variable protection
- HTTPS enforcement

## Monitoring & Observability

### Logging Strategy
```
Application Logs → Structured Format → Log Aggregation → Analysis
       │                                      │
       └── Error Tracking ────────────────────┘
```

### Key Metrics
- Response times
- Error rates
- Database query performance
- User session analytics
- Resource utilization

## Future Architecture Considerations

### Scalability Plans
1. **Horizontal Scaling**: Multiple backend instances
2. **Database Sharding**: Tenant-based partitioning
3. **Caching Layer**: Redis integration
4. **Message Queue**: Event-driven architecture
5. **Microservices**: Service decomposition

### Technology Roadmap
- WebSocket integration for real-time features
- Mobile app with React Native
- Desktop app with Electron
- AI/ML service integration
- Advanced analytics pipeline

---

*This architecture is designed for scalability, maintainability, and developer experience while focusing on the unique requirements of education management.*