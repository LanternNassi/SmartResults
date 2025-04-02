// app/api/grade-systems/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  {params} : { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, gradeRanges } = body;

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' }, 
        { status: 400 }
      );
    }

    // First check if the grade system exists
    const existingSystem = await prisma.gradeSystem.findUnique({
      where: { id },
      include: { gradeRanges: true }
    });

    if (!existingSystem) {
      return NextResponse.json(
        { error: 'Grade system not found' },
        { status: 404 }
      );
    }

    // Start a transaction to update everything
    const updatedSystem = await prisma.$transaction(async (tx) => {
      // Update the grade system name
      const system = await tx.gradeSystem.update({
        where: { id },
        data: { name }
      });

      // If grade ranges are provided, update them
      if (gradeRanges && Array.isArray(gradeRanges)) {
        // Delete existing grade ranges
        await tx.gradeRange.deleteMany({
          where: { gradeSystemId: id }
        });

        // Create new grade ranges
        await tx.gradeRange.createMany({
          data: gradeRanges.map(range => ({
            grade: range.grade,
            min: range.min,
            max: range.max,
            gradeSystemId: id
          }))
        });
      }

      // Return the updated system with grade ranges
      return tx.gradeSystem.findUnique({
        where: { id },
        include: {
          gradeRanges: {
            orderBy: { min: 'desc' }
          }
        }
      });
    });

    return NextResponse.json(updatedSystem);
  } catch (error) {
    console.error('Error updating grade system:', error);
    return NextResponse.json(
      { error: 'Failed to update grade system' },
      { status: 500 }
    );
  }
}