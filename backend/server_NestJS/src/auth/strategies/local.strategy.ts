/**
 * Local Authentication Strategy
 * 
 * Implements Passport Local Strategy for email/password authentication
 * Used during the login process to validate user credentials
 * 
 * This strategy is triggered by the LocalAuthGuard
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    // Configure the strategy to use email instead of username
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validate method called by Passport during authentication
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns User object if credentials are valid
   * @throws UnauthorizedException if credentials are invalid
   */
  async validate(email: string, password: string): Promise<any> {
    // Delegate to AuthService for actual validation logic
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // The user object returned here will be attached to the request
    // as req.user by Passport
    return user;
  }
}