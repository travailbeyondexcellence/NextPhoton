// shared/db/index.ts
import { PrismaClient as PrismaClientNode } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';
import { Prisma } from '@prisma/client'; // Import Prisma namespace for types if needed

// Determine if we are in an edge environment
// Vercel and Netlify define specific environment variables for their edge functions.
// Cloudflare Workers use a different mechanism (checking `navigator.userAgent`).
// We'll check for common indicators.
const isEdge = typeof process.env.VERCEL_ENV === 'string' || typeof process.env.NETLIFY === 'string' || typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

// Define a type for the client to ensure consistency
let prisma: PrismaClientNode | PrismaClientEdge;

// Instantiate the correct client based on the environment
if (isEdge) {
  console.log("Using Prisma Edge Client");
  prisma = new PrismaClientEdge({
    // Ensure the DATABASE_URL is correctly passed, especially for edge environments
    // Prisma Accelerate or Data Proxy is typically required for edge functions.
    // The connection string might need to be prefixed with `prisma://`
    // Ensure the DATABASE_URL_EDGE environment variable is set for edge environments.
    // This should be the connection string from Prisma Accelerate or Data Proxy.
    datasources: {
      db: {
        url: process.env.DATABASE_URL_EDGE, // Use the edge-specific URL
      },
    },
    log: ['query', 'error', 'warn'], // Optional: configure logging as needed
  });
} else {
  console.log("Using Prisma Node Client");
  // Use the singleton pattern for Node.js environment to prevent multiple instances
  // in development with hot-reloading.
  const prismaClientSingleton = () => {
    return new PrismaClientNode({
      log: ['query', 'error', 'warn'], // Optional: configure logging as needed
      datasources: { // Explicitly pass datasource URL here too for consistency
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  };

  // Use globalThis to store the client in development
  const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof prismaClientSingleton> | undefined;
  };

  prisma = globalForPrisma.prisma ?? prismaClientSingleton();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
}

// Export the instantiated client and the Prisma namespace/types
export { prisma, Prisma, PrismaClientEdge, PrismaClientNode };

// Re-export PrismaClient type, potentially choosing one based on environment or using a union
// For simplicity, let's export the Node client type by default, adjust if needed for specific use cases.
export type PrismaClient = PrismaClientNode;
