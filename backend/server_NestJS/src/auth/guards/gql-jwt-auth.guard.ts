/**
 * GraphQL JWT Authentication Guard
 * 
 * Specialized JWT guard for GraphQL endpoints
 * Extracts the request from GraphQL context and validates JWT tokens
 * 
 * Use this guard on GraphQL resolvers that require authentication
 */

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Override getRequest to extract request from GraphQL context
   * GraphQL context structure is different from REST
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (!req) {
      throw new UnauthorizedException('Request context not found in GraphQL operation');
    }

    return req;
  }

  /**
   * Override canActivate for GraphQL-specific handling
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Get the GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Check if authorization header exists
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Call parent canActivate which triggers JWT validation
    return super.canActivate(context);
  }

  /**
   * Override handleRequest to customize error handling for GraphQL
   */
  handleRequest(err: any, user: any, info: any) {
    // Throw specific error messages based on the error type
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired. Please login again.');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token. Please login again.');
      }
      if (info?.message === 'No auth token') {
        throw new UnauthorizedException('Authentication token not provided');
      }
      throw err || new UnauthorizedException('Authentication required for this operation');
    }
    
    return user;
  }
}