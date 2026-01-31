# NextPhoton Technical Architecture

## Document Version
- **Version**: 2.0.0
- **Last Updated**: January 2026
- **Status**: Canonical Reference

---

## 1. Architecture Overview

NextPhoton follows a **microservices-based monorepo architecture** designed for scalability, maintainability, and multi-platform support across web, mobile (Android/iOS/iPadOS), and desktop platforms.

### 1.1 Architecture Principles

| Principle | Application |
|-----------|-------------|
| **Single Responsibility (S)** | Each module/class has one reason to change |
| **Open/Closed (O)** | Entities open for extension, closed for modification |
| **Liskov Substitution (L)** | Subtypes substitutable for base types |
| **Interface Segregation (I)** | Many specific interfaces over one general interface |
| **Dependency Inversion (D)** | Depend on abstractions, not concretions |
| **Clean Architecture** | Domain → Application → Infrastructure → Presentation |
| **MVVM Pattern** | Model-View-ViewModel for all mobile/desktop apps |

### 1.2 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                      │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────┤
│   Next.js   │   Tauri     │   Android   │    iOS      │    iPadOS       │
│   Web App   │   Desktop   │   (Kotlin)  │   (Swift)   │    (Swift)      │
│   (React)   │   (Rust)    │   Compose   │   SwiftUI   │    SwiftUI      │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴────────┬────────┘
       │             │             │             │               │
       └─────────────┴─────────────┼─────────────┴───────────────┘
                                   │
                          ┌────────▼────────┐
                          │  Cloudflare CDN │
                          │  + Workers      │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │   API Gateway   │
                          │   (Go + Chi)    │
                          └────────┬────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       │                   NATS Message Bus                     │
       └───────────────────────────┼───────────────────────────┘
                                   │
    ┌──────────┬──────────┬────────┴────────┬──────────┬──────────┐
    │          │          │                 │          │          │
┌───▼───┐ ┌───▼───┐ ┌────▼────┐ ┌─────────▼┐ ┌──────▼───┐ ┌────▼────┐
│ Auth  │ │ User  │ │ Session │ │Curriculum│ │Notification│ │ Media   │
│Service│ │Service│ │ Service │ │ Service  │ │  Service   │ │ Service │
└───┬───┘ └───┬───┘ └────┬────┘ └────┬─────┘ └─────┬─────┘ └────┬────┘
    │         │          │           │             │            │
    └─────────┴──────────┴───────────┴─────────────┴────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
               ┌────▼────┐                  ┌─────▼─────┐
               │PostgreSQL│                  │   Redis   │
               │ (NeonDB) │                  │  Cache    │
               └──────────┘                  └───────────┘
