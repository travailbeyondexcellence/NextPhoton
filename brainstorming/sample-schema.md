# Proposed Prisma Schema Design

## Database Configuration
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "C:/Users/zen/Zen Education/NextPhoton/node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Core Enums
```prisma
enum Role {
  LEARNER
  GUARDIAN
  EDUCATOR
  EMPLOYEE
  INTERN
  ADMIN
}
```

## Better-Auth Models (Unchanged)
```prisma
model User {
  id            String    @id
  name          String
  email         String   @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime

  // Auth relations
  sessions      Session[]
  accounts      Account[]

  // App-specific role relations
  userRoles        UserRoles[]
  learnerProfile   LearnerProfile?
  guardianProfile  GuardianProfile?
  educatorProfile  EducatorProfile?
  employeeProfile  EmployeeProfile?
  internProfile    InternProfile?
  adminProfile     AdminProfile?

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

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime

  @@map("account")
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@map("verification")
}
```

## Multi-Tenant & Organization Support
```prisma
model Organization {
  id        String   @id @default(uuid())
  name      String
  domain    String?  @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations to profiles
  learnerProfiles   LearnerProfile[]
  guardianProfiles  GuardianProfile[]
  educatorProfiles  EducatorProfile[]
  employeeProfiles  EmployeeProfile[]
  internProfiles    InternProfile[]
  adminProfiles     AdminProfile[]

  @@map("organization")
}
```

## Role & Permission Management
```prisma
model UserRoles {
  id     String @id @default(uuid())
  userId String
  role   Role
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, role])
  @@map("user_roles")
}

model RolePermissions {
  id          String   @id @default(uuid())
  role        Role     @unique
  permissions Json     // Base permissions for this role
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("role_permissions")
}
```

## Profile Models
```prisma
model LearnerProfile {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Organization relation
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  
  // Common profile fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  isActive             Boolean  @default(true)
  onboardingCompleted  Boolean  @default(false)
  permissions          Json?    // Delta permissions (overrides from role defaults)
  
  // Learner-specific fields
  targetExamYear Int?
  
  // Relations
  guardianRelations GuardianLearnerRelation[] @relation("LearnerRelations")

  @@map("learner_profile")
}

model GuardianProfile {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Organization relation
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  
  // Common profile fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  isActive             Boolean  @default(true)
  onboardingCompleted  Boolean  @default(false)
  permissions          Json?    // Delta permissions (overrides from role defaults)
  
  // Guardian-specific fields
  // (to be added based on requirements)
  
  // Relations
  learnerRelations GuardianLearnerRelation[] @relation("GuardianRelations")

  @@map("guardian_profile")
}

model EducatorProfile {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Organization relation
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  
  // Common profile fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  isActive             Boolean  @default(true)
  onboardingCompleted  Boolean  @default(false)
  permissions          Json?    // Delta permissions (overrides from role defaults)
  
  // Educator-specific fields
  // (to be added based on requirements)

  @@map("educator_profile")
}

model EmployeeProfile {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Organization relation
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  
  // Common profile fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  isActive             Boolean  @default(true)
  onboardingCompleted  Boolean  @default(false)
  permissions          Json?    // Delta permissions (overrides from role defaults)
  
  // Employee-specific fields
  // (to be added based on requirements)

  @@map("employee_profile")
}

model InternProfile {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Organization relation
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  
  // Common profile fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  isActive             Boolean  @default(true)
  onboardingCompleted  Boolean  @default(false)
  permissions          Json?    // Delta permissions (overrides from role defaults)
  
  // Intern-specific fields
  // (to be added based on requirements)

  @@map("intern_profile")
}

model AdminProfile {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Organization relation
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  
  // Common profile fields
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  isActive             Boolean  @default(true)
  onboardingCompleted  Boolean  @default(false)
  permissions          Json?    // Delta permissions (overrides from role defaults)
  
  // Admin-specific fields
  // (to be added based on requirements)

  @@map("admin_profile")
}
```

## Relationship Models
```prisma
model GuardianLearnerRelation {
  id            String @id @default(uuid())
  guardianId    String
  learnerId     String
  relationship  String // "parent", "legal_guardian", "elder_brother", etc.
  permissions   Json?  // What can this guardian do for this learner
  isActive      Boolean @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  guardian LearnerProfile @relation("GuardianRelations", fields: [guardianId], references: [id], onDelete: Cascade)
  learner  GuardianProfile @relation("LearnerRelations", fields: [learnerId], references: [id], onDelete: Cascade)

  @@unique([guardianId, learnerId])
  @@map("guardian_learner_relation")
}
```

## Key Features of This Schema:

1. **Better-Auth Isolation**: Auth models remain unchanged for easy future replacement
2. **Multi-Role Support**: Users can have multiple roles via UserRoles model
3. **Hierarchical Permissions**: Role-based defaults with individual profile overrides
4. **Multi-Tenant Ready**: Organization model for tenant isolation
5. **Relationship Management**: Guardian-learner relationships with permissions
6. **Common Profile Structure**: All profiles share standard fields
7. **Scalable**: Easy to add new roles and profile-specific fields