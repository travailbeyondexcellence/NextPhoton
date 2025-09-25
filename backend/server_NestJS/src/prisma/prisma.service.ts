import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../../../../shared/db/index';

/**
 * Prisma Service for NestJS Server
 * 
 * This service wraps the centralized Prisma client from the shared folder
 * to ensure both client and server use the same database connection and schema.
 * It delegates all operations to the shared prisma instance.
 * 
 * Benefits:
 * - Single source of truth for database connection
 * - Consistent schema across client and server
 * - Prevents multiple Prisma client instances
 * - Proper connection pooling and management
 * - Full access to all Prisma models and methods through delegation
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    // Delegate all model operations to the shared prisma instance
    get user() { return prisma.user; }
    get session() { return prisma.session; }
    get account() { return prisma.account; }
    get verification() { return prisma.verification; }
    get role() { return prisma.role; }
    get permission() { return prisma.permission; }
    get rolePermission() { return prisma.rolePermission; }
    get userRole() { return prisma.userRole; }
    
    // Profile models
    get learnerProfile() { return prisma.learnerProfile; }
    get guardianProfile() { return prisma.guardianProfile; }
    get educatorProfile() { return prisma.educatorProfile; }
    get eCMProfile() { return prisma.eCMProfile; }
    get employeeProfile() { return prisma.employeeProfile; }
    get internProfile() { return prisma.internProfile; }
    get adminProfile() { return prisma.adminProfile; }
    
    // Transaction support
    get $transaction() { return prisma.$transaction.bind(prisma); }
    
    // Query raw support
    get $queryRaw() { return prisma.$queryRaw.bind(prisma); }
    get $executeRaw() { return prisma.$executeRaw.bind(prisma); }
    
    // Connection methods
    get $connect() { return prisma.$connect.bind(prisma); }
    get $disconnect() { return prisma.$disconnect.bind(prisma); }

    async onModuleInit() {
        // Connection is already managed by the shared client
        await prisma.$connect();
        console.log('✅ PrismaService connected to shared database client');
    }

    async onModuleDestroy() {
        // Disconnect is managed by the shared client
        await prisma.$disconnect();
        console.log('🔌 PrismaService disconnected from shared database client');
    }
} 