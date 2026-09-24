'use client';

import { useState } from 'react';
import { Niche } from '@prisma/client';
import NicheModal from './NicheModal';
import { deleteNiche } from '@/app/configuracoes/actions';

interface NichesSectionProps {
  initialNiches: Niche[];
}

export default function NichesSection({ initialNiches }: NichesSectionProps) {
  const [niches, setNiches] = useState(initialNiches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = (newNiche: Niche) => {
    setNiches([...niches, newNiche]);
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedNiche: Niche) => {
    setNiches(niches.map(n => (n.id === updatedNiche.id ? updatedNiche : n)));
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este nicho?')) return;
    await deleteNiche(id);
    setNiches(niches.filter(n => n.id !== id));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Nichos</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Segmentos dos seus leads.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="h-9 px-3 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          + Novo
        </button>
      </div>

      <div className="p-5 pt-0 space-y-2.5">
        {niches.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400 py-4">Nenhum nicho cadastrado.</p>
        ) : (
          niches.map(niche => (
            <div key={niche.id} className="flex items-center justify-between py-2.5 border-b border-slate-200 last:border-0 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: niche.color }}
                />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{niche.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingId(niche.id);
                    setIsModalOpen(true);
                  }}
                  className="h-8 px-3 rounded-md text-slate-600 hover:bg-slate-100 text-sm transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(niche.id)}
                  className="h-8 px-3 rounded-md text-red-600 hover:bg-red-50 text-sm transition-colors dark:text-red-400 dark:hover:bg-red-950"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <NicheModal
          nicheId={editingId}
          onSuccess={editingId ? handleUpdate : handleCreate}
          onClose={() => {
            setIsModalOpen(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
