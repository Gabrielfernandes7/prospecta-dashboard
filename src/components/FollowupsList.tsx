'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { markFollowUpDone } from '@/app/interacoes/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Interaction {
  id: string;
  leadId: string;
  direction: string;
  channel: string;
  occurredAt: string | Date;
  content: string;
  outcome: string | null;
  followUpAt: string | Date;
  followUpDone: boolean;
  lead: { id: string; name: string };
}

interface FollowupsListProps {
  followups: Interaction[];
  onFollowupUpdated: (id: string) => void;
}

type FilterType = 'vencido' | 'hoje' | 'agendado';

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

function getFollowupStatus(followUpAt: string | Date): FilterType {
  const followupDate = new Date(followUpAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  followupDate.setHours(0, 0, 0, 0);

  if (followupDate < today) return 'vencido';
  if (followupDate.getTime() === today.getTime()) return 'hoje';
  return 'agendado';
}

function getStatusIcon(status: FilterType) {
  const icons = {
    vencido: { Icon: AlertCircle, color: 'text-red-600', label: 'Vencido' },
    hoje: { Icon: Clock, color: 'text-amber-600', label: 'Hoje' },
    agendado: { Icon: Clock, color: 'text-blue-600', label: 'Agendado' },
  };
  return icons[status];
}

function FollowupCard({
  followup,
  status,
  onMarkDone,
}: {
  followup: Interaction;
  status: FilterType;
  onMarkDone: (id: string) => void;
}) {
  const statusInfo = getStatusIcon(status);
  const StatusIcon = statusInfo.Icon;
  const formattedDate = new Date(followup.followUpAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });

  const originalDate = new Date(followup.occurredAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Link
                href={`/leads/${followup.leadId}`}
                className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {followup.lead.name}
              </Link>
              <p className="text-xs text-slate-600 mt-0.5">
                Interação em {originalDate}
              </p>
            </div>
            <StatusIcon className={`${statusInfo.color} w-5 h-5 flex-shrink-0`} />
          </div>

          {followup.outcome && (
            <div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                outcomeColors[followup.outcome] || 'bg-slate-100 text-slate-700'
              }`}>
                {followup.outcome}
              </span>
            </div>
          )}

          <p className="text-sm text-slate-700 whitespace-pre-wrap break-words line-clamp-2">
            {followup.content}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {formattedDate}
              </Badge>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-600">{followup.channel}</span>
            </div>

            <button
              onClick={() => onMarkDone(followup.id)}
              className="h-8 px-3 rounded-md text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Feito
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FollowupsList({ followups, onFollowupUpdated }: FollowupsListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('vencido');
  const [marking, setMarking] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return {
      vencido: followups.filter(f => getFollowupStatus(f.followUpAt) === 'vencido'),
      hoje: followups.filter(f => getFollowupStatus(f.followUpAt) === 'hoje'),
      agendado: followups.filter(f => getFollowupStatus(f.followUpAt) === 'agendado'),
    };
  }, [followups]);

  const handleMarkDone = async (id: string) => {
    setMarking(id);
    const result = await markFollowUpDone(id);
    if (result.success) {
      onFollowupUpdated(id);
    }
    setMarking(null);
  };

  const filters: FilterType[] = ['vencido', 'hoje', 'agendado'];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {filters.map(filter => {
          const count = grouped[filter].length;
          const isActive = activeFilter === filter;
          const statusInfo = getStatusIcon(filter);

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? `border-slate-900 text-slate-900`
                  : `border-transparent text-slate-600 hover:text-slate-900`
              }`}
            >
              <statusInfo.Icon className={`w-4 h-4 ${isActive ? statusInfo.color : ''}`} />
              {statusInfo.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {grouped[activeFilter].length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">
              {activeFilter === 'vencido' && 'Nenhum follow-up vencido. Ótimo!'}
              {activeFilter === 'hoje' && 'Nenhum follow-up para hoje.'}
              {activeFilter === 'agendado' && 'Nenhum follow-up agendado.'}
            </p>
          </div>
        ) : (
          grouped[activeFilter].map(followup => (
            <FollowupCard
              key={followup.id}
              followup={followup}
              status={activeFilter}
              onMarkDone={handleMarkDone}
            />
          ))
        )}
      </div>
    </div>
  );
}
