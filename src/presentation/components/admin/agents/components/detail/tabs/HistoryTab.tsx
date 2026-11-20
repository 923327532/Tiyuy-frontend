'use client';

import type { ReactNode } from 'react';
import { formatDate, formatDateTime } from '@/presentation/components/admin/users/utils/users.utils';
import { EmptyNote, Panel, StatusChip } from '../ui/agentDetailParts';
import { getPlanLabel } from '../model/accountState';
import type { AgentTabProps } from './types';

function TimelineItem({
  title,
  meta,
  right,
  isLast,
}: {
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  isLast?: boolean;
}) {
  return (
    <li className="relative pl-6">
      {!isLast ? (
        <span
          className="absolute left-[5px] top-3 h-[calc(100%)] w-px bg-slate-200"
          aria-hidden="true"
        />
      ) : null}
      <span
        className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full border-2 border-white bg-slate-300 ring-1 ring-slate-200"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-4 pb-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#0f2e3a]">{title}</p>
          {meta ? <p className="mt-0.5 text-xs text-slate-500">{meta}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </li>
  );
}

export function HistoryTab({ agent }: AgentTabProps) {
  return (
    <div className="space-y-4">
      <Panel title="Historial de la cuenta">
        <ol className="pt-1">
          <TimelineItem
            title="Registro en la plataforma"
            meta={formatDateTime(agent.createdAt)}
            right={<StatusChip tone="info">Alta</StatusChip>}
          />
          <TimelineItem
            title="Último acceso registrado"
            meta={
              agent.lastLoginAt
                ? formatDateTime(agent.lastLoginAt)
                : 'Sin accesos registrados'
            }
            right={agent.lastLoginAt ? undefined : <StatusChip tone="neutral">Sin datos</StatusChip>}
          />
          <TimelineItem
            title={`Plan ${getPlanLabel(agent)}`}
            meta={
              agent.planExpiresAt
                ? `Vigencia: ${formatDate(agent.planExpiresAt)}`
                : 'Sin fecha de vencimiento'
            }
            right={<StatusChip tone="success">Vigente</StatusChip>}
            isLast
          />
        </ol>
      </Panel>

      <Panel title="Resumen de actividad">
        <EmptyNote>
          El agente acumula {agent.propertiesCount ?? 0} propiedad(es) publicada(s) con una tasa de
          conversión del {(agent.conversionRate ?? 0).toFixed(1)}%.
        </EmptyNote>
      </Panel>
    </div>
  );
}