```

---

## 2. Repository Structure

```
nextphoton/
│
├── frontend/
│   ├── web/                          # Next.js 16 Application
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   ├── components/           # React components
│   │   │   ├── core/                 # Interfaces, Entities, Use Cases
│   │   │   ├── infrastructure/       # Repository implementations
│   │   │   ├── di/                   # Dependency Injection container
│   │   │   ├── presentation/         # Components, Hooks, Providers
│   │   │   └── shared/               # Constants, Utils, Types, Schemas
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   ├── desktop/                      # Rust + Tauri 2.x Application
│   │   ├── src-tauri/                # Rust backend
│   │   │   ├── src/
│   │   │   │   ├── domain/           # Entities, Repository Traits
│   │   │   │   ├── infrastructure/   # Persistence, Network
│   │   │   │   ├── application/      # Commands, State
│   │   │   │   └── di/               # Dependency Injection
│   │   │   └── Cargo.toml
│   │   ├── src/                      # Shared React frontend
│   │   └── package.json
│   │
│   └── mobile/
│       ├── android/                  # Kotlin + Jetpack Compose
│       │   ├── app/src/main/
│       │   │   ├── domain/           # Entities, Repository Interfaces
│       │   │   ├── data/             # Repository Implementations
│       │   │   ├── presentation/     # Screens, ViewModels
│       │   │   └── core/di/          # Koin Modules
│       │   └── build.gradle.kts
│       │
│       ├── ios/                      # Swift + SwiftUI (iPhone)
│       │   ├── Domain/               # Entities, Repository Protocols
│       │   ├── Data/                 # Repository Implementations
│       │   ├── Presentation/         # Views, ViewModels
│       │   ├── Core/DI/              # Factory Containers
│       │   └── Package.swift
│       │
│       └── ipados/                   # Swift + SwiftUI (iPad)
│           ├── Domain/
│           ├── Data/
│           ├── Presentation/
│           ├── Core/DI/
│           └── Package.swift
│
├── backend/
│   ├── api-gateway/                  # Go API Gateway
│   │   ├── cmd/server/
│   │   ├── internal/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   └── handlers/
│   │   └── go.mod
│   │
│   ├── services/                     # Go Microservices
│   │   ├── auth-service/
│   │   │   ├── cmd/server/main.go
│   │   │   ├── config/
│   │   │   ├── domain/               # Entities, Repository Interfaces
│   │   │   ├── application/          # Commands, Queries, DTOs
│   │   │   ├── infrastructure/       # Persistence, Messaging
│   │   │   ├── interfaces/           # GraphQL Resolvers, NATS Handlers
│   │   │   ├── ent/                  # Ent ORM schemas
│   │   │   ├── graph/                # GraphQL schema & resolvers
│   │   │   └── go.mod
│   │   │
│   │   ├── user-service/
│   │   ├── session-service/
│   │   ├── curriculum-service/
│   │   ├── notification-service/
│   │   ├── payment-service/
│   │   ├── analytics-service/
│   │   └── media-service/
│   │
│   ├── shared/                       # Shared Go Libraries
│   │   ├── pkg/
│   │   │   ├── nats/                 # NATS client utilities
│   │   │   ├── postgres/             # Database utilities
│   │   │   ├── middleware/           # Common middleware
│   │   │   └── errors/               # Error handling
│   │   └── go.mod
│   │
│   └── graphql/                      # Federated GraphQL Schema
│       ├── schema/
│       └── federation/
│
├── infrastructure/
│   ├── terraform/                    # Infrastructure as Code
│   │   ├── modules/
│   │   │   ├── kubernetes/
│   │   │   ├── neondb/
│   │   │   ├── redis/
│   │   │   └── cloudflare/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── terragrunt.hcl
│   │
│   ├── kubernetes/                   # K8s Manifests + KEDA
│   │   ├── base/
│   │   │   ├── deployments/
│   │   │   ├── services/
│   │   │   ├── configmaps/
│   │   │   └── secrets/
│   │   ├── overlays/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   ├── keda/                     # KEDA ScaledObjects
│   │   └── kustomization.yaml
│   │
│   ├── helm/                         # Helm Charts
│   │   ├── nextphoton/
│   │   │   ├── charts/
│   │   │   ├── templates/
│   │   │   ├── values.yaml
│   │   │   └── Chart.yaml
│   │   └── dependencies/
│   │
│   ├── argocd/                       # GitOps
│   │   ├── applications/
│   │   ├── projects/
│   │   └── applicationsets/
│   │
│   ├── cloudflare/                   # Workers + R2
│   │   ├── workers/
│   │   └── r2/
│   │
│   └── monitoring/                   # Grafana, Prometheus, etc.
│       ├── prometheus/
│       ├── grafana/
│       ├── loki/
│       └── jaeger/
│
├── project_docs/                     # Documentation (this folder)
│
├── .github/                          # CI/CD Workflows
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── security.yml
│
├── .gitignore
├── README.md
└── Makefile
```

---

## 3. Backend Architecture - Go Microservices

### 3.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Go | 1.22.x | Primary Language |
| **GraphQL** | gqlgen | 0.17.x | GraphQL Server |
| **Router** | chi | 5.0.x | HTTP Router |
| **DI** | wire | 0.6.x | Compile-Time DI |
| **ORM** | ent | 0.13.x | Type-Safe ORM |

### 3.2 Data & Messaging

| Technology | Version | Purpose |
|-----------|---------|---------|
| **PostgreSQL (NeonDB)** | 16.x | Primary Database |
| **pgx** | 5.5.x | PostgreSQL Driver |
| **sqlc** | 1.25.x | Type-Safe SQL |
| **golang-migrate** | 4.17.x | Database Migrations |
| **NATS** | 2.10.x | Message Queue |
| **Redis** | 7.2.x | Caching |

### 3.3 Observability

| Technology | Version | Purpose |
|-----------|---------|---------|
| **zap** | 1.27.x | Structured Logging |
| **OpenTelemetry** | 1.24.x | Distributed Tracing |
| **Prometheus Client** | 1.19.x | Metrics Export |

### 3.4 Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (Go + Chi)                     │
│  • JWT Validation  • Rate Limiting  • Request Routing             │
│  • CORS Handling   • Request Logging  • Load Balancing            │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │      NATS Message Bus      │
                    │  • Pub/Sub  • Request/Reply│
                    └─────────────┬─────────────┘
                                  │
    ┌──────────────┬──────────────┼──────────────┬──────────────┐
    │              │              │              │              │
┌───▼────┐    ┌───▼────┐    ┌────▼───┐    ┌────▼───┐    ┌─────▼────┐
│  AUTH  │    │  USER  │    │SESSION │    │PAYMENT │    │ANALYTICS │
│SERVICE │    │SERVICE │    │SERVICE │    │SERVICE │    │ SERVICE  │
├────────┤    ├────────┤    ├────────┤    ├────────┤    ├──────────┤
│• Login │    │• CRUD  │    │• Book  │    │• UPI   │    │• Events  │
│• Regis │    │• Roles │    │• Track │    │• Stripe│    │• Metrics │
│• JWT   │    │• ABAC  │    │• ECM   │    │• Refund│    │• Reports │
│• OAuth │    │• Orgs  │    │• Attend│    │• Invoice│   │• BI      │
└───┬────┘    └───┬────┘    └───┬────┘    └───┬────┘    └────┬─────┘
    │             │             │             │              │
    └─────────────┴─────────────┴─────────────┴──────────────┘
                                │
                     ┌──────────┴──────────┐
                     │   PostgreSQL (NeonDB)│
                     │   + Redis Cache      │
                     └─────────────────────┘
```

