import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TempPrismaService } from '../prisma/temp-prisma.service';
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
    constructor(private prisma: TempPrismaService) { }

    /**
     * Get users by type (legacy method for compatibility)
     * 
     * @param type - User type (admin, teacher, student, parent)
     * @returns Array of users of specified type
     */
    async getUsers(type: string) {
        const modelMap: Record<string, any> = {
            admin: this.prisma.admin,
            teacher: this.prisma.teacher,
            student: this.prisma.student,
            parent: this.prisma.parent,
        };

        const model = modelMap[type];
        if (!model) {
            throw new BadRequestException('Invalid user type');
        }

        try {
            const users = await model.findMany();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
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
            });

            return user;
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
                }),
                this.prisma.user.count()
            ]);

            return { users, totalCount };
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
            // TODO: Integrate with Better-auth for proper user creation
            // This is a placeholder implementation
            const user = await this.prisma.user.create({
                data: {
                    email: input.email,
                    name: input.name,
                    image: input.image,
                    // Note: Password hashing should be handled by Better-auth
                    // This is just a placeholder structure
                },
            });

            return user;
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
                data: updates,
            });

            return user;
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