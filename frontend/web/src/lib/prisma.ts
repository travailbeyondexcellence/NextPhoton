/**
 * Prisma Client for NextPhoton Frontend
 *
 * DEPLOYMENT MODE: Mock Data (No Database)
 * This file safely handles Prisma when DATABASE_URL is not available.
 * For Vercel deployment with mock data, Prisma will gracefully fallback.
 *
 * IMPORTANT: This file uses dynamic imports to avoid build-time dependency on @prisma/client
 * which may not be available in mock deployment environments.
 */

// Type definition for Prisma client (without importing it)
type PrismaClientType = any;

// Mock Prisma client for deployment without database
const createMockPrismaClient = (): PrismaClientType => {
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

const prismaClientSingleton = (): PrismaClientType => {
  // If using mock data, always return mock client
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return createMockPrismaClient();
  }

  // Only create real Prisma client if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    return createMockPrismaClient();
  }

  // Try to dynamically import PrismaClient (only when needed)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  } catch (error) {
    console.warn('⚠️ Prisma client not available. Using mock mode.', error);
    return createMockPrismaClient();
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
