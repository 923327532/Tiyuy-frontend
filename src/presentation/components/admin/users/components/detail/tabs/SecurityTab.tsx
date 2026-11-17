'use client';

import { AlertTriangle, Check, Loader } from 'lucide-react';
import { formatDateTime, formatRelative } from '../../../utils/users.utils';
import {
  EmptyNote,
  IDENTITY_META,
  Panel,
  Row,
  RowList,
  SECONDARY_BUTTON,
  StatusChip,
} from '../ui/detailParts';
import type { TabProps } from './types';

function ToggleRow({
  label,
  done,
  onAction,
  actionLabel,
  loading,
}: {
  label: string;
  done: boolean;
  onAction?: () => void;
  actionLabel?: string;
  loading?: boolean;
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
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          )}
        </span>
        {label}
      </div>
      <div className="shrink-0">
        {done ? (
          <StatusChip tone="success">Verificado</StatusChip>
        ) : onAction ? (
          <button type="button" onClick={onAction} disabled={loading} className={SECONDARY_BUTTON}>
            {loading ? <Loader className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
            {actionLabel ?? 'Verificar'}
          </button>
        ) : (
          <StatusChip>Pendiente</StatusChip>
        )}
      </div>
    </li>
  );
}

export function SecurityTab({
  user,
  extras,
  onVerifyEmail,
  onVerifyPhone,
  isEmailVerifying,
  isPhoneVerifying,
}: TabProps) {
  const hasExtras = !!extras;
  const hasConflict =
    (extras?.publishedListings?.length ?? 0) > 0 && !user.emailVerified && !user.phoneVerified;

  return (
    <div className="space-y-4">
      {hasConflict ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">Contacto no verificado con avisos publicados</p>
            <p className="mt-0.5 text-amber-800/90">
              Conviene confirmar correo o teléfono antes de que reciba consultas de esos avisos.
            </p>
          </div>
        </div>
      ) : null}

      <Panel title="Verificacion y acceso">
        <ul className="divide-y divide-slate-100 -my-2.5">
          <ToggleRow
            label="Correo electronico"
            done={user.emailVerified}
            onAction={!user.emailVerified ? () => onVerifyEmail?.(user.id) : undefined}
            actionLabel="Verificar correo"
            loading={isEmailVerifying}
          />
          <ToggleRow
            label="Telefono"
            done={user.phoneVerified}
            onAction={!user.phoneVerified ? () => onVerifyPhone?.(user.id) : undefined}
            actionLabel="Verificar telefono"
            loading={isPhoneVerifying}
          />
          <li className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-[#0f2e3a]">Identidad (DNI / CE / RUC)</span>
            {extras?.identityStatus ? (
              <StatusChip tone={IDENTITY_META[extras.identityStatus].tone}>
                {IDENTITY_META[extras.identityStatus].label}
              </StatusChip>
            ) : (
              <StatusChip>{hasExtras ? 'Sin datos' : '—'}</StatusChip>
            )}
          </li>
        </ul>
      </Panel>

      <Panel title="Actividad de acceso">
        <RowList>
          <Row label="Ultimo acceso" value={formatRelative(user.lastLoginAt)} />
          <Row label="Fecha y hora" value={formatDateTime(user.lastLoginAt)} />
          <Row
            label="Intentos fallidos"
            value={extras?.failedLoginAttempts ?? '—'}
            valueClassName="tabular-nums"
          />
          <Row label="Dispositivo reciente" value={extras?.lastDevice ?? '—'} />
        </RowList>
      </Panel>

      <Panel title="Preferencias y cumplimiento">
        <RowList>
          <Row
            label="Notificaciones"
            value={
              extras?.notificationsEnabled == null
                ? '—'
                : extras.notificationsEnabled
                  ? 'Activadas'
                  : 'Desactivadas'
            }
          />
          <Row
            label="Boletin"
            value={
              extras?.newsletterSubscribed == null
                ? '—'
                : extras.newsletterSubscribed
                  ? 'Suscrito'
                  : 'No suscrito'
            }
          />
          <Row
            label="Alertas abiertas"
            value={
              extras?.openAlerts?.length ? (
                <span className="font-medium text-rose-700">{extras.openAlerts.length}</span>
              ) : hasExtras ? (
                'Ninguna'
              ) : (
                '—'
              )
            }
          />
        </RowList>
      </Panel>
    </div>
  );
}
