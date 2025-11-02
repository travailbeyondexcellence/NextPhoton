# NextPhoton Go Microservices Migration Guide

## Overview
This document details the migration from NestJS to Go microservices architecture for the NextPhoton backend.

## Migration Status

### ✅ Completed Tasks

1. **Project Structure Created**
   - Created complete directory structure for Go microservices
   - Location: `/home/zenith/Desktop/Code/NextPhoton/backend/`
   - Structure follows best practices with separate services, shared libraries, and infrastructure

2. **Prisma Schema Analysis**
   - Analyzed existing Prisma schema files
   - Identified 8 core models for Auth service
   - Documented relationships and constraints

3. **Ent Schema Definitions Created**
   - Converted Prisma models to Ent schema (Facebook's ORM for Go)
   - Created schemas for:
     - User
     - Session
     - Account
     - Role
     - Permission
     - UserRole
     - RolePermission
     - UserPermission
   - Location: `backend/services/auth/ent/schema/`

4. **Configuration System**
   - Created config loader with environment variable support
   - Location: `backend/services/auth/config/config.go`
   - Supports DATABASE_URL, JWT_SECRET, CORS, NATS, ports

5. **GraphQL Schema**
   - Defined GraphQL schema for Auth service
   - Includes mutations: login, register, logout, refreshToken
   - Includes queries: me, user, users
   - Location: `backend/services/auth/graph/schema/auth.graphql`

6. **Go Module Initialization**
   - Initialized Go module for Auth service
   - Module name: `github.com/nextphoton/auth-service`
   - Dependencies installing (in progress)

### 🔄 In Progress

1. **Dependency Installation**
   - Installing ent, gqlgen, jwt, bcrypt, pgx, cors, zap
   - Background process running

### ⏳ Pending Tasks

1. **Generate Ent Code**
   ```bash
   cd backend/services/auth
   go run -mod=mod entgo.io/ent/cmd/ent generate ./ent/schema
   ```

2. **Generate GraphQL Code**
   ```bash
   cd backend/services/auth
   go run github.com/99designs/gqlgen generate
   ```

3. **Implement Auth Service Logic**
   - JWT token generation/validation
   - Password hashing with bcrypt
   - Login/register handlers
   - GraphQL resolvers
   - Service layer business logic

4. **Create gRPC Definitions**
   - Define .proto files for inter-service communication
   - Generate Go code from protobuf
   - Implement gRPC servers and clients

5. **NATS Integration**
   - Set up NATS client
   - Implement pub/sub for events
   - Request/reply pattern for service communication

6. **Docker Configuration**
   - Create Dockerfile for Auth service
   - Create docker-compose.yml for local dev
   - Include PostgreSQL, NATS, Auth service, Frontend

7. **Database Migrations**
   - Run ent migrations to create tables
   - Migrate existing data from Prisma tables

8. **Testing**
   - Unit tests with testify
   - Integration tests with dockertest
   - GraphQL query tests

9. **Additional Services**
   - User Service (profiles, roles)
   - Session Service (if needed)
   - Future services as needed

## Architecture Decisions

### Technology Stack

| Component | Technology | Reason |
|-----------|------------|--------|
| GraphQL Server | **gqlgen** | Type-safe, industry standard |
| ORM | **ent** | Best GraphQL integration, type-safe |
| PostgreSQL Driver | **pgx** (via ent) | Fastest driver |
| gRPC | **google.golang.org/grpc** | Standard for service-to-service |
| Message Queue | **NATS** | Lightweight, fast |
| Testing | **testify + dockertest** | Comprehensive |
| JWT | **golang-jwt/jwt/v5** | Most popular |
| Logging | **zap** | Fast structured logging |

### Project Structure

```
/home/zenith/Desktop/Code/NextPhoton/
├── backend/
│   ├── services/
│   │   ├── auth/              # Auth microservice ✅
│   │   │   ├── cmd/server/    # Main entry point
│   │   │   ├── internal/      # Private code
│   │   │   │   ├── handlers/  # GraphQL resolvers
│   │   │   │   ├── grpc/      # gRPC handlers
│   │   │   │   ├── service/   # Business logic
│   │   │   │   ├── repository/# Data access
│   │   │   │   └── middleware/# HTTP middleware
│   │   │   ├── ent/           # Database ORM ✅
│   │   │   │   └── schema/    # ent schemas ✅
│   │   │   ├── graph/         # GraphQL ✅
│   │   │   │   ├── schema/    # GraphQL schema ✅
│   │   │   │   └── generated/ # Generated code
│   │   │   ├── proto/         # gRPC definitions
│   │   │   ├── config/        # Configuration ✅
│   │   │   ├── Dockerfile
│   │   │   └── go.mod ✅
│   │   │
│   │   └── user/              # User service (future)
│   │
│   ├── shared/                # Shared libraries
│   │   ├── proto/             # Shared protobuf
│   │   ├── middleware/        # Shared middleware
│   │   ├── auth/              # Auth utilities
│   │   └── nats/              # NATS utilities
│   │
│   └── infrastructure/        # DevOps
│       ├── terraform/
│       ├── kubernetes/
│       └── docker/
│
├── frontend/web/              # Next.js frontend (existing)
└── shared/prisma/             # To be deprecated
```

## Next Steps

### Immediate Actions (Do These First)

1. **Wait for Dependencies to Install**
   Check status:
   ```bash
   cd /home/zenith/Desktop/Code/NextPhoton/backend/services/auth
   go mod tidy
   ```

2. **Generate Ent Code**
   ```bash
   cd backend/services/auth
   go run -mod=mod entgo.io/ent/cmd/ent generate ./ent/schema
   ```

3. **Generate GraphQL Code**
   ```bash
   cd backend/services/auth
   go run github.com/99designs/gqlgen generate
   ```

4. **Create Main Server File**
   Create `cmd/server/main.go` with:
   - HTTP server setup
   - GraphQL handler
   - Database connection
   - CORS middleware
   - Graceful shutdown

5. **Implement Auth Service**
   Create `internal/service/auth_service.go` with:
   - Login logic
   - Register logic
   - JWT generation
   - Password hashing

### File Templates Needed

#### 1. cmd/server/main.go
```go
package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/99designs/gqlgen/graphql/handler"
    "github.com/99designs/gqlgen/graphql/playground"
    "github.com/nextphoton/auth-service/config"
    "github.com/nextphoton/auth-service/ent"
    "github.com/nextphoton/auth-service/graph/generated"
    "github.com/rs/cors"
    _ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatal("Failed to load config:", err)
    }

    // Connect to database
    client, err := ent.Open("pgx", cfg.DatabaseURL)
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    defer client.Close()

    // Run migrations
    if err := client.Schema.Create(context.Background()); err != nil {
        log.Fatal("Failed to create schema:", err)
    }

    // Create GraphQL server
    srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
        Resolvers: &graph.Resolver{Client: client, Config: cfg},
    }))

    // Setup CORS
    corsMiddleware := cors.New(cors.Options{
        AllowedOrigins: []string{cfg.CORSOrigin},
        AllowCredentials: true,
    })

    // Setup routes
    http.Handle("/graphql", corsMiddleware.Handler(srv))
    http.Handle("/playground", playground.Handler("GraphQL", "/graphql"))

    // Start server
    server := &http.Server{
        Addr: ":" + cfg.ServerPort,
    }

    go func() {
        log.Printf("GraphQL server ready at http://localhost:%s/graphql", cfg.ServerPort)
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatal(err)
        }
    }()

    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    server.Shutdown(ctx)
}
```

#### 2. Docker Setup

Create `backend/services/auth/Dockerfile`:
```dockerfile
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/auth-service .
EXPOSE 3963
CMD ["./auth-service"]
```

Create `backend/infrastructure/docker/docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: nextphoton_dev
      POSTGRES_USER: neondb_owner
      POSTGRES_PASSWORD: npg_1gMUbdQyB3Ol
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nats:
    image: nats:latest
    ports:
      - "4222:4222"
      - "8222:8222"

  auth-service:
    build:
      context: ../../services/auth
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://neondb_owner:npg_1gMUbdQyB3Ol@postgres:5432/nextphoton_dev?sslmode=disable
      JWT_SECRET: nextphoton-dev-jwt-secret-key-2024-secure-random-string-min-32-chars
      JWT_EXPIRATION: 7d
      BACKEND_PORT: 3963
      CORS_ORIGIN: http://localhost:369
      NATS_URL: nats://nats:4222
    ports:
      - "3963:3963"
    depends_on:
      - postgres
      - nats

volumes:
  postgres_data:
```

## How to Run

### Local Development (Once Completed)

1. **Start Docker Containers**
   ```bash
   cd /home/zenith/Desktop/Code/NextPhoton/backend/infrastructure/docker
   docker-compose up -d
   ```

2. **Run Migrations**
   ```bash
   cd /home/zenith/Desktop/Code/NextPhoton/backend/services/auth
   go run ./cmd/server  # Migrations run automatically on startup
   ```

3. **Access Services**
   - GraphQL Playground: http://localhost:3963/playground
   - Frontend: http://localhost:369
   - NATS Monitoring: http://localhost:8222

### Testing GraphQL

```graphql
mutation Register {
  register(input: {
    name: "John Doe"
    email: "john@example.com"
    password: "SecurePass123!"
  }) {
    user {
      id
      name
      email
    }
    message
  }
}

mutation Login {
  login(input: {
    email: "john@example.com"
    password: "SecurePass123!"
  }) {
    accessToken
    user {
      id
      name
      email
    }
  }
}

query Me {
  me {
    id
    name
    email
    userRoles {
      id
      roleId
    }
  }
}
```

## Migration Strategy

### Phase 1: Auth Service (Current)
1. Complete Auth service implementation
2. Test login/register/JWT
3. Run in parallel with NestJS
4. Switch frontend to Go backend
5. Deprecate NestJS Auth

### Phase 2: User Service
1. Create User service
2. Implement profile management
3. Role management via gRPC from Auth service
4. Switch frontend endpoints

### Phase 3: Additional Services
1. Session Service
2. Curriculum Service
3. Analytics Service

## Key Files Created

### Ent Schemas ✅
- `backend/services/auth/ent/schema/user.go`
- `backend/services/auth/ent/schema/session.go`
- `backend/services/auth/ent/schema/account.go`
- `backend/services/auth/ent/schema/role.go`
- `backend/services/auth/ent/schema/permission.go`
- `backend/services/auth/ent/schema/userrole.go`
- `backend/services/auth/ent/schema/rolepermission.go`
- `backend/services/auth/ent/schema/userpermission.go`

### Configuration ✅
- `backend/services/auth/config/config.go`

### GraphQL ✅
- `backend/services/auth/graph/schema/auth.graphql`
- `backend/services/auth/gqlgen.yml`

### Module ✅
- `backend/services/auth/go.mod`

## Environment Variables

Required in `.env` or environment:
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=7d

# Server
BACKEND_PORT=3963
CORS_ORIGIN=http://localhost:369

# NATS
NATS_URL=nats://localhost:4222

# Environment
NODE_ENV=development
```

## Deprecation Plan

Once Go services are fully operational:

1. **Remove** `backend/server_NestJS/`
2. **Remove** `shared/prisma/`
3. **Update** Frontend to only use GraphQL (remove REST calls)
4. **Archive** NestJS code in a separate branch

## Resources

- Ent Documentation: https://entgo.io/docs/getting-started
- gqlgen Documentation: https://gqlgen.com/getting-started/
- NATS Documentation: https://docs.nats.io/
- Go Project Layout: https://github.com/golang-standards/project-layout

## Support

For questions or issues:
1. Check this documentation
2. Review ent and gqlgen docs
3. Check generated code in `ent/` and `graph/generated/`

---

**Created**: 2025-11-02
**Last Updated**: 2025-11-02
**Status**: Foundation Complete, Implementation In Progress
