import type { SidebarNavItem } from './types';

type PermissionCheck = (permission: string) => boolean;

export function isPathActive(
  path: string | undefined,
  pathname: string,
  exact = false,
): boolean {
  if (!path) return false;

  const cleanPath = path.split('?')[0];

  if (exact) return pathname === cleanPath;

  return (
    pathname === cleanPath ||
    (cleanPath !== '/admin' && pathname.startsWith(`${cleanPath}/`))
  );
}

export function hasActiveChild(
  item: SidebarNavItem,
  pathname: string,
): boolean {
  return Boolean(
    item.children?.some(
      (child) =>
        isPathActive(child.path, pathname, child.exact) ||
        hasActiveChild(child, pathname),
    ),
  );
}

export function filterNavigation(
  items: SidebarNavItem[],
  hasPermission: PermissionCheck,
): SidebarNavItem[] {
  return items.reduce<SidebarNavItem[]>((result, item) => {
    const hasOwnPermission =
      !item.requiredPermissions?.length ||
      item.requiredPermissions.some((permission) =>
        hasPermission(permission),
      );

    if (!hasOwnPermission) return result;

    const children = item.children
      ? filterNavigation(item.children, hasPermission)
      : undefined;

    // No mostrar secciones vacías por falta de permisos.
    if (item.children && children?.length === 0 && !item.path) {
      return result;
    }

    result.push({ ...item, children });

    return result;
  }, []);
}

export function getActiveSectionIds(
  items: SidebarNavItem[],
  pathname: string,
): string[] {
  return items
    .filter((item) => hasActiveChild(item, pathname))
    .map((item) => item.id);
}
