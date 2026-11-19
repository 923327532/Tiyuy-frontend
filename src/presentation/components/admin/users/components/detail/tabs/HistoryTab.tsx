'use client';

import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { PROPERTY_TYPE_LABELS } from '@/presentation/components/admin/PropertyAnalytics/propertyAnalyticsConfig';
import { formatDate, formatMoney } from '../../../utils/users.utils';
import {
  CLAIM_META,
  CLAIM_TYPE_LABEL,
  EmptyNote,
  ItemRow,
  LINK,
  LISTING_META,
  ListBody,
  METHOD_LABEL,
  PAYMENT_META,
  Panel,
  StatusChip,
} from '../ui/detailParts';
import type { TabProps } from './types';

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

export function HistoryTab({ user, extras, onViewProperties }: TabProps) {
  const hasExtras = !!extras;
  const listings = extras?.publishedListings ?? [];
  const claims = extras?.formalClaims ?? [];
  const payments = extras?.payments ?? [];

  return (
    <div className="space-y-4">
      <Panel
        title="Avisos y publicaciones"
        action={
          onViewProperties ? (
            <button type="button" onClick={() => onViewProperties(user)} className={LINK}>
              Ver propiedades <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null
        }
      >
        {!hasExtras ? (
          <EmptyNote>Conecta el listado de avisos para ver el historial de publicaciones.</EmptyNote>
        ) : listings.length ? (
          <ListBody>
            {listings.map((listing) => (
              <ItemRow
                key={listing.id}
                title={listing.title}
                meta={`${(PROPERTY_TYPE_LABELS as Record<string, string>)[listing.propertyType ?? ''] ?? listing.propertyType ?? 'Propiedad'} · ${formatDate(listing.publishedAt ?? listing.createdAt)}`}                right={
                  <StatusChip tone={LISTING_META[listing.status].tone}>
                    {LISTING_META[listing.status].label}
                  </StatusChip>
                }
              />
            ))}
          </ListBody>
        ) : (
          <EmptyNote>Sin avisos publicados</EmptyNote>
        )}
      </Panel>

      <Panel title="Pagos, reclamos y movimientos">
        {!hasExtras ? (
          <EmptyNote>El timeline se completa con pagos, devoluciones y reclamos.</EmptyNote>
        ) : payments.length || claims.length ? (
          <ol className="pt-1">
            {payments.map((payment, i) => (
              <TimelineItem
                key={`p-${payment.id}`}
                title={payment.concept}
                meta={`${formatDate(payment.date)} · ${METHOD_LABEL[payment.method]} · ${formatMoney(payment.amount, payment.currency)}`}
                right={
                  <StatusChip tone={PAYMENT_META[payment.status].tone}>
                    {PAYMENT_META[payment.status].label}
                  </StatusChip>
                }
                isLast={i === payments.length - 1 && claims.length === 0}
              />
            ))}
            {claims.map((claim, i) => (
              <TimelineItem
                key={`c-${claim.id}`}
                title={`${CLAIM_TYPE_LABEL[claim.type]} ${claim.code}`}
                meta={`${formatDate(claim.createdAt)}${claim.subject ? ` · ${claim.subject}` : ''}`}
                right={
                  <StatusChip tone={CLAIM_META[claim.status].tone}>
                    {CLAIM_META[claim.status].label}
                  </StatusChip>
                }
                isLast={i === claims.length - 1}
              />
            ))}
          </ol>
        ) : (
          <EmptyNote>Sin movimientos registrados</EmptyNote>
        )}
      </Panel>
    </div>
  );
}