### 3.5 Service Communication Patterns

| Pattern | Technology | Use Case |
|---------|-----------|----------|
| **Synchronous** | GraphQL via gqlgen | Client-facing API |
| **Async Events** | NATS Pub/Sub | Event broadcasting (user.created, session.completed) |
| **Request/Reply** | NATS Request | Service-to-service queries |
| **Internal RPC** | gRPC (optional) | High-performance internal calls |

### 3.6 Clean Architecture per Service

```
service/
├── cmd/server/main.go              # Entry point
├── config/config.go                # Configuration
├── domain/                         # Core Business Logic
│   ├── entities/                   # Domain entities
│   ├── repositories/               # Repository interfaces
│   ├── services/                   # Service interfaces
│   └── events/                     # Domain events
├── application/                    # Use Cases
│   ├── commands/                   # Write operations
│   ├── queries/                    # Read operations
│   └── dto/                        # Data transfer objects
├── infrastructure/                 # External Concerns
│   ├── persistence/                # Database implementations
│   ├── messaging/                  # NATS implementations
│   └── external/                   # External API clients
├── interfaces/                     # Input Adapters
│   ├── graphql/                    # GraphQL resolvers
│   └── nats/                       # NATS handlers
├── ent/                            # Ent ORM (generated)
└── graph/                          # gqlgen (generated)
```

---

## 4. Frontend Architecture - Web (Next.js 16)

### 4.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.x | React Framework (App Router) |
| **Language** | TypeScript | 5.4.x | Type Safety |
| **Runtime** | React | 19.x | UI Library |
| **Package Manager** | Bun | 1.1.x | Fast Package Manager & Runtime |
| **Styling** | Tailwind CSS | 4.x | Utility-First CSS |

### 4.2 State & Data Management

| Technology | Version | Purpose |
|-----------|---------|---------|
| **TanStack Query** | 5.x | Server State Management |
| **Zod** | 3.23.x | Schema Validation |
| **React Hook Form** | 7.51.x | Form Management |
| **GraphQL Request** | 7.x | GraphQL Client |
| **@graphql-codegen** | 5.x | Type Generation |

