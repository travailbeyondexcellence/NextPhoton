# NextPhoton Project Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- PostgreSQL (Latest stable version)
- Git (for version control)
- pnpm (for package management)

## Environment Setup

1. **Database Configuration**
   - Create a PostgreSQL database for the project
   - Create a `.env` file in the root directory with the following:
     ```env
     DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
     ```
   - Replace `username`, `password`, and `your_database_name` with your PostgreSQL credentials

2. **Client Environment Variables**
   - Create a `.env` file in the `client` directory for Next.js specific variables
   - Add any required client-side environment variables (e.g., Clerk authentication keys)
   - Example:
     ```env
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
     CLERK_SECRET_KEY=your_key
     ```

## Installation Steps

1. **Install Dependencies**
   ```bash
   # In the root directory
   npm install
   ```

2. **Database Setup**
   ```bash
   # In the root directory
   npx prisma generate --schema=shared/prisma/schema.prisma

   npx prisma migrate dev --schema=shared/prisma/schema.prisma

   ```

## Running the Project

The project consists of two main components that need to run simultaneously:

1. **Start the Server**
   ```bash
   # Navigate to server directory
   cd server
   
   # Start the NestJS server
   npm run dev
   ```
   The server will start on the default port (typically 3000)

2. **Start the Client**
   ```bash
   # Open a new terminal window
   # Navigate to client directory
   cd client
   
   # Start the Next.js development server
   npm run dev
   ```
   The client will start on port 3001 (since 3000 is used by the server)

## Project Structure

```
NextPhoton/
├── client/             # Next.js frontend application
├── server/             # NestJS backend application
├── shared/             # Shared resources
│   └── prisma/        # Database schema and migrations
├── .env               # Root environment variables
└── package.json       # Root package configuration
```

## Important Notes

- The project uses a monorepo structure with pnpm workspaces
- The database schema is located in `shared/prisma/schema.prisma`
- Both client and server must be running simultaneously
- The client uses Next.js with Clerk authentication
- The server uses NestJS
- Database operations are handled through Prisma ORM

## Troubleshooting

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check the `DATABASE_URL` in the root `.env` file
   - Ensure the database exists and is accessible

2. **Port Conflicts**
   - If port 3000 is in use, modify the server port in `server/src/main.ts`
   - If port 3001 is in use, modify the client port in `client/package.json`

3. **Prisma Issues**
   - Run `npx prisma generate` if you encounter Prisma client errors
   - Run `npx prisma db pull` to verify database connection
   - Check Prisma logs for detailed error messages

## Development Workflow

1. Make changes to the database schema in `shared/prisma/schema.prisma`
2. Run `npx prisma migrate dev` to apply changes
3. Run `npx prisma generate` to update the Prisma client
4. Restart the server if necessary
5. The client will hot-reload automatically

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs) 