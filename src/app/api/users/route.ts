import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET route to fetch all users
export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST route to add a new user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, telephone, password, gender, role } = body;

        if (!username || !email || !telephone || !password || !gender || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                telephone,
                password,
                gender,
                role,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
