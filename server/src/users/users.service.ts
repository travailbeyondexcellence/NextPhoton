import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

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
} 