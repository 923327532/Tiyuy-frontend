import type { FilterOption } from '../types/properties.types';

export const PROPERTIES_STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PENDING', label: 'Pendiente de aprobación' },
  { value: 'PUBLISHED', label: 'Publicada' },
  { value: 'PAUSED', label: 'Pausada' },
  { value: 'EXPIRED', label: 'Expirada' },
  { value: 'REJECTED', label: 'Rechazada' },
  { value: 'SUSPENDED', label: 'Suspendida' },
  { value: 'DISABLED_BY_ADMIN', label: 'Deshabilitada por Admin' },
];

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PENDING: 'Pendiente',
  PUBLISHED: 'Publicada',
  PAUSED: 'Pausada',
  REJECTED: 'Rechazada',
  RENTED: 'Alquilada',
  SOLD: 'Vendida',
  EXPIRED: 'Expirada',
  SUSPENDED: 'Suspendida',
  DISABLED_BY_ADMIN: 'Deshabilitada',
};

export type PropertyBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'default';

export const PROPERTY_STATUS_VARIANTS: Record<string, PropertyBadgeVariant> = {
  PUBLISHED: 'success',
  PENDING: 'warning',
  REJECTED: 'danger',
  SUSPENDED: 'warning',
  DRAFT: 'neutral',
  PAUSED: 'info',
  EXPIRED: 'neutral',
  DISABLED_BY_ADMIN: 'danger',
  RENTED: 'info',
  SOLD: 'success',
};

export const PROPERTY_TRANSACTION_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
};

export const REPORT_REASON_LABELS: Record<string, string> = {
  SPAM: 'Spam',
  SCAM: 'Estafa',
  INCORRECT_DATA: 'Datos incorrectos',
  OFFENSIVE: 'Contenido ofensivo',
  DUPLICATE: 'Propiedad duplicada',
  OTHER: 'Otro',
};

export const REPORT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
};

export const MODERATION_ACTIONS = {
  APPROVE: 'Aprobar',
  REJECT: 'Rechazar',
  SUSPEND: 'Suspender',
} as const;

export const EMPTY_KPIS = {
  total: 0,
  published: 0,
  pending: 0,
  suspended: 0,
  rejected: 0,
  reports: 0,
};
