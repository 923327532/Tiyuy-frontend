'use client';

import type { ReactNode } from 'react';
import type { UserListItem } from '@/core/domain/entities/Admin';
import { AlertTriangle, Check, ChevronRight, Loader } from 'lucide-react';
import {
  PROPERTY_TYPE_LABELS,
} from '@/presentation/components/admin/PropertyAnalytics/propertyAnalyticsConfig';
import { formatDate, formatDateTime, formatMoney, formatRelative } from './userFormat';
import { getSegment } from './userSegments';
import type { UserDetailExtras } from './userTypes';
import {
  ALERT_META,
  CANCELLATION_META,
  CLAIM_META,
  CLAIM_TYPE_LABEL,
  CARD,
  Chip,
  EmptyNote,
  IDENTITY_META,
  ItemRow,
  LINK,
  LISTING_META,
  ListBody,
  METHOD_LABEL,
  PAYMENT_META,
  POLICY_LABEL,
  Panel,
  Row,
  RowList,
  SECONDARY_BUTTON,
  StatusChip,
  TICKET_META,
  getUserInsights,
  type DetailTab,
} from './userDetailParts';

export interface TabProps {
  user: UserListItem;
  extras?: UserDetailExtras;
  loading: boolean;
  goToTab: (tab: DetailTab) => void;
  onVerifyEmail: (userId: number) => void;
  onVerifyPhone: (userId: number) => void;
  onViewProperties: (user: UserListItem) => void;
  onViewProjects: (user: UserListItem) => void;
  isEmailVerifying: boolean;
  isPhoneVerifying: boolean;
  onResolveCancellation?: (requestId: string, decision: 'APPROVE' | 'REJECT') => void;
  isResolvingCancellation?: boolean;
}

function VerificationMark({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
      <Check className="h-4 w-4" aria-hidden="true" />
      Verificado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      Pendiente
    </span>
  );
}

function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="py-4 sm:px-5 sm:first:pl-0 sm:last:pr-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{value}</dd>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

const num = (value?: number) => (value === undefined ? '—' : value);

/* ───────────────────────────── Resumen ───────────────────────────── */

