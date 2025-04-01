import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET route to fetch all schools
export async function GET() {
    try {
        const schools = await prisma.school.findMany();
        return NextResponse.json(schools);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

// POST route to add a new school
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, address, email, phoneNumber, principal } = body;

        if (!name || !address || !email || !phoneNumber || !principal) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const newSchool = await prisma.school.create({
            data: {
                name,
                address,
                email,
                phoneNumber,
                principal,
            },
        });

        return NextResponse.json(newSchool, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
