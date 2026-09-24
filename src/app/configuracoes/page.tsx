import { prisma } from '@/lib/prisma';
import NichesSection from '@/components/NichesSection';
import SolutionsSection from '@/components/SolutionsSection';

export default async function SettingsPage() {
  const [niches, solutions] = await Promise.all([
    prisma.niche.findMany(),
    prisma.solutionType.findMany(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-600">Gerencie nichos e tipos de solução digital.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <NichesSection initialNiches={niches} />
        <SolutionsSection initialSolutions={solutions} />
      </div>
    </div>
  );
}
