'use client';

import { useState, useEffect } from 'react';
import { Niche, SolutionType } from '@prisma/client';
import { createLead, updateLead, deleteLead, getLead } from '@/app/leads/actions';
import InteractionsTimeline from './InteractionsTimeline';

const STAGES = ['NOVO', 'ABORDADO', 'RESPONDEU', 'NEGOCIANDO', 'FECHADO', 'PERDIDO'];
const SOURCES = ['INSTAGRAM', 'GOOGLE_MAPS', 'INDICACAO', 'OUTRO'];

interface LeadModalProps {
  leadId: string | null;
  niches: Niche[];
  solutions: SolutionType[];
  onSuccess: (lead: any) => void;
  onClose: () => void;
}

export default function LeadModal({ leadId, niches, solutions, onSuccess, onClose }: LeadModalProps) {
  const [name, setName] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [source, setSource] = useState('INSTAGRAM');
  const [nicheId, setNicheId] = useState('');
  const [solutionTypeId, setSolutionTypeId] = useState('');
  const [stage, setStage] = useState('NOVO');
  const [proposedValue, setProposedValue] = useState('');
  const [soldValue, setSoldValue] = useState('');
  const [soldAt, setSoldAt] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interactions, setInteractions] = useState<any[]>([]);

  useEffect(() => {
    if (niches.length > 0 && !nicheId) setNicheId(niches[0].id);
  }, [niches, nicheId]);

  useEffect(() => {
    if (leadId) {
      getLead(leadId).then(lead => {
        if (lead) {
          setName(lead.name);
          setInstagramUrl(lead.instagramUrl || '');
          setGoogleMapsUrl(lead.googleMapsUrl || '');
          setSource(lead.source);
          setNicheId(lead.nicheId);
          setSolutionTypeId(lead.solutionTypeId || '');
          setStage(lead.stage);
          setProposedValue(lead.proposedValue?.toString() || '');
          setSoldValue(lead.soldValue?.toString() || '');
          const date = lead.soldAt instanceof Date ? lead.soldAt : lead.soldAt ? new Date(lead.soldAt as any) : null;
          setSoldAt(date ? date.toISOString().split('T')[0] : '');
          setLostReason(lead.lostReason || '');
          setNotes(lead.notes || '');
        }
      });
      fetch(`/api/interactions?leadId=${leadId}`)
        .then(r => r.json())
        .then(data => setInteractions(Array.isArray(data) ? data : []));
    }
  }, [leadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name.trim()) {
        setError('Nome é obrigatório');
        setLoading(false);
        return;
      }

      const data = {
        name,
        instagramUrl: instagramUrl || null,
        googleMapsUrl: googleMapsUrl || null,
        source,
        nicheId,
        solutionTypeId: solutionTypeId || null,
        stage,
        proposedValue: proposedValue ? Number(proposedValue) : null,
        soldValue: stage === 'FECHADO' ? (soldValue ? Number(soldValue) : null) : null,
        soldAt: stage === 'FECHADO' && soldAt ? new Date(soldAt).toISOString() : null,
        lostReason: stage === 'PERDIDO' ? lostReason : null,
        notes,
      };

      const result = leadId
        ? await updateLead(leadId, data)
        : await createLead(data);

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
    if (!confirm('Excluir este lead e todas as suas interações?')) return;
    setLoading(true);
    const result = await deleteLead(leadId!);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Erro ao deletar');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-lg border border-slate-200 shadow-lg my-4">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            {leadId ? name || 'Lead' : 'Novo lead'}
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

        <form onSubmit={handleSubmit} className="space-y-4 p-5 max-h-[72vh] overflow-y-auto">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Nome *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nome do lead"
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Etapa</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                {STAGES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-1.5">Instagram URL</label>
            <input
              type="url"
              value={instagramUrl}
              onChange={e => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/usuario"
              className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-1.5">Google Maps URL</label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={e => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Origem</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                {SOURCES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Nicho</label>
              <select
                value={nicheId}
                onChange={e => setNicheId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                {niches.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Solução digital</label>
              <select
                value={solutionTypeId}
                onChange={e => setSolutionTypeId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="">—</option>
                {solutions.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Valor proposto</label>
              <input
                type="number"
                value={proposedValue}
                onChange={e => setProposedValue(e.target.value)}
                placeholder="1000"
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          {stage === 'FECHADO' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-900 block mb-1.5">Valor vendido</label>
                <input
                  type="number"
                  value={soldValue}
                  onChange={e => setSoldValue(e.target.value)}
                  placeholder="1000"
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-900 block mb-1.5">Data da venda</label>
                <input
                  type="date"
                  value={soldAt}
                  onChange={e => setSoldAt(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
            </div>
          )}

          {stage === 'PERDIDO' && (
            <div>
              <label className="text-sm font-medium text-slate-900 block mb-1.5">Motivo da perda</label>
              <input
                type="text"
                value={lostReason}
                onChange={e => setLostReason(e.target.value)}
                placeholder="Ex: bloqueou, sem interesse..."
                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-1.5">Observações</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anotações livres"
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          {leadId && (
            <InteractionsTimeline
              leadId={leadId}
              interactions={interactions}
              onInteractionAdded={(newInteraction: any) => {
                setInteractions([newInteraction, ...interactions]);
                setStage(newInteraction.lead?.stage || stage);
              }}
            />
          )}
        </form>

        <div className="p-5 border-t border-slate-200 flex justify-between">
          <div>
            {leadId && (
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
              {loading ? 'Salvando...' : leadId ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
