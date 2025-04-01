import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: Request, { params }: { params: { id?: string } }) => {
    try {
        const { id } = await params;
        if (!params || !id) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        const studentId = parseInt(id);

        if (isNaN(studentId)) {
            return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
        }

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                results : {
                    select: {
                        result: true,
                        subjectpaper: {
                            select: {
                                id: true,
                                subject: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const transformedResults = student.results.map((res) => ({
            subject: res.subjectpaper.subject.id, 
            paper: res.subjectpaper.id,
            mark: res.result
        }));

        const responseStudent = { ...student, results: transformedResults };

        return NextResponse.json(responseStudent);
    } catch (error) {
        console.error("Error fetching student:", error);
        return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
    }
}
