import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { type: string } }
) {
    try {
        const { type } = params;
        const modelMap: Record<string, any> = {
            admin: prisma.admin,
            teacher: prisma.teacher,
            student: prisma.student,
            parent: prisma.parent,
        };

        const model = modelMap[type];
        if (!model) {
            return NextResponse.json(
                { error: 'Invalid user type' },
                { status: 400 }
            );
        }

        const users = await model.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 