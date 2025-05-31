import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../../../shared/db/index';

/**
 * Prisma Service for NestJS Server
 * 
 * This service imports the centralized Prisma client from the shared folder
 * to ensure both client and server use the same database connection and schema.
 * 
 * Benefits:
 * - Single source of truth for database connection
 * - Consistent schema across client and server
 * - Prevents multiple Prisma client instances
 * - Proper connection pooling and management
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    // Use the shared Prisma client instance directly
    user = prisma.user;
    session = prisma.session;
    account = prisma.account;
    verification = prisma.verification;
    
    // Add other models as they are implemented
    // learnerProfile = prisma.learnerProfile;
    // guardianProfile = prisma.guardianProfile;
    // educatorProfile = prisma.educatorProfile;

    async onModuleInit() {
        // Connection is already managed by the shared client
        console.log('✅ PrismaService connected to shared database client');
    }

    async onModuleDestroy() {
        // Disconnect is managed by the shared client
        console.log('🔌 PrismaService disconnected from shared database client');
    }

    // Expose full Prisma client for transaction and advanced operations
    get $() {
        return prisma;
    }
} 