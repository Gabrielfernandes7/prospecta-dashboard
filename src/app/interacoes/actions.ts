'use server';

import { prisma } from '@/lib/prisma';
import { CreateInteractionSchema, UpdateInteractionSchema } from '@/lib/zod';

const STAGE_PROGRESSION = {
  NOVO: { OUTBOUND: 'ABORDADO', INBOUND: 'RESPONDEU' },
  ABORDADO: { OUTBOUND: 'ABORDADO', INBOUND: 'RESPONDEU' },
  RESPONDEU: { OUTBOUND: 'RESPONDEU', INBOUND: 'RESPONDEU' },
  NEGOCIANDO: { OUTBOUND: 'NEGOCIANDO', INBOUND: 'NEGOCIANDO' },
  FECHADO: { OUTBOUND: 'FECHADO', INBOUND: 'FECHADO' },
  PERDIDO: { OUTBOUND: 'PERDIDO', INBOUND: 'PERDIDO' },
};

export async function getInteraction(id: string) {
  try {
    return await prisma.interaction.findUnique({
      where: { id },
      include: { lead: true },
    });
  } catch {
    return null;
  }
}

export async function createInteraction(data: unknown) {
  try {
    const validated = CreateInteractionSchema.parse(data);

    // Create interaction
    const interaction = await prisma.interaction.create({
      data: validated,
      include: { lead: true },
    });

    // Auto-update lead stage
    const lead = interaction.lead;
    let newStage = lead.stage;

    if (validated.outcome === 'FECHOU') {
      newStage = 'FECHADO';
    } else if (validated.outcome === 'BLOQUEOU' || validated.outcome === 'SEM_INTERESSE') {
      newStage = 'PERDIDO';
    } else {
      const progression = STAGE_PROGRESSION[lead.stage as keyof typeof STAGE_PROGRESSION];
      if (progression) {
        newStage = progression[validated.direction as keyof typeof progression] || lead.stage;
      }
    }

    if (newStage !== lead.stage) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { stage: newStage },
      });
    }

    return { success: true, data: interaction };
  } catch (error) {
    return { success: false, error: 'Erro ao criar interação' };
  }
}

export async function updateInteraction(id: string, data: unknown) {
  try {
    const validated = UpdateInteractionSchema.parse(data);
    const interaction = await prisma.interaction.update({
      where: { id },
      data: validated,
      include: { lead: true },
    });
    return { success: true, data: interaction };
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar interação' };
  }
}

export async function deleteInteraction(id: string) {
  try {
    await prisma.interaction.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao deletar interação' };
  }
}

export async function markFollowUpDone(id: string) {
  try {
    await prisma.interaction.update({
      where: { id },
      data: { followUpDone: true },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao marcar follow-up' };
  }
}
