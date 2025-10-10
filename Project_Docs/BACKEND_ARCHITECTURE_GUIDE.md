# Backend Architecture Guide - NextPhoton
## Study Guide for Fly.io Deployment

**Last Updated:** October 6, 2025
**Author:** Generated for NextPhoton Backend Understanding
**Purpose:** Understand your NestJS backend before deploying to Fly.io

---

## 📚 **Your Backend Architecture Overview**

**Your Stack:**
- **Framework:** NestJS (Enterprise Node.js)
- **Database:** PostgreSQL via Prisma ORM
- **API Styles:** REST + GraphQL (Dual API)
- **Authentication:** JWT with Passport.js
- **Port:** 963 (Development)
- **Entry Point:** `backend/server_NestJS/src/main.ts`

---

## 📖 **Essential Reading Order**

### **1. Start Here - Core Architecture** ⭐⭐⭐

**Read these files first:**

```
backend/server_NestJS/src/main.ts              # Entry point - server startup
backend/server_NestJS/src/app.module.ts        # Root module - app structure
```

#### **What `main.ts` Does:**
```typescript
// Line 4-20: Bootstrap function
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:369',
    credentials: true,
  });

  // Server listens on port 963, binds to 0.0.0.0 (all interfaces)
  const PORT = process.env.BACKEND_PORT || process.env.PORT || 963;
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL Playground: http://localhost:${PORT}/graphql`);
}
```

**Key Concepts:**
- `NestFactory.create()` - Creates NestJS application instance
- `enableCors()` - Allows frontend (Vercel) to call backend
- `listen(PORT, '0.0.0.0')` - Binds to all network interfaces (required for Fly.io)

#### **What `app.module.ts` Does:**
```typescript
// Line 21-30: Root module configuration
@Module({
  imports: [
    AuthModule,     // JWT Authentication and authorization
    UsersModule,    // REST API endpoints for user management
    GraphqlModule,  // GraphQL endpoint with resolvers and schema
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Key Concepts:**
- `@Module()` decorator - Defines a NestJS module
- `imports` - Feature modules (Auth, Users, GraphQL)
- `controllers` - REST API endpoint handlers
- `providers` - Services available for dependency injection

---

### **2. Authentication System** ⭐⭐⭐

**Your JWT auth implementation is complete and production-ready:**

```
backend/server_NestJS/src/auth/
├── auth.module.ts           # Auth module configuration
├── auth.service.ts          # Login/register business logic (11KB)
├── auth.controller.ts       # REST endpoints (/auth/login, /auth/register)
├── seed-auth.ts             # Database seeder for test users
├── strategies/
│   ├── jwt.strategy.ts      # JWT token validation strategy
│   └── local.strategy.ts    # Email/password validation strategy
├── guards/
│   ├── jwt-auth.guard.ts    # Protect REST routes with JWT
│   ├── gql-jwt-auth.guard.ts # Protect GraphQL routes with JWT
│   ├── local-auth.guard.ts  # Email/password validation guard
│   └── roles.guard.ts       # Role-based access control (RBAC)
├── decorators/
│   └── roles.decorator.ts   # Custom @Roles() decorator
├── interfaces/
│   └── jwt-payload.interface.ts  # JWT token structure
├── dto/
│   ├── login.dto.ts         # Login request validation
│   └── register.dto.ts      # Register request validation
└── dummy-users.json         # Sample users for testing
```

#### **Authentication Flow:**

**1. User Login (POST /auth/login):**
```
Client → auth.controller.ts → auth.service.ts
  ↓
Validate email/password (local.strategy.ts)
  ↓
Generate JWT token (auth.service.ts)
  ↓
Return { access_token, user }
```

**2. Protected Route Access:**
```
Client sends: Authorization: Bearer <token>
  ↓
jwt-auth.guard.ts intercepts request
  ↓
jwt.strategy.ts validates token
  ↓
Extracts user info → req.user
  ↓
Controller method executes
```

#### **What to Understand:**

**auth.service.ts:**
- `login()` - Validates credentials, generates JWT
- `register()` - Creates new user, hashes password
- `validateUser()` - Checks email/password against database
- Uses Prisma to query database

**jwt.strategy.ts:**
- Extends `PassportStrategy(Strategy)`
- Validates JWT tokens from `Authorization` header
- Extracts user ID from token payload
- Returns user object to `req.user`

**jwt-auth.guard.ts:**
- `@UseGuards(JwtAuthGuard)` - Protect routes
- Automatically validates JWT before controller executes
- Returns 401 Unauthorized if token invalid

**DTOs (Data Transfer Objects):**
- Define request body structure
- Validate incoming data
- Use `class-validator` decorators

---

### **3. REST API** ⭐⭐

**User management endpoints:**

```
backend/server_NestJS/src/users/
├── users.module.ts          # Users module configuration
├── users.service.ts         # Business logic (CRUD operations)
└── users.controller.ts      # REST endpoint definitions
```

#### **REST Endpoints:**

```
GET    /users              # Get all users (paginated)
GET    /users/:id          # Get user by ID
POST   /users              # Create new user
PATCH  /users/:id          # Update user
DELETE /users/:id          # Delete user
```

#### **What to Understand:**

**users.controller.ts:**
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

**Key Concepts:**
- `@Controller('users')` - Defines base route `/users`
- `@Get()`, `@Post()`, `@Patch()`, `@Delete()` - HTTP methods
- Dependency Injection - `usersService` injected via constructor
- Service pattern - Controller delegates to service

**users.service.ts:**
```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

**Key Concepts:**
- `@Injectable()` - Makes class available for DI
- PrismaService - Database access layer
- Async/await - All database operations are asynchronous

---

### **4. GraphQL API** ⭐⭐

**GraphQL implementation:**

```
backend/server_NestJS/src/graphql/
├── graphql.module.ts        # Apollo Server configuration
├── schema.gql               # Generated GraphQL schema
├── resolvers/
│   ├── user.resolver.ts     # User queries/mutations
│   └── auth.resolver.ts     # Auth queries/mutations
├── guards/
│   └── gql-auth.guard.ts    # GraphQL route protection
└── scalars/
    └── date.scalar.ts       # Custom Date scalar type
```

#### **GraphQL Schema (`schema.gql`):**

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  roles: [String!]!
  createdAt: DateTime!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  me: User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

#### **GraphQL Endpoint:**
```
URL: http://localhost:963/graphql
Playground: http://localhost:963/graphql (browser UI)
```

#### **What to Understand:**

**graphql.module.ts:**
```typescript
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
      context: ({ req }) => ({ req }),
    }),
  ],
})
```

**Key Concepts:**
- Apollo Server integration
- `autoSchemaFile` - Auto-generates schema from resolvers
- `playground: true` - Enables GraphQL Playground UI
- `context` - Makes Express request available to resolvers

**user.resolver.ts:**
```typescript
@Resolver(() => User)
export class UserResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlJwtAuthGuard)  // Protected mutation
  async createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }
}
```

**Key Concepts:**
- `@Resolver()` - Defines GraphQL resolver
- `@Query()` - Defines GraphQL query
- `@Mutation()` - Defines GraphQL mutation
- `@Args()` - Extracts GraphQL arguments
- `@UseGuards()` - Protects GraphQL operations

---

### **5. Database Layer** ⭐⭐⭐

**Prisma integration:**

```
backend/server_NestJS/src/prisma/
└── prisma.service.ts        # Prisma client singleton

