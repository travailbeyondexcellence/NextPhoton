import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * GraphQL Authentication Guard
 * 
 * This guard ensures that GraphQL operations are authenticated by checking
 * for valid session data in the GraphQL context. It extracts the request
 * from GraphQL context and validates the user session.
 * 
 * Features:
 * - GraphQL context handling
 * - Session validation
 * - User context injection
 * - Consistent error handling
 */
@Injectable()
export class GqlAuthGuard implements CanActivate {
  /**
   * Determines if the current GraphQL operation should be allowed
   * 
   * @param context - The execution context containing request information
   * @returns boolean indicating if the operation is authorized
   * @throws UnauthorizedException if user is not authenticated
   */
  canActivate(context: ExecutionContext): boolean {
    // Extract GraphQL context from NestJS execution context
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Check if request object exists (should always be present)
    if (!req) {
      throw new UnauthorizedException('Request context not found');
    }

    // TODO: Integrate with Better-auth session validation
    // For now, we'll check for a simple user property on the request
    // In production, this should validate the session token and load user data
    
    // Placeholder authentication logic
    // Replace with actual Better-auth integration
    const user = req.user; // This would be set by session middleware
    
    if (!user) {
      throw new UnauthorizedException('Authentication required. Please log in to access this resource.');
    }

    // Check if user account is active
    if (user.isActive === false) {
      throw new UnauthorizedException('Account is disabled. Please contact support.');
    }

    // Attach user to GraphQL context for use in resolvers
    req.currentUser = user;
    
    return true;
  }
}

/**
 * Optional Authentication Guard
 * 
 * This guard allows both authenticated and anonymous access,
 * but injects user data when available. Useful for queries
 * that can return different data based on authentication status.
 */
@Injectable()
export class OptionalGqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (!req) {
      return true; // Allow anonymous access if no request context
    }

    // Set user data if available, but don't require authentication
    const user = req.user;
    if (user && user.isActive !== false) {
      req.currentUser = user;
    }

    return true;
  }
}