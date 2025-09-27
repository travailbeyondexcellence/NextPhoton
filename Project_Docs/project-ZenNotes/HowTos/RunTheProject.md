# NextPhoton Project Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- Bun (Latest stable version - package manager)
- PostgreSQL (Latest stable version)
- Git (for version control)

## Environment Setup

1. **Database Configuration**
   - Create a PostgreSQL database for the project
   - Create a `.env` file in the root directory with the following:
     ```env
     DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
     ```
   - Replace `username`, `password`, and `your_database_name` with your PostgreSQL credentials

2. **Authentication Environment Variables**
   - Create a `.env` file in the `frontend/web` directory for Next.js specific variables
   - Add JWT authentication secret keys:
     ```env
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRES_IN=7d
     NEXTAUTH_SECRET=your_nextauth_secret_here
     NEXTAUTH_URL=http://localhost:3001
     ```

## Installation Steps

1. **Install Dependencies**
   ```bash
   # In the root directory
   bun install
   ```

2. **Database Setup**
   ```bash
   # In the root directory
   bun run prisma:generate

   bun run prisma:migrate

   ```

## Running the Project

The project consists of two main components that need to run simultaneously:

1. **Start the Server**
   ```bash
   # From the root directory
   bun run server
   ```
   The NestJS server will start on port 3000

2. **Start the Client**
   ```bash
   # From the root directory (new terminal window)
   bun run web
   ```
   The Next.js client will start on port 3001

3. **Start Both Simultaneously**
   ```bash
   # From the root directory
   bun run start:all
   ```
   This will start both frontend and backend using Turbo

## Project Structure

```
NextPhoton/
├── frontend/
│   └── web/           # Next.js 15 web application
├── backend/
│   └── server_NestJS/ # NestJS API server with GraphQL
├── shared/
│   ├── prisma/        # Centralized Prisma schema
│   └── db/            # Database utilities
├── .env               # Root environment variables
└── package.json       # Root workspace configuration
```

## Important Notes

- The project uses a monorepo structure with Bun workspaces
- The database schema is located in `shared/prisma/schema.prisma`
- Both frontend and backend must be running simultaneously
- The frontend uses Next.js 15 with JWT authentication
- The backend uses NestJS with JWT authentication and GraphQL
- Database operations are handled through Prisma ORM with a centralized client
- Authentication is handled via JWT tokens with role-based access control (ABAC)

## Troubleshooting

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check the `DATABASE_URL` in the root `.env` file
   - Ensure the database exists and is accessible

2. **Port Conflicts**
   - If port 3000 is in use, modify the server port in `server/src/main.ts`
   - If port 3001 is in use, modify the client port in `client/package.json`

3. **Prisma Issues**
   - Run `bun run prisma:generate` if you encounter Prisma client errors
   - Run `bun run test:db` to verify database connection
   - Check Prisma logs for detailed error messages
   - Use `bun run prisma:studio` to open Prisma Studio for database management

## Development Workflow

1. Make changes to the database schema in `shared/prisma/schema.prisma`
2. Run `bun run prisma:migrate` to create and apply new migrations
3. Run `bun run prisma:generate` to update the Prisma client
4. Restart the server if necessary (`bun run server`)
5. The frontend will hot-reload automatically

## Authentication Flow

- JWT-based authentication with secure token storage
- Role-based access control (ABAC) system
- User roles: Learner, Guardian, Educator, EduCare Manager, Employee, Intern, Admin
- Authentication endpoints provided by NestJS backend
- Frontend authentication state managed via React context/hooks

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Documentation](https://jwt.io/introduction)
- [Bun Documentation](https://bun.sh/docs) 