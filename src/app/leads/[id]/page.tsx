'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLead, updateLead, deleteLead } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InteractionsTimeline from '@/components/InteractionsTimeline';
import LeadModal from '@/components/LeadModal';
import { Trash2, Edit2, ArrowLeft, AlertCircle } from 'lucide-react';

type Lead = any;

const stageColors: Record<string, { bg: string; text: string; label: string }> = {
  NOVO: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Novo' },
  ABORDADO: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Abordado' },
  RESPONDEU: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Respondeu' },
  NEGOCIANDO: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Negociando' },
  FECHADO: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Fechado' },
  PERDIDO: { bg: 'bg-red-100', text: 'text-red-700', label: 'Perdido' },
};

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [niches, setNiches] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [leadData, nichesData, solutionsData] = await Promise.all([
        getLead(leadId),
        fetch('/api/niches').then(r => r.json()),
        fetch('/api/solutions').then(r => r.json()),
      ]);

      if (leadData) {
        setLead(leadData);
      } else {
        setError('Lead não encontrado');
      }

      setNiches(Array.isArray(nichesData) ? nichesData : []);
      setSolutions(Array.isArray(solutionsData) ? solutionsData : []);
      setLoading(false);
    };
    fetchData();
  }, [leadId]);

  const handleDelete = async () => {
    if (!confirm('Excluir este lead permanentemente?')) return;
    const result = await deleteLead(leadId);
    if (result.success) {
      router.push('/leads');
    } else {
      setError(result.error || 'Erro ao deletar lead');
    }
  };

  const handleInteractionAdded = (interaction: any) => {
    if (lead) {
      setLead({
        ...lead,
        interactions: [interaction, ...lead.interactions],
        stage: interaction.lead?.stage || lead.stage,
      });
    }
  };

  const handleLeadUpdated = async () => {
    const data = await getLead(leadId);
    if (data) {
      setLead(data);
    }
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 flex items-center justify-center h-screen">
        <p className="text-slate-600">Carregando...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">{error || 'Lead não encontrado'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stageInfo = stageColors[lead.stage] || stageColors.NOVO;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="h-9 px-4 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="h-9 px-4 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Lead Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{lead.name}</h1>
              <p className="text-sm text-slate-600 mt-1">ID: {lead.id}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase">Etapa</p>
                <div className={`mt-2 px-3 py-2 rounded-md inline-block font-medium cursor-pointer hover:opacity-80 transition-opacity ${stageInfo.bg} ${stageInfo.text}`} onClick={() => setIsEditModalOpen(true)} title="Clique para editar">
                  {stageInfo.label}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600 uppercase">Nicho</p>
                <Badge variant="secondary" className="mt-2">
                  {lead.niche.name}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600 uppercase">Solução</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{lead.solutionType.name}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600 uppercase">Fonte</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{lead.source}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposed & Sold Values */}
      <div className="grid gap-4 md:grid-cols-2">
        {lead.proposedValue && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Valor Proposto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">R$ {lead.proposedValue.toLocaleString('pt-BR')}</p>
            </CardContent>
          </Card>
        )}

        {lead.soldValue && lead.stage === 'FECHADO' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Valor Vendido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-emerald-600">R$ {lead.soldValue.toLocaleString('pt-BR')}</p>
                {lead.soldAt && (
                  <p className="text-xs text-slate-600">
                    Em {new Date(lead.soldAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {lead.stage === 'PERDIDO' && lead.lostReason && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Motivo da Perda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-900">{lead.lostReason}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact URLs */}
      {(lead.instagramUrl || lead.googleMapsUrl) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Contatos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lead.instagramUrl && (
              <a
                href={lead.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                📱 Instagram
              </a>
            )}
            {lead.googleMapsUrl && (
              <a
                href={lead.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                📍 Google Maps
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {lead.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{lead.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Interactions Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Interações ({lead.interactions.length})</CardTitle>
          <CardDescription>Timeline de todos os contatos com este lead</CardDescription>
        </CardHeader>
        <CardContent>
          <InteractionsTimeline
            leadId={leadId}
            interactions={lead.interactions}
            onInteractionAdded={handleInteractionAdded}
          />
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <LeadModal
          leadId={leadId}
          niches={niches}
          solutions={solutions}
          onSuccess={handleLeadUpdated}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
