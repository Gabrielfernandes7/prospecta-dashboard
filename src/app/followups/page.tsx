'use client';

import { useEffect, useState } from 'react';
import FollowupsList from '@/components/FollowupsList';

interface Interaction {
  id: string;
  leadId: string;
  direction: string;
  channel: string;
  occurredAt: string;
  content: string;
  outcome: string | null;
  followUpAt: string;
  followUpDone: boolean;
  lead: { id: string; name: string };
}

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowups = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/interactions');
        const data = await res.json();

        // Filter only interactions with pending follow-ups
        const pending = (Array.isArray(data) ? data : []).filter(
          (i: Interaction) => i.followUpAt && !i.followUpDone
        );

        // Sort by followUpAt date (newest first)
        pending.sort(
          (a: Interaction, b: Interaction) =>
            new Date(b.followUpAt).getTime() - new Date(a.followUpAt).getTime()
        );

        setFollowups(pending);
      } catch (error) {
        console.error('Erro ao carregar follow-ups:', error);
        setFollowups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowups();
  }, []);

  const handleFollowupUpdated = (id: string) => {
    setFollowups(followups.filter(f => f.id !== id));
  };

  const totalVencido = followups.filter(f => {
    const followupDate = new Date(f.followUpAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    followupDate.setHours(0, 0, 0, 0);
    return followupDate < today;
  }).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Follow-ups</h1>
        <p className="mt-2 text-sm text-slate-600">
          {followups.length} follow-ups pendentes
          {totalVencido > 0 && (
            <span className="ml-2 inline-block px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-medium">
              {totalVencido} vencido{totalVencido !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Carregando follow-ups...</p>
        </div>
      ) : followups.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-slate-600 text-lg">Nenhum follow-up pendente</p>
          <p className="text-slate-500 text-sm mt-1">Volte aqui quando precisar gerenciar follow-ups dos seus leads.</p>
        </div>
      ) : (
        <FollowupsList followups={followups} onFollowupUpdated={handleFollowupUpdated} />
      )}
    </div>
  );
}
