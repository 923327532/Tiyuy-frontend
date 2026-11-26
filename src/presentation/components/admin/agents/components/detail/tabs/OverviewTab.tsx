'use client';

import { Building2, ChevronRight, Percent, TrendingUp, Wallet } from 'lucide-react';
import { formatDate } from '@/presentation/components/admin/users/utils/users.utils';
import {
  EmptyNote,
  LINK,
  Panel,
  Row,
  RowList,
  StatusChip,
  formatAgentMoney,
  getAgentInsights,
} from '../ui/agentDetailParts';
import { getPlanLabel } from '../model/accountState';
import type { AgentTabProps } from './types';

export function OverviewTab({ agent, goToTab, onViewProperties }: AgentTabProps) {
  const insights = getAgentInsights(agent);

  const stats: {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    accent: string;
    action?: () => void;
  }[] = [
    {
      label: 'Propiedades',
      value: agent.propertiesCount ?? 0,
      icon: <Building2 className="h-4 w-4 text-[#164e63]" />,
      accent: 'bg-sky-50',
      action: onViewProperties ? () => onViewProperties(agent) : undefined,
    },
    {
      label: 'Conversión',
      value: `${(agent.conversionRate ?? 0).toFixed(1)}%`,
      icon: <Percent className="h-4 w-4 text-teal-700" />,
      accent: 'bg-teal-50',
    },
    {
      label: 'Ingresos mes',
      value: formatAgentMoney(agent.monthRevenue ?? 0),
      icon: <Wallet className="h-4 w-4 text-emerald-700" />,
      accent: 'bg-emerald-50',
    },
    {
      label: 'Ingresos año',
      value: formatAgentMoney(agent.yearRevenue ?? 0),
      icon: <TrendingUp className="h-4 w-4 text-amber-700" />,
      accent: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-4">
      <Panel title="Lectura rápida">
        <ul className="space-y-2.5">
          {insights.length ? (
            insights.map((insight) => (
              <li
                key={insight.id}
                className="flex items-center gap-2.5 rounded-xl bg-slate-50/90 px-3 py-2 text-sm text-slate-700"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    insight.tone === 'danger'
                      ? 'bg-rose-500'
                      : insight.tone === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-teal-600'
                  }`}
                  aria-hidden="true"
                />
                <span>{insight.text}</span>
              </li>
            ))
          ) : (
            <EmptyNote>Sin observaciones relevantes.</EmptyNote>
          )}
        </ul>
      </Panel>

      <Panel title="Actividad en la plataforma">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-3.5 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs font-medium text-slate-500">{stat.label}</dt>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}>
                  {stat.icon}
                </span>
              </div>
              <dd className="mt-2.5 flex items-baseline justify-between gap-2">
                <span className="text-lg font-bold tracking-tight tabular-nums text-[#0f2e3a]">
                  {stat.value}
                </span>
                {stat.action ? (
                  <button type="button" onClick={stat.action} className={LINK}>
                    Ver <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel
        title="Información personal"
        action={
          <button type="button" onClick={() => goToTab('plan')} className={LINK}>
            Ver plan <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        }
      >
        <RowList>
          <Row label="DNI" value={agent.dni || 'No especificado'} />
          <Row label="Ciudad" value={agent.city || 'No especificado'} />
          <Row label="País" value={agent.country || 'No especificado'} />
          <Row label="Plan actual" value={<StatusChip tone="info">{getPlanLabel(agent)}</StatusChip>} />
          <Row label="Miembro desde" value={formatDate(agent.createdAt)} />
        </RowList>
      </Panel>
    </div>
  );
}