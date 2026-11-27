import type { BadgeProps } from '@/presentation/components/ui/Badge';

export type DiscountTab = 'applier' | 'central';

export interface DiscountFilterState {
  searchQuery: string;
  sourceFilter: string;
  statusFilter: string;
}

export const EMPTY_DISCOUNT_FILTERS: DiscountFilterState = {
  searchQuery: '',
  sourceFilter: 'all',
  statusFilter: 'all',
};

export const DISCOUNT_SOURCE_OPTIONS = [
  { value: 'all', label: 'Todos los orígenes' },
  { value: 'DISCOUNT_CODE', label: 'Códigos' },
  { value: 'AGENT', label: 'Agentes' },
  { value: 'DEVELOPER', label: 'Inmobiliarias' },
  { value: 'AGENCY_PLAN', label: 'Planes de agencia' },
  { value: 'USER', label: 'Usuarios' },
];

export const DISCOUNT_STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'INACTIVE', label: 'Inactivos' },
  { value: 'EXPIRED', label: 'Vencidos' },
  { value: 'EXHAUSTED', label: 'Agotados' },
  { value: 'USED', label: 'Usados' },
];

type Variant = NonNullable<BadgeProps['variant']>;

const SOURCE_LABELS: Record<string, string> = {
  DISCOUNT_CODE: 'Código',
  AGENT: 'Agente',
  DEVELOPER: 'Inmobiliaria',
  AGENCY_PLAN: 'Plan de agencia',
  USER: 'Usuario',
};

const SOURCE_VARIANTS: Record<string, Variant> = {
  DISCOUNT_CODE: 'info',
  AGENT: 'success',
  DEVELOPER: 'brand',
  AGENCY_PLAN: 'warning',
  USER: 'neutral',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  EXPIRED: 'Vencido',
  EXHAUSTED: 'Agotado',
  USED: 'Usado',
  DEPLETED: 'Agotado',
  CANCELLED: 'Cancelado',
  SUSPENDED: 'Suspendido',
};

const STATUS_VARIANTS: Record<string, Variant> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  EXPIRED: 'warning',
  EXHAUSTED: 'danger',
  USED: 'info',
  DEPLETED: 'danger',
  CANCELLED: 'danger',
  SUSPENDED: 'warning',
};

export const getSourceLabel = (source: string): string =>
  SOURCE_LABELS[source] ?? source.replace(/_/g, ' ');

export const getSourceVariant = (source: string): Variant =>
  SOURCE_VARIANTS[source] ?? 'default';

export const getStatusLabel = (status: string): string =>
  STATUS_LABELS[status] ?? status.replace(/_/g, ' ');

export const getStatusVariant = (status: string): Variant =>
  STATUS_VARIANTS[status] ?? 'neutral';

export const hasDiscountFilters = (filters: DiscountFilterState): boolean =>
  filters.searchQuery.trim().length > 0 ||
  filters.sourceFilter !== EMPTY_DISCOUNT_FILTERS.sourceFilter ||
  filters.statusFilter !== EMPTY_DISCOUNT_FILTERS.statusFilter;
