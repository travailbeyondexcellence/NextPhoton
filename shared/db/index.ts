import { PrismaClient } from '@prisma/client';

declare global {
  // Avoid re-declaring in hot reload
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use a singleton pattern in dev to avoid exhausting DB connections on reloads
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
