'use client';

import { useState, useEffect } from 'react';
import { createInteraction, updateInteraction, deleteInteraction, getInteraction } from '@/app/interacoes/actions';
import { Portal } from './Portal';

const DIRECTIONS = ['OUTBOUND', 'INBOUND'];
const CHANNELS = [
  'INSTAGRAM_DM', 'INSTAGRAM_COMENTARIO', 'INSTAGRAM_STORY',
  'WHATSAPP', 'EMAIL', 'LIGACAO', 'REUNIAO', 'OUTRO'
];
const OUTCOMES = [
  'SEM_RESPOSTA', 'RESPONDEU', 'INTERESSADO', 'SEM_INTERESSE',
  'AGENDOU', 'FECHOU', 'BLOQUEOU', 'OUTRO'
];

interface InteractionModalProps {
  leadId: string;
  interactionId: string | null;
  onSuccess: (interaction: any) => void;
  onClose: () => void;
}

export default function InteractionModal({
  leadId,
  interactionId,
  onSuccess,
  onClose,
}: InteractionModalProps) {
  const [direction, setDirection] = useState('OUTBOUND');
  const [channel, setChannel] = useState('INSTAGRAM_DM');
  const [occurredAt, setOccurredAt] = useState('');
  const [content, setContent] = useState('');
  const [outcome, setOutcome] = useState('');
  const [followUpAt, setFollowUpAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setOccurredAt(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    if (interactionId) {
      getInteraction(interactionId).then(interaction => {
        if (interaction) {
          setDirection(interaction.direction);
          setChannel(interaction.channel);
          setOccurredAt(new Date(interaction.occurredAt).toISOString().slice(0, 16));
          setContent(interaction.content);
          setOutcome(interaction.outcome || '');
          setFollowUpAt(interaction.followUpAt ? new Date(interaction.followUpAt).toISOString().slice(0, 16) : '');
        }
      });
    }
  }, [interactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!content.trim()) {
        setError('Conteúdo é obrigatório');
        setLoading(false);
        return;
      }

      const data = {
        leadId,
        direction,
        channel,
        occurredAt: new Date(occurredAt).toISOString(),
        content,
        outcome: outcome || null,
        followUpAt: followUpAt ? new Date(followUpAt).toISOString() : null,
        followUpDone: false,
      };

      const result = interactionId
        ? await updateInteraction(interactionId, data)
        : await createInteraction(data);

      if (result.success && result.data) {
        onSuccess(result.data);
      } else {
        setError(result.error || 'Erro ao salvar');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Excluir esta interação?')) return;
    setLoading(true);
    const result = await deleteInteraction(interactionId!);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Erro ao deletar');
    }
    setLoading(false);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[999999] bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-lg my-4">
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            {interactionId ? 'Editar interação' : 'Registrar interação'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-5 max-h-[72vh] overflow-y-auto">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Direção</label>
              <select
                value={direction}
                onChange={e => setDirection(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="OUTBOUND">Outbound (eu enviei)</option>
                <option value="INBOUND">Inbound (ele respondeu)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Canal</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                {CHANNELS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-1.5">Data e hora</label>
            <input
              type="datetime-local"
              value={occurredAt}
              onChange={e => setOccurredAt(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-1.5">Conteúdo *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="O que foi dito / enviado?"
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Resultado</label>
              <select
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="">—</option>
                {OUTCOMES.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Próximo follow-up</label>
              <input
                type="datetime-local"
                value={followUpAt}
                onChange={e => setFollowUpAt(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 flex justify-between">
          <div>
            {interactionId && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="h-9 px-4 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Excluir
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="h-9 px-4 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Salvando...' : interactionId ? 'Salvar' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