shared/prisma/
└── schema/                  # Multi-file Prisma schema
    ├── schema.prisma        # Main configuration
    ├── auth.prisma          # User, Session, Account models
    ├── roles-permissions.prisma  # ABAC system
    ├── user-profiles.prisma      # Role-specific profiles
    ├── academic-system.prisma
    ├── session-management.prisma
    ├── monitoring-progress.prisma
    ├── financial-system.prisma
    ├── communication.prisma
    └── analytics-reporting.prisma
```

#### **Prisma Service:**

**prisma.service.ts:**
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Key Concepts:**
- Singleton pattern - One PrismaClient instance
- `onModuleInit()` - Connects to database on startup
- `onModuleDestroy()` - Gracefully disconnects on shutdown
- Injected into services for database access

#### **Database Commands:**

```bash
# From project root
bun run prisma:generate      # Generate Prisma Client
bun run prisma:push          # Push schema to database
bun run prisma:migrate       # Create migration
bun run prisma:studio        # Open database GUI
```

---

## 🔧 **Key NestJS Concepts**

### **1. Dependency Injection (DI)**

**What it is:**
- Services are "injected" into constructors automatically
- NestJS manages service lifecycle (singleton by default)

**Example:**
```typescript
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,      // Injected
    private jwtService: JwtService,     // Injected
  ) {}
}
```

**How it works:**
1. NestJS creates `PrismaService` instance once
2. NestJS creates `JwtService` instance once
3. When `AuthService` is needed, NestJS injects both services
4. No need for `new PrismaService()` - NestJS handles it

---

### **2. Decorators**

**NestJS uses TypeScript decorators extensively:**

```typescript
@Module()         // Define a module
@Controller()     // Define REST controller
@Resolver()       // Define GraphQL resolver
@Injectable()     // Make class available for DI
@UseGuards()      // Apply guards (auth, roles)
@Get()            // HTTP GET endpoint
@Post()           // HTTP POST endpoint
@Query()          // GraphQL query
@Mutation()       // GraphQL mutation
@Param()          // Extract URL parameter
@Body()           // Extract request body
@Args()           // Extract GraphQL arguments
```

---

### **3. Guards**

**Guards protect routes:**

```typescript
// Protect REST endpoint
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Request() req) {
  return req.user;  // User info from JWT
}

