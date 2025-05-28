import { PrismaClient } from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dotenvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: dotenvPath });



// Function to test Prisma connection is working:


declare global {
  // Augment the global object only once
  var _prisma: PrismaClientType | undefined;
}

const prisma = global._prisma ?? new PrismaClient({ log: ['error', 'warn'] });

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}




console.log("📂 Current Working Directory:", process.cwd());
console.log("📄 Loading .env from:", dotenvPath);
console.log("🔍 Loaded DATABASE_URL:", process.env.DATABASE_URL);

async function main() {
  const users = await prisma.user.findMany(); // ✅ model name in camelCase

  console.log("✅ Users fetched from Neon DB:");

  if (users.length) { console.log("1st User:", users[0]); }

}

main()
  .catch((e) => {
    console.error("❌ Prisma Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { prisma };