### 4.3 Testing Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vitest** | 2.x | Unit & Integration Testing |
| **Playwright** | 1.43.x | E2E Testing |
| **Testing Library** | 16.x | Component Testing |
| **MSW** | 2.x | API Mocking |
| **@faker-js/faker** | 8.x | Test Data Generation |

### 4.4 Clean Architecture Layers

| Layer | Responsibility |
|-------|---------------|
| `core/` | Interfaces, Entities, Use Cases (Abstractions) |
| `infrastructure/` | Repository & Service Implementations |
| `di/` | Manual Dependency Injection Container |
| `presentation/` | Components, Hooks, Providers |
| `shared/` | Constants, Utils, Types, Schemas |

---

## 5. Frontend Architecture - Desktop (Tauri 2.x)

### 5.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Tauri | 2.x | Desktop Framework |
| **Backend Language** | Rust | 1.76.x | Native Backend |
| **Frontend** | React + TypeScript | 19.x / 5.4.x | UI (shared with web) |
| **Build Tool** | Vite | 5.x | Frontend Bundler |

### 5.2 Rust Backend Libraries

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tokio** | 1.36.x | Async Runtime |
| **Serde** | 1.0.x | Serialization |
| **SQLx** | 0.7.x | Database (SQLite) |
| **reqwest** | 0.12.x | HTTP Client |
| **graphql_client** | 0.14.x | GraphQL Client |
| **tauri-plugin-store** | 2.x | Local Storage |
| **tauri-plugin-sql** | 2.x | SQLite Plugin |

### 5.3 Architecture Pattern (Clean Architecture)

| Layer | Responsibility |
|-------|---------------|
| `domain/` | Entities, Repository Traits (Interfaces) |
| `infrastructure/` | Persistence, Network Implementations |
| `application/` | Commands, State Management |
| `di/` | Dependency Injection Container |

---

## 6. Frontend Architecture - Mobile Android

### 6.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Kotlin | 2.0.x | Primary Language |
| **UI Framework** | Jetpack Compose | 1.6.x | Declarative UI |
| **Compose BOM** | 2024.02.x | Version Management |
| **Build Tool** | Gradle (Kotlin DSL) | 8.6.x | Build System |

### 6.2 Libraries

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **HTTP Client** | Ktor | 2.3.x | Network Requests |
| **DI** | Koin | 3.5.x | Dependency Injection |
| **Database** | Room | 2.6.x | Local Persistence |
| **GraphQL** | Apollo Kotlin | 4.0.x | GraphQL Client |
| **Async** | Kotlin Coroutines | 1.8.x | Concurrency |
| **Serialization** | Kotlin Serialization | 1.6.x | JSON Parsing |
| **Image Loading** | Coil | 2.6.x | Image Loading |
| **Navigation** | Navigation Compose | 2.7.x | Screen Navigation |
| **Preferences** | DataStore | 1.0.x | Key-Value Storage |

### 6.3 Testing Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **JUnit 5** | 5.10.x | Unit Testing Framework |
| **MockK** | 1.13.x | Kotlin Mocking |
| **Turbine** | 1.1.x | Flow Testing |
| **Robolectric** | 4.11.x | Android Unit Tests |
| **Espresso** | 3.5.x | UI Testing |
| **Compose Test** | 1.6.x | Compose UI Testing |
| **Kaspresso** | 1.5.x | E2E Testing |

### 6.4 Architecture Pattern (Clean Architecture + MVVM)

| Layer | Responsibility |
|-------|---------------|
| `domain/` | Entities, Repository Interfaces, Use Cases |
| `data/` | Repository Implementations, DTOs, DAOs |
| `presentation/` | Screens, ViewModels, States, UI Components |
| `core/di/` | Koin Modules |

---

## 7. Frontend Architecture - Mobile iOS

### 7.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Swift | 5.10+ | Primary Language |
| **UI Framework** | SwiftUI | 5.x | Declarative UI |
| **Min Target** | iOS | 17.0+ | Minimum iOS Version |
| **Package Manager** | Swift Package Manager | - | Dependencies |

