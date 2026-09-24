import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const solutions = await prisma.solutionType.findMany();
    return NextResponse.json(solutions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 });
  }
}
