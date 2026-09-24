'use server';

import { prisma } from '@/lib/prisma';
import { CreateNicheSchema, UpdateNicheSchema, CreateSolutionTypeSchema, UpdateSolutionTypeSchema } from '@/lib/zod';

// Niches
export async function getNiche(id: string) {
  try {
    return await prisma.niche.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function createNiche(data: unknown) {
  try {
    const validated = CreateNicheSchema.parse(data);
    const niche = await prisma.niche.create({ data: validated });
    return { success: true, data: niche };
  } catch (error) {
    return { success: false, error: 'Erro ao criar nicho' };
  }
}

export async function updateNiche(id: string, data: unknown) {
  try {
    const validated = UpdateNicheSchema.parse(data);
    const niche = await prisma.niche.update({ where: { id }, data: validated });
    return { success: true, data: niche };
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar nicho' };
  }
}

export async function deleteNiche(id: string) {
  try {
    const leadsCount = await prisma.lead.count({ where: { nicheId: id } });
    if (leadsCount > 0) {
      return { success: false, error: 'Existem leads usando este nicho' };
    }
    await prisma.niche.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao deletar nicho' };
  }
}

// Solutions
export async function getSolution(id: string) {
  try {
    return await prisma.solutionType.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function createSolution(data: unknown) {
  try {
    const validated = CreateSolutionTypeSchema.parse(data);
    const solution = await prisma.solutionType.create({ data: validated });
    return { success: true, data: solution };
  } catch (error) {
    return { success: false, error: 'Erro ao criar solução' };
  }
}

export async function updateSolution(id: string, data: unknown) {
  try {
    const validated = UpdateSolutionTypeSchema.parse(data);
    const solution = await prisma.solutionType.update({ where: { id }, data: validated });
    return { success: true, data: solution };
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar solução' };
  }
}

export async function deleteSolution(id: string) {
  try {
    const leadsCount = await prisma.lead.count({ where: { solutionTypeId: id } });
    if (leadsCount > 0) {
      return { success: false, error: 'Existem leads usando esta solução' };
    }
    await prisma.solutionType.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao deletar solução' };
  }
}
