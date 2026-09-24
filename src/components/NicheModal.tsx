'use client';

import { useState, useEffect } from 'react';
import { Niche } from '@prisma/client';
import { createNiche, updateNiche, getNiche } from '@/app/configuracoes/actions';

interface NicheModalProps {
  nicheId: string | null;
  onSuccess: (niche: Niche) => void;
  onClose: () => void;
}

export default function NicheModal({ nicheId, onSuccess, onClose }: NicheModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (nicheId) {
      getNiche(nicheId).then(niche => {
        if (niche && niche.name) {
          setName(niche.name);
          setColor(niche.color);
        }
      });
    }
  }, [nicheId]);

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

      const result = nicheId
        ? await updateNiche(nicheId, { name, color })
        : await createNiche({ name, color });

      if (result.success && result.data) {
        onSuccess(result.data);
      } else {
        setError(result.error || 'Erro ao salvar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-lg my-4">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            {nicheId ? 'Editar nicho' : 'Novo nicho'}
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

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-1.5">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Odontologia"
              className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900 block mb-1.5">
              Cor
            </label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>
        </form>

        <div className="p-5 border-t border-slate-200 flex justify-end gap-2">
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
            {loading ? 'Salvando...' : nicheId ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
}
