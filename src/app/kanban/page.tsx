'use client';

import { useEffect, useState } from 'react';
import KanbanBoard from '@/components/KanbanBoard';

type Lead = any;

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLeads([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Kanban</h1>
        <p className="text-sm text-slate-600">Arraste os cards para mover o lead entre as etapas.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Carregando...</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <KanbanBoard leads={leads} onLeadsChange={setLeads} />
        </div>
      )}
    </div>
  );
}
