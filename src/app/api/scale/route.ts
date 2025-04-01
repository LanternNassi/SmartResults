// app/api/grade-systems/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get the system name from query params if provided
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    
    if (name) {
      // Get specific grade system
      const gradeSystem = await prisma.gradeSystem.findUnique({
        where: { name },
        include: {
          gradeRanges: {
            orderBy: { min: 'desc' }
          }
        }
      });
      
      if (!gradeSystem) {
        return NextResponse.json(
          { error: `Grade system '${name}' not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json(gradeSystem);
    } else {
      // Get all grade systems
      const gradeSystems = await prisma.gradeSystem.findMany({
        include: {
          gradeRanges: {
            orderBy: { min: 'desc' }
          }
        }
      });
      
      return NextResponse.json(gradeSystems);
    }
  } catch (error) {
    console.error('Error fetching grade systems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grade systems' },
      { status: 500 }
    );
  }
}