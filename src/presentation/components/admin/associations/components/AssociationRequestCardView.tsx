'use client';

import { CalendarDays, CheckCircle, Building2, XCircle } from 'lucide-react';
import type { DeveloperAgentAssociation } from '@/core/domain/entities/Admin';

interface Props {
  requests: DeveloperAgentAssociation[];
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

function initials(item: DeveloperAgentAssociation) {
  return `${item.agentFirstName?.[0] ?? ''}${item.agentLastName?.[0] ?? ''}`.toUpperCase() || 'A';
}

export function AssociationRequestCardView({ requests, isReviewing, onApprove, onReject }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
      {requests.map((item) => (
        <li key={item.id}>
          <article
            className="
              flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4
              shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md
            "
          >
            <header className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                  {initials(item)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-800">
                    {item.agentFirstName} {item.agentLastName}
                  </h3>
                  <p className="truncate text-xs text-slate-400">{item.agentEmail}</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${
                  STATUS_STYLES[item.status] ?? STATUS_STYLES.REMOVED
                }`}
              >
                {item.status}
              </span>
            </header>

            <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="font-medium text-slate-700">{item.developerName || '—'}</span>
                  {item.developerRuc ? <span className="block text-slate-400">RUC: {item.developerRuc}</span> : null}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                  {item.requestedAt
                    ? new Date(item.requestedAt).toLocaleDateString('es-PE')
                    : 'Sin fecha'}
                  {item.requestedBy ? ` · ${item.requestedBy}` : ''}
                </span>
              </div>
            </div>

            {item.status === 'PENDING' && (
              <footer className="mt-auto flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => onApprove(item)}
                  disabled={isReviewing}
                  className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => onReject(item)}
                  disabled={isReviewing}
                  className="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
                >
                  Rechazar
                </button>
              </footer>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
