import { PrismaClient } from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
/**
 * Centralized Prisma Client for NextPhoton
 * 
 * This is the single source of truth for database connections across
 * the entire NextPhoton application (client, server, and any other services).
 * 
 * Features:
 * - Singleton pattern to prevent multiple client instances
 * - Automatic environment variable loading
 * - Development-friendly logging
 * - Proper connection management
 */

// Load environment variables from root .env file  
const dotenvPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: dotenvPath });

// Global type augmentation for singleton pattern
declare global {
  var _prisma: PrismaClientType | undefined;
}

// Create singleton Prisma client instance
const prisma = global._prisma ?? new PrismaClient({ 
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// In development, store client globally to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

// Log connection info for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log("📂 Shared DB Client - Working Directory:", process.cwd());
  console.log("📄 Shared DB Client - Loading .env from:", dotenvPath);
  console.log("🔍 Shared DB Client - DATABASE_URL configured:", !!process.env.DATABASE_URL);
}

export { prisma };