### 7.2 Libraries

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **GraphQL** | Apollo iOS | 1.9.x | GraphQL Client |
| **Persistence** | SwiftData | 1.x | Local Database |
| **Keychain** | KeychainAccess | 4.2.x | Secure Storage |
| **Image Loading** | Kingfisher | 7.11.x | Image Loading |
| **DI** | Factory | 2.3.x | Dependency Injection |
| **Networking** | URLSession | - | Native HTTP Client |
| **Reactive** | Combine | - | Reactive Streams |

### 7.3 Testing Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **XCTest** | - | Unit Testing Framework |
| **Quick** | 7.x | BDD Testing |
| **Nimble** | 13.x | Matcher Framework |
| **ViewInspector** | 0.9.x | SwiftUI Testing |
| **OHHTTPStubs** | 9.x | Network Mocking |
| **XCUITest** | - | UI Testing |
| **SnapshotTesting** | 1.15.x | Snapshot Testing |

### 7.4 Architecture Pattern (Clean Architecture + MVVM)

| Layer | Responsibility |
|-------|---------------|
| `Domain/` | Entities, Repository Protocols, Use Cases |
| `Data/` | Repository Implementations, DTOs, APIs |
| `Presentation/` | Views, ViewModels, States, Components |
| `Core/DI/` | Factory Containers |

---

## 8. Frontend Architecture - iPadOS

### 8.1 Core Technologies

Same as iOS with iPad-specific enhancements:

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Swift | 5.10+ | Primary Language |
| **UI Framework** | SwiftUI | 5.x | Declarative UI |
| **Min Target** | iPadOS | 17.0+ | Minimum iPadOS Version |

### 8.2 iPad-Specific Features

| Feature | Technology | Purpose |
|---------|-----------|---------|
| **Multitasking** | SwiftUI Scenes | Split View, Slide Over |
| **Sidebar Navigation** | NavigationSplitView | Three-Column Layout |
| **Keyboard Support** | FocusState, KeyboardShortcut | Hardware Keyboard |
| **Pencil Support** | PencilKit | Apple Pencil Integration |
| **Stage Manager** | WindowGroup | Multi-Window Support |

---

## 9. Database Architecture

### 9.1 Primary Database - PostgreSQL (NeonDB)

**Connection**: Serverless PostgreSQL via NeonDB
**Driver**: pgx v5.5.x (Go)

### 9.2 Schema Organization

The database schema is organized into modular domains:

| Schema File | Models | Purpose |
|------------|--------|---------|
| `auth.prisma` | User, Session, Account, Verification | Authentication |
| `user-profiles.prisma` | 7 role profiles | User management |
| `roles-permissions.prisma` | UserRole, RolePermissions | ABAC system |
| `academic-system.prisma` | Exam, Curriculum, Subject, Topic | Curriculum |
| `session-management.prisma` | LearningSession, Booking, Assignment | Sessions |
| `monitoring-progress.prisma` | ProgressRecord, Milestone, Intervention | ECM tracking |
| `financial-system.prisma` | Transaction, Invoice, Payment | Payments |
| `communication.prisma` | Message, Notification, Announcement | Messaging |
| `analytics-reporting.prisma` | AnalyticsEvent, Metrics, Reports | Analytics |

### 9.3 Caching Layer - Redis

| Use Case | TTL | Purpose |
|----------|-----|---------|
| Session tokens | 7 days | Authentication |
| User permissions | 1 hour | ABAC caching |
| Rate limiting | 1 minute | API protection |
| GraphQL responses | 5 minutes | Query caching |

---

## 10. Message Queue Architecture - NATS

### 10.1 Subject Naming Convention

```
nextphoton.<domain>.<action>.<version>

Examples:
- nextphoton.user.created.v1
- nextphoton.session.completed.v1
- nextphoton.payment.processed.v1
- nextphoton.notification.send.v1
```

### 10.2 Event Types

| Event | Publisher | Subscribers |
|-------|-----------|-------------|
| `user.created` | auth-service | user-service, notification-service |
| `session.booked` | session-service | notification-service, payment-service |
| `session.completed` | session-service | analytics-service, payment-service |
| `payment.processed` | payment-service | notification-service, user-service |
| `progress.updated` | session-service | analytics-service, notification-service |

