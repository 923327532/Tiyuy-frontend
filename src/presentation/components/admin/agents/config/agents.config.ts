/**
 * Opciones y constantes de la página de administración de agentes.
 */

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

export const VERIFICATION_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'verified', label: 'Verificado' },
  { value: 'unverified', label: 'Pendiente' },
];

export const PLAN_OPTIONS = [
  { value: 'all', label: 'Todos los planes' },
  { value: 'ENTERPRISE', label: 'Plan Empresarial' },
  { value: 'ENTERPRISE_TRIAL', label: 'Prueba Empresarial' },
  { value: 'PRO', label: 'Plan Pro' },
  { value: 'BASIC', label: 'Plan Básico' },
  { value: 'FREE', label: 'Plan Gratis' },
];

export const CHART_PERIODS = ['7D', '30D', '3M', '6M', '1A'];
export const PLAN_CODES = ['ENTERPRISE', 'PRO', 'BASIC', 'FREE'];
export const PLAN_COLORS = ['#0d9488', '#f59e0b', '#9ca3af'];
