'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateLead } from '@/app/leads/actions';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

type Lead = any;

interface KanbanBoardVerticalProps {
  leads: Lead[];
  onLeadsChange: (leads: Lead[]) => void;
}

const STAGES = ['NOVO', 'ABORDADO', 'RESPONDEU', 'NEGOCIANDO', 'FECHADO', 'PERDIDO'];

const stageColors: Record<string, { bg: string; text: string; border: string; label: string; accent: string }> = {
  NOVO: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', label: 'Novo', accent: 'bg-slate-500' },
  ABORDADO: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Abordado', accent: 'bg-blue-500' },
  RESPONDEU: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Respondeu', accent: 'bg-amber-500' },
  NEGOCIANDO: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', label: 'Negociando', accent: 'bg-violet-500' },
  FECHADO: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Fechado', accent: 'bg-emerald-500' },
  PERDIDO: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Perdido', accent: 'bg-red-500' },
};

function daysSinceContact(lead: Lead): number | null {
  const lastInteraction = lead.interactions?.[0]?.occurredAt;
  if (!lastInteraction) return null;
  const days = Math.floor((Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24));
  return days;
}

function KanbanCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id: lead.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const days = daysSinceContact(lead);

  return (
    <Link href={`/leads/${lead.id}`}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
          isDragging ? 'shadow-lg scale-105 bg-slate-50' : ''
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900 flex-1 line-clamp-2">{lead.name}</h4>
            {lead.interactions && lead.interactions.length > 0 && (
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {lead.interactions.length}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: lead.niche?.color || '#e2e8f0' }}
            />
            <span className="text-xs text-slate-600">{lead.niche?.name}</span>
            {lead.proposedValue && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-600">R$ {lead.proposedValue.toLocaleString('pt-BR')}</span>
              </>
            )}
          </div>

          {days !== null && (
            <div className={`text-xs font-medium ${days > 7 ? 'text-orange-600' : 'text-slate-600'}`}>
              {days === 0 ? '📍 Hoje' : `⏰ ${days}d atrás`}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function StageLane({ stage, leads, onDropped }: { stage: string; leads: Lead[]; onDropped: () => void }) {
  const stageInfo = stageColors[stage] || stageColors.NOVO;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div
        className={`px-4 py-3 border-b ${stageInfo.border} flex items-center justify-between cursor-pointer hover:bg-slate-50`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${stageInfo.accent}`} />
          <div>
            <h3 className={`font-semibold ${stageInfo.text}`}>{stageInfo.label}</h3>
            <p className="text-xs text-slate-500">{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
        />
      </div>

      {/* Cards */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {leads.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">Nenhum lead</div>
          ) : (
            <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {leads.map(lead => (
                  <KanbanCard key={lead.id} lead={lead} />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}

export default function KanbanBoardVertical({ leads, onLeadsChange }: KanbanBoardVerticalProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
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
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {STAGES.map(stage => (
          <StageLane key={stage} stage={stage} leads={leads.filter(l => l.stage === stage)} onDropped={() => {}} />
        ))}
      </div>
    </DndContext>
  );
}
