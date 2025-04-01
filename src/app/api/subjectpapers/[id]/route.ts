import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async (request: Request , {params}:{params:{id?: string}}) => {
    try{
        const {id} = await params
        if (!params || !id){
            return NextResponse.json({ error: "Subject paper ID is required" }, { status: 400 });
        }

        const subjectPaperId = parseInt(id);

        if (isNaN(subjectPaperId)){
            return NextResponse.json({ error: "Invalid subject paper ID" }, { status: 400 });
        }

        const subjectPaper = await prisma.subjectPapers.findUnique({
            where: { id: subjectPaperId },
        });

        if (!subjectPaper){
            return NextResponse.json({ error: "Subject paper not found" }, { status: 404 });
        }

        return NextResponse.json(subjectPaper);

    }catch(error){
        console.error('Error fetching subjects:', error);
        return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
    }
}

export const DELETE = async (request: Request , {params}:{params:{id?: string}}) => {
    try{
        const {id} = await params
        if (!params || !id){
            return NextResponse.json({ error: "Subject paper ID is required" }, { status: 400 });
        }

        const subjectPaperId = parseInt(id);

        if (isNaN(subjectPaperId)){
            return NextResponse.json({ error: "Invalid subject paper ID" }, { status: 400 });
        }

        const subjectPaper = await prisma.subjectPapers.delete({
            where: { id: subjectPaperId },
        });

        if (!subjectPaper){
            return NextResponse.json({ error: "Subject paper not found" }, { status: 404 });
        }

        return NextResponse.json(subjectPaper);

    }catch(error){
        console.error('Error deleting subjects:', error);
        return NextResponse.json({ error: 'Failed to delete subjects' }, { status: 500 });
    }
}