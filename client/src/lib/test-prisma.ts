// This script is used to test Prisma connection to the Neon database.

// THIS FILE SHOULD NOT BE DELETED OR MOVED.
// Make sure to run this script from the client directory: `npx ts-node src/lib/test-prisma.ts`
// Ensure you have the correct environment variables set in your .env file.


// import { PrismaClient } from '@prisma/client';

const path = require('path');
const dotenv = require('dotenv');

const dotenvPath = path.resolve(__dirname, '../../../.env');

// console.log("📂 Current Working Directory:", process.cwd());
// require('dotenv').config({ path: '../../../.env' }); // load .env // this assumes you're running from inside client/

dotenv.config({ path: dotenvPath });

console.log("📂 Current Working Directory:", process.cwd());
console.log("📄 Loading .env from:", dotenvPath);
console.log("🔍 Loaded DATABASE_URL:", process.env.DATABASE_URL);


const { PrismaClient } = require('@prisma/client');

// npx ts-node src/lib/test-prisma.ts
console.log("🔍 Loaded DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.betterAuthUser.findMany(); // ✅ model name in camelCase

    console.log("✅ Users fetched from Neon DB:");
    console.log(users);
}

main()
    .catch((e) => {
        console.error("❌ Prisma Error:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });



