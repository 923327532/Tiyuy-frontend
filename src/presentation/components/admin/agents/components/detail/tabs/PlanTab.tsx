'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatDate } from '@/presentation/components/admin/users/utils/users.utils';
import {
  EmptyNote,
  LINK,
  Panel,
  Row,
  RowList,
  StatusChip,
  formatAgentMoney,
} from '../ui/agentDetailParts';
import { getPlanLabel } from '../model/accountState';
import type { AgentTabProps } from './types';

export function PlanTab({ agent }: AgentTabProps) {
  const plan = getPlanLabel(agent);
  const expired = agent.planExpiresAt
    ? new Date(agent.planExpiresAt).getTime() < Date.now()
    : false;

  const revenue = [
    { label: 'Semana', value: agent.weekRevenue ?? 0 },
    { label: 'Mes', value: agent.monthRevenue ?? 0 },
    { label: 'Año', value: agent.yearRevenue ?? 0 },
  ];

  return (
    <div className="space-y-4">
      <Panel
        title="Plan actual"
        action={
          <Link href="/admin/agents/discounts" className={LINK}>
            Gestionar descuentos <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        }
      >
        <RowList>
          <Row label="Plan" value={<StatusChip tone="info">{plan}</StatusChip>} />
          <Row
            label="Vencimiento"
            value={
              agent.planExpiresAt ? (
                <StatusChip tone={expired ? 'danger' : 'success'}>
                  {formatDate(agent.planExpiresAt)}
                </StatusChip>
              ) : (
                'Sin vencimiento'
              )
            }
          />
          <Row label="Propiedades publicadas" value={agent.propertiesCount ?? 0} />
          <Row label="Tasa de conversión" value={`${(agent.conversionRate ?? 0).toFixed(1)}%`} />
        </RowList>
      </Panel>

      <Panel title="Ingresos generados">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {revenue.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <dt className="text-xs text-slate-500">{item.label}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-[#0f2e3a]">
                {formatAgentMoney(item.value)}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Detalle del plan">
        {agent.planExpiresAt ? (
          <EmptyNote>
            El plan <strong className="font-semibold text-[#0f2e3a]">{plan}</strong>{' '}
            {expired ? 'venció el' : 'está vigente hasta el'} {formatDate(agent.planExpiresAt)}.
          </EmptyNote>
        ) : (
          <EmptyNote>
            El agente usa el plan <strong className="font-semibold text-[#0f2e3a]">{plan}</strong> sin
            fecha de vencimiento registrada.
          </EmptyNote>
        )}
      </Panel>
    </div>
  );
}
