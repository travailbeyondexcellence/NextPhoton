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
│   │   └── schema.prisma          # ✅ Single schema source
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
- **`shared/prisma/schema.prisma`** - Single Prisma schema definition
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

### **1. Centralized Prisma Client (`shared/db/index.ts`)**

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

Essential scripts for Prisma management:

```json
{
  "scripts": {
    "prisma:generate": "npx prisma generate --schema=shared/prisma/schema.prisma",
    "prisma:push": "npx prisma db push --schema=shared/prisma/schema.prisma && npx prisma generate --schema=shared/prisma/schema.prisma",
    "prisma:migrate": "npx prisma migrate dev --name your_change_name --schema=shared/prisma/schema.prisma",
    "prisma:studio": "npx prisma studio --schema=shared/prisma/schema.prisma",
    "test:db": "npx tsx shared/db/test-connection.ts",
    "test:prisma": "npm run test:db"
  }
}
```

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

**Cause**: Client not regenerated after schema changes

**Solution**:
```bash
npm run prisma:push  # Push schema + regenerate client
```

## 🔄 Development Workflow

### **1. Making Schema Changes**
```bash
# 1. Edit shared/prisma/schema.prisma
# 2. Push changes to database
npm run prisma:push

# 3. Test connection
npm run test:db

# 4. Restart development servers
cd server && npm run start:dev
```

### **2. Adding New Models**
```bash
# 1. Add model to shared/prisma/schema.prisma
# 2. Update shared/db/test-connection.ts to test new model
# 3. Regenerate client
npm run prisma:generate

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
- Follow centralized schema management
- Update shared test file when adding models
- Use npm scripts for Prisma operations

### **❌ DON'T**
- Create separate Prisma clients in client/server
- Generate multiple Prisma clients
- Duplicate schema files
- Skip connection testing after changes
- Use different Prisma versions across services

## 📝 Summary

NextPhoton's centralized Prisma architecture ensures:

1. **Single Source of Truth**: One schema, one client, consistent access
2. **Proper Testing**: Comprehensive validation utilities
3. **Type Safety**: Shared types across entire application
4. **Performance**: Efficient connection pooling and memory usage
5. **Maintainability**: Simplified schema evolution and debugging

This approach prevents the common monorepo pitfall of multiple Prisma instances and ensures robust, scalable database access across all NextPhoton services.