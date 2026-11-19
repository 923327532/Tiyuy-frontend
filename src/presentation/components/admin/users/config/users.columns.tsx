import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UserTableColumn, UsersFiltersState } from '@/presentation/components/admin/users/types/users.types';

function renderCount(value: unknown) {
  return <span className="font-medium tabular-nums">{Number(value) || 0}</span>;
}

export function getUserConditionalColumns(roleFilter: UsersFiltersState['roleFilter']): UserTableColumn[] {
  const propertiesColumn: UserTableColumn = {
    key: 'publishedPropertiesCount',
    label: 'Propiedades',
    sortable: true,
    width: '80px',
    className: '!px-2 text-center',
    headerClassName: '!px-2 text-center',
    render: (value: unknown) => renderCount(value),
  };

  const projectsColumn: UserTableColumn = {
    key: 'publishedProjectsCount',
    label: 'Proyectos',
    sortable: true,
    width: '80px',
    className: '!px-2 text-center',
    headerClassName: '!px-2 text-center',
    render: (value: unknown) => renderCount(value),
  };

  if (roleFilter === 'DEVELOPER') return [projectsColumn];
  if (roleFilter === 'AGENT' || roleFilter === 'USER') return [propertiesColumn];
  return [propertiesColumn, projectsColumn];
}

export function getUsersSummary(users: UserListItem[], totalElements: number) {
  const activeUsers = users.filter((u) => u.enabled).length;
  const pendingUsers = users.filter((u) => !u.emailVerified || !u.phoneVerified).length;
  const suspendedUsers = users.filter((u) => !u.enabled).length;

  const usersByRole = users.reduce<Record<string, number>>((acc, user) => {
    const role = user.role ?? 'USER';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  return {
    totalUsers: totalElements,
    activeUsers,
    pendingUsers,
    suspendedUsers,
    usersByRole,
  };
}
