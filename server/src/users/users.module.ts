import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

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
        UsersService,    // User business logic service
        PrismaService,   // Real Prisma database service
    ],
    exports: [
        UsersService,    // Export for use in GraphQL resolvers and other modules
    ],
})
export class UsersModule { } 