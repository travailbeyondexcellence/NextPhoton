/**
 * Authentication Controller
 * 
 * REST API endpoints for authentication operations:
 * - POST /auth/register - User registration
 * - POST /auth/login - User login
 * - POST /auth/logout - User logout
 * - GET /auth/profile - Get current user profile
 * - POST /auth/refresh - Refresh JWT token
 */

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * 
   * Endpoint: POST /auth/register
   * Creates a new user account with the specified role
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * User login with email and password
   * 
   * Endpoint: POST /auth/login
   * Uses LocalStrategy for authentication via Passport
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * User logout
   * 
   * Endpoint: POST /auth/logout
   * Requires JWT authentication
   * Invalidates the user's session
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  /**
   * Get current user profile
   * 
   * Endpoint: GET /auth/profile
   * Requires JWT authentication
   * Returns the authenticated user's information
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  /**
   * Refresh JWT token
   * 
   * Endpoint: POST /auth/refresh
   * Requires valid JWT token
   * Returns a new JWT token with extended expiration
   */
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req) {
    // The user is already validated by JwtAuthGuard
    // Generate a new token with the same payload
    const payload = {
      sub: req.user.id,
      email: req.user.email,
      roles: req.user.roles,
    };

    return {
      access_token: this.authService.jwtService.sign(payload),
      user: req.user,
    };
  }

  /**
   * Health check endpoint
   * 
   * Endpoint: GET /auth/health
   * Returns the health status of the auth service
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  health() {
    return {
      status: 'healthy',
      service: 'auth',
      timestamp: new Date().toISOString(),
    };
  }
}