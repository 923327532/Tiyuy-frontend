import type { UserListItem } from '@/core/domain/entities/Admin';
import type { AccountState, UserDetailExtras, UserSegment } from '../../../userTypes';

export type UserAccountState = AccountState;

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

export function getSegment(user: Pick<UserListItem, 'role'>): UserSegment {
  switch (user.role as string) {
    case 'DEVELOPER':
      return 'REAL_ESTATE_COMPANY';
    case 'AGENT':
      return 'BROKER';
    case 'INVESTOR':
    case 'CONTACT':
    case 'LEAD':
      return 'INVESTOR';
    case 'USER':
    case 'ADMIN':
    default:
      return 'INDIVIDUAL';
  }
}

export function getSegmentMeta(segment: UserSegment) {
  return SEGMENTS.find((item) => item.id === segment) ?? SEGMENTS[2];
}

export const ACCOUNT_STATE_META: Record<
  AccountState,
  { label: string; chip: string; dot: string }
> = {
  ACTIVE: {
    label: 'Activo',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  IN_REVIEW: {
    label: 'En revisión',
    chip: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  SUSPENDED: {
    label: 'Suspendido',
    chip: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    dot: 'bg-rose-500',
  },
  CLAIM_PENDING: {
    label: 'Reclamo pendiente',
    chip: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    dot: 'bg-orange-500',
  },
};

function hasOpenFormalClaim(extras?: UserDetailExtras): boolean {
  if (!extras?.formalClaims?.length) return false;
  return extras.formalClaims.some(
    (claim) => claim.status === 'OPEN' || claim.status === 'IN_REVIEW',
  );
}

export function getAccountState(
  user: Pick<UserListItem, 'enabled'>,
  extras?: UserDetailExtras,
): AccountState {
  if (!user.enabled) return 'SUSPENDED';
  if (extras?.accountState) return extras.accountState;
  if (hasOpenFormalClaim(extras)) return 'CLAIM_PENDING';
  return 'ACTIVE';
}