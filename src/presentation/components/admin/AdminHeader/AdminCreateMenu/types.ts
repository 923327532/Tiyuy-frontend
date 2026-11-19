import type { LucideIcon } from 'lucide-react';

export interface CreateAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Permiso necesario para ver la acción. */
  permission?: string;
  /** Solo visible para SUPER_ADMIN. */
  superAdminOnly?: boolean;
}

export interface CreateActionGroup {
  label: string;
  actions: CreateAction[];
}

export interface PermissionContext {
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: boolean;
}
