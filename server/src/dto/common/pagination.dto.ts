import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';

/**
 * Pagination Input for GraphQL Queries
 * 
 * This input type provides standardized pagination parameters
 * for GraphQL queries that return lists of data.
 * 
 * Features:
 * - Cursor-based pagination support
 * - Limit validation to prevent performance issues
 * - Optional sorting parameters
 */
@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 10, description: 'Number of items to return (max 100)' })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @Field(() => Int, { nullable: true, defaultValue: 0, description: 'Number of items to skip' })
  @IsOptional()
  @Min(0)
  offset?: number = 0;

  @Field({ nullable: true, description: 'Cursor for pagination (base64 encoded)' })
  @IsOptional()
  cursor?: string;

  @Field({ nullable: true, description: 'Sort field name' })
  @IsOptional()
  sortBy?: string;

  @Field({ nullable: true, defaultValue: 'asc', description: 'Sort direction (asc or desc)' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

/**
 * Pagination Info Output for GraphQL Responses
 * 
 * This type provides metadata about paginated results,
 * enabling clients to implement proper pagination controls.
 */
@ObjectType()
export class PaginationInfo {
  @Field(() => Int, { description: 'Total number of items available' })
  totalCount!: number;

  @Field(() => Int, { description: 'Number of items in current page' })
  currentCount!: number;

  @Field({ description: 'Whether there are more items available' })
  hasNextPage!: boolean;

  @Field({ description: 'Whether there are previous items available' })
  hasPreviousPage!: boolean;

  @Field({ nullable: true, description: 'Cursor for next page' })
  nextCursor?: string;

  @Field({ nullable: true, description: 'Cursor for previous page' })
  previousCursor?: string;
}