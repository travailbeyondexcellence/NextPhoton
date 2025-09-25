/**
 * Authentication Module
 * 
 * This module handles all authentication-related functionality including:
 * - JWT token generation and validation
 * - User registration and login
 * - Password hashing and verification
 * - Session management
 * 
 * Uses Passport.js with Local and JWT strategies for authentication
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // Import configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configure Passport module with default JWT strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Configure JWT module with secret and expiration from environment
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
    
    // Import Users module for user-related operations
    UsersModule,
  ],
  
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
  ],
  
  controllers: [AuthController],
  
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}