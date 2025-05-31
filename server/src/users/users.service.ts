import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from '../dto/inputs/create-user.input';
import { PaginationInput } from '../dto/common/pagination.dto';

/**
 * Users Service
 * 
 * This service handles all user-related business logic including
 * CRUD operations, authentication, and user management across
 * different user types in the NextPhoton platform.
 * 
 * Features:
 * - User creation and management
 * - Multi-role user support
 * - Pagination for user lists
 * - Integration with Better-auth
 */
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get users by type (legacy method for compatibility)
     * 
     * @param type - User type (admin, teacher, student, parent)
     * @returns Array of users of specified type
     */
    async getUsers(type: string) {
        // Legacy method - return mock data for now since these models don't exist yet
        // TODO: Replace with real profile queries when user profiles are implemented
        
        const mockData: Record<string, any[]> = {
            admin: [
                { id: 'admin-1', name: 'Admin User 1', email: 'admin1@example.com' },
                { id: 'admin-2', name: 'Admin User 2', email: 'admin2@example.com' },
            ],
            teacher: [
                { id: 'teacher-1', name: 'Teacher User 1', email: 'teacher1@example.com' },
                { id: 'teacher-2', name: 'Teacher User 2', email: 'teacher2@example.com' },
            ],
            student: [
                { id: 'student-1', name: 'Student User 1', email: 'student1@example.com' },
                { id: 'student-2', name: 'Student User 2', email: 'student2@example.com' },
            ],
            parent: [
                { id: 'parent-1', name: 'Parent User 1', email: 'parent1@example.com' },
                { id: 'parent-2', name: 'Parent User 2', email: 'parent2@example.com' },
            ],
        };

        if (!mockData[type]) {
            throw new BadRequestException('Invalid user type');
        }

        return mockData[type];
    }

    /**
     * Find user by ID
     * 
     * @param id - User ID to search for
     * @returns User object or null if not found
     */
    async findById(id: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                }
            });

            if (!user) {
                return null;
            }

            // Add isActive field (not in Better-auth schema, but needed for GraphQL)
            return {
                ...user,
                isActive: true, // Default to true since Better-auth doesn't have this field
            };
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    /**
     * Find users with pagination
     * 
     * @param pagination - Pagination parameters
     * @returns Object containing users array and total count
     */
    async findMany(pagination: PaginationInput = {}) {
        const { limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

        try {
            const [users, totalCount] = await Promise.all([
                this.prisma.user.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        createdAt: true,
                        updatedAt: true,
                        emailVerified: true,
                    }
                }),
                this.prisma.user.count()
            ]);

            // Add isActive field to all users
            const usersWithActive = users.map(user => ({
                ...user,
                isActive: true, // Default to true since Better-auth doesn't have this field
            }));

            return { users: usersWithActive, totalCount };
        } catch (error) {
            console.error('Error finding users with pagination:', error);
            throw error;
        }
    }

    /**
     * Create a new user
     * 
     * @param input - User creation data
     * @returns Created user object
     */
    async create(input: CreateUserInput) {
        try {
            // Generate a unique ID for Better-auth compatibility
            const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const user = await this.prisma.user.create({
                data: {
                    id: userId,
                    email: input.email,
                    name: input.name,
                    image: input.image,
                    emailVerified: false, // New users need to verify email
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                }
            });

            // Add isActive field for GraphQL compatibility
            return {
                ...user,
                isActive: true,
            };
        } catch (error) {
            console.error('Error creating user:', error);
            if ((error as any).code === 'P2002') {
                throw new BadRequestException('User with this email already exists');
            }
            throw error;
        }
    }

    /**
     * Update user information
     * 
     * @param id - User ID to update
     * @param updates - Partial user data to update
     * @returns Updated user object
     */
    async update(id: string, updates: Partial<CreateUserInput>) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    ...updates,
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                }
            });

            // Add isActive field for GraphQL compatibility
            return {
                ...user,
                isActive: true,
            };
        } catch (error) {
            console.error('Error updating user:', error);
            if ((error as any).code === 'P2025') {
                throw new NotFoundException('User not found');
            }
            throw error;
        }
    }

    /**
     * Delete user (soft delete by setting isActive to false)
     * 
     * @param id - User ID to delete
     * @returns Success boolean
     */
    async delete(id: string): Promise<boolean> {
        try {
            // TODO: Implement soft delete with isActive field
            // For now, we'll use hard delete as placeholder
            await this.prisma.user.delete({
                where: { id }
            });

            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            if ((error as any).code === 'P2025') {
                throw new NotFoundException('User not found');
            }
            throw error;
        }
    }
} 