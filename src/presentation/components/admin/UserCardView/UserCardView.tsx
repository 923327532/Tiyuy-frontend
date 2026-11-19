'use client';

import { UserListItem } from '@/core/domain/entities/Admin';
import {
  AlertTriangle,
  Check,
  Mail,
  MapPin,
  Phone,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import { ROLE_LABELS, ROLE_STYLES } from '../users/userRoleConfig';

/**
 * UserCardView
 * Tarjetas de usuarios para el panel admin. Las acciones siempre están
 * visibles (antes solo aparecían al pasar el mouse, lo que las hacía
 * inalcanzables en móvil y con teclado).
 */

interface UserCardViewProps {
  users: UserListItem[];
  onViewDetail: (user: UserListItem) => void;
  onToggleStatus?: (user: UserListItem) => void;
  onDelete?: (user: UserListItem) => void;
  canManage?: boolean;
  canDelete?: boolean;
}

/** Roles que publican: para ellos tiene sentido mostrar su producción. */
const PUBLISHER_ROLES = new Set(['AGENT', 'DEVELOPER']);

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
const relativeFormatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

function toDate(value?: Date | string | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRegistered(value?: Date | string | null): string {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : '—';
}

function formatLastAccess(value?: Date | string | null): string {
  const date = toDate(value);
  if (!date) return 'Sin accesos';

  const minutes = Math.round((date.getTime() - Date.now()) / 60_000);
  const abs = Math.abs(minutes);

  if (abs < 1) return 'Ahora';
  if (abs < 60) return relativeFormatter.format(minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hour');

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relativeFormatter.format(days, 'day');

  return dateFormatter.format(date);
}

function getFullName(user: UserListItem): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
}

function getInitials(user: UserListItem): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  return (user.email?.[0] ?? '?').toUpperCase();
}

function VerifiedMark({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 text-emerald-700">
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      verificado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-amber-700">
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
      sin verificar
    </span>
  );
}

const ICON_BUTTON =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30';

export function UserCardView({
  users,
  onViewDetail,
  onToggleStatus,
  onDelete,
  canManage,
  canDelete,
}: UserCardViewProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {users.map((user) => {
        const fullName = getFullName(user);
        const role = user.role ?? 'USER';
        const showProduction =
          PUBLISHER_ROLES.has(role) ||
          user.publishedPropertiesCount > 0 ||
          user.publishedProjectsCount > 0;
        const location = [user.city, user.country].filter(Boolean).join(', ');

        return (
          <li key={user.id}>
            <article
              className={`flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,46,58,0.04)] transition hover:border-slate-300 ${
                user.enabled ? '' : 'bg-slate-50/70'
              }`}
            >
              <div className="flex-1 p-5">
                <div className="flex items-center gap-3">
                  {user.profilePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profilePhotoUrl}
                      alt=""
                      loading="lazy"
                      className={`h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200 ${
                        user.enabled ? '' : 'grayscale'
                      }`}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                    >
                      {getInitials(user)}
                    </span>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900" title={fullName}>
                      {fullName}
                    </h3>
                    <p className="truncate text-xs text-slate-500" title={user.email}>
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      ROLE_STYLES[role] ?? ROLE_STYLES.USER
                    }`}
                  >
                    {ROLE_LABELS[role] ?? role}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      user.enabled
                        ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
                        : 'bg-rose-50 text-rose-800 ring-rose-200'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.enabled ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      aria-hidden="true"
                    />
                    {user.enabled ? 'Activo' : 'Suspendido'}
                  </span>
                </div>

                <dl className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Correo</dt>
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <dd>
                      Correo <VerifiedMark verified={Boolean(user.emailVerified)} />
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Teléfono</dt>
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <dd className="flex min-w-0 flex-wrap items-center gap-x-2">
                      <span className="truncate">{user.phone || 'Sin teléfono'}</span>
                      {user.phone ? <VerifiedMark verified={Boolean(user.phoneVerified)} /> : null}
                    </dd>
                  </div>

                  {location && (
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Ubicación</dt>
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                      <dd className="truncate">{location}</dd>
                    </div>
                  )}
                </dl>

                {showProduction && (
                  <dl className="mt-4 grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 pt-4">
                    <div className="pr-3">
                      <dd className="text-xl font-semibold tabular-nums text-slate-900">
                        {user.publishedPropertiesCount ?? 0}
                      </dd>
                      <dt className="text-xs text-slate-500">Propiedades publicadas</dt>
                    </div>
                    <div className="pl-4">
                      <dd className="text-xl font-semibold tabular-nums text-slate-900">
                        {user.publishedProjectsCount ?? 0}
                      </dd>
                      <dt className="text-xs text-slate-500">Proyectos publicados</dt>
                    </div>
                  </dl>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                <span>Alta: {formatRegistered(user.createdAt)}</span>
                <span>Último acceso: {formatLastAccess(user.lastLoginAt)}</span>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-100 p-3">
                <button
                  type="button"
                  onClick={() => onViewDetail(user)}
                  className="h-9 flex-1 rounded-lg bg-[#0f2e3a] px-3 text-sm font-medium text-white transition hover:bg-[#164453] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/40 focus-visible:ring-offset-2"
                >
                  Ver detalle
                </button>

                {canManage && onToggleStatus && (
                  <button
                    type="button"
                    onClick={() => onToggleStatus(user)}
                    title={user.enabled ? 'Suspender cuenta' : 'Reactivar cuenta'}
                    aria-label={`${user.enabled ? 'Suspender' : 'Reactivar'} la cuenta de ${fullName}`}
                    className={`${ICON_BUTTON} ${
                      user.enabled
                        ? 'text-amber-700 hover:border-amber-300 hover:bg-amber-50'
                        : 'text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {user.enabled ? (
                      <UserX className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <UserCheck className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                )}

                {canDelete && onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    title="Eliminar usuario"
                    aria-label={`Eliminar a ${fullName}`}
                    className={`${ICON_BUTTON} text-rose-700 hover:border-rose-300 hover:bg-rose-50`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}