import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.BetterAuthUser.findMany(); // replace "user" with your model
    console.log(users);
}

main()
    .catch((e) => {
        console.error("❌ Prisma Error:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
