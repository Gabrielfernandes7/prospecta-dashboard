'use client';

import { useState } from 'react';
import { SolutionType } from '@prisma/client';
import SolutionModal from './SolutionModal';
import { deleteSolution } from '@/app/configuracoes/actions';

interface SolutionsSectionProps {
  initialSolutions: SolutionType[];
}

function formatMoney(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default function SolutionsSection({ initialSolutions }: SolutionsSectionProps) {
  const [solutions, setSolutions] = useState(initialSolutions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = (newSolution: SolutionType) => {
    setSolutions([...solutions, newSolution]);
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedSolution: SolutionType) => {
    setSolutions(solutions.map(s => (s.id === updatedSolution.id ? updatedSolution : s)));
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta solução?')) return;
    await deleteSolution(id);
    setSolutions(solutions.filter(s => s.id !== id));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h3 className="font-semibold text-slate-900">Soluções digitais</h3>
          <p className="text-sm text-slate-600">O que você oferece.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="h-9 px-3 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          + Nova
        </button>
      </div>

      <div className="p-5 pt-0 space-y-2.5">
        {solutions.length === 0 ? (
          <p className="text-sm text-slate-600 py-4">Nenhuma solução cadastrada.</p>
        ) : (
          solutions.map(solution => (
            <div key={solution.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
              <div>
                <div className="text-sm font-medium text-slate-900">{solution.name}</div>
                <div className="text-xs text-slate-600">
                  Valor padrão: {formatMoney(solution.defaultPrice)}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingId(solution.id);
                    setIsModalOpen(true);
                  }}
                  className="h-8 px-3 rounded-md text-slate-600 hover:bg-slate-100 text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(solution.id)}
                  className="h-8 px-3 rounded-md text-red-600 hover:bg-red-50 text-sm transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <SolutionModal
          solutionId={editingId}
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
