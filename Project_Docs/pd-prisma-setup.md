# NextPhoton Prisma Setup & Architecture

This document outlines the centralized Prisma architecture implemented in NextPhoton to ensure consistent database access across all services while avoiding common pitfalls of multiple Prisma client instances.

## 🎯 Core Architecture Principle

**Single Source of Truth**: One Prisma client instance shared across the entire monorepo.

### ❌ **WRONG Approach (What NOT to Do)**
```
NextPhoton/
├── client/
│   ├── prisma/
│   │   └── schema.prisma          # ❌ Separate schema
│   └── src/lib/prisma.ts          # ❌ Separate client
├── server/
│   ├── prisma/
│   │   └── schema.prisma          # ❌ Duplicate schema
│   └── src/prisma.service.ts      # ❌ Separate client
```

### ✅ **CORRECT Approach (NextPhoton Implementation)**
```
NextPhoton/
├── shared/
│   ├── prisma/
│   │   ├── schema.prisma          # ✅ Main schema (generator & datasource only)
│   │   └── schemas/               # ✅ Multi-file schema directory
│   │       ├── auth.prisma        # ✅ Better-auth models
│   │       ├── user-profiles.prisma # ✅ Role-specific profiles
│   │       ├── roles-permissions.prisma # ✅ ABAC system
│   │       └── ...other-domains.prisma # ✅ Domain-specific models
│   └── db/
│       ├── index.ts               # ✅ Centralized client
│       └── test-connection.ts     # ✅ Validation tests
├── client/
│   └── src/lib/
│       └── prisma.ts              # ✅ Imports from shared
├── server/
│   └── src/prisma/
│       └── prisma.service.ts      # ✅ Imports from shared
```

## 📁 File Structure & Responsibilities

### **Shared Folder (`shared/`)**
- **`shared/prisma/schema.prisma`** - Main schema file (generator & datasource only)
- **`shared/prisma/schemas/`** - Multi-file schema directory containing domain models
- **`shared/db/index.ts`** - Centralized Prisma client with singleton pattern
- **`shared/db/test-connection.ts`** - Database connection validation tests

### **Client Folder (`client/`)**
- Imports Prisma client from `shared/db/index`
- No separate Prisma configuration
- Uses shared types and client instance

### **Server Folder (`server/`)**
- **`server/src/prisma/prisma.service.ts`** - NestJS service wrapper
- Imports from `shared/db/index` 
- Exposes Prisma models for dependency injection

## 🔧 Implementation Details

### **1. Multi-File Schema Organization**

NextPhoton uses Prisma's multi-file schema feature (GA since v6.7.0) to organize models by domain:

**Main Schema File (`shared/prisma/schema.prisma`):**
```prisma
// Main Prisma Schema File
// Contains only generator and datasource configuration
// All models are in separate files in schemas/ directory

generator client {
  provider = "prisma-client-js"
  output   = "../../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models organized in schemas/ directory:
// - auth.prisma - Better-auth models
// - user-profiles.prisma - Role-specific profiles
// - roles-permissions.prisma - ABAC system
// ... other domain files
```

**Domain-Specific Model Files (`shared/prisma/schemas/`):**
- `auth.prisma` - User, Session, Account, Verification (Better-auth)
- `user-profiles.prisma` - LearnerProfile, GuardianProfile, EducatorProfile, etc.
- `roles-permissions.prisma` - Role, Permission, UserRole, UserPermission
- `academic-system.prisma` - Curriculum, Subject, Topic, Exam models
- `session-management.prisma` - LearningSession, SessionBooking models
- `financial-system.prisma` - Payment, Invoice, RateProposal models
- `communication.prisma` - Message, Notification, Announcement models
- `analytics-reporting.prisma` - Analytics and reporting models

**Key Benefits:**
- ✅ **Domain Separation**: Models grouped by business domain
- ✅ **Reduced Merge Conflicts**: Teams can work on different domains
- ✅ **Better Organization**: Clear file naming and structure
- ✅ **Automatic Combining**: Prisma handles file combination automatically

## 🚀 Setting Up Multi-File Schema Structure

### **Step-by-Step Setup Process**

**1. Create the Directory Structure:**
```bash
# From NextPhoton root directory
mkdir -p shared/prisma/schemas
```

