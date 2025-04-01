import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request:Request){
    const { searchParams } = new URL(request.url);
    const index = searchParams.get("index");
    if (!index) {
        return NextResponse.json({ error: "Index is required" }, { status: 400 });
    }
    try {
        const student = await prisma.student.findUnique({
            where: {
                indexNo: index,
            },
            include: {
                school: true,
            }
        });
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }
        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}