'use server';

import { prisma } from '@/lib/prisma';
import { CreateLeadSchema, UpdateLeadSchema } from '@/lib/zod';

export async function getLead(id: string) {
  try {
    return await prisma.lead.findUnique({
      where: { id },
      include: { niche: true, solutionType: true, interactions: { orderBy: { occurredAt: 'desc' } } },
    });
  } catch {
    return null;
  }
}

export async function createLead(data: unknown) {
  try {
    const validated = CreateLeadSchema.parse(data);
    const lead = await prisma.lead.create({
      data: validated,
      include: { niche: true, solutionType: true },
    });
    return { success: true, data: lead };
  } catch (error) {
    return { success: false, error: 'Erro ao criar lead' };
  }
}

export async function updateLead(id: string, data: unknown) {
  try {
    const validated = UpdateLeadSchema.parse(data);
    const lead = await prisma.lead.update({
      where: { id },
      data: validated,
      include: { niche: true, solutionType: true },
    });
    return { success: true, data: lead };
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar lead' };
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao deletar lead' };
  }
}