**2. Prepare Main Schema File:**
Create `shared/prisma/schema.prisma` with ONLY configuration:
```prisma
// Main Prisma Schema File
// Contains only generator and datasource configuration
// All models are in separate files in schemas/ directory

generator client {
  provider = "prisma-client-js"
  output   = "../../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models organized in schemas/ directory:
// - auth.prisma - Better-auth models
// - user-profiles.prisma - Role-specific profiles
// - roles-permissions.prisma - ABAC system
// ... other domain files
```

**3. Create Domain-Specific Schema Files:**
In `shared/prisma/schemas/` directory, create:

**`auth.prisma`** (Better-auth models):
```prisma
// Better-Auth Models
// Authentication and session management for NextPhoton

model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@map("session")
}

// ... other auth models
```

**`user-profiles.prisma`** (Role-specific profiles):
```prisma
// User Profile Models
// Role-specific user profiles for NextPhoton

model LearnerProfile {
  id               String    @id @default(cuid())
  userId           String    @unique
  user             User      @relation("UserLearner", fields: [userId], references: [id])
  
  // Learner-specific fields
  grade            String?
  subjects         String[]
  learningGoals    String?
  
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  isActive         Boolean   @default(true)

  @@map("learner_profile")
}

// ... other profile models
```

**4. Update Package.json Scripts:**
Ensure all scripts use directory path:
```json
{
  "scripts": {
    "prisma:generate": "npx prisma generate --schema=shared/prisma",
    "prisma:push": "npx prisma db push --schema=shared/prisma && npx prisma generate --schema=shared/prisma",
    "prisma:migrate": "npx prisma migrate dev --name your_change_name --schema=shared/prisma",
    "prisma:studio": "npx prisma studio --schema=shared/prisma"
  }
}
```

**5. Generate and Test:**
```bash
# Generate Prisma client from multi-file schema
npm run prisma:push

# Test the setup
npm run test:db
```

### **Migration from Single File to Multi-File**

If migrating from a single `schema.prisma` file:

**1. Backup Current Schema:**
```bash
cp shared/prisma/schema.prisma shared/prisma/schema.prisma.backup
```

**2. Extract Models by Domain:**
- Move User, Session, Account, Verification → `schemas/auth.prisma`
- Move profile models → `schemas/user-profiles.prisma`
- Move role/permission models → `schemas/roles-permissions.prisma`
- etc.

**3. Update Main Schema:**
Remove all model definitions, keep only generator and datasource blocks

**4. Update Scripts:**
Change all `--schema=shared/prisma/schema.prisma` to `--schema=shared/prisma`

**5. Test Migration:**
```bash
npm run prisma:push
npm run test:db
```

### **Domain Organization Guidelines**

**Recommended File Structure:**
```
shared/prisma/schemas/
├── auth.prisma                    # Authentication & sessions
├── user-profiles.prisma           # Role-specific profiles  
├── roles-permissions.prisma       # ABAC system
├── academic-system.prisma         # Curriculum, subjects, topics
├── session-management.prisma      # Learning sessions, bookings
├── monitoring-progress.prisma     # ECM tracking, progress
├── financial-system.prisma        # Payments, invoicing, rates
├── communication.prisma           # Messages, notifications
└── analytics-reporting.prisma     # Analytics, reporting
```

**File Naming Conventions:**
- Use kebab-case: `user-profiles.prisma` not `UserProfiles.prisma`
- Be descriptive: `session-management.prisma` not `sessions.prisma`
- Group related models: All payment-related models in `financial-system.prisma`

### **Common Setup Mistakes to Avoid**

❌ **Wrong Script Configuration:**
```json
"prisma:push": "npx prisma db push --schema=shared/prisma/schema.prisma"
```

✅ **Correct Script Configuration:**
```json
"prisma:push": "npx prisma db push --schema=shared/prisma"
```

❌ **Models in Main Schema:**
```prisma
// shared/prisma/schema.prisma
generator client { ... }
datasource db { ... }

model User { ... }  // ❌ Don't put models here
```

✅ **Clean Main Schema:**
```prisma
// shared/prisma/schema.prisma
generator client { ... }
datasource db { ... }

// Models are in schemas/ directory files
```

❌ **Importing/Referencing Other Files:**
```prisma
// ❌ Prisma doesn't support imports
import { User } from './auth.prisma'
```

✅ **Direct Model Usage:**
```prisma
// ✅ Models are automatically available across files
model LearnerProfile {
  userId  String  @unique
  user    User    @relation("UserLearner", fields: [userId], references: [id])
}
```

### **2. Centralized Prisma Client (`shared/db/index.ts`)**

