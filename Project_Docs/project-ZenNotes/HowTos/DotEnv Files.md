# Environment Configuration Guide

## Overview

This project uses multiple `.env` files to manage environment variables across different parts of the application. This separation ensures proper security and configuration management in our monorepo structure.

## Environment Files Structure

```
NextPhoton/
├── .env                    # Root environment variables (Database & Shared)
├── client/
│   └── .env               # Client-specific environment variables
└── server/
    └── .env               # Server-specific environment variables (if needed)
```

## Root `.env` File

Located in the project root directory, this file contains shared environment variables used across the application.

### Required Variables
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

### Purpose
- Contains database connection string used by Prisma
- Shared between client and server
- Essential for database operations
- Used by Prisma migrations and client generation

## Frontend `.env` File

Located in the `frontend/web` directory, this file contains Next.js and frontend-specific environment variables.

### Required Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000  # NestJS Backend URL

# JWT Configuration (if storing any public keys)
NEXT_PUBLIC_JWT_EXPIRY=3600  # Token expiry in seconds (optional)
```

### Purpose
- Frontend-specific environment variables
- API endpoint configuration
- Public variables (prefixed with `NEXT_PUBLIC_`)
- Any frontend-specific feature flags

## Backend `.env` File

Located in the `backend/server_NestJS` directory, this file contains NestJS backend-specific environment variables.

### Required Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=3600  # Token expiry in seconds

# Database (if different from root)
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# API Keys (if needed)
API_KEY=your_api_key
```

### Purpose
- Backend-specific configuration
- JWT secret key for token generation
- API keys and secrets
- Port configuration
- Environment-specific settings

## Best Practices

1. **Security**
   - Never commit `.env` files to version control
   - Keep sensitive information in appropriate `.env` files
   - Use strong, unique values for secrets
   - Regularly rotate sensitive credentials

2. **Organization**
   - Keep shared variables in root `.env`
   - Separate client and server concerns
   - Use clear, descriptive variable names
   - Document all environment variables

3. **Development**
   - Create `.env.example` files for each `.env`
   - Document required variables
   - Include default values where appropriate
   - Specify which variables are optional

## Example `.env.example` Files

### Root `.env.example`
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### Frontend `.env.example`
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional JWT Configuration
NEXT_PUBLIC_JWT_EXPIRY=3600
```

### Backend `.env.example`
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRY=3600

# Database (optional if using root .env)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

## Environment Variable Usage

### In Client Code
```typescript
// Accessing environment variables in Next.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
```

### In Server Code
```typescript
// Accessing environment variables in NestJS
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
```

### In Prisma
```prisma
// Prisma automatically reads DATABASE_URL from root .env
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Troubleshooting

1. **Database Connection Issues**
   - Verify `DATABASE_URL` in root `.env`
   - Check PostgreSQL is running
   - Ensure database exists
   - Validate credentials

2. **Client Environment Issues**
   - Verify `NEXT_PUBLIC_` prefix for client-side variables
   - Check Clerk keys are properly set
   - Ensure API URL is correct

3. **Server Environment Issues**
   - Verify port configuration
   - Check API keys if used
   - Ensure proper NODE_ENV setting

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [Prisma Environment Variables](https://www.prisma.io/docs/orm/prisma-schema/data-sources)
- [Clerk Environment Setup](https://clerk.com/docs/quickstarts/get-started-with-nextjs)