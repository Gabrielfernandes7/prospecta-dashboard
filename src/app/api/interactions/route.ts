import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    const where: any = {};
    if (leadId) where.leadId = leadId;

    const interactions = await prisma.interaction.findMany({
      where,
      include: { lead: true },
      orderBy: { occurredAt: 'desc' },
    });

    return NextResponse.json(interactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 });
  }
}