```typescript
import { PrismaClient } from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';

// Global singleton pattern to prevent multiple instances
declare global {
  var _prisma: PrismaClientType | undefined;
}

const prisma = global._prisma ?? new PrismaClient({ 
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// In development, store globally to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

export { prisma };
```

**Key Features:**
- **Singleton Pattern**: Prevents multiple client instances
- **Environment Loading**: Automatic .env file discovery
- **Development Optimization**: Global storage for hot reloading
- **Proper Logging**: Error and warning logs enabled

### **2. Server Integration (`server/src/prisma/prisma.service.ts`)**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../../../shared/db/index';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    // Direct exposure of Prisma models
    user = prisma.user;
    session = prisma.session;
    account = prisma.account;
    verification = prisma.verification;

    async onModuleInit() {
        console.log('✅ PrismaService connected to shared database client');
    }

    async onModuleDestroy() {
        console.log('🔌 PrismaService disconnected from shared database client');
    }

    // Full client access for transactions
    get $() {
        return prisma;
    }
}
```

**Benefits:**
- **NestJS Integration**: Proper lifecycle management
- **Model Exposure**: Direct access to Prisma models
- **Transaction Support**: Full client access for complex operations
- **Logging**: Connection status visibility

### **3. Client Integration (Future)**

```typescript
// client/src/lib/prisma.ts
import { prisma } from '../../../shared/db/index';

export { prisma };
```

## 🧪 Testing Prisma Connection

### **Database Connection Test**

A comprehensive test file is available at `shared/db/test-connection.ts` to validate:

- **Database Connectivity** - Verifies connection to PostgreSQL
- **Schema Validation** - Confirms all models are accessible
- **Data Access** - Tests CRUD operations
- **Performance** - Connection pooling and query speed
- **Better-auth Models** - Validates authentication tables

### **Running Tests**

```bash
# Option 1: Using npm script (recommended)
npm run test:db

# Option 2: Alternative script name
npm run test:prisma

# Option 3: Direct execution
npx tsx shared/db/test-connection.ts
```

### **Expected Test Output**

```bash
🧪 === Prisma Database Connection Test ===
📂 Current Working Directory: /NextPhoton
🔍 DATABASE_URL configured: true
🗄️ Database URL (masked): //***:***@neon.tech

📡 Testing database connection...
✅ Database connection successful

🔍 Testing Prisma client generation...
✅ Prisma client working - User table accessible (5 users found)

👥 Fetching sample users...
✅ Found 2 users in database:
   1. John Doe (john@example.com) - user_1735659234567_abc123def

🔐 Testing Better-auth models...
✅ Sessions: 3
✅ Accounts: 2  
✅ Verifications: 1

⚡ === Prisma Performance Test ===
✅ 10 concurrent queries completed in 120ms
📊 Average query time: 12ms

🏆 All database tests completed successfully!
```

## 📦 Package.json Scripts

Essential scripts for multi-file Prisma schema management:

```json
{
  "scripts": {
    "prisma:generate": "npx prisma generate --schema=shared/prisma",
    "prisma:push": "npx prisma db push --schema=shared/prisma && npx prisma generate --schema=shared/prisma",
    "prisma:migrate": "npx prisma migrate dev --name your_change_name --schema=shared/prisma",
    "prisma:studio": "npx prisma studio --schema=shared/prisma",
    "test:db": "npx tsx shared/db/test-connection.ts",
    "test:prisma": "npm run test:db"
  }
}
```

**⚠️ Important:** Note that `--schema` points to the **directory** (`shared/prisma`) not the file (`shared/prisma/schema.prisma`). This is required for multi-file schema support.

## 🚨 Common Issues & Solutions

### **Issue 1: "Property 'user' does not exist on type 'PrismaClient'"**

**Cause**: Prisma client not generated or outdated

**Solution**:
```bash
npm run prisma:generate
```

### **Issue 2: Multiple Prisma Client Instances**

**Cause**: Separate clients in client/server folders

**Solution**: 
- Remove separate `prisma.ts` files
- Import from `shared/db/index` only
- Use centralized client architecture

### **Issue 3: Environment Variables Not Loading**

**Cause**: `.env` file location issues

**Solution**:
- Place `.env` in root NextPhoton folder
- Verify `DATABASE_URL` is set
- Run test: `npm run test:db`

### **Issue 4: Schema Changes Not Reflected**

**Cause**: Client not regenerated after schema changes or using wrong schema path

**Solution**:
```bash
# Ensure using directory path, not file path
npm run prisma:push  # Push schema + regenerate client

