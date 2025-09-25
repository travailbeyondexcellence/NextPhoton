import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

/**
 * Create User Input Type for GraphQL
 * 
 * This input type defines the structure for creating a new user via GraphQL.
 * It includes validation rules to ensure data integrity and security.
 * 
 * Features:
 * - GraphQL InputType for mutations
 * - Class-validator decorators for data validation
 * - Shared validation logic between GraphQL and REST
 */
@InputType()
export class CreateUserInput {
  @Field({ description: 'User email address' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email!: string;

  @Field({ description: 'User password (minimum 8 characters)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password!: string;

  @Field({ description: 'Display name for the user' })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name!: string;

  @Field({ nullable: true, description: 'User profile image URL' })
  @IsOptional()
  @IsString()
  image?: string;
}