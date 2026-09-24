'use client';

import { useEffect, useState } from 'react';

interface Interaction {
  id: string;
  leadId: string;
  direction: string;
  channel: string;
  occurredAt: string;
  content: string;
  outcome: string | null;
  followUpAt: string | null;
  followUpDone: boolean;
  lead: { name: string };
}

const outcomeColors: Record<string, string> = {
  SEM_RESPOSTA: 'bg-slate-100 text-slate-700',
  RESPONDEU: 'bg-blue-100 text-blue-700',
  INTERESSADO: 'bg-violet-100 text-violet-700',
  SEM_INTERESSE: 'bg-amber-100 text-amber-700',
  AGENDOU: 'bg-indigo-100 text-indigo-700',
  FECHOU: 'bg-emerald-100 text-emerald-700',
  BLOQUEOU: 'bg-rose-100 text-rose-700',
  OUTRO: 'bg-slate-100 text-slate-700',
};

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/interactions')
      .then(r => r.json())
      .then(data => {
        setInteractions(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Interações</h1>
        <p className="text-sm text-slate-600">Timeline global — {interactions.length} registros</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-200">
          {loading ? (
            <div className="p-8 text-center text-slate-600">Carregando...</div>
          ) : interactions.length === 0 ? (
            <div className="p-8 text-center text-slate-600">Nenhuma interação registrada</div>
          ) : (
            interactions.map(interaction => {
              const isOutbound = interaction.direction === 'OUTBOUND';
              const formattedDate = new Date(interaction.occurredAt).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={interaction.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-1">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold text-white ${
                        isOutbound ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}>
                        {isOutbound ? '↑' : '↓'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-900">{interaction.lead.name}</span>
                        <span className="text-xs text-slate-600">· {interaction.channel}</span>
                        {interaction.outcome && (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            outcomeColors[interaction.outcome] || 'bg-slate-100 text-slate-700'
                          }`}>
                            {interaction.outcome}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-words">
                        {interaction.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <span>{formattedDate}</span>
                        {interaction.followUpAt && !interaction.followUpDone && (
                          <span className="text-amber-600 font-medium">
                            ⏰ Follow-up {new Date(interaction.followUpAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
