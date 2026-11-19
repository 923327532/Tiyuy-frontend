'use client';

import { ChevronRight } from 'lucide-react';
import { formatDate, formatMoney } from '../../../utils/users.utils';
import { getSegment } from '../model/accountState';
import {
  EmptyNote,
  ItemRow,
  LINK,
  ListBody,
  METHOD_LABEL,
  PAYMENT_META,
  Panel,
  StatusChip,
  getUserInsights,
} from '../ui/detailParts';
import type { TabProps } from './types';

export function OverviewTab({ user, extras, goToTab, onViewProperties, onViewProjects }: TabProps) {
  const segment = getSegment(user);
  const insights = getUserInsights(user, extras);
  const hasExtras = !!extras;
  const missing = !hasExtras;

  const stats: { label: string; value: number | string; action?: () => void }[] = [];

  if (segment === 'BROKER') {
    stats.push({
      label: 'Propiedades',
      value: user.publishedPropertiesCount ?? extras?.publishedListings?.length ?? '—',
      action: () => onViewProperties?.(user),
    });
  } else if (segment === 'REAL_ESTATE_COMPANY') {
    stats.push({ label: 'Proyectos', value: '—', action: () => onViewProjects?.(user) });
  } else {
    stats.push({ label: 'Busquedas guardadas', value: extras?.savedSearchesCount ?? '—' });
  }

  stats.push({ label: 'Favoritos', value: extras?.favoritesCount ?? '—' });
  stats.push({ label: 'Leads / contactos', value: extras?.leadsCount ?? '—' });

  return (
    <div className="space-y-4">
      <Panel title="Lectura rapida">
        <ul className="space-y-2">
          {insights.map((insight) => (
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
          ))}
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
        title="Historial de pagos"
        action={
          <button type="button" onClick={() => goToTab('history')} className={LINK}>
            Historial completo <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        }
      >
        {missing ? (
          <EmptyNote>
            Conecta el endpoint de pagos para mostrar movimientos, cancelaciones y devoluciones.
          </EmptyNote>
        ) : extras?.payments?.length ? (
          <ListBody>
            {extras.payments.slice(0, 3).map((payment) => (
              <ItemRow
                key={payment.id}
                title={payment.concept}
                meta={`${formatDate(payment.date)} · ${METHOD_LABEL[payment.method]}`}
                right={
                  <>
                    <p className="text-sm font-medium tabular-nums text-[#0f2e3a]">
                      {formatMoney(payment.amount, payment.currency)}
                    </p>
                    <StatusChip tone={PAYMENT_META[payment.status].tone}>
                      {PAYMENT_META[payment.status].label}
                    </StatusChip>
                  </>
                }
              />
            ))}
          </ListBody>
        ) : (
          <EmptyNote>Sin pagos registrados</EmptyNote>
        )}
      </Panel>
    </div>
  );
}
