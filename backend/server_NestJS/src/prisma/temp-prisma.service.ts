import { Injectable } from '@nestjs/common';

/**
 * Temporary Prisma Service for GraphQL Testing
 * 
 * This is a temporary service that mocks Prisma functionality
 * to allow GraphQL testing without a fully configured database.
 * Replace this with the actual PrismaService once the database
 * schema and connection are properly set up.
 */
@Injectable()
export class TempPrismaService {
  // Mock user model for testing GraphQL functionality
  user = {
    findUnique: async ({ where }: { where: { id: string } }) => {
      // Mock user data for testing
      return {
        id: where.id,
        email: 'test@example.com',
        name: 'Test User',
        image: undefined,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: new Date(),
      };
    },

    findMany: async ({ skip = 0, take = 10, orderBy = {} }) => {
      // Mock users array for testing
      return Array.from({ length: Math.min(take, 5) }, (_, i) => ({
        id: `user-${skip + i + 1}`,
        email: `user${skip + i + 1}@example.com`,
        name: `Test User ${skip + i + 1}`,
        image: undefined,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: new Date(),
      }));
    },

    count: async () => {
      // Mock total count for pagination testing
      return 25;
    },

    create: async ({ data }: { data: any }) => {
      // Mock user creation for testing
      return {
        id: `user-new-${Date.now()}`,
        email: data.email,
        name: data.name,
        image: data.image || undefined,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: undefined,
      };
    },

    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      // Mock user update for testing
      return {
        id: where.id,
        email: data.email || 'updated@example.com',
        name: data.name || 'Updated User',
        image: data.image || undefined,
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
        emailVerified: new Date(),
      };
    },

    delete: async ({ where }: { where: { id: string } }) => {
      // Mock user deletion for testing
      return {
        id: where.id,
        email: 'deleted@example.com',
        name: 'Deleted User',
      };
    },
  };

  // Legacy mock models for compatibility with existing REST endpoints
  admin = {
    findMany: async () => [
      { id: 'admin-1', name: 'Admin User 1' },
      { id: 'admin-2', name: 'Admin User 2' },
    ],
  };

  teacher = {
    findMany: async () => [
      { id: 'teacher-1', name: 'Teacher User 1' },
      { id: 'teacher-2', name: 'Teacher User 2' },
    ],
  };

  student = {
    findMany: async () => [
      { id: 'student-1', name: 'Student User 1' },
      { id: 'student-2', name: 'Student User 2' },
    ],
  };

  parent = {
    findMany: async () => [
      { id: 'parent-1', name: 'Parent User 1' },
      { id: 'parent-2', name: 'Parent User 2' },
    ],
  };
}