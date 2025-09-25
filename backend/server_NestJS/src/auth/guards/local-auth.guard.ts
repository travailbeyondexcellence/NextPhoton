/**
 * Local Authentication Guard
 * 
 * Guard that triggers the Local Passport strategy for email/password authentication
 * Used on login endpoints to validate user credentials
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // This guard uses the 'local' strategy defined in LocalStrategy
  // No additional implementation needed - base AuthGuard handles everything
}