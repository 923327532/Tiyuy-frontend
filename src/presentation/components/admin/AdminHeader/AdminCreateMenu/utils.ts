import type {
  CreateActionGroup,
  PermissionContext,
} from './types';

/**
 * Oculta las acciones que el administrador actual no puede ejecutar
 * y elimina los grupos que se queden sin acciones.
 */
export function getVisibleActionGroups(
  groups: CreateActionGroup[],
  { hasPermission, isSuperAdmin }: PermissionContext,
): CreateActionGroup[] {
  return groups
    .map((group) => ({
      ...group,
      actions: group.actions.filter((action) => {
        if (action.superAdminOnly && !isSuperAdmin) return false;
        if (action.permission && !hasPermission(action.permission)) {
          return false;
        }
        return true;
      }),
    }))
    .filter((group) => group.actions.length > 0);
}
