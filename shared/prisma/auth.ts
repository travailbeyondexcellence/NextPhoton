import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
//  npx @better-auth/cli generate --config=./prisma/auth.ts 
// run the above comand from inside the shared folder to generate the schema files that are needed for betterAuth to work with Prisma.



// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "../../../shared/db/index";

import { prisma } from "../db"; // Import the prisma singleton from shared

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    // Add other configurations like authentication methods (email/password, social providers) here
    emailAndPassword: {
        enabled: true
    },
    // socialProviders: { 
    //     github: { 
    //        clientId: process.env.GITHUB_CLIENT_ID as string, 
    //        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    //     }, 
    // }, 
}); 