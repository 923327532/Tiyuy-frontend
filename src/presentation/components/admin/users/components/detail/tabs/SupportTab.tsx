'use client';

import { ChevronRight, Loader } from 'lucide-react';
import { formatDate } from '../../../utils/users.utils';
import {
  ALERT_META,
  CANCELLATION_META,
  CLAIM_META,
  CLAIM_TYPE_LABEL,
  EmptyNote,
  ItemRow,
  LINK,
  ListBody,
  POLICY_LABEL,
  Panel,
  SECONDARY_BUTTON,
  StatusChip,
  TICKET_META,
} from '../ui/detailParts';
import type { TabProps } from './types';

export function SupportTab({ extras, goToTab, onResolveCancellation, isResolvingCancellation }: TabProps) {
  const hasExtras = !!extras;

  return (
    <div className="space-y-4">
      <Panel
        title="Reclamos y solicitudes"
        action={
          <button type="button" onClick={() => goToTab('history')} className={LINK}>
            Ver historial <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        }
      >
        {!hasExtras ? (
          <EmptyNote>Conecta el Libro de Reclamaciones y las solicitudes de cambio o devolucion.</EmptyNote>
        ) : extras?.formalClaims?.length ? (
          <ListBody>
            {extras.formalClaims.map((claim) => (
              <ItemRow
                key={claim.id}
                title={
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{claim.code}</span>
                    {CLAIM_TYPE_LABEL[claim.type]}
                  </span>
                }
                meta={`${formatDate(claim.createdAt)}${claim.subject ? ` · ${claim.subject}` : ''}`}
                right={
                  <StatusChip tone={CLAIM_META[claim.status].tone}>
                    {CLAIM_META[claim.status].label}
                  </StatusChip>
                }
              />
            ))}
          </ListBody>
        ) : (
          <EmptyNote>Sin reclamos ni solicitudes registradas</EmptyNote>
        )}
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Tickets de soporte">
          {!hasExtras ? (
            <EmptyNote>Sin datos de soporte.</EmptyNote>
          ) : extras?.openTickets?.length ? (
            <ListBody>
              {extras.openTickets.map((ticket) => (
                <ItemRow
                  key={ticket.id}
                  title={ticket.subject}
                  meta={`${ticket.id} · ${formatDate(ticket.createdAt)}`}
                  right={
                    <StatusChip tone={TICKET_META[ticket.status].tone}>
                      {TICKET_META[ticket.status].label}
                    </StatusChip>
                  }
                />
              ))}
            </ListBody>
          ) : (
            <EmptyNote>Sin tickets registrados</EmptyNote>
          )}
        </Panel>

        <Panel title="Cancelaciones solicitadas">
          {!hasExtras ? (
            <EmptyNote>Sin datos de cancelaciones.</EmptyNote>
          ) : extras?.cancellationRequests?.length ? (
            <ListBody>
              {extras.cancellationRequests.map((req) => (
                <ItemRow
                  key={req.id}
                  title={req.service}
                  meta={`${formatDate(req.requestedAt)}${req.reason ? ` · ${req.reason}` : ''}`}
                  right={
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusChip tone={CANCELLATION_META[req.status].tone}>
                        {CANCELLATION_META[req.status].label}
                      </StatusChip>
                      {req.status === 'REQUESTED' && onResolveCancellation ? (
                        <button
                          type="button"
                          onClick={() => onResolveCancellation(req.id)}
                          disabled={isResolvingCancellation}
                          className={SECONDARY_BUTTON}
                        >
                          {isResolvingCancellation ? (
                            <Loader className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                          ) : null}
                          Revisar
                        </button>
                      ) : null}
                    </div>
                  }
                />
              ))}
            </ListBody>
          ) : (
            <EmptyNote>Sin solicitudes de cancelacion</EmptyNote>
          )}
        </Panel>
      </div>

      <Panel title="Alertas de politica">
        {!hasExtras ? (
          <EmptyNote>Sin datos de alertas.</EmptyNote>
        ) : extras?.openAlerts?.length ? (
          <ListBody>
            {extras.openAlerts.map((alert) => (
              <ItemRow
                key={alert.id}
                title={alert.summary}
                meta={`${POLICY_LABEL[alert.policy]} · ${formatDate(alert.createdAt)}`}
                right={
                  <StatusChip tone={ALERT_META[alert.status].tone}>
                    {ALERT_META[alert.status].label}
                  </StatusChip>
                }
              />
            ))}
          </ListBody>
        ) : (
          <EmptyNote>Sin alertas abiertas</EmptyNote>
        )}
      </Panel>
    </div>
  );
}
