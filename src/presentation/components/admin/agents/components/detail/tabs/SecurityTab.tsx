'use client';

import { Check } from 'lucide-react';
import { formatDateTime, formatRelative } from '@/presentation/components/admin/users/utils/users.utils';
import {
  EmptyNote,
  Panel,
  Row,
  RowList,
  StatusChip,
} from '../ui/agentDetailParts';
import type { AgentTabProps } from './types';

function ToggleRow({
  label,
  done,
  doneLabel = 'Verificado',
  pendingLabel = 'Pendiente',
}: {
  label: string;
  done: boolean;
  doneLabel?: string;
  pendingLabel?: string;
}) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-2 text-sm text-[#0f2e3a]">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {done ? (
            <Check className="h-3 w-3" aria-hidden="true" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          )}
        </span>
        {label}
      </div>
      <StatusChip tone={done ? 'success' : 'warning'}>
        {done ? doneLabel : pendingLabel}
      </StatusChip>
    </li>
  );
}

export function SecurityTab({ agent }: AgentTabProps) {
  return (
    <div className="space-y-4">
      <Panel title="Verificación de la cuenta">
        <ul className="divide-y divide-slate-100 -my-3">
          <ToggleRow label="Correo electrónico" done={agent.emailVerified} />
          <ToggleRow label="Número de teléfono" done={agent.phoneVerified} />
          <ToggleRow
            label="Cuenta activa"
            done={agent.enabled}
            doneLabel="Activa"
            pendingLabel="Suspendida"
          />
        </ul>
      </Panel>

      <Panel title="Accesos">
        <RowList>
          <Row label="Último acceso" value={formatRelative(agent.lastLoginAt)} />
          <Row label="Fecha y hora" value={formatDateTime(agent.lastLoginAt)} />
          <Row label="Correo" value={agent.email} valueClassName="break-all" />
        </RowList>
      </Panel>

      {!agent.emailVerified || !agent.phoneVerified ? (
        <Panel title="Pendiente">
          <EmptyNote>
            El agente debe completar la verificación de sus datos de contacto para operar sin
            restricciones.
          </EmptyNote>
        </Panel>
      ) : null}
    </div>
  );
}
