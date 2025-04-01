import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const GET = async (request: Request) => {
    try{
        const { searchParams } = new URL(request.url);
        const level = searchParams.get('class');

        if (level) {
            const subjects = await prisma.subject.findMany({
                where: {
                    class: level,
                },
                include: {
                    papers: true,
                    students: {
                        select: { id: true } // Just fetching IDs to check existence
                    }
                },
                orderBy: {
                    name: 'asc',
                },
            });
            return NextResponse.json(subjects);
        }

        const subjects = await prisma.subject.findMany({
            include: {
                papers: true,
                students: {
                    select: { id: true } // Just fetching IDs to check existence
                }
            },
            orderBy: {
                name: 'asc',
            },
        });
        return NextResponse.json(subjects);

    }catch(error){
        console.error('Error fetching subjects:', error);
        return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        const { name, code , description , papers } = body;

        const newSubject = await prisma.subject.create({
            data: {
                name,
                code,
                class : body.class,
                description,
                papers:{
                    create: papers.map((paper: { paper: string }) => ({
                        paper: paper.paper,
                    })),
                }
            },
        });

        return NextResponse.json(newSubject, { status: 201 });
    } catch (error) {
        console.error('Error creating subject:', error);
        return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
    }
}

