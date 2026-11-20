'use client';

import { ChevronRight } from 'lucide-react';
import { formatDate } from '@/presentation/components/admin/users/utils/users.utils';
import {
  EmptyNote,
  LINK,
  Panel,
  Row,
  RowList,
  formatAgentMoney,
  getAgentInsights,
} from '../ui/agentDetailParts';
import { getPlanLabel } from '../model/accountState';
import type { AgentTabProps } from './types';

export function OverviewTab({ agent, goToTab, onViewProperties }: AgentTabProps) {
  const insights = getAgentInsights(agent);

  const stats: { label: string; value: number | string; action?: () => void }[] = [
    {
      label: 'Propiedades',
      value: agent.propertiesCount ?? 0,
      action: onViewProperties ? () => onViewProperties(agent) : undefined,
    },
    { label: 'Conversión', value: `${(agent.conversionRate ?? 0).toFixed(1)}%` },
    { label: 'Ingresos mes', value: formatAgentMoney(agent.monthRevenue ?? 0) },
    { label: 'Ingresos año', value: formatAgentMoney(agent.yearRevenue ?? 0) },
  ];

  return (
    <div className="space-y-4">
      <Panel title="Lectura rápida">
        <ul className="space-y-2">
          {insights.length ? (
            insights.map((insight) => (
              <li key={insight.id} className="flex items-start gap-2 text-sm text-slate-700">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    insight.tone === 'danger'
                      ? 'bg-rose-500'
                      : insight.tone === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-[#0f2e3a]'
                  }`}
                  aria-hidden="true"
                />
                {insight.text}
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
            <div key={stat.label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <dt className="text-xs text-slate-500">{stat.label}</dt>
              <dd className="mt-1 flex items-baseline justify-between gap-2">
                <span className="text-lg font-semibold tabular-nums text-[#0f2e3a]">
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
          <Row label="Plan actual" value={getPlanLabel(agent)} />
          <Row label="Miembro desde" value={formatDate(agent.createdAt)} />
        </RowList>
      </Panel>
    </div>
  );
}
