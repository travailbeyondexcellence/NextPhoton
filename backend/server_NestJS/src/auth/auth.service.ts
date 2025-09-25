/**
 * Authentication Service
 * 
 * Core service handling authentication logic including:
 * - User validation and authentication
 * - JWT token generation and management
 * - Password hashing and verification
 * - User registration with role assignment
 * - Session management
 */

import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    public readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials for local strategy
   * Used by Passport LocalStrategy during login
   * 
   * @param email - User's email address
   * @param password - Plain text password to verify
   * @returns User object without password if valid, null otherwise
   */
  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Find user by email with their account details
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          accounts: true,
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return null;
      }

      // Find the local account (email/password account)
      const localAccount = user.accounts.find(
        account => account.providerId === 'email'
      );

      if (!localAccount || !localAccount.password) {
        return null;
      }

      // Verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, localAccount.password);

      if (!isPasswordValid) {
        return null;
      }

      // Return user without sensitive information
      const { accounts, ...userWithoutAccounts } = user;
      return {
        ...userWithoutAccounts,
        roles: user.userRoles.map(ur => ur.role.name),
      };
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  /**
   * Handles user login and JWT token generation
   * 
   * @param loginDto - Login credentials (email and password)
   * @returns Access token and user information
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    // Create session in database
    const session = await this.prisma.session.create({
      data: {
        id: this.generateId(),
        userId: user.id,
        token: this.generateId(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: '', // Should be extracted from request in controller
        userAgent: '', // Should be extracted from request in controller
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        emailVerified: user.emailVerified,
      },
    };
  }

  /**
   * Registers a new user with email/password authentication
   * 
   * @param registerDto - Registration data including email, password, name, and role
   * @returns Access token and created user information
   */
  async register(registerDto: RegisterDto) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Validate role exists
      const role = await this.prisma.role.findUnique({
        where: { name: registerDto.role },
      });

      if (!role) {
        throw new BadRequestException(`Role ${registerDto.role} does not exist`);
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

      // Create user with account and role in a transaction
      const user = await this.prisma.$transaction(async (tx) => {
        // Create the user
        const newUser = await tx.user.create({
          data: {
            id: this.generateId(),
            email: registerDto.email,
            name: registerDto.name,
            emailVerified: false, // Email verification can be implemented later
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Create the email/password account
        await tx.account.create({
          data: {
            id: this.generateId(),
            userId: newUser.id,
            accountId: newUser.email,
            providerId: 'email',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Assign the role to the user
        await tx.userRole.create({
          data: {
            id: this.generateId(),
            userId: newUser.id,
            roleId: role.id,
            assignedAt: new Date(),
            assignedBy: 'system', // Can be the admin user ID who created this
          },
        });

        // Create role-specific profile based on the role
        await this.createRoleProfile(tx, newUser.id, registerDto.role, registerDto.name);

        return newUser;
      });

      // Generate JWT token for immediate login after registration
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: [registerDto.role],
      };

      // Create initial session
      await this.prisma.session.create({
        data: {
          id: this.generateId(),
          userId: user.id,
          token: this.generateId(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          ipAddress: '',
          userAgent: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: [registerDto.role],
          emailVerified: false,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new BadRequestException('Failed to register user');
    }
  }

  /**
   * Logs out a user by invalidating their session
   * 
   * @param userId - ID of the user to log out
   */
  async logout(userId: string) {
    try {
      // Delete all sessions for this user
      await this.prisma.session.deleteMany({
        where: { userId },
      });

      return { message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      throw new BadRequestException('Failed to logout');
    }
  }

  /**
   * Validates a JWT token and returns the user
   * Used by JwtStrategy for route protection
   * 
   * @param payload - Decoded JWT payload
   * @returns User object if valid
   */
  async validateToken(payload: JwtPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.userRoles.map(ur => ur.role.name),
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Creates role-specific profile for a user
   * 
   * @param tx - Prisma transaction client
   * @param userId - User ID to create profile for
   * @param role - Role name determining which profile to create
   * @param userName - User's full name to split into first and last
   */
  private async createRoleProfile(tx: any, userId: string, role: string, userName: string) {
    // Split the full name into first and last name
    const nameParts = userName.split(' ');
    const firstName = nameParts[0] || 'First';
    const lastName = nameParts.slice(1).join(' ') || 'Name';
    
    const profileData = {
      id: this.generateId(),
      userId,
      firstName,
      lastName,
      phoneNumber: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    switch (role.toLowerCase()) {
      case 'learner':
        await tx.learnerProfile.create({
          data: {
            ...profileData,
            dateOfBirth: new Date('2000-01-01'),
            currentGrade: '',
            school: '',
            learningStyle: 'visual',
            preferredLanguage: 'English',
            subjects: [],
            targetExams: [],
          },
        });
        break;

      case 'guardian':
        await tx.guardianProfile.create({
          data: {
            ...profileData,
            relationship: '',
            occupation: '',
          },
        });
        break;

      case 'educator':
        await tx.educatorProfile.create({
          data: {
            ...profileData,
            qualifications: [],
            specializations: [],
            experience: 0,
            documentsUploaded: [],
            languages: ['English'],
          },
        });
        break;

      case 'ecm':
        await tx.eCMProfile.create({
          data: {
            ...profileData,
            department: '',
            specialization: [],
            experience: 0,
          },
        });
        break;

      case 'employee':
        await tx.employeeProfile.create({
          data: {
            ...profileData,
            employeeId: `EMP${Date.now()}`,
            department: '',
            position: '',
            joiningDate: new Date(),
          },
        });
        break;

      case 'intern':
        await tx.internProfile.create({
          data: {
            ...profileData,
            university: '',
            major: '',
            year: 1,
            skills: [],
            department: '',
            internshipType: 'full-time',
            mentorId: null,
            startDate: new Date(),
            endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          },
        });
        break;

      case 'admin':
        await tx.adminProfile.create({
          data: {
            ...profileData,
            adminLevel: 'platform',
          },
        });
        break;

      default:
        console.warn(`No profile template for role: ${role}`);
    }
  }

  /**
   * Generates a unique ID for database records
   * In production, consider using UUID or another ID generation strategy
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}