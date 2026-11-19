import type { FilterOption } from '@/presentation/components/admin/users/types/users.types';

export const USERS_STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'enabled', label: 'Activo' },
  { value: 'disabled', label: 'Suspendido' },
];

export const USERS_ROLE_OPTIONS: FilterOption[] = [
  { value: '', label: 'Todos los roles' },
  { value: 'USER', label: 'Usuario' },
  { value: 'AGENT', label: 'Agente' },
  { value: 'DEVELOPER', label: 'Promotor' },
  { value: 'ADMIN', label: 'Administrador' },
];
