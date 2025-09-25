/**
 * Data Transfer Object for User Login
 * 
 * Validates login credentials:
 * - Email format
 * - Password presence
 */

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /**
   * User's email address
   * Must be a valid email format
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * User's password
   * No specific validation as we're checking against stored hash
   */
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}