'use client';

import { useState } from 'react';
import InteractionModal from './InteractionModal';

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
}

interface InteractionsTimelineProps {
  leadId: string;
  interactions: Interaction[];
  onInteractionAdded: (interaction: Interaction) => void;
}

const outcomeColors: Record<string, string> = {
  SEM_RESPOSTA: 'bg-slate-100 text-slate-700',
  RESPONDEU: 'bg-blue-100 text-blue-700',
  INTERESSADO: 'bg-violet-100 text-violet-700',
  SEM_INTERESSE: 'bg-amber-100 text-amber-700',
  AGENDOU: 'bg-indigo-100 text-indigo-700',
  FECHOU: 'bg-emerald-100 text-emerald-700',
  BLOQUEOU: 'bg-rose-100 text-rose-700',
};

export default function InteractionsTimeline({
  leadId,
  interactions,
  onInteractionAdded,
}: InteractionsTimelineProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Timeline de interações</h3>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="h-8 px-3 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          + Registrar
        </button>
      </div>

      <div className="space-y-3">
        {interactions.length === 0 ? (
          <p className="text-sm text-slate-600 py-4">Nenhuma interação registrada ainda.</p>
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
              <div key={interaction.id} className="flex gap-3 p-3 rounded-md border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="shrink-0">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold text-white ${
                    isOutbound ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}>
                    {isOutbound ? '↑' : '↓'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-600">{interaction.channel}</span>
                    {interaction.outcome && (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        outcomeColors[interaction.outcome] || 'bg-slate-100 text-slate-700'
                      }`}>
                        {interaction.outcome}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{formattedDate}</span>
                    {interaction.followUpAt && !interaction.followUpDone && (
                      <span className="text-xs text-amber-600">
                        ⏰ {new Date(interaction.followUpAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap break-words">{interaction.content}</p>
                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(interaction.id);
                        setIsModalOpen(true);
                      }}
                      className="h-7 px-2 rounded text-slate-600 hover:bg-slate-100 text-xs transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <InteractionModal
          leadId={leadId}
          interactionId={editingId}
          onSuccess={(interaction: any) => {
            onInteractionAdded(interaction);
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