export function OverviewTab({ user, extras, goToTab, onViewProperties, onViewProjects }: TabProps) {
  const segment = getSegment(user.role);
  const insights = getUserInsights(user, extras);
  const propertiesCount = user.publishedPropertiesCount ?? 0;
  const projectsCount = user.publishedProjectsCount ?? 0;

  const viewLink = (label: string, action: () => void) => (
    <button type="button" onClick={action} className={LINK}>
      {label}
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  let metrics: ReactNode;
  if (segment === 'REAL_ESTATE_COMPANY') {
    metrics = (
      <>
        <Metric
          label="Proyectos publicados"
          value={projectsCount}
          hint={projectsCount > 0 ? viewLink('Ver proyectos', () => onViewProjects(user)) : undefined}
        />
        <Metric label="Desarrollos activos" value={num(extras?.company?.activeProjects)} />
        <Metric
          label="Verificación de empresa"
          value={
            <span className="text-xl">
              {extras?.company ? (extras.company.verified ? 'Verificada' : 'Pendiente') : '—'}
            </span>
          }
        />
      </>
    );
  } else if (segment === 'BROKER') {
    metrics = (
      <>
        <Metric
          label="Propiedades publicadas"
          value={propertiesCount}
          hint={propertiesCount > 0 ? viewLink('Ver propiedades', () => onViewProperties(user)) : undefined}
        />
        <Metric label="En venta" value={num(extras?.brokerPortfolio?.forSale)} />
        <Metric label="En alquiler" value={num(extras?.brokerPortfolio?.forRent)} />
      </>
    );
  } else if (segment === 'INDIVIDUAL') {
    metrics = (
      <>
        <Metric
          label="Propiedades publicadas"
          value={propertiesCount}
          hint={propertiesCount > 0 ? viewLink('Ver propiedades', () => onViewProperties(user)) : undefined}
        />
        <Metric label="Último acceso" value={<span className="text-xl">{formatRelative(user.lastLoginAt)}</span>} />
        <Metric label="Miembro desde" value={<span className="text-xl">{formatDate(user.createdAt)}</span>} />
      </>
    );
  } else {
    metrics = (
      <>
        <Metric label="Último acceso" value={<span className="text-xl">{formatRelative(user.lastLoginAt)}</span>} />
        <Metric label="Miembro desde" value={<span className="text-xl">{formatDate(user.createdAt)}</span>} />
        <Metric label="Avisos publicados" value={propertiesCount} />
      </>
    );
  }

  const byType = extras?.brokerPortfolio?.byType
    ? Object.entries(extras.brokerPortfolio.byType)
    : [];

  return (
    <div className="space-y-6">
      <section className={`${CARD} px-5`} aria-label="Indicadores">
        <dl className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {metrics}
        </dl>
      </section>

      <Panel
        title="Requiere atención"
        subtitle="Pendientes de este usuario, del más urgente al menos"
      >
        {insights.attention.length === 0 ? (
          <EmptyNote>Sin pendientes. La cuenta está al día.</EmptyNote>
        ) : (
          <ul className="divide-y divide-slate-100">
            {insights.attention.map((line) => (
              <li key={line.id}>
                <button
                  type="button"
                  onClick={() => goToTab(line.tab)}
                  className="group flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0f2e3a]/30"
                >
                  <span className="text-sm font-medium text-slate-900">{line.label}</span>
                  <ChevronRight
                    className="h-4 w-4 text-slate-300 transition group-hover:text-slate-500"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {segment === 'REAL_ESTATE_COMPANY' && (
        <Panel title="Perfil de la empresa" subtitle="Datos corporativos registrados">
          <RowList>
            <Row label="Razón social">{extras?.company?.legalName || '—'}</Row>
            <Row label="RUC">{extras?.company?.ruc || '—'}</Row>
            <Row label="Desarrollos activos">{num(extras?.company?.activeProjects)}</Row>
          </RowList>
        </Panel>
      )}

      {segment === 'BROKER' && (
        <Panel title="Cartera por tipo de inmueble" subtitle="Inventario asignado al corredor">
          {byType.length === 0 ? (
            <EmptyNote>Sin inmuebles asignados.</EmptyNote>
          ) : (
            <RowList>
              {byType.map(([type, count]) => (
                <Row key={type} label={PROPERTY_TYPE_LABELS[type] ?? type}>
                  <span className="font-semibold tabular-nums">{count}</span>
                </Row>
              ))}
            </RowList>
          )}
        </Panel>
      )}
    </div>
  );
}

/* ───────────────────── Seguridad y verificación ───────────────────── */

export function SecurityTab({
  user,
  extras,
  loading,
  onVerifyEmail,
  onVerifyPhone,
  isEmailVerifying,
  isPhoneVerifying,
  onResolveCancellation,
  isResolvingCancellation,
}: TabProps) {
  const cancellation = extras?.cancellationRequest ?? null;

  return (
    <div className="space-y-6">
      <Panel title="Verificación de perfil" subtitle="Validación de identidad para evitar anuncios fraudulentos">
        <RowList>
          {extras?.identityStatus && (
            <Row label="Identidad">
              <StatusChip meta={IDENTITY_META[extras.identityStatus]} fallback={extras.identityStatus} />
            </Row>
          )}
          <Row label="DNI">{user.dni || '—'}</Row>
          <Row label="Correo">
            <span className="inline-flex items-center justify-end gap-3">
              <VerificationMark verified={Boolean(user.emailVerified)} />
              {!user.emailVerified && (
                <button
                  type="button"
                  onClick={() => onVerifyEmail(user.id)}
                  disabled={isEmailVerifying}
                  className={SECONDARY_BUTTON}
                >
                  {isEmailVerifying && <Loader className="h-3 w-3 animate-spin" aria-hidden="true" />}
                  {isEmailVerifying ? 'Verificando…' : 'Verificar correo'}
                </button>
              )}
            </span>
          </Row>
          <Row label="Teléfono">
            <span className="inline-flex items-center justify-end gap-3">
              <VerificationMark verified={Boolean(user.phoneVerified)} />
              {!user.phoneVerified && user.phone && (
                <button
                  type="button"
                  onClick={() => onVerifyPhone(user.id)}
                  disabled={isPhoneVerifying}
                  className={SECONDARY_BUTTON}
                >
                  {isPhoneVerifying && <Loader className="h-3 w-3 animate-spin" aria-hidden="true" />}
                  {isPhoneVerifying ? 'Verificando…' : 'Verificar teléfono'}
                </button>
              )}
            </span>
          </Row>
        </RowList>
      </Panel>

      <Panel
        title="Auditoría de políticas"
        subtitle="Alertas sobre opciones de seguridad y política antidiscriminación"
      >
        <ListBody
          items={extras?.policyAlerts}
          loading={loading}
          empty="Sin alertas registradas para este usuario."
          render={(alert) => (
            <ItemRow
              key={alert.id}
              title={POLICY_LABEL[alert.policy] ?? alert.policy}
              detail={alert.summary}
              chip={<StatusChip meta={ALERT_META[alert.status]} fallback={alert.status} />}
              date={formatDate(alert.createdAt)}
            />
          )}
        />
      </Panel>

      <Panel title="Gestión de cancelación" subtitle="Baja de la cuenta según las opciones de cancelación">
        {loading ? (
          <EmptyNote>Cargando…</EmptyNote>
        ) : !cancellation ? (
          <EmptyNote>No hay solicitud de baja.</EmptyNote>
        ) : (
          <>
            <RowList>
              <Row label="Estado">
                <StatusChip meta={CANCELLATION_META[cancellation.status]} fallback={cancellation.status} />
              </Row>
              <Row label="Solicitada">{formatDateTime(cancellation.requestedAt)}</Row>
              {cancellation.scheduledFor && (
                <Row label="Baja programada">{formatDate(cancellation.scheduledFor)}</Row>
              )}
              <Row label="Motivo">{cancellation.reason || 'No indicado'}</Row>
            </RowList>
            {cancellation.status === 'PENDING' && onResolveCancellation && (
              <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
                <button
                  type="button"
                  disabled={isResolvingCancellation}
                  onClick={() => onResolveCancellation(cancellation.id, 'REJECT')}
                  className={SECONDARY_BUTTON}
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  disabled={isResolvingCancellation}
                  onClick={() => onResolveCancellation(cancellation.id, 'APPROVE')}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0f2e3a] px-3 text-xs font-medium text-white transition hover:bg-[#164453] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/40 focus-visible:ring-offset-2"
                >
                  {isResolvingCancellation && <Loader className="h-3 w-3 animate-spin" aria-hidden="true" />}
                  Aprobar baja
                </button>
              </footer>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}

/* ─────────────────────── Soporte y reclamaciones ─────────────────────── */

export function SupportTab({ extras, loading }: TabProps) {
  const access = extras?.accessibilitySupport ?? null;

  return (
    <div className="space-y-6">
      <Panel title="Centro de soporte" subtitle="Consultas e incidencias del usuario">
        <ListBody
          items={extras?.tickets}
          loading={loading}
          empty="Este usuario no ha abierto tickets."
          render={(ticket) => (
            <ItemRow
              key={ticket.id}
              title={ticket.subject}
              chip={<StatusChip meta={TICKET_META[ticket.status]} fallback={ticket.status} />}
              date={formatDate(ticket.createdAt)}
            />
          )}
        />
      </Panel>

      <Panel
        title="Libro de reclamaciones y devoluciones"
        subtitle="Reclamos formales y solicitudes de cambio o devolución"
      >
        <ListBody
          items={extras?.claims}
          loading={loading}
          empty="Sin reclamos ni solicitudes de devolución."
          render={(claim) => (
            <ItemRow
              key={claim.id}
              title={`${claim.code} · ${CLAIM_TYPE_LABEL[claim.type] ?? claim.type}`}
              detail={
                claim.dueDate
                  ? `${claim.summary} — responder antes del ${formatDate(claim.dueDate)}`
                  : claim.summary
              }
              chip={<StatusChip meta={CLAIM_META[claim.status]} fallback={claim.status} />}
              date={formatDate(claim.createdAt)}
            />
          )}
        />
      </Panel>

      <Panel title="Asistencia especializada" subtitle="Apoyo a personas con discapacidad">
        {loading ? (
          <EmptyNote>Cargando…</EmptyNote>
        ) : !access ? (
          <EmptyNote>No ha solicitado asistencia especializada.</EmptyNote>
        ) : (
          <RowList>
            <Row label="Estado">
              <StatusChip meta={TICKET_META[access.status]} fallback={access.status} />
            </Row>
            {access.requestedAt && <Row label="Solicitada">{formatDateTime(access.requestedAt)}</Row>}
            {access.note && <Row label="Detalle">{access.note}</Row>}
          </RowList>
        )}
      </Panel>
    </div>
  );
}

/* ─────────────────── Historial de avisos y pagos ─────────────────── */

export function HistoryTab({ user, extras, loading, onViewProperties }: TabProps) {
  const payments = extras?.payments ?? [];
  const hasListings = (user.publishedPropertiesCount ?? 0) > 0 || (extras?.listings?.length ?? 0) > 0;
  const collected = payments
    .filter((payment) => payment.status === 'PAID')
    .reduce<Record<string, number>>((acc, payment) => {
      acc[payment.currency] = (acc[payment.currency] ?? 0) + payment.amount;
      return acc;
    }, {});

  return (
    <div className="space-y-6">
      <Panel
        title="Avisos publicados"
        subtitle="Publicaciones realizadas por el usuario"
        action={
          hasListings ? (
            <button type="button" onClick={() => onViewProperties(user)} className={LINK}>
              Ver propiedades
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : undefined
        }
      >
        <ListBody
          items={extras?.listings}
          loading={loading}
          empty="Aún no tiene avisos."
          render={(listing) => (
            <ItemRow
              key={listing.id}
              title={listing.title}
              chip={<StatusChip meta={LISTING_META[listing.status]} fallback={listing.status} />}
              date={formatDate(listing.createdAt)}
            />
          )}
        />
      </Panel>

      <Panel
        title="Pagos"
        subtitle="Cobros procesados con Mercado Pago, Yape o Plin"
        footer={
          Object.keys(collected).length > 0 ? (
            <footer className="flex items-baseline justify-between gap-3 border-t border-slate-100 px-5 py-3 text-xs">
              <span className="text-slate-500">Total cobrado</span>
              <span className="font-semibold tabular-nums text-slate-900">
                {Object.entries(collected)
                  .map(([currency, amount]) => formatMoney(amount, currency as 'PEN' | 'USD'))
                  .join(' · ')}
              </span>
            </footer>
          ) : undefined
        }
      >
        <ListBody
          items={extras?.payments}
          loading={loading}
          empty="Sin pagos registrados."
          render={(payment) => (
            <ItemRow
              key={payment.id}
              title={payment.concept}
              detail={`${METHOD_LABEL[payment.method] ?? payment.method} · ${formatMoney(payment.amount, payment.currency)}`}
              chip={<StatusChip meta={PAYMENT_META[payment.status]} fallback={payment.status} />}
              date={formatDate(payment.paidAt)}
            />
          )}
        />
      </Panel>
    </div>
  );
}

export { Chip };