import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: Request , {params}:{params:{id?: string}}) => {
    try{
        const {id} = await params
        if (!params || !id){
            return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });
        }

        const subjectId = parseInt(id);

        if (isNaN(subjectId)){
            return NextResponse.json({ error: "Invalid subject ID" }, { status: 400 });
        }

        const subject = await prisma.subject.findUnique({
            where: { id: subjectId },
            include : {
                papers: {
                    select: {
                        id: true,
                        paper: true,
                    },
                },
            }
        });

        if (!subject){
            return NextResponse.json({ error: "Subject not found" }, { status: 404 });
        }

        return NextResponse.json(subject); 

    }catch(error){
        console.error('Error fetching subjects:', error);
        return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
    }
}

export const DELETE = async (request: Request , {params}:{params:{id?: string}}) => {
    try{
        const {id} = await params
        if (!params || !id){
            return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });
        }

        const subjectId = parseInt(id);

        if (isNaN(subjectId)){
            return NextResponse.json({ error: "Invalid subject ID" }, { status: 400 });
        }

        const subject = await prisma.subject.delete({
            where: { id: subjectId },
        });

        if (!subject){
            return NextResponse.json({ error: "Subject not found" }, { status: 404 });
        }

        return NextResponse.json(subject); 

    }catch(error){
        console.error('Error deleting subjects:', error);
        return NextResponse.json({ error: 'Failed to delete subjects' }, { status: 500 });
    }
}