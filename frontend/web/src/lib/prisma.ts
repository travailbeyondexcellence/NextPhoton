/**
 * Prisma Client for NextPhoton Frontend
 *
 * DEPLOYMENT MODE: Mock Data (No Database)
 * This file safely handles Prisma when DATABASE_URL is not available.
 * For Vercel deployment with mock data, Prisma will gracefully fallback.
 */

import { PrismaClient } from '@prisma/client'

// Mock Prisma client for deployment without database
const createMockPrismaClient = () => {
  console.warn('⚠️ Prisma: DATABASE_URL not configured. Using mock data mode.');

  return new Proxy({} as any, {
    get: (_target, prop) => {
      return () => {
        console.warn(`Prisma.${String(prop)} called but DATABASE_URL not configured.`);
        return Promise.resolve([]);
      };
    },
  });
};

const prismaClientSingleton = () => {
  // Only create real Prisma client if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    return createMockPrismaClient();
  }

  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
