// import { PrismaClient } from '@prisma/client'
import { PrismaClient } from '.././../../shared/db';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    // Enable tracing in development
    // enableTracing: process.env.NODE_ENV === 'development',
    // enableTracing: false,
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
