import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const SECRET_KEY = 'nassim'; // Replace with a secure key in production


export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: email }, // Assuming 'email' is the unique field
    });

    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.password !== password) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = jwt.sign({ email, id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    return NextResponse.json({ accessToken, user: { id: user.id, email: user.email , name: user.username } }, { status: 200 });
}