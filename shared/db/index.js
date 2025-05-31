"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const dotenvPath = path_1.default.resolve(process.cwd(), '.env');
dotenv_1.default.config({ path: dotenvPath });
const prisma = global._prisma ?? new client_1.PrismaClient({
    log: ['error', 'warn'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
exports.prisma = prisma;
if (process.env.NODE_ENV !== 'production') {
    global._prisma = prisma;
}
if (process.env.NODE_ENV !== 'production') {
    console.log("📂 Shared DB Client - Working Directory:", process.cwd());
    console.log("📄 Shared DB Client - Loading .env from:", dotenvPath);
    console.log("🔍 Shared DB Client - DATABASE_URL configured:", !!process.env.DATABASE_URL);
}
//# sourceMappingURL=index.js.map