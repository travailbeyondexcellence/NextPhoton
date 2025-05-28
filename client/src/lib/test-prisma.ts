// This script is used to test Prisma connection to the Neon database.

// THIS FILE SHOULD NOT BE DELETED OR MOVED.
// Make sure to run this script from the client directory: `npx tsx src/lib/test-prisma.ts` (after installing tsx)
// Ensure you have the correct environment variables set in your .env file.


// import { PrismaClient } from '@prisma/client';

// const path = require('path');
// const dotenv = require('dotenv');
// // const { PrismaClient } = require('@prisma/client');
// // const prisma = new PrismaClient();
// // import { prisma } from '../../../shared/db';
// const sharedDb = require('../../../shared/db');
// const prisma = sharedDb.prisma;

import path from 'path';
import dotenv from 'dotenv';
import { prisma } from '../../../shared/db'; // ✅ import default
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dotenvPath = path.resolve(__dirname, '../../../.env');

// console.log("📂 Current Working Directory:", process.cwd());
// require('dotenv').config({ path: '../../../.env' }); // load .env // this assumes you're running from inside client/

dotenv.config({ path: dotenvPath });

console.log("📂 Current Working Directory:", process.cwd());
console.log("📄 Loading .env from:", dotenvPath);
console.log("🔍 Loaded DATABASE_URL:", process.env.DATABASE_URL);

// npx ts-node src/lib/test-prisma.ts




async function main() {
    const users = await prisma.user.findMany(); // ✅ model name in camelCase

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



