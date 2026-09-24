import { z } from 'zod';

// Enums
export const LeadStageEnum = z.enum(['NOVO', 'ABORDADO', 'RESPONDEU', 'NEGOCIANDO', 'FECHADO', 'PERDIDO']);
export const LeadSourceEnum = z.enum(['INSTAGRAM', 'GOOGLE_MAPS', 'INDICACAO', 'OUTRO']);
export const InteractionDirectionEnum = z.enum(['OUTBOUND', 'INBOUND']);
export const InteractionChannelEnum = z.enum([
  'INSTAGRAM_DM',
  'INSTAGRAM_COMENTARIO',
  'INSTAGRAM_STORY',
  'WHATSAPP',
  'EMAIL',
  'LIGACAO',
  'REUNIAO',
  'OUTRO',
]);
export const InteractionOutcomeEnum = z.enum([
  'SEM_RESPOSTA',
  'RESPONDEU',
  'INTERESSADO',
  'SEM_INTERESSE',
  'AGENDOU',
  'FECHOU',
  'BLOQUEOU',
  'OUTRO',
]);

// Niche
export const NicheSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
});
export const CreateNicheSchema = NicheSchema.omit({ id: true });
export const UpdateNicheSchema = CreateNicheSchema;
export type Niche = z.infer<typeof NicheSchema>;
export type CreateNiche = z.infer<typeof CreateNicheSchema>;

// SolutionType
export const SolutionTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  defaultPrice: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
});
export const CreateSolutionTypeSchema = SolutionTypeSchema.omit({ id: true });
export const UpdateSolutionTypeSchema = CreateSolutionTypeSchema;
export type SolutionType = z.infer<typeof SolutionTypeSchema>;
export type CreateSolutionType = z.infer<typeof CreateSolutionTypeSchema>;

// Lead
export const LeadSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  instagramUrl: z.string().url().nullable().optional(),
  googleMapsUrl: z.string().url().nullable().optional(),
  source: LeadSourceEnum,
  nicheId: z.string().min(1, 'Nicho é obrigatório'),
  solutionTypeId: z.string().nullable().optional(),
  stage: LeadStageEnum,
  proposedValue: z.number().nullable().optional(),
  soldValue: z.number().nullable().optional(),
  soldAt: z.date().nullable().optional(),
  lostReason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export const CreateLeadSchema = LeadSchema.omit({ id: true });
export const UpdateLeadSchema = CreateLeadSchema;
export type Lead = z.infer<typeof LeadSchema>;
export type CreateLead = z.infer<typeof CreateLeadSchema>;

// Interaction
export const InteractionSchema = z.object({
  id: z.string(),
  leadId: z.string().min(1, 'Lead é obrigatório'),
  direction: InteractionDirectionEnum,
  channel: InteractionChannelEnum,
  occurredAt: z.coerce.date(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  outcome: InteractionOutcomeEnum.nullable().optional(),
  followUpAt: z.coerce.date().nullable().optional(),
  followUpDone: z.boolean().default(false),
});
export const CreateInteractionSchema = InteractionSchema.omit({ id: true });
export const UpdateInteractionSchema = CreateInteractionSchema;
export type Interaction = z.infer<typeof InteractionSchema>;
export type CreateInteraction = z.infer<typeof CreateInteractionSchema>;
