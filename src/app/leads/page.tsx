'use client';

import { useEffect, useState } from 'react';
import LeadsTable from '@/components/LeadsTable';
import { Niche, SolutionType } from '@prisma/client';

interface LeadWithRelations {
  id: string;
  name: string;
  instagramUrl: string | null;
  googleMapsUrl: string | null;
  source: string;
  nicheId: string;
  solutionTypeId: string | null;
  stage: string;
  proposedValue: number | null;
  soldValue: number | null;
  soldAt: string | null;
  lostReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  niche: Niche;
  solutionType: SolutionType | null;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadWithRelations[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [solutions, setSolutions] = useState<SolutionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', niche: '', stage: '', solution: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/niches').then(r => r.json()),
      fetch('/api/solutions').then(r => r.json()),
    ]).then(([n, s]) => {
      setNiches(Array.isArray(n) ? n : []);
      setSolutions(Array.isArray(s) ? s : []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    if (filters.niche) query.append('niche', filters.niche);
    if (filters.stage) query.append('stage', filters.stage);
    if (filters.solution) query.append('solution', filters.solution);

    fetch(`/api/leads?${query}`).then(r => r.json()).then(data => {
      setLeads(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Leads</h1>
        <p className="text-sm text-slate-600">{leads.length} de {leads.length} leads</p>
      </div>

      <LeadsTable
        leads={leads as any}
        niches={niches}
        solutions={solutions}
        loading={loading}
        filters={filters}
        onFiltersChange={setFilters}
        onLeadsChange={(updatedLeads: any) => setLeads(updatedLeads)}
      />
    </div>
  );
}
