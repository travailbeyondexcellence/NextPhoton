import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserResolver } from './resolvers/user.resolver';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { DateScalar } from './scalars/date.scalar';
import { UsersModule } from '../users/users.module';

/**
 * GraphQL Module Configuration
 * 
 * This module configures Apollo GraphQL server with NestJS integration.
 * It sets up the GraphQL schema generation, playground, and resolvers.
 * 
 * Features:
 * - Code-first schema generation
 * - GraphQL Playground in development
 * - Context injection for authentication
 * - Error formatting for consistent API responses
 * - Custom scalar types for enhanced data handling
 * - Integration with existing service modules
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-first approach: Generate schema from TypeScript decorators
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      // Enable GraphQL Playground in development environment
      playground: process.env.NODE_ENV !== 'production',
      introspection: true,
      // Include stacktrace in development for better debugging
      debug: process.env.NODE_ENV !== 'production',
      // Context function to inject request/response into GraphQL resolvers
      context: ({ req, res }) => ({ req, res }),
      // Format errors for consistent API responses across REST and GraphQL
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        path: error.path,
      }),
      // Note: CORS is handled by the Express server, not GraphQL directly
    }),
    UsersModule,  // Import UsersModule to access UsersService in resolvers
  ],
  providers: [
    UserResolver,     // Register User resolver for GraphQL operations
    GqlAuthGuard,     // Register GraphQL authentication guard
    DateScalar,       // Register custom Date scalar type
  ],
  exports: [
    GqlAuthGuard,     // Export guard for use in other modules
  ],
})
export class GraphqlModule {}