# Verify multi-file schema is working
npm run test:db
```

### **Issue 5: Multi-File Schema Not Working**

**Cause**: Using file path instead of directory path in commands

**Solution**:
```bash
# ✅ CORRECT: Use directory path
--schema=shared/prisma

# ❌ WRONG: Don't use file path
--schema=shared/prisma/schema.prisma
```

## 🔄 Development Workflow

### **1. Making Schema Changes**
```bash
# 1. Edit appropriate file in shared/prisma/schemas/
#    - auth.prisma for user/session models
#    - user-profiles.prisma for role profiles
#    - etc.
# 2. Push changes to database
npm run prisma:push

# 3. Test connection
npm run test:db

# 4. Restart development servers
cd server && npm run start:dev
```

### **2. Adding New Models**
```bash
# 1. Choose appropriate schema file in shared/prisma/schemas/
#    - Create new domain file if needed (e.g., payments.prisma)
#    - Add model to existing domain file if applicable
# 2. Update shared/db/test-connection.ts to test new model
# 3. Push schema changes and regenerate client
npm run prisma:push

# 4. Add model exposure in server/src/prisma/prisma.service.ts
# 5. Test new model access
npm run test:db
```

### **3. Production Deployment**
```bash
# 1. Deploy schema changes
npm run prisma:deployprod

# 2. Generate production client
npm run prisma:generate

# 3. Build applications
npm run build
```

## 📊 Benefits of Centralized Architecture

### **Performance Benefits**
- **Single Connection Pool**: Efficient database connections
- **Reduced Memory Usage**: One client instance vs multiple
- **Faster Cold Starts**: No duplicate client initialization

### **Development Benefits**
- **Consistency**: Same schema across all services
- **Type Safety**: Shared types prevent inconsistencies
- **Easier Debugging**: Single source of database issues
- **Simplified Testing**: One test suite for all database operations

### **Maintenance Benefits**
- **Schema Updates**: Change once, apply everywhere
- **Version Control**: Single Prisma version across monorepo
- **Migration Management**: Centralized database evolution
- **Monitoring**: Single connection point for observability

## 🏗️ Architecture Compliance

### **✅ DO**
- Import Prisma client from `shared/db/index`
- Use provided test utilities for validation
- Follow multi-file schema organization by domain
- Edit models in appropriate `schemas/` files
- Use directory path (`shared/prisma`) in commands
- Update shared test file when adding models
- Use npm scripts for Prisma operations

### **❌ DON'T**
- Create separate Prisma clients in client/server
- Generate multiple Prisma clients
- Copy models between schema files
- Put all models in main schema.prisma file
- Use file path instead of directory path in commands
- Skip connection testing after changes
- Use different Prisma versions across services

## 📝 Summary

NextPhoton's centralized Prisma architecture ensures:

1. **Single Source of Truth**: One client, consistent access across services
2. **Multi-File Organization**: Domain-separated models for better maintainability
3. **Proper Testing**: Comprehensive validation utilities
4. **Type Safety**: Shared types across entire application
5. **Performance**: Efficient connection pooling and memory usage
6. **Team Collaboration**: Reduced merge conflicts with domain separation
7. **Maintainability**: Simplified schema evolution and debugging

This approach prevents the common monorepo pitfall of multiple Prisma instances and ensures robust, scalable database access across all NextPhoton services.

## 📚 Additional Resources

### **Official Prisma Documentation**
- [Multi-file Prisma Schema](https://www.prisma.io/docs/orm/prisma-schema/overview/location)
- [Prisma Schema Location](https://www.prisma.io/docs/orm/prisma-schema/overview/location)
- [Organizing Schema Files](https://www.prisma.io/blog/organize-your-prisma-schema-with-multi-file-support)

### **NextPhoton-Specific Commands**
```bash
# Quick setup verification
npm run test:db

# Schema file validation
npx prisma validate --schema=shared/prisma

# Studio with multi-file schema
npm run prisma:studio

# Format all schema files
npx prisma format --schema=shared/prisma
```

### **IDE Setup for Multi-File Schemas**
For optimal development experience:
1. Install [Prisma VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) v5.15.0+
2. Ensure workspace is opened at NextPhoton root for proper schema discovery
3. Use "Go to Definition" to navigate between related models across files

