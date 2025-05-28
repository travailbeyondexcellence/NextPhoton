import { PrismaClient } from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

declare global {
  // Augment the global object only once
  var _prisma: PrismaClientType | undefined;
}

const prisma = global._prisma ?? new PrismaClient({ log: ['error', 'warn'] });

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

export { prisma };
