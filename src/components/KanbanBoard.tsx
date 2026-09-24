'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { updateLead } from '@/app/leads/actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Lead = any;

interface KanbanBoardProps {
  leads: Lead[];
  onLeadsChange: (leads: Lead[]) => void;
}

const STAGES = ['NOVO', 'ABORDADO', 'RESPONDEU', 'NEGOCIANDO', 'FECHADO', 'PERDIDO'];

const stageColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
  NOVO: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', label: 'Novo' },
  ABORDADO: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Abordado' },
  RESPONDEU: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Respondeu' },
  NEGOCIANDO: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', label: 'Negociando' },
  FECHADO: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Fechado' },
  PERDIDO: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Perdido' },
};

function daysSinceContact(lead: Lead): number | null {
  const lastInteraction = lead.interactions?.[0]?.occurredAt;
  if (!lastInteraction) return null;
  const days = Math.floor((Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24));
  return days;
}

function KanbanCard({ lead, isDragging }: { lead: Lead; isDragging: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: lead.id });
  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const days = daysSinceContact(lead);
  const stageInfo = stageColors[lead.stage] || stageColors.NOVO;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 rounded-lg border-2 border-slate-200 bg-white hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${
        isDragging ? 'opacity-50 shadow-lg scale-105 bg-slate-50' : ''
      }`}
    >
      <Link href={`/leads/${lead.id}`} className="block group-hover:opacity-80">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-slate-900 flex-1 line-clamp-2">{lead.name}</h4>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: lead.niche?.color || '#e2e8f0' }}
            />
            <span className="text-xs text-slate-600">{lead.niche?.name}</span>
          </div>

          {lead.proposedValue && (
            <div className="text-xs text-slate-600">
              R$ {lead.proposedValue.toLocaleString('pt-BR')}
            </div>
          )}

          {days !== null && (
            <div className={`text-xs font-medium ${days > 7 ? 'text-orange-600' : 'text-slate-600'}`}>
              {days === 0 ? 'Hoje' : `${days}d atrás`}
            </div>
          )}

          <div className="flex items-center gap-1 pt-1">
            {lead.interactions && lead.interactions.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {lead.interactions.length} {lead.interactions.length === 1 ? 'interação' : 'interações'}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

function KanbanColumn({ stage, leads, onDragOver }: { stage: string; leads: Lead[]; onDragOver: (stage: string) => void }) {
  const stageInfo = stageColors[stage] || stageColors.NOVO;

  return (
    <div className="flex-1 min-w-[300px] bg-slate-100 rounded-lg p-4 space-y-3">
      <div className={`px-3 py-2 rounded-md inline-block font-semibold text-sm ${stageInfo.text} ${stageInfo.bg} border ${stageInfo.border}`}>
        {stageInfo.label} ({leads.length})
      </div>

      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[300px]">
          {leads.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-8">Nenhum lead</div>
          ) : (
            leads.map(lead => <KanbanCard key={lead.id} lead={lead} isDragging={false} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({ leads, onLeadsChange }: KanbanBoardProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const leadId = active.id as string;
      const newStage = over.id as string;

      const lead = leads.find(l => l.id === leadId);
      if (!lead || lead.stage === newStage) return;

      setUpdatingId(leadId);

      const result = await updateLead(leadId, { ...lead, stage: newStage });
      if (result.success && result.data) {
        const updated = leads.map(l => (l.id === leadId ? result.data : l));
        onLeadsChange(updated);
      }

      setUpdatingId(null);
    },
    [leads, onLeadsChange]
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage} data-testid={`column-${stage}`}>
            <KanbanColumn stage={stage} leads={leads.filter(l => l.stage === stage)} onDragOver={() => {}} />
          </div>
        ))}
      </div>
    </DndContext>
  );
}
