import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TempPrismaService } from '../prisma/temp-prisma.service';

/**
 * Users Module
 * 
 * This module encapsulates all user-related functionality including
 * REST controllers, GraphQL resolvers, and business logic services.
 * It provides both REST and GraphQL access to user operations.
 * 
 * Features:
 * - REST API endpoints for user management
 * - Shared services for GraphQL resolvers
 * - Prisma database integration
 * - User authentication and authorization
 */
@Module({
    controllers: [UsersController],
    providers: [
        UsersService,       // User business logic service
        TempPrismaService,  // Temporary database mock service
    ],
    exports: [
        UsersService,    // Export for use in GraphQL resolvers and other modules
    ],
})
export class UsersModule { } 