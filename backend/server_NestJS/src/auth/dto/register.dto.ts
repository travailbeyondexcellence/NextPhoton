/**
 * Data Transfer Object for User Registration
 * 
 * Validates registration data including:
 * - Email format and uniqueness
 * - Password strength requirements
 * - Name requirements
 * - Valid role selection
 */

import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, Matches } from 'class-validator';

// Define allowed roles for registration
export enum UserRole {
  LEARNER = 'learner',
  GUARDIAN = 'guardian',
  EDUCATOR = 'educator',
  ECM = 'ecm',
  EMPLOYEE = 'employee',
  INTERN = 'intern',
  ADMIN = 'admin',
}

export class RegisterDto {
  /**
   * User's email address
   * Must be a valid email format
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * User's password
   * Minimum 8 characters, must contain at least:
   * - One uppercase letter
   * - One lowercase letter
   * - One number
   * - One special character
   */
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain uppercase, lowercase, number and special character',
    },
  )
  password: string;

  /**
   * User's full name
   * Minimum 2 characters
   */
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  /**
   * User's role in the system
   * Must be one of the predefined roles
   */
  @IsEnum(UserRole, { message: 'Invalid role specified' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;
}