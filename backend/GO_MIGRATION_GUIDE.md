# NextPhoton Go Microservices - Architecture Guide

## Overview
NextPhoton backend has been fully migrated from NestJS to Go microservices architecture.

## Architecture

### Service Map

| Service | Port | Module | Description |
|---------|------|--------|-------------|
| API Gateway | 3960 | github.com/nextphoton/api-gateway | Chi router, reverse proxy, CORS, rate limiting |
| Auth Service | 3963 | github.com/nextphoton/auth-service | JWT auth, registration, login, RBAC, Ent ORM |
| User Service | 3964 | github.com/nextphoton/user-service | User profiles (7 roles), CRUD, pgx |
| Session Service | 3965 | github.com/nextphoton/session-service | Learning sessions, bookings, attendance, feedback |
| Notification Service | 3966 | github.com/nextphoton/notification-service | Notifications, announcements |
| Payment Service | 3967 | github.com/nextphoton/payment-service | Transactions, invoices, Stripe |
| Media Service | 3968 | github.com/nextphoton/media-service | File uploads, media management |
| Analytics Service | 3969 | github.com/nextphoton/analytics-service | Event tracking, dashboards, learning analytics |

### Technology Stack

| Component | Technology |
|-----------|------------|
| Language | Go 1.24 |
| API | GraphQL (gqlgen) |
| ORM (Auth) | Ent (Facebook) |
| DB Driver | pgx v5 |
| Database | PostgreSQL 16 |
| Router | Chi v5 (Gateway) |
| Auth | JWT (golang-jwt/v5) |
| Password | bcrypt (golang.org/x/crypto) |
| Messaging | NATS |
| Cache | Redis |
| Logging | Zap |
| Config | godotenv |

### Directory Structure

```
backend/
├── api-gateway/
│   ├── cmd/server/main.go          # Entry point
│   ├── config/config.go            # Configuration
│   ├── internal/middleware/         # Auth, CORS, logging, rate limit, recovery
│   ├── Dockerfile
│   └── go.mod
├── services/
│   ├── auth/
│   │   ├── cmd/server/main.go      # Entry point with role seeding
│   │   ├── config/config.go
│   │   ├── ent/schema/             # Ent entity schemas (8 models)
│   │   ├── graph/
│   │   │   ├── schema/auth.graphql
│   │   │   ├── generated/          # gqlgen generated code
│   │   │   └── resolver.go
│   │   ├── internal/
│   │   │   ├── service/auth_service.go
│   │   │   └── middleware/auth.go
│   │   ├── Dockerfile
│   │   └── go.mod
│   ├── user-service/
│   │   ├── cmd/server/main.go
│   │   ├── config/config.go
│   │   ├── graph/schema/user.graphql
│   │   ├── graph/resolver.go
│   │   ├── internal/
│   │   │   ├── service/user_service.go
│   │   │   ├── middleware/auth.go
│   │   │   └── db/db.go
│   │   ├── Dockerfile
│   │   └── go.mod
│   ├── session-service/
│   ├── notification-service/
│   ├── payment-service/
│   ├── media-service/
│   └── analytics-service/
│       (same structure as above)
├── docker-compose.yml
└── GO_MIGRATION_GUIDE.md
```

## Getting Started

### Prerequisites

- Go 1.24+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- NATS (or use Docker)

### Local Development

#### Option 1: Docker Compose (Recommended)

```bash
cd backend
docker-compose up -d
```

All services start automatically. Access:
- API Gateway: http://localhost:3960
- Auth Playground: http://localhost:3963/playground
- Health checks: http://localhost:3960/health

#### Option 2: Run Services Individually

```bash
# Terminal 1: Auth Service
cd backend/services/auth
go run ./cmd/server

# Terminal 2: User Service
cd backend/services/user-service
go run ./cmd/server

# Terminal 3: API Gateway
cd backend/api-gateway
go run ./cmd/server
```

### Generate Code (Required After Schema Changes)

For Auth service (Ent + gqlgen):
```bash
cd backend/services/auth
go run -mod=mod entgo.io/ent/cmd/ent generate ./ent/schema
go run github.com/99designs/gqlgen generate
```

For other services (gqlgen only):
```bash
cd backend/services/<service-name>
go run github.com/99designs/gqlgen generate
```

## API Endpoints

### Auth Service (port 3963)

```graphql
# Register
mutation {
  register(input: { name: "John", email: "john@example.com", password: "Pass123!", role: "learner" }) {
    user { id name email }
    accessToken
    message
  }
}

# Login
mutation {
  login(input: { email: "john@example.com", password: "Pass123!" }) {
    accessToken
    user { id name email userRoles { roleId } }
  }
}

# Get current user (requires Authorization header)
query { me { id name email } }
```

### Gateway Routes

| Route | Service |
|-------|---------|
| /graphql | Auth (default) |
| /auth/graphql | Auth Service |
| /users/graphql | User Service |
| /sessions/graphql | Session Service |
| /notifications/graphql | Notification Service |
| /payments/graphql | Payment Service |
| /media/graphql | Media Service |
| /analytics/graphql | Analytics Service |

## User Roles

7 roles with RBAC/ABAC:
- **learner** - Students
- **guardian** - Parents/guardians
- **educator** - Teachers/tutors
- **ecm** - Education Care Managers
- **employee** - Staff
- **intern** - Interns
- **admin** - System administrators

## Environment Variables

See `.env.example` for the full list. Key variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=min-32-chars
CORS_ORIGIN=http://localhost:369
NATS_URL=nats://localhost:4222
```

## Migration Notes

- NestJS backend has been fully replaced by Go microservices
- Database schema remains compatible (same PostgreSQL, same table structure)
- Frontend points to API Gateway (port 3960) instead of NestJS (port 963)
- Prisma schema in `shared/prisma/` is retained as the schema source of truth
- Ent ORM in auth service mirrors the Prisma schema for auth-related tables
- Other services use raw pgx queries against the same database

---

**Last Updated**: 2026-04-22
**Status**: Migration Complete
