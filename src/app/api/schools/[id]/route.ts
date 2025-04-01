import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id?: string } } 
) {
  try {
    const {id} = await params
    if (!params || !id) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 });
    }

    // Parse the ID
    const schoolId = parseInt(id);

    if (isNaN(schoolId)) {
      return NextResponse.json({ error: "Invalid school ID" }, { status: 400 });
    }

    // Fetch the school from the database
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json(school);
  } catch (error) {
    console.error("Error fetching school:", error);
    return NextResponse.json({ error: "Failed to fetch school" }, { status: 500 });
  }
}
