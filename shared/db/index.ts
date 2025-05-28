const { PrismaClient } = require('@prisma/client');
import type { PrismaClient as PrismaClientType } from '@prisma/client';

declare global {
  // Augment the global object only once
  var _prisma: PrismaClientType | undefined;
}

const prisma = global._prisma ?? new PrismaClient({ log: ['error', 'warn'] });

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

export default prisma;
