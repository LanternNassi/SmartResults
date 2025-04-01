import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request to fetch all students
export async function GET(request: Request, { params }: { params: { level?: string } }) {
    try {
        const { searchParams } = new URL(request.url);
        const level = searchParams.get("level");

        const students = await prisma.student.findMany({
            where: {
                class: level || undefined,
            },
            include: {
                school: true,
                results: {
                    select: { id: true , result: true } 
                }
            },
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

// POST request to create a new student
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, gender, schoolId , indexNo} = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !gender || !schoolId || !indexNo) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newStudent = await prisma.student.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                gender,
                schoolId,
                indexNo: indexNo, // Ensure indexNo is provided in the request body
                class: body.class,     // Ensure class is provided in the request body
                // school: { connect: { id: schoolId } }, // Connect to the related school
            },
        });

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}