'use client';

import type { ReactNode } from 'react';
import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UserDetailExtras } from '../../../userTypes';

export const CARD =
  'rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,46,58,0.04)]';

export const LINK =
  'inline-flex items-center gap-0.5 rounded text-sm font-medium text-[#0f2e3a] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';

export const SECONDARY_BUTTON =
  'inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#0f2e3a] transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const TONES: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/10',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20',
};

export function Chip({
  children,
  tone = 'neutral',
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function StatusChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <Chip tone={tone}>{children}</Chip>;
}

export function Panel({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`${CARD} p-4 sm:p-5`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h4 className="text-sm font-semibold tracking-tight text-[#0f2e3a]">{title}</h4>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-right text-sm text-[#0f2e3a] ${valueClassName ?? ''}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}

export function RowList({ children }: { children: ReactNode }) {
  return <div className="-my-2.5">{children}</div>;
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}

export function ListBody({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-slate-100 -my-2.5">{children}</ul>;
}

export function ItemRow({
  title,
  meta,
  right,
  sub,
}: {
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#0f2e3a]">{title}</p>
        {meta ? <p className="mt-0.5 text-xs text-slate-500">{meta}</p> : null}
        {sub ? <div className="mt-1.5">{sub}</div> : null}
      </div>
      {right ? <div className="shrink-0 text-right">{right}</div> : null}
    </li>
  );
}

/* Mapas de estado (chips) */

export const TICKET_META: Record<string, { label: string; tone: Tone }> = {
  OPEN: { label: 'Abierto', tone: 'warning' },
  IN_PROGRESS: { label: 'En curso', tone: 'info' },
  RESOLVED: { label: 'Resuelto', tone: 'success' },
  CLOSED: { label: 'Cerrado', tone: 'neutral' },
};

export const ALERT_META: Record<string, { label: string; tone: Tone }> = {
  OPEN: { label: 'Abierta', tone: 'danger' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning' },
  RESOLVED: { label: 'Resuelta', tone: 'success' },
};

export const PAYMENT_META: Record<string, { label: string; tone: Tone }> = {
  PAID: { label: 'Pagado', tone: 'success' },
  PENDING: { label: 'Pendiente', tone: 'warning' },
  REFUNDED: { label: 'Reembolsado', tone: 'neutral' },
  FAILED: { label: 'Fallido', tone: 'danger' },
};

export const CLAIM_META: Record<string, { label: string; tone: Tone }> = {
  OPEN: { label: 'Abierto', tone: 'danger' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning' },
  PENDING: { label: 'Pendiente', tone: 'warning' },
  IN_PROGRESS: { label: 'En curso', tone: 'info' },
  RESOLVED: { label: 'Resuelto', tone: 'success' },
  REJECTED: { label: 'Rechazado', tone: 'neutral' },
};

export const CLAIM_TYPE_LABEL: Record<string, string> = {
  CLAIM: 'Reclamo',
  COMPLAINT: 'Queja',
  REFUND: 'Devolución',
  EXCHANGE: 'Cambio',
};

export const CANCELLATION_META: Record<string, { label: string; tone: Tone }> = {
  REQUESTED: { label: 'Solicitada', tone: 'warning' },
  PENDING: { label: 'Pendiente', tone: 'warning' },
  APPROVED: { label: 'Aprobada', tone: 'success' },
  REJECTED: { label: 'Rechazada', tone: 'danger' },
  COMPLETED: { label: 'Completada', tone: 'success' },
};

export const LISTING_META: Record<string, { label: string; tone: Tone }> = {
  PUBLISHED: { label: 'Publicado', tone: 'success' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning' },
  PAUSED: { label: 'Pausado', tone: 'neutral' },
  REJECTED: { label: 'Rechazado', tone: 'danger' },
};

export const IDENTITY_META: Record<string, { label: string; tone: Tone }> = {
  VERIFIED: { label: 'Verificada', tone: 'success' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning' },
  PENDING: { label: 'Pendiente', tone: 'neutral' },
  REJECTED: { label: 'Rechazada', tone: 'danger' },
};

export const POLICY_LABEL: Record<string, string> = {
  SECURITY: 'Seguridad',
  ANTI_DISCRIMINATION: 'Antidiscriminación',
  OTHER: 'Otra',
};

export const METHOD_LABEL: Record<string, string> = {
  MERCADO_PAGO: 'Mercado Pago',
  YAPE: 'Yape',
  PLIN: 'Plin',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  OTHER: 'Otro',
};

/* Insights de la cuenta */

export type InsightTone = 'info' | 'warning' | 'danger';

export interface UserInsight {
  id: string;
  text: string;
  tone: InsightTone;
}

export function getUserInsights(
  user: UserListItem,
  extras?: UserDetailExtras,
): UserInsight[] {
  const insights: UserInsight[] = [];
  const name = user.firstName || 'El usuario';

  if (!user.enabled) {
    insights.push({ id: 'suspended', text: 'La cuenta está suspendida', tone: 'danger' });
  }
  if (!user.emailVerified) {
    insights.push({ id: 'email', text: `${name} no ha verificado su correo`, tone: 'warning' });
  }
  if (!user.phoneVerified) {
    insights.push({ id: 'phone', text: 'Teléfono pendiente de verificación', tone: 'info' });
  }
  if (user.emailVerified && user.phoneVerified) {
    insights.push({ id: 'contact-ok', text: 'Correo y teléfono verificados', tone: 'info' });
  }
  if ((extras?.publishedListings?.length ?? 0) > 0) {
    insights.push({
      id: 'listings',
      text: `Tiene ${extras!.publishedListings!.length} aviso(s) publicados`,
      tone: 'info',
    });
  }
  if ((extras?.openAlerts?.length ?? 0) > 0) {
    insights.push({
      id: 'alerts',
      text: `${extras!.openAlerts!.length} alerta(s) de política abierta(s)`,
      tone: 'danger',
    });
  }
  if ((extras?.formalClaims?.length ?? 0) > 0) {
    const pending = extras!.formalClaims!.filter(
      (claim) => claim.status === 'OPEN' || claim.status === 'IN_REVIEW',
    ).length;
    if (pending > 0) {
      insights.push({
        id: 'claims',
        text: `${pending} reclamo(s) o solicitud(es) pendiente(s)`,
        tone: 'danger',
      });
    }
  }
  if ((extras?.openTickets?.length ?? 0) > 0) {
    insights.push({
      id: 'tickets',
      text: `${extras!.openTickets!.length} ticket(s) de soporte abierto(s)`,
      tone: 'warning',
    });
  }

  return insights.slice(0, 3);
}

export type DetailTab = 'overview' | 'security' | 'support' | 'history';