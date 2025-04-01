import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request:Request){
    try{

        const {student , scores} = await request.json()

        if(!student || !scores){
            return NextResponse.json({error:'All fields are required'},{status:400})
        }

        const newResult = await prisma.student.update({
            where :{ id: student.id },
            data:{
                results:{
                    create: scores.map((score:{subject:number,paper:number,mark:any})=>({
                        subjectpaper : {
                            connect:{
                                id: score.paper
                            }
                        },
                        result : parseFloat(score.mark),
                        added_by : 1
                    }))
                }
            }
        })

        if (!newResult){
            return NextResponse.json({error:'Failed to create result'},{status:500})
        }
        return NextResponse.json(newResult,{status:201})

    }catch(error){
        return NextResponse.json({error: error},{status:400})
    }
}

export async function GET(request:Request){
    try{
        const {searchParams} = new URL(request.url)
        const studentId = searchParams.get('studentId')
        const student = await prisma.student.findUnique({
            where:{
                id: parseInt(studentId as string)
            }
        })
        if(!student){
            return NextResponse.json({error:'Student not found'},{status:404})
        }
        const result = await prisma.subjectPaperResults.findMany({
            where:{
                studentId: parseInt(studentId as string)
            },
            include:{
                subjectpaper:{
                    include:{
                        subject:true
                    }
                }
            }
        })

        if(!result){
            return NextResponse.json({error:'No results found'},{status:404})
        }

        return NextResponse.json({student , result},{status:200})

    }catch(error){
        return NextResponse.json({error: error},{status:400})
    }
}