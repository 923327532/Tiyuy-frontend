'use client';

import { ChevronLeft, ChevronRight, CheckCircle, PauseCircle, Ban, Clock } from 'lucide-react';
import type { InmobiliariaStatusHistory } from '@/core/domain/entities/Admin';
import type { DetailTabProps } from '@/presentation/components/admin/agencies/types/agencies.types';
import '../styles/HistoryTab.css';

interface HistoryRowProps {
  entry: InmobiliariaStatusHistory;
}

function HistoryRow({ entry }: HistoryRowProps) {
  let statusIcon: React.ReactNode;
  let statusClass = 'agc-history__status ';

  switch (entry.newStatus) {
    case 'ACTIVE':
      statusIcon = <CheckCircle className="w-4 h-4" aria-hidden="true" />;
      statusClass += 'agc-history__status--active';
      break;
    case 'SUSPENDED':
      statusIcon = <PauseCircle className="w-4 h-4" aria-hidden="true" />;
      statusClass += 'agc-history__status--suspended';
      break;
    case 'BLOCKED':
    case 'INACTIVE':
      statusIcon = <Ban className="w-4 h-4" aria-hidden="true" />;
      statusClass += 'agc-history__status--blocked';
      break;
    default:
      statusIcon = <Clock className="w-4 h-4" aria-hidden="true" />;
      statusClass += 'agc-history__status--default';
  }

  return (
    <div className="agc-history__row">
      <div className="agc-history__date">
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        <time dateTime={entry.createdAt ? new Date(entry.createdAt).toISOString() : undefined}>
          {entry.createdAt ? new Date(entry.createdAt).toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) : '—'}
        </time>
      </div>
      <div className="agc-history__status-wrapper">
        <span className={statusClass}>{statusIcon} {entry.newStatus}</span>
        {entry.reason && <p className="agc-history__reason">{entry.reason}</p>}
        {entry.changedBy && <p className="agc-history__by">Por: {entry.changedBy}</p>}
      </div>
    </div>
  );
}

export function HistoryTab({
  statusHistory,
  historyPage,
  totalHistoryPages,
  totalHistoryElements,
  onHistoryPageChange,
  onClearHistory,
}: DetailTabProps) {
  return (
    <div className="agc-history-tab">
      <div className="agc-history__header">
        <h3 className="agc-history__title">Historial de cambios de estado</h3>
        <div className="agc-history__meta">
          <span>{totalHistoryElements} registros</span>
          {totalHistoryElements > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="agc-history__clear"
            >
              Vaciar historial
            </button>
          )}
        </div>
      </div>

      {statusHistory.length === 0 ? (
        <div className="agc-history__empty">
          <Clock className="w-12 h-12 text-slate-300" aria-hidden="true" />
          <p className="agc-history__empty-title">Sin historial</p>
          <p className="agc-history__empty-text">No hay cambios de estado registrados para esta inmobiliaria.</p>
        </div>
      ) : (
        <>
          <div className="agc-history__list" role="list">
            {statusHistory.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </div>

          {totalHistoryPages > 1 && (
            <nav className="agc-history__pagination" aria-label="Paginación del historial">
              <button
                type="button"
                onClick={() => onHistoryPageChange(historyPage - 1)}
                disabled={historyPage === 0}
                className="agc-history__page-btn"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="agc-history__page-info">
                Página {historyPage + 1} de {totalHistoryPages}
              </span>
              <button
                type="button"
                onClick={() => onHistoryPageChange(historyPage + 1)}
                disabled={historyPage >= totalHistoryPages - 1}
                className="agc-history__page-btn"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}