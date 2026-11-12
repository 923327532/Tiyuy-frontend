'use client';

import type { ReactNode } from 'react';
import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UserDetailExtras } from './userTypes';

/* ───────── Superficie y piezas comunes (mismo lenguaje del dashboard) ───────── */

export const CARD =
  'rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,46,58,0.04)]';

export const LINK =
  'inline-flex items-center gap-0.5 rounded text-sm font-medium text-[#0f2e3a] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';

export const SECONDARY_BUTTON =
  'inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#0f2e3a] transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const TONES: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-rose-50 text-rose-800 ring-rose-200',
  info: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
};

export function Chip({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`${CARD} overflow-hidden`}>
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
      {footer}
    </section>
  );
}

export function RowList({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-slate-100 px-5">{children}</dl>;
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="min-w-0 text-right text-sm text-slate-900">{children}</dd>
    </div>
  );
}

export function ItemRow({
  title,
  detail,
  chip,
  date,
}: {
  title: string;
  detail?: string;
  chip?: ReactNode;
  date?: string;
}) {
  return (
    <li className="flex items-start justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        {detail && <p className="mt-0.5 text-xs text-slate-500">{detail}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {chip}
        {date && <span className="text-xs text-slate-500">{date}</span>}
      </div>
    </li>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="px-5 py-6 text-center text-sm text-slate-500">{children}</p>;
}

function SkeletonRows() {
  return (
    <div className="space-y-3 px-5 py-4" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-50" />
      ))}
    </div>
  );
}

/** Lista con estados de carga y vacío ya resueltos. */
export function ListBody<T>({
  items,
  loading,
  empty,
  render,
}: {
  items?: T[] | null;
  loading: boolean;
  empty: string;
  render: (item: T) => ReactNode;
}) {
  if (loading) return <SkeletonRows />;
  if (!items || items.length === 0) return <EmptyNote>{empty}</EmptyNote>;
  return <ul className="divide-y divide-slate-100">{items.map(render)}</ul>;
}

/* ───────── Etiquetas de estado ───────── */

export interface StatusMeta {
  label: string;
  tone: Tone;
}

