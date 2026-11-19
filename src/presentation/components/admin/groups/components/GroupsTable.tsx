'use client';

import { Badge } from '@/presentation/components/ui/Badge';
import { DataTable, type Column } from '@/presentation/components/ui/DataTable';
import { formatRegistered } from '@/presentation/components/admin/users/utils/users.utils';
import '@/presentation/components/admin/users/components/table/styles/UsersTable.css';

import type { GroupItem, GroupsViewType } from '../types';
import { getItemMemberCount, isChannelItem } from '../types';
import { GroupIdentityCell } from './table/GroupIdentityCell';
import { RowActions } from './table/RowActions';
import { StatusBadge } from './table/StatusBadge';

export { RowActions } from './table/RowActions';

interface GroupsTableProps {
  items: GroupItem[];
  viewType: GroupsViewType;
  isLoading: boolean;
  onViewDetail: (item: GroupItem) => void;
  onToggleStatus: (item: GroupItem) => void;
  onSuspend: (item: GroupItem) => void;
  onViolation: (item: GroupItem) => void;
  onReactivate: (item: GroupItem) => void;
}

export function GroupsTable({
  items,
  viewType,
  isLoading,
  onViewDetail,
  onToggleStatus,
  onSuspend,
  onViolation,
  onReactivate,
}: GroupsTableProps) {
  const columns: Column<GroupItem>[] = [
    {
      key: 'name',
      label: 'Grupo / Canal',
      sortable: false,
      width: '300px',
      render: (_value, item) => <GroupIdentityCell item={item} />,
    },
    {
      key: 'type',
      label: 'Tipo',
      sortable: false,
      width: '120px',
      render: (_value, item) => (
        <Badge variant={isChannelItem(item) ? 'info' : 'brand'} size="sm">
          {isChannelItem(item) ? 'Canal' : 'Grupo'}
        </Badge>
      ),
    },
    {
      key: 'members',
      label: viewType === 'channels' ? 'Suscriptores' : 'Miembros',
      sortable: false,
      width: '120px',
      render: (_value, item) => (
        <span className="text-sm font-semibold text-slate-700">
          {getItemMemberCount(item).toLocaleString('es-PE')}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Ciudad / Administrador',
      sortable: false,
      width: '200px',
      render: (_value, item) => (
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-700">
            {isChannelItem(item) ? item.city : item.adminName}
          </p>
          <p className="truncate text-xs text-slate-400">
            {isChannelItem(item) ? item.adminName : item.adminEmail}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: false,
      width: '140px',
      render: (_value, item) => <StatusBadge item={item} />,
    },
    {
      key: 'createdAt',
      label: 'Registro',
      sortable: false,
      width: '130px',
      render: (_value, item) => (
        <time
          className="users-table__date"
          dateTime={item.createdAt ? new Date(item.createdAt).toISOString() : undefined}
        >
          {formatRegistered(item.createdAt)}
        </time>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      width: '180px',
      align: 'center',
      render: (_value, item) => (
        <RowActions
          item={item}
          isSuspendedView={viewType === 'suspended'}
          onViewDetail={onViewDetail}
          onToggleStatus={onToggleStatus}
          onSuspend={onSuspend}
          onViolation={onViolation}
          onReactivate={onReactivate}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      rowKey="id"
      onRowClick={onViewDetail}
      isLoading={isLoading}
      striped
      hoverable
      emptyMessage="No se encontraron grupos o canales"
      className="users-table__container"
    />
  );
}
