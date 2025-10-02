import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { UserOutput } from '../../dto/outputs/user.output';
import { CreateUserInput } from '../../dto/inputs/create-user.input';
import { PaginationInput, PaginationInfo } from '../../dto/common/pagination.dto';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt-auth.guard';
import { OptionalGqlAuthGuard } from '../guards/gql-auth.guard';
import { UsersService } from '../../users/users.service';

/**
 * User GraphQL Resolver
 * 
 * This resolver handles all GraphQL operations related to users,
 * including queries for user data and mutations for user management.
 * It integrates with the existing UsersService for business logic.
 * 
 * Features:
 * - Authentication guards for protected operations
 * - Input validation using class-validator
 * - Consistent error handling
 * - Pagination support for list queries
 */
@Resolver(() => UserOutput)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current authenticated user
   * 
   * @param context - GraphQL context containing request and user data
   * @returns UserOutput - Current user information
   */
  @Query(() => UserOutput, { 
    description: 'Get current authenticated user profile' 
  })
  @UseGuards(GqlJwtAuthGuard)
  async me(@Context() context): Promise<UserOutput> {
    const user = context.req.user;
    
    // Convert user data to GraphQL output format
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  }

  /**
   * Get user by ID
   * 
   * @param id - User ID to fetch
   * @param context - GraphQL context for authentication
   * @returns UserOutput - User information
   */
  @Query(() => UserOutput, { 
    description: 'Get user by ID',
    nullable: true 
  })
  @UseGuards(OptionalGqlAuthGuard)
  async user(
    @Args('id') id: string,
    @Context() context
  ): Promise<UserOutput | null> {
    // TODO: Implement proper authorization logic
    // Check if current user can access this user's data
    
    const user = await this.usersService.findById(id);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  }

  /**
   * Get paginated list of users
   * 
   * @param pagination - Pagination parameters
   * @param context - GraphQL context for authentication
   * @returns Object containing users list and pagination info
   */
  @Query(() => UsersResponse, { 
    description: 'Get paginated list of users' 
  })
  @UseGuards(GqlJwtAuthGuard)
  async users(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Context() context?
  ): Promise<UsersResponse> {
    // TODO: Implement proper authorization logic
    // Check if current user has permission to list users
    
    const paginationParams = pagination || { limit: 10, offset: 0 };
    const { users, totalCount } = await this.usersService.findMany(paginationParams);
    
    const hasNextPage = (paginationParams.offset || 0) + (paginationParams.limit || 10) < totalCount;
    const hasPreviousPage = (paginationParams.offset || 0) > 0;

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
      })),
      pagination: {
        totalCount,
        currentCount: users.length,
        hasNextPage,
        hasPreviousPage,
        nextCursor: hasNextPage ? Buffer.from(`${(paginationParams.offset || 0) + (paginationParams.limit || 10)}`).toString('base64') : undefined,
        previousCursor: hasPreviousPage ? Buffer.from(`${Math.max(0, (paginationParams.offset || 0) - (paginationParams.limit || 10))}`).toString('base64') : undefined,
      },
    };
  }

  /**
   * Create a new user account
   * 
   * @param input - User creation data
   * @returns UserOutput - Created user information
   */
  @Mutation(() => UserOutput, { 
    description: 'Create a new user account' 
  })
  async createUser(
    @Args('input', new ValidationPipe({ transform: true })) input: CreateUserInput
  ): Promise<UserOutput> {
    const user = await this.usersService.create(input);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  }
}

/**
 * Response type for paginated users query
 * 
 * Combines user data with pagination metadata for efficient
 * client-side pagination implementation.
 */
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UsersResponse {
  @Field(() => [UserOutput], { description: 'List of users in current page' })
  users!: UserOutput[];

  @Field(() => PaginationInfo, { description: 'Pagination metadata' })
  pagination!: PaginationInfo;
}