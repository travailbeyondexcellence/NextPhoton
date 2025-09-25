import { PrismaClient } from '@prisma/client'
// import { PrismaClient } from '.././../../shared/db';

// import { PrismaClient } from '../../../shared/db/index';
// import { Prisma } from '../../../shared/db/index';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    // Enable tracing in development
    // enableTracing: process.env.NODE_ENV === 'development',
    // trace: {
    //   level: 'query',
    //   emit: (data) => console.log(data),
    // },
    // enableTracing: {
    //   level: 'query',
    //   emit: (data) => console.log(data),
    // },
    // enableTracing: true,

    // enableTracing: undefined,
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
