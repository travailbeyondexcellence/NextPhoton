import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';

/**
 * Application Root Module
 * 
 * This is the main application module that imports and configures
 * all feature modules including REST API endpoints and GraphQL.
 * 
 * Features:
 * - JWT Authentication through Auth module
 * - REST API through Users module
 * - GraphQL API through GraphQL module
 * - Shared services and utilities
 * - Database integration
 */
@Module({
  imports: [
    AuthModule,     // JWT Authentication and authorization
    UsersModule,    // REST API endpoints for user management
    GraphqlModule,  // GraphQL endpoint with resolvers and schema
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
