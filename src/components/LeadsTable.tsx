'use client';

import { useState } from 'react';
import { Niche, SolutionType } from '@prisma/client';
import LeadModal from './LeadModal';

interface Lead {
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
  createdAt: string;
  niche: Niche;
  solutionType: SolutionType | null;
}

interface LeadsTableProps {
  leads: Lead[];
  niches: Niche[];
  solutions: SolutionType[];
  loading: boolean;
  filters: { search: string; niche: string; stage: string; solution: string };
  onFiltersChange: (filters: any) => void;
  onLeadsChange: (leads: Lead[]) => void;
}

const STAGES = ['NOVO', 'ABORDADO', 'RESPONDEU', 'NEGOCIANDO', 'FECHADO', 'PERDIDO'];

function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR');
}

function formatMoney(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function getInstagramHandle(url: string | null): string {
  if (!url) return '—';
  const match = url.match(/instagram\.com\/([^\/?]+)/);
  return match ? `@${match[1]}` : '—';
}

const stageColors: Record<string, string> = {
  NOVO: 'bg-slate-100 text-slate-700',
  ABORDADO: 'bg-blue-100 text-blue-700',
  RESPONDEU: 'bg-amber-100 text-amber-700',
  NEGOCIANDO: 'bg-violet-100 text-violet-700',
  FECHADO: 'bg-emerald-100 text-emerald-700',
  PERDIDO: 'bg-rose-100 text-rose-700',
};

const stageLabels: Record<string, string> = {
  NOVO: 'Novo',
  ABORDADO: 'Abordado',
  RESPONDEU: 'Respondeu',
  NEGOCIANDO: 'Negociando',
  FECHADO: 'Fechado',
  PERDIDO: 'Perdido',
};

export default function LeadsTable({
  leads,
  niches,
  solutions,
  loading,
  filters,
  onFiltersChange,
  onLeadsChange,
}: LeadsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const firstContact = (lead: Lead) => {
    const d = new Date(lead.createdAt);
    return formatDate(d.toISOString());
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Filters */}
      <div className="p-4 grid gap-3 md:grid-cols-4 border-b border-border">
        <input
          type="text"
          placeholder="Buscar por nome, @ ou nota..."
          value={filters.search}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
          className="h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        <select
          value={filters.niche}
          onChange={e => onFiltersChange({ ...filters, niche: e.target.value })}
          className="h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">Todos os nichos</option>
          {niches.map(n => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
        <select
          value={filters.stage}
          onChange={e => onFiltersChange({ ...filters, stage: e.target.value })}
          className="h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">Todas as etapas</option>
          {STAGES.map(s => (
            <option key={s} value={s}>
              {stageLabels[s]}
            </option>
          ))}
        </select>
        <select
          value={filters.solution}
          onChange={e => onFiltersChange({ ...filters, solution: e.target.value })}
          className="h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">Todas as soluções</option>
          {solutions.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-secondary-foreground">Lead</th>
              <th className="px-4 py-3 text-left font-medium text-secondary-foreground">Nicho</th>
              <th className="px-4 py-3 text-left font-medium text-secondary-foreground">Solução</th>
              <th className="px-4 py-3 text-left font-medium text-secondary-foreground">Etapa</th>
              <th className="px-4 py-3 text-left font-medium text-secondary-foreground">1º contato</th>
              <th className="px-4 py-3 text-left font-medium text-secondary-foreground">Proposto</th>
              <th className="px-4 py-3 text-left font-medium text-secondary-foreground">Vendido</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum lead encontrado
                </td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr
                  key={lead.id}
                  className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setEditingId(lead.id);
                    setIsModalOpen(true);
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{lead.name}</div>
                    <a
                      href={lead.instagramUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {getInstagramHandle(lead.instagramUrl)}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: lead.niche?.color || '#e2e8f0' }}
                      />
                      {lead.niche?.name || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.solutionType?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${stageColors[lead.stage]}`}>
                      {stageLabels[lead.stage]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{firstContact(lead)}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{formatMoney(lead.proposedValue)}</td>
                  <td
                    className={`px-4 py-3 tabular-nums ${
                      lead.stage === 'FECHADO' ? 'font-medium text-emerald-600' : 'text-muted-foreground'
                    }`}
                  >
                    {lead.stage === 'FECHADO' ? formatMoney(lead.soldValue) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <LeadModal
          leadId={editingId}
          niches={niches}
          solutions={solutions}
          onSuccess={(updatedLead: any) => {
            const updated = editingId
              ? leads.map(l => (l.id === updatedLead.id ? updatedLead : l))
              : [...leads, updatedLead];
            onLeadsChange(updated);
            setIsModalOpen(false);
            setEditingId(null);
          }}
          onClose={() => {
            setIsModalOpen(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
