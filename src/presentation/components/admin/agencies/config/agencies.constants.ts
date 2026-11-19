import type { FilterOption } from '@/presentation/components/admin/agencies/types/agencies.types';

export const AGENCIES_STATUS_OPTIONS: FilterOption[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
  { value: 'SUSPENDED', label: 'Suspendido' },
];

export const AGENCIES_PLAN_OPTIONS: FilterOption[] = [
  { value: '', label: 'Todos los planes' },
  { value: 'BASIC', label: 'Básico' },
  { value: 'PROFESSIONAL', label: 'Profesional' },
  { value: 'ENTERPRISE', label: 'Empresarial' },
];

export const AGENCIES_DISCOUNT_OPTIONS: FilterOption[] = [
  { value: '', label: 'Todos los descuentos' },
  { value: 'with_discount', label: 'Con descuento' },
  { value: 'without_discount', label: 'Sin descuento' },
];

export const AGENCIES_SORT_OPTIONS: FilterOption[] = [
  { value: 'name', label: 'Nombre' },
  { value: 'agents', label: 'Agentes' },
  { value: 'revenue', label: 'Ingresos' },
  { value: 'activity', label: 'Actividad' },
];

export const AGENCIES_TABLE_COLUMNS = [
  { key: 'name', label: 'Inmobiliaria', width: '280px' },
  { key: 'managerName', label: 'Gerente', width: '180px' },
  { key: 'email', label: 'Contacto', width: '220px' },
  { key: 'city', label: 'Ciudad', width: '140px' },
  { key: 'totalProjects', label: 'Proyectos', width: '100px', align: 'center' as const },
  { key: 'totalAgents', label: 'Agentes', width: '100px', align: 'center' as const },
  { key: 'status', label: 'Estado', width: '130px' },
  { key: 'lastActivity', label: 'Última actividad', width: '150px' },
] as const;