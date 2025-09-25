/**
 * JWT Authentication Guard
 * 
 * Guard that validates JWT tokens for protected routes
 * Triggers the JWT Passport strategy to verify and decode tokens
 * 
 * Use this guard on any route that requires authentication
 */

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Override canActivate to add custom error handling
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Call the parent canActivate which triggers JWT validation
    return super.canActivate(context);
  }

  /**
   * Override handleRequest to customize error messages
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
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}