---

## 11. API Gateway

### 11.1 Responsibilities

- **Authentication**: JWT token validation
- **Authorization**: Permission checking via auth-service
- **Rate Limiting**: Request throttling per user/IP
- **Request Routing**: Route to appropriate microservice
- **CORS Handling**: Cross-origin request handling
- **Request Logging**: Structured logging with correlation IDs
- **Load Balancing**: Distribute requests across service instances

### 11.2 GraphQL Federation

The API Gateway implements GraphQL Federation to compose schemas from all microservices:

```graphql
# Gateway composes schemas from:
# - auth-service (User, Session, Auth mutations)
# - user-service (Profiles, Roles, Permissions)
# - session-service (Sessions, Bookings, Assignments)
# - payment-service (Transactions, Invoices)
# - analytics-service (Metrics, Reports)
```

---

## 12. Security Architecture

### 12.1 Authentication Flow

```
1. User submits credentials
2. Auth-service validates and generates JWT
3. JWT contains: userId, roles[], permissions[]
4. Client stores JWT securely
5. Each request includes JWT in Authorization header
6. API Gateway validates JWT signature
7. Services extract user context from validated JWT
```

### 12.2 ABAC Implementation

```go
// Permission checking flow
func CheckPermission(ctx context.Context, resource, action string) bool {
    user := GetUserFromContext(ctx)

    // 1. Load role-based permissions
    rolePerms := LoadRolePermissions(user.Roles)

    // 2. Apply individual overrides
    userPerms := LoadUserPermissions(user.ID)

    // 3. Merge (user overrides take precedence)
    finalPerms := MergePermissions(rolePerms, userPerms)

    // 4. Check permission
    return finalPerms.Has(resource, action)
}
```

### 12.3 Security Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Vault** | 1.15.x | Secrets Management |
| **SOPS** | 3.8.x | Encrypted Secrets |
| **Falco** | 0.37.x | Runtime Security |
| **OPA/Gatekeeper** | 3.15.x | Policy Enforcement |
| **Cert-Manager** | 1.14.x | TLS Certificate Management |

---

## 13. Environment Configuration

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| `local` | Developer Machine | Docker Compose |
| `dev` | Development Testing | Shared K8s Namespace |
| `staging` | Pre-Production | Isolated K8s Cluster |
| `prod` | Production | Production K8s Cluster |

---

## 14. Key Configuration Files

| Platform | Key Files |
|----------|-----------|
| **Next.js** | `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `bunfig.toml`, `vitest.config.ts`, `playwright.config.ts` |
| **Tauri** | `Cargo.toml`, `tauri.conf.json`, `vite.config.ts` |
| **Android** | `build.gradle.kts`, `libs.versions.toml`, `AndroidManifest.xml` |
| **iOS/iPadOS** | `Package.swift`, `Info.plist`, `*.xcodeproj` |
| **Go Backend** | `go.mod`, `wire.go`, `gqlgen.yml`, `sqlc.yaml` |
| **Infrastructure** | `terraform.tfvars`, `kustomization.yaml`, `Chart.yaml`, `prometheus.yml` |

---

## 15. Related PRD Documents

| Document | Description |
|----------|-------------|
| `pd-infrastructure.md` | Terraform, Kubernetes, KEDA, Helm, ArgoCD |
| `pd-mobile-architecture.md` | Detailed Android and iOS/iPadOS architecture |
| `pd-desktop-architecture.md` | Tauri desktop application details |
| `pd-testing-strategy.md` | Comprehensive testing across all platforms |
| `pd-monitoring-observability.md` | Prometheus, Grafana, Jaeger, Loki |
| `pd-business-intelligence.md` | PostHog, Metabase, analytics tools |
| `pd-roles-permissions.md` | ABAC system and role specifications |
| `pd-workflows.md` | User journeys for all roles |

---

This architecture provides a robust, scalable foundation for NextPhoton's comprehensive educational platform while maintaining flexibility for future enhancements and integrations.
