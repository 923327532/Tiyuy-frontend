'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import type { DeveloperAgentAssociation } from '@/core/domain/entities/Admin';
import { DataTable } from '@/presentation/components/ui/DataTable';
import type { Column } from '@/presentation/components/ui/DataTable';

interface Props {
  requests: DeveloperAgentAssociation[];
  isLoading?: boolean;
  isReviewing?: boolean;
  onApprove: (item: DeveloperAgentAssociation) => void;
  onReject: (item: DeveloperAgentAssociation) => void;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  REMOVED: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

function formatDate(value?: Date) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-PE');
}

function initials(item: DeveloperAgentAssociation) {
  return `${item.agentFirstName?.[0] ?? ''}${item.agentLastName?.[0] ?? ''}`.toUpperCase() || 'A';
}

export function AssociationRequestsTable({
  requests,
  isLoading,
  isReviewing,
  onApprove,
  onReject,
}: Props) {
  const columns: Column<DeveloperAgentAssociation>[] = [
    {
      key: 'agent',
      label: 'Agente',
      render: (_value, item) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
            {initials(item)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {item.agentFirstName} {item.agentLastName}
            </p>
            <p className="truncate text-xs text-slate-400">{item.agentEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'developer',
      label: 'Inmobiliaria',
      render: (_value, item) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-700">{item.developerName || '—'}</p>
          <p className="truncate text-xs text-slate-400">RUC: {item.developerRuc || '—'}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_value, item) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ${
            STATUS_STYLES[item.status] ?? STATUS_STYLES.REMOVED
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'requestedBy',
      label: 'Solicitado por',
      render: (_value, item) => (
        <span className="text-sm text-slate-600">{item.requestedBy || '—'}</span>
      ),
    },
    {
      key: 'requestedAt',
      label: 'Fecha',
      render: (_value, item) => (
        <span className="text-sm text-slate-600">{formatDate(item.requestedAt)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right',
      render: (_value, item) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          {item.status === 'PENDING' ? (
            <>
              <button
                type="button"
                onClick={() => onApprove(item)}
                disabled={isReviewing}
                title="Aprobar solicitud"
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
              >
                <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Aprobar
              </button>
              <button
                type="button"
                onClick={() => onReject(item)}
                disabled={isReviewing}
                title="Rechazar solicitud"
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
              >
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Rechazar
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400">Revisada</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={requests}
      columns={columns}
      rowKey="id"
      isLoading={isLoading}
      striped
      hoverable
      emptyMessage="No se encontraron solicitudes de asociación"
      className="association-requests-table"
    />
  );
}
