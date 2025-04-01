import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
    try{
        // Get the query parameters from the request URL
        const url = new URL(request.url);
        const query = url.searchParams;

        if (query.has("subject")){
            const subjectId = query.get("subject");

            if (query.has("search")){
                const search = query.get("startswith") || "";
                const papers = await prisma.subjectPapers.findMany({
                    where: {
                        subjectId: subjectId ? parseInt(subjectId, 10) : undefined,
                        paper: {
                            contains: search,
                        },
                    },
                });
                return NextResponse.json(papers);
            }

            const papers = await prisma.subjectPapers.findMany({
                where: {
                    subjectId: subjectId ? parseInt(subjectId, 10) : undefined,
                },
            });

            
            return NextResponse.json(papers);
        }

        if (query.has("search")){
            const search = query.get("search") || "";
            const papers = await prisma.subjectPapers.findMany({
                where: {
                    paper: {
                        contains: search,
                    },
                },
            });
            return NextResponse.json(papers);
        }


        
        const papers = await prisma.subjectPapers.findMany({});
        return NextResponse.json(papers);

    }catch(error){
        console.error('Error fetching subjectsPapers:', error);
        return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
    }
}


export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        const { subjectId, paper } = body;

        const newSubjectPaper = await prisma.subjectPapers.create({
            data: {
                subjectId,
                paper
            },
        });

        return NextResponse.json(newSubjectPaper, { status: 201 });
    } catch (error) {
        console.error('Error creating subjectPaper:', error);
        return NextResponse.json({ error: 'Failed to create subjectPaper' }, { status: 500 });
    }
}