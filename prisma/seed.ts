import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.interaction.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.solutionType.deleteMany();
  await prisma.niche.deleteMany();

  // Create niches (cores neutras)
  const nicheClinica = await prisma.niche.create({
    data: { name: 'Clínica', color: '#64748b' },
  });

  const nicheEstetica = await prisma.niche.create({
    data: { name: 'Estética', color: '#78909c' },
  });

  const nicheOdontologia = await prisma.niche.create({
    data: { name: 'Odontologia', color: '#90a4ae' },
  });

  // Create solution types
  const solSite = await prisma.solutionType.create({
    data: {
      name: 'Site institucional',
      defaultPrice: 1000,
    },
  });

  const solLP = await prisma.solutionType.create({
    data: {
      name: 'Landing page',
      defaultPrice: 1500,
    },
  });

  const solWA = await prisma.solutionType.create({
    data: {
      name: 'Automação WhatsApp',
      defaultPrice: 800,
    },
  });

  // Create leads
  const lead1 = await prisma.lead.create({
    data: {
      name: 'Dra Emanuelle Maciel',
      instagramUrl: 'https://www.instagram.com/clinica_aprimore/',
      googleMapsUrl: '',
      source: 'INSTAGRAM',
      nicheId: nicheClinica.id,
      solutionTypeId: solSite.id,
      stage: 'RESPONDEU',
      proposedValue: 1000,
      notes: 'Montei o site preview: https://aprimore-dra-manu-marciel.netlify.app',
      createdAt: new Date('2026-09-14T10:00:00'),
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: 'Dra. Eloisa Santos',
      instagramUrl: 'https://www.instagram.com/draeloisasantos/',
      googleMapsUrl: '',
      source: 'INSTAGRAM',
      nicheId: nicheClinica.id,
      solutionTypeId: solSite.id,
      stage: 'ABORDADO',
      proposedValue: 1000,
      notes: 'Mandei mensagem, mas não montei o site dela',
      createdAt: new Date('2026-09-22T10:00:00'),
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      name: 'Estética Kamilla Maia',
      instagramUrl: 'https://www.instagram.com/esteticakamillamaia/',
      googleMapsUrl: '',
      source: 'INSTAGRAM',
      nicheId: nicheEstetica.id,
      solutionTypeId: solSite.id,
      stage: 'ABORDADO',
      proposedValue: 1000,
      notes: 'Mandei mensagem, mas não montei o site dela. Link do site expirado.',
      createdAt: new Date('2026-09-23T10:00:00'),
    },
  });

  const lead4 = await prisma.lead.create({
    data: {
      name: 'Espaço Innovare Estética e Depilação',
      instagramUrl: 'https://www.instagram.com/innovareesteticaedepilacao/',
      googleMapsUrl: 'https://share.google/igjwSwZECPfMCHKPO',
      source: 'INSTAGRAM',
      nicheId: nicheEstetica.id,
      solutionTypeId: solSite.id,
      stage: 'PERDIDO',
      proposedValue: 1000,
      lostReason: 'Bloqueou o contato',
      createdAt: new Date('2026-09-23T11:00:00'),
    },
  });

  // Create interactions
  await prisma.interaction.create({
    data: {
      leadId: lead1.id,
      direction: 'OUTBOUND',
      channel: 'INSTAGRAM_DM',
      occurredAt: new Date('2026-09-14T10:00:00'),
      content: 'Enviei a primeira mensagem apresentando a proposta do site institucional.',
      outcome: 'RESPONDEU',
    },
  });

  await prisma.interaction.create({
    data: {
      leadId: lead1.id,
      direction: 'INBOUND',
      channel: 'INSTAGRAM_DM',
      occurredAt: new Date('2026-09-15T09:30:00'),
      content: 'Ela respondeu com interesse e pediu para ver um preview.',
    },
  });

  await prisma.interaction.create({
    data: {
      leadId: lead1.id,
      direction: 'OUTBOUND',
      channel: 'INSTAGRAM_DM',
      occurredAt: new Date('2026-09-17T14:00:00'),
      content: 'Enviei o link do preview: https://aprimore-dra-manu-marciel.netlify.app',
      outcome: 'INTERESSADO',
      followUpAt: new Date('2026-09-25T10:00:00'),
    },
  });

  await prisma.interaction.create({
    data: {
      leadId: lead2.id,
      direction: 'OUTBOUND',
      channel: 'INSTAGRAM_DM',
      occurredAt: new Date('2026-09-22T10:00:00'),
      content: 'Mandei mensagem de abordagem inicial.',
      outcome: 'SEM_RESPOSTA',
      followUpAt: new Date('2026-09-27T10:00:00'),
    },
  });

  await prisma.interaction.create({
    data: {
      leadId: lead3.id,
      direction: 'OUTBOUND',
      channel: 'INSTAGRAM_DM',
      occurredAt: new Date('2026-09-23T10:00:00'),
      content: 'Enviei abordagem inicial. Notei que o link do site dela está expirado.',
      outcome: 'SEM_RESPOSTA',
      followUpAt: new Date('2026-09-28T10:00:00'),
    },
  });

  await prisma.interaction.create({
    data: {
      leadId: lead4.id,
      direction: 'OUTBOUND',
      channel: 'INSTAGRAM_DM',
      occurredAt: new Date('2026-09-23T11:00:00'),
      content: 'Tentei contato via DM.',
      outcome: 'BLOQUEOU',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
