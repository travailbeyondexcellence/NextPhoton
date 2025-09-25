import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { LoginDto } from '../../auth/dto/login.dto';
import { RegisterDto } from '../../auth/dto/register.dto';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt-auth.guard';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL Authentication Response Types
 */
@ObjectType()
export class AuthUser {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field(() => [String])
  roles!: string[];

  @Field()
  emailVerified!: boolean;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token!: string;

  @Field(() => AuthUser)
  user!: AuthUser;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message!: string;
}

/**
 * Authentication GraphQL Resolver
 * 
 * Handles authentication operations through GraphQL:
 * - Login with email/password
 * - Register new users
 * - Logout current session
 * - Get current user profile
 */
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login mutation
   * Authenticates user with email and password
   */
  @Mutation(() => AuthResponse, { 
    description: 'Login with email and password' 
  })
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthResponse> {
    const loginDto: LoginDto = { email, password };
    return await this.authService.login(loginDto);
  }

  /**
   * Register mutation
   * Creates a new user account
   */
  @Mutation(() => AuthResponse, { 
    description: 'Register a new user account' 
  })
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('role', { defaultValue: 'learner' }) role: string
  ): Promise<AuthResponse> {
    const registerDto: RegisterDto = { 
      email, 
      password, 
      name, 
      role: role as any 
    };
    return await this.authService.register(registerDto);
  }

  /**
   * Logout mutation
   * Invalidates current user session
   */
  @Mutation(() => LogoutResponse, { 
    description: 'Logout current user' 
  })
  @UseGuards(GqlJwtAuthGuard)
  async logout(@Context() context): Promise<LogoutResponse> {
    const user = context.req.user;
    return await this.authService.logout(user.id);
  }

  /**
   * Current user query
   * Returns authenticated user information
   */
  @Query(() => AuthUser, { 
    description: 'Get current authenticated user',
    nullable: true 
  })
  @UseGuards(GqlJwtAuthGuard)
  async currentUser(@Context() context): Promise<AuthUser> {
    const user = context.req.user;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      emailVerified: user.emailVerified
    };
  }

  /**
   * Simple health check query
   * Tests if GraphQL is working
   */
  @Query(() => String, { 
    description: 'Health check for GraphQL' 
  })
  async health(): Promise<string> {
    return 'GraphQL is working! 🚀';
  }
}