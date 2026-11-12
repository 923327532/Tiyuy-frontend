import type { UserListItem } from '@/core/domain/entities/Admin';
import type { AccountState, UserDetailExtras, UserSegment } from './userTypes';

export const SEGMENTS: {
  id: UserSegment;
  label: string;
  singular: string;
  description: string;
}[] = [
  {
    id: 'REAL_ESTATE_COMPANY',
    label: 'Inmobiliarias',
    singular: 'Inmobiliaria',
    description: 'Cuentas corporativas que publican proyectos',
  },
  {
    id: 'BROKER',
    label: 'Corredores y agentes',
    singular: 'Corredor / agente',
    description: 'Registrados desde "TIYUY para Corredores"',
  },
  {
    id: 'INDIVIDUAL',
    label: 'Particulares',
    singular: 'Particular',
    description: 'Publican un inmueble o buscan comprar o alquilar',
  },
  {
    id: 'INVESTOR',
    label: 'Inversores y contactos',
    singular: 'Inversor o contacto',
    description: 'Llegan por las secciones corporativas del portal',
  },
];

/**
 * Rol del backend → categoría del padrón.
 * Ajusta INVESTOR/CONTACT/LEAD a los nombres reales de tus roles.
 */
const SEGMENT_BY_ROLE: Record<string, UserSegment> = {
  DEVELOPER: 'REAL_ESTATE_COMPANY',
  AGENT: 'BROKER',
  USER: 'INDIVIDUAL',
  INVESTOR: 'INVESTOR',
  CONTACT: 'INVESTOR',
  LEAD: 'INVESTOR',
};

export function getSegment(role?: string): UserSegment | null {
  return role ? (SEGMENT_BY_ROLE[role] ?? null) : null;
}

export function getSegmentLabel(role?: string): string | null {
  const segment = getSegment(role);
  return SEGMENTS.find((item) => item.id === segment)?.singular ?? null;
}

export const ACCOUNT_STATE_META: Record<
  AccountState,
  { label: string; chip: string; dot: string }
> = {
  ACTIVE: {
    label: 'Activo',
    chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  IN_REVIEW: {
    label: 'En revisión',
    chip: 'bg-amber-50 text-amber-800 ring-amber-200',
    dot: 'bg-amber-500',
  },
  SUSPENDED: {
    label: 'Suspendido',
    chip: 'bg-rose-50 text-rose-800 ring-rose-200',
    dot: 'bg-rose-500',
  },
  CLAIM_PENDING: {
    label: 'Con reclamo pendiente',
    chip: 'bg-orange-50 text-orange-800 ring-orange-200',
    dot: 'bg-orange-500',
  },
};

/** Prioridad: Suspendido > Con reclamo pendiente > En revisión > Activo. */
export function getAccountState(
  user: Pick<UserListItem, 'enabled'>,
  extras?: UserDetailExtras,
): AccountState {
  if (!user.enabled) return 'SUSPENDED';

  const hasPendingClaim = extras?.claims?.some(
    (claim) => claim.status === 'PENDING' || claim.status === 'IN_PROGRESS',
  );
  if (hasPendingClaim) return 'CLAIM_PENDING';

  const inReview =
    extras?.identityStatus === 'IN_REVIEW' ||
    extras?.cancellationRequest?.status === 'PENDING' ||
    extras?.policyAlerts?.some((alert) => alert.status !== 'RESOLVED');
  if (inReview) return 'IN_REVIEW';

  return 'ACTIVE';
}