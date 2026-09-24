import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const niche = searchParams.get('niche');
    const stage = searchParams.get('stage');
    const solution = searchParams.get('solution');
    const search = searchParams.get('search');

    const where: any = {};
    if (niche) where.nicheId = niche;
    if (stage) where.stage = stage;
    if (solution) where.solutionTypeId = solution;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { instagramUrl: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: { niche: true, solutionType: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
