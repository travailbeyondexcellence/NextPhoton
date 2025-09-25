/**
 * JWT Authentication Strategy
 * 
 * Implements Passport JWT Strategy for token-based authentication
 * Extracts and validates JWT tokens from request headers
 * 
 * This strategy is triggered by the JwtAuthGuard
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      // Extract JWT from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Don't ignore expiration - reject expired tokens
      ignoreExpiration: false,
      
      // Get secret from environment variable or use default
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
    });
  }

  /**
   * Validate method called by Passport after JWT verification
   * 
   * @param payload - Decoded JWT payload
   * @returns User object if token is valid
   * @throws UnauthorizedException if user not found or invalid
   */
  async validate(payload: JwtPayload): Promise<any> {
    // Validate the token payload and get user details
    const user = await this.authService.validateToken(payload);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }

    // The user object returned here will be attached to the request
    // as req.user by Passport
    return user;
  }
}