'use client';

import { DataTable } from '@/presentation/components/ui/DataTable';
import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UsersTableProps, UserTableColumn } from '@/presentation/components/admin/users/types/users.types';
import { formatRegistered } from '@/presentation/components/admin/users/utils/users.utils';

import { UserIdentityCell } from './components/UserIdentityCell';
import { RoleBadge, StatusBadge, VerificationBadges } from './components/UserBadges';
import { RowActions } from './components/RowActions';
import './styles/UsersTable.css';

export function UsersTable({
  users,
  columns,
  selectedUsers,
  onSelectionChange,
  onViewDetail,
  onToggleStatus,
  onDelete,
  onViewProperties,
  onViewProjects,
  canManage,
  canDelete,
  isLoading,
  toggleStatusPending,
  pendingUserId,
}: UsersTableProps) {
  const baseColumns: UserTableColumn[] = [
    {
      key: 'email',
      label: 'Usuario',
      sortable: true,
      width: '280px',
      render: (_value: unknown, user: UserListItem) => <UserIdentityCell user={user} />,
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      width: '130px',
      render: (_value: unknown, user: UserListItem) => <RoleBadge user={user} />,
    },
    {
      key: 'enabled',
      label: 'Estado',
      sortable: true,
      width: '120px',
      render: (_value: unknown, user: UserListItem) => <StatusBadge user={user} />,
    },
    {
      key: 'emailVerified',
      label: 'Verificación',
      sortable: false,
      width: '150px',
      render: (_value: unknown, user: UserListItem) => <VerificationBadges user={user} />,
    },
    {
      key: 'createdAt',
      label: 'Registro',
      sortable: true,
      width: '130px',
      render: (_value: unknown, user: UserListItem) => (
        <time
          className="users-table__date"
          dateTime={user.createdAt ? new Date(user.createdAt).toISOString() : undefined}
        >
          {formatRegistered(user.createdAt)}
        </time>
      ),
    },
  ];

  const actionColumn: UserTableColumn = {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    width: '180px',
    align: 'right',
    render: (_value: unknown, user: UserListItem) => (
      <RowActions
        user={user}
        canManage={canManage}
        canDelete={canDelete}
        toggleStatusPending={toggleStatusPending}
        pendingUserId={pendingUserId}
        onViewDetail={onViewDetail}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onViewProperties={onViewProperties}
        onViewProjects={onViewProjects}
      />
    ),
  };

  return (
    <DataTable
      data={users}
      columns={[...baseColumns, ...columns, actionColumn]}
      rowKey="id"
      selectedRows={selectedUsers}
      onSelectionChange={onSelectionChange}
      onRowClick={onViewDetail}
      isLoading={isLoading}
      striped
      hoverable
      emptyMessage="No se encontraron usuarios"
      className="users-table__container w-full min-w-0 overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-lg"
      tableClassName="min-w-[960px]"
    />
  );
}
