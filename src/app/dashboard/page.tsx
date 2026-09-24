'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle2, AlertCircle, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Lead {
  id: string;
  name: string;
  nicheId: string;
  stage: string;
  proposedValue: number | null;
  soldValue: number | null;
  niche: { id: string; name: string; color: string };
  interactions: any[];
  createdAt: string;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLeads([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-center h-screen">
        <p className="text-slate-600">Carregando dados...</p>
      </div>
    );
  }

  const leadsArray = Array.isArray(leads) ? leads : [];

  // Cálculos
  const total = leadsArray.length;
  const abordados = leadsArray.filter(l => l.stage !== 'NOVO').length;
  const responderam = leadsArray.filter(l => ['RESPONDEU', 'NEGOCIANDO', 'FECHADO'].includes(l.stage)).length;
  const vendidos = leadsArray.filter(l => l.stage === 'FECHADO');
  const receita = vendidos.reduce((a, l) => a + (Number(l.soldValue) || 0), 0);
  const taxaResposta = abordados ? Math.round((responderam / abordados) * 100) : 0;
  const taxaConversao = abordados ? Math.round((vendidos.length / abordados) * 100) : 0;

  // Dados para gráficos
  const funnelData = [
    { name: 'Novo', value: leadsArray.filter(l => l.stage === 'NOVO').length },
    { name: 'Abordado', value: leadsArray.filter(l => l.stage === 'ABORDADO').length },
    { name: 'Respondeu', value: leadsArray.filter(l => l.stage === 'RESPONDEU').length },
    { name: 'Negociando', value: leadsArray.filter(l => l.stage === 'NEGOCIANDO').length },
    { name: 'Fechado', value: leadsArray.filter(l => l.stage === 'FECHADO').length },
  ];

  const nicheData = Array.from(new Map(leadsArray.map(l => [l.nicheId, l.niche])).values())
    .map(niche => ({
      name: niche.name,
      leads: leadsArray.filter(l => l.nicheId === niche.id).length,
      color: niche.color,
    }));

  const daysSinceContact = (lead: Lead) => {
    const lastInteraction = lead.interactions?.[0]?.occurredAt;
    if (!lastInteraction) return null;
    const days = Math.floor((Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getLeadStatus = (lead: Lead) => {
    const days = daysSinceContact(lead);
    if (lead.stage === 'FECHADO') return { icon: CheckCircle2, color: 'text-green-600', label: 'Vendido' };
    if (lead.stage === 'PERDIDO') return { icon: AlertCircle, color: 'text-red-600', label: 'Perdido' };
    if (days && days > 7) return { icon: AlertCircle, color: 'text-orange-600', label: `${days}d sem contato` };
    return { icon: Clock, color: 'text-blue-600', label: 'Em andamento' };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Visão geral dos seus leads e do funil de conversão.</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <KPICard icon={Users} label="Leads totais" value={total} />
        <KPICard icon={TrendingUp} label="Abordados" value={abordados} sub={`${total ? Math.round((abordados / total) * 100) : 0}%`} />
        <KPICard icon={CheckCircle2} label="Taxa resposta" value={`${taxaResposta}%`} sub={`${responderam}/${abordados}`} />
        <KPICard icon={Target} label="Taxa conversão" value={`${taxaConversao}%`} sub={`${vendidos.length} vendas`} />
        <KPICard icon={TrendingUp} label="Receita" value={`R$ ${(receita / 1000).toFixed(1)}k`} />
        <KPICard icon={Clock} label="Leads hoje" value={leadsArray.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length} />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Funil Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Funil por etapa</CardTitle>
            <CardDescription>Distribuição de leads no pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#64748b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Niches Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Leads por nicho</CardTitle>
            <CardDescription>Distribuição entre segmentos</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={nicheData} dataKey="leads" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {nicheData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leads Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Seus leads</CardTitle>
          <CardDescription>{leads.length} leads cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {leads.map(lead => {
              const status = getLeadStatus(lead);
              const StatusIcon = status.icon;
              const days = daysSinceContact(lead);

              return (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate text-sm">{lead.name}</h3>
                        {lead.niche && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {lead.niche.name}
                          </Badge>
                        )}
                      </div>
                      <StatusIcon className={`${status.color} w-5 h-5 flex-shrink-0 ml-2`} />
                    </div>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Etapa:</span>
                        <span className="font-medium text-slate-900">{lead.stage}</span>
                      </div>
                      {lead.proposedValue && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Proposto:</span>
                          <span className="font-medium text-slate-900">R$ {lead.proposedValue.toLocaleString('pt-BR')}</span>
                        </div>
                      )}
                      {days !== null && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Último contato:</span>
                          <span className="text-slate-500">{days}d atrás</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500">{lead.interactions?.length || 0} interações</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: number | string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</p>
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
      </CardContent>
    </Card>
  );
}
