'use client';

import { useEffect, useState } from 'react';
import { Niche, SolutionType } from '@prisma/client';
import NichesSection from '@/components/NichesSection';
import SolutionsSection from '@/components/SolutionsSection';

export default function SettingsPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [solutions, setSolutions] = useState<SolutionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/niches').then(r => r.json()),
      fetch('/api/solutions').then(r => r.json()),
    ]).then(([n, s]) => {
      setNiches(Array.isArray(n) ? n : []);
      setSolutions(Array.isArray(s) ? s : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 text-center">
        <p className="text-slate-600">Carregando...</p>
      </div>
    );
  }

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
