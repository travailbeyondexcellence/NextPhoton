import { PrismaClient } from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
declare global {
    var _prisma: PrismaClientType | undefined;
}
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client/runtime/library").DefaultArgs>;
export { prisma };