export const IDENTITY_META: Record<string, StatusMeta> = {
  VERIFIED: { label: 'Verificada', tone: 'success' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning' },
  PENDING: { label: 'Pendiente', tone: 'warning' },
  REJECTED: { label: 'Rechazada', tone: 'danger' },
};

export const ALERT_META: Record<string, StatusMeta> = {
  OPEN: { label: 'Abierta', tone: 'danger' },
  IN_REVIEW: { label: 'En revisión', tone: 'warning' },
  RESOLVED: { label: 'Resuelta', tone: 'success' },
};

export const POLICY_LABEL: Record<string, string> = {
  SECURITY: 'Opciones de seguridad',
  ANTI_DISCRIMINATION: 'Política antidiscriminación',
  OTHER: 'Otra política',
};

export const TICKET_META: Record<string, StatusMeta> = {
  OPEN: { label: 'Abierto', tone: 'warning' },
  IN_PROGRESS: { label: 'En curso', tone: 'info' },
  RESOLVED: { label: 'Resuelto', tone: 'success' },
  CLOSED: { label: 'Cerrado', tone: 'neutral' },
};

export const CLAIM_TYPE_LABEL: Record<string, string> = {
  CLAIM: 'Reclamo',
  COMPLAINT: 'Queja',
  REFUND: 'Devolución',
  EXCHANGE: 'Cambio',
};

export const CLAIM_META: Record<string, StatusMeta> = {
  PENDING: { label: 'Pendiente', tone: 'warning' },
  IN_PROGRESS: { label: 'En atención', tone: 'info' },
  RESOLVED: { label: 'Atendido', tone: 'success' },
  REJECTED: { label: 'Rechazado', tone: 'neutral' },
};

export const METHOD_LABEL: Record<string, string> = {
  MERCADO_PAGO: 'Mercado Pago',
  YAPE: 'Yape',
  PLIN: 'Plin',
  OTHER: 'Otro medio',
};

export const PAYMENT_META: Record<string, StatusMeta> = {
  PAID: { label: 'Pagado', tone: 'success' },
  PENDING: { label: 'Pendiente', tone: 'warning' },
  REFUNDED: { label: 'Devuelto', tone: 'info' },
  FAILED: { label: 'Fallido', tone: 'danger' },
};

export const CANCELLATION_META: Record<string, StatusMeta> = {
  PENDING: { label: 'Pendiente', tone: 'warning' },
  APPROVED: { label: 'Aprobada', tone: 'info' },
  REJECTED: { label: 'Rechazada', tone: 'neutral' },
  COMPLETED: { label: 'Baja completada', tone: 'success' },
};

export const LISTING_META: Record<string, StatusMeta> = {
  PUBLISHED: { label: 'Publicada', tone: 'success' },
  PENDING: { label: 'En revisión', tone: 'warning' },
  REJECTED: { label: 'Rechazada', tone: 'danger' },
  DRAFT: { label: 'Borrador', tone: 'neutral' },
  PAUSED: { label: 'Pausada', tone: 'neutral' },
  SOLD: { label: 'Vendida', tone: 'info' },
  RENTED: { label: 'Alquilada', tone: 'info' },
  EXPIRED: { label: 'Vencida', tone: 'neutral' },
};

export function StatusChip({ meta, fallback }: { meta?: StatusMeta; fallback: string }) {
  return <Chip tone={meta?.tone ?? 'neutral'}>{meta?.label ?? fallback}</Chip>;
}

/* ───────── Indicadores derivados (para pestañas y "Requiere atención") ───────── */

export type DetailTab = 'overview' | 'security' | 'support' | 'history';

export interface AttentionLine {
  id: string;
  label: string;
  tab: DetailTab;
}

export function getUserInsights(user: UserListItem, extras?: UserDetailExtras) {
  const openAlerts = extras?.policyAlerts?.filter((a) => a.status !== 'RESOLVED').length ?? 0;
  const openTickets =
    extras?.tickets?.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length ?? 0;
  const pendingClaims =
    extras?.claims?.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS').length ?? 0;
  const cancellationPending = extras?.cancellationRequest?.status === 'PENDING';
  const accessibilityOpen =
    !!extras?.accessibilitySupport && extras.accessibilitySupport.status !== 'RESOLVED';

  const attention: AttentionLine[] = [];

  if (!user.emailVerified) attention.push({ id: 'email', label: 'Correo sin verificar', tab: 'security' });
  if (user.phone && !user.phoneVerified)
    attention.push({ id: 'phone', label: 'Teléfono sin verificar', tab: 'security' });
  if (extras?.identityStatus && extras.identityStatus !== 'VERIFIED')
    attention.push({
      id: 'identity',
      label: `Identidad: ${(IDENTITY_META[extras.identityStatus]?.label ?? '').toLowerCase()}`,
      tab: 'security',
    });
  if (openAlerts > 0)
    attention.push({ id: 'alerts', label: `${openAlerts} alerta(s) de políticas abiertas`, tab: 'security' });
  if (cancellationPending)
    attention.push({ id: 'cancel', label: 'Solicitud de baja pendiente', tab: 'security' });
  if (pendingClaims > 0)
    attention.push({ id: 'claims', label: `${pendingClaims} reclamo(s) sin resolver`, tab: 'support' });
  if (openTickets > 0)
    attention.push({ id: 'tickets', label: `${openTickets} ticket(s) de soporte abiertos`, tab: 'support' });
  if (accessibilityOpen)
    attention.push({ id: 'access', label: 'Pidió asistencia especializada', tab: 'support' });

  return {
    openAlerts,
    openTickets,
    pendingClaims,
    cancellationPending,
    accessibilityOpen,
    attention,
    securityBadge: openAlerts + (cancellationPending ? 1 : 0),
    supportBadge: openTickets + pendingClaims + (accessibilityOpen ? 1 : 0),
  };
}