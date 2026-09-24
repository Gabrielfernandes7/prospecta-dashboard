import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const niches = await prisma.niche.findMany();
    return NextResponse.json(niches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch niches' }, { status: 500 });
  }
}
