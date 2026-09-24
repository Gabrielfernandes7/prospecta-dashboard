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
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h3 className="font-semibold text-card-foreground">Nichos</h3>
          <p className="text-sm text-muted-foreground">Segmentos dos seus leads.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + Novo
        </button>
      </div>

      <div className="p-5 pt-0 space-y-2.5">
        {niches.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nenhum nicho cadastrado.</p>
        ) : (
          niches.map(niche => (
            <div key={niche.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: niche.color }}
                />
                <span className="text-sm font-medium text-card-foreground">{niche.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingId(niche.id);
                    setIsModalOpen(true);
                  }}
                  className="h-8 px-3 rounded-md text-muted-foreground hover:bg-secondary text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(niche.id)}
                  className="h-8 px-3 rounded-md text-destructive hover:bg-destructive/10 text-sm transition-colors"
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
