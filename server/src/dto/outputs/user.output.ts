import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * User Output Type for GraphQL
 * 
 * This type defines the structure of User data returned by GraphQL queries.
 * It's shared between GraphQL and potentially REST endpoints for consistency.
 * 
 * Features:
 * - GraphQL ObjectType for auto-schema generation
 * - Type-safe field definitions
 * - Excludes sensitive fields like password
 */
@ObjectType()
export class UserOutput {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  id!: string;

  @Field({ description: 'User email address' })
  email!: string;

  @Field({ description: 'Display name for the user' })
  name!: string;

  @Field({ nullable: true, description: 'User profile image URL' })
  image?: string;

  @Field({ description: 'Timestamp when user account was created' })
  createdAt!: Date;

  @Field({ description: 'Timestamp when user account was last updated' })
  updatedAt!: Date;

  @Field({ description: 'Whether the user account is active' })
  isActive!: boolean;

  @Field({ nullable: true, description: 'Timestamp when email was verified' })
  emailVerified?: Date;
}