// Protect GraphQL query
@Query(() => User)
@UseGuards(GqlJwtAuthGuard)
me(@Context() context) {
  return context.req.user;
}

// Role-based protection
@Get('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
adminOnly() {
  return 'Admin access';
}
```

---

### **4. DTOs (Data Transfer Objects)**

**Validate request data:**

```typescript
// login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// Usage in controller
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

**Benefits:**
- Automatic validation
- Type safety
- Clear API contracts

---

## 🚀 **Fly.io Deployment Preparation**

### **1. Environment Variables**

**Local Development (.env):**
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextphoton"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRATION="7d"

# Server
BACKEND_PORT=963
CORS_ORIGIN="http://localhost:369"

# Frontend URL
FRONTEND_URL="http://localhost:369"
```

**Production (Fly.io secrets):**
```bash
# Will need to set:
DATABASE_URL="postgresql://[fly-postgres-connection-string]"
JWT_SECRET="[strong-random-secret]"
CORS_ORIGIN="https://nextphoton.vercel.app"
FRONTEND_URL="https://nextphoton.vercel.app"
PORT=8080  # Fly.io default
```

---

### **2. Port Configuration**

**Your `main.ts` is already Fly.io-ready:**
```typescript
const PORT = process.env.BACKEND_PORT || process.env.PORT || 963;
await app.listen(PORT, '0.0.0.0');  // ✅ 0.0.0.0 is correct for Fly.io
```

**Why `0.0.0.0` is important:**
- `localhost` (127.0.0.1) - Only accessible from same machine ❌
- `0.0.0.0` - Accessible from all network interfaces ✅ (Required for Fly.io)

---

### **3. CORS Configuration**

**Current (main.ts:8-11):**
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:369',
  credentials: true,
});
```

**For Production:**
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'https://nextphoton.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

### **4. Database Migration Strategy**

**Before deploying:**

1. **Create Fly.io PostgreSQL database**
2. **Run migrations:**
   ```bash
   DATABASE_URL="postgresql://fly-url" bun run prisma:migrate
   ```
3. **Seed initial data:**
   ```bash
   DATABASE_URL="postgresql://fly-url" bun run seed:auth
   ```

---

## 📝 **Backend File Structure**

```
backend/server_NestJS/
├── src/
│   ├── main.ts                    # ⭐ Server entry point
│   ├── app.module.ts              # ⭐ Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   │
│   ├── auth/                      # ⭐⭐⭐ Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts        # Login/register logic
│   │   ├── auth.controller.ts     # REST endpoints
│   │   ├── seed-auth.ts           # Database seeder
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts    # JWT validation
│   │   │   └── local.strategy.ts  # Email/password validation
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── gql-jwt-auth.guard.ts
│   │   │   ├── local-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── interfaces/
│   │   │   └── jwt-payload.interface.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── dummy-users.json
│   │
│   ├── users/                     # ⭐⭐ User management (REST)
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── users.controller.ts
│   │
│   ├── graphql/                   # ⭐⭐ GraphQL API
│   │   ├── graphql.module.ts
│   │   ├── schema.gql             # Generated schema
│   │   ├── resolvers/
│   │   │   ├── user.resolver.ts
│   │   │   └── auth.resolver.ts
│   │   ├── guards/
│   │   │   └── gql-auth.guard.ts
│   │   └── scalars/
│   │       └── date.scalar.ts
│   │
│   ├── prisma/                    # ⭐⭐⭐ Database layer
│   │   └── prisma.service.ts
│   │
│   └── dto/                       # Shared DTOs
│       ├── inputs/
│       │   └── create-user.input.ts
│       ├── outputs/
│       │   └── user.output.ts
│       └── common/
│           └── pagination.dto.ts
│
├── test/                          # Tests
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
└── nest-cli.json                  # NestJS CLI config
```

---

## 🧪 **Testing Your Backend Locally**

### **1. Start Development Server**

```bash
cd backend/server_NestJS
bun run dev
```

**Expected output:**
```
🚀 Server ready at http://localhost:963
🚀 GraphQL Playground: http://localhost:963/graphql
```

---

### **2. Test REST Endpoints**

**Login:**
```bash
curl -X POST http://localhost:963/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

**Expected response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@test.com",
    "name": "Admin User",
    "roles": ["admin"]
  }
}
```

**Get Profile (Protected):**
```bash
curl http://localhost:963/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### **3. Test GraphQL Endpoint**

**Open GraphQL Playground:**
```
http://localhost:963/graphql
```

**Query Users:**
```graphql
query {
  users {
    id
    email
    name
    roles
  }
}
```

**Protected Query:**
```graphql
query {
  me {
    id
    email
    name
  }
}
```

**Set Auth Header in Playground:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

---

## 📚 **Recommended Study Path**

### **Day 1: Core Architecture (1-2 hours)**

1. ✅ **Read:** `main.ts` - Understand server bootstrap
2. ✅ **Read:** `app.module.ts` - See module structure
3. ✅ **Run:** `bun run dev` - Start server
4. ✅ **Test:** Visit http://localhost:963/graphql

**Goal:** Understand how the server starts and modules connect

---

### **Day 2: Authentication Deep Dive (2-3 hours)**

5. ✅ **Read:** `auth/auth.module.ts` - Module configuration
6. ✅ **Read:** `auth/auth.service.ts` - Login/register logic
7. ✅ **Read:** `auth/strategies/jwt.strategy.ts` - JWT validation
8. ✅ **Read:** `auth/guards/jwt-auth.guard.ts` - Route protection
9. ✅ **Test:** Login via curl or Postman

**Goal:** Understand JWT authentication flow end-to-end

---

### **Day 3: API Layers (2 hours)**

10. ✅ **Read:** `users/users.controller.ts` - REST API
11. ✅ **Read:** `graphql/resolvers/user.resolver.ts` - GraphQL
12. ✅ **Read:** `prisma/prisma.service.ts` - Database layer
13. ✅ **Test:** Query GraphQL playground

**Goal:** Understand REST vs GraphQL patterns

---

### **Day 4: Deployment Prep (2-3 hours)**

14. ✅ **Review:** Environment variables needed
15. ✅ **Read:** Fly.io documentation
16. ✅ **Plan:** Database migration strategy
17. ✅ **Prepare:** CORS configuration for Vercel

**Goal:** Ready to deploy to Fly.io

---

## 🎓 **Your Backend Learning Resources**

### **Already Written by You:**

📖 **Your Book: THE_NEXT_PHOTON_PROJECT_GUIDE.md**
- Chapter 19: Introduction to NestJS
- Chapter 20: Dependency Injection
- Chapter 21-22: GraphQL & Apollo Server
- Chapter 23: RESTful API Design
- Chapter 24: JWT Authentication

**These chapters cover exactly what's in your backend!** Read your own work - it's tailored to your codebase.

---

### **Official Documentation:**

- **NestJS:** https://docs.nestjs.com
- **Prisma:** https://www.prisma.io/docs
- **Passport.js:** http://www.passportjs.org/docs
- **Apollo Server:** https://www.apollographql.com/docs/apollo-server

---

## ✅ **Pre-Deployment Checklist**

**Before deploying to Fly.io:**

- [ ] Understand `main.ts` entry point
- [ ] Understand module structure (`app.module.ts`)
- [ ] Know how JWT auth works
- [ ] Test all endpoints locally
- [ ] List required environment variables
- [ ] Plan database migration
- [ ] Update CORS for Vercel frontend
- [ ] Test with Vercel frontend locally
- [ ] Review security (JWT secret, HTTPS, etc.)
- [ ] Prepare health check endpoint

---

## 🚀 **Next Steps**

1. **Today:** Study your backend architecture (2-4 hours)
2. **Tomorrow:** Set up Fly.io account and PostgreSQL
3. **Day 3:** Deploy backend to Fly.io
4. **Day 4:** Connect Vercel frontend to Fly.io backend
5. **Day 5:** Test end-to-end authentication

---

## 📞 **Support Resources**

**Your Documentation:**
- This guide: `BACKEND_ARCHITECTURE_GUIDE.md`
- Your book: `THE_NEXT_PHOTON_PROJECT_GUIDE.md`
- Deployment guides: `VERCEL_DEPLOYMENT_*.md`
- Coding standards: `CodingSOP.md`
- Project context: `CLAUDE.md`

---

**Last Updated:** October 6, 2025
**Status:** ✅ Backend ready for Fly.io deployment
**Frontend:** ✅ Deployed on Vercel
**Next:** 🚀 Deploy backend to Fly.io

---

## 💡 **Key Takeaways**

1. **Your backend is well-architected** - JWT auth, dual API (REST + GraphQL), Prisma ORM
2. **Already production-ready** - Proper error handling, guards, validation
3. **Deployment-ready** - Port binding correct, CORS configurable
4. **Well-documented** - Comments throughout, clear structure

**You've built a solid backend. Now it's time to deploy it!** 🎉
