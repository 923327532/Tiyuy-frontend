'use client';

import { DataTable } from '@/presentation/components/ui/DataTable';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type { AgenciesTableProps, AgencyTableColumn } from '@/presentation/components/admin/agencies/types/agencies.types';

import { UserIdentityCell } from '@/presentation/components/admin/users/components/table/components/UserIdentityCell';
import { StatusBadge } from '@/presentation/components/admin/users/components/table/components/UserBadges';
import { formatRegistered } from '@/presentation/components/admin/users/utils/users.utils';
import { RowActions } from './components/RowActions';
import '@/presentation/components/admin/users/components/table/styles/UsersTable.css';

/** Adapta la inmobiliaria a la celda de identidad de usuarios (avatar + nombre + email). */
function toIdentity(agency: InmobiliariaWithStats) {
  return {
    id: agency.id,
    email: agency.name,
    firstName: agency.email,
    lastName: '',
    profilePhotoUrl: agency.logoUrl,
    enabled: agency.enabled !== false,
  };
}

export function AgenciesTable({
  agencies,
  columns,
  onSelectAgency,
  onNotifyAgency,
  isLoading,
}: AgenciesTableProps) {
  const baseColumns: AgencyTableColumn[] = [
    {
      key: 'name',
      label: 'Inmobiliaria',
      sortable: true,
      width: '280px',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <UserIdentityCell user={toIdentity(agency)} />
      ),
    },
    {
      key: 'managerName',
      label: 'Gerente',
      sortable: true,
      width: '180px',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <span className="users-table__name">{agency.managerName || '—'}</span>
      ),
    },
    {
      key: 'contact',
      label: 'Contacto',
      sortable: false,
      width: '220px',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <div className="users-table__user-info">
          <p className="users-table__email">{agency.email || '—'}</p>
          <p className="users-table__name">{agency.phone || '—'}</p>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'Ciudad',
      sortable: true,
      width: '140px',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <span className="users-table__date">{agency.city || '—'}</span>
      ),
    },
    {
      key: 'totalProjects',
      label: 'Proyectos',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <span className="users-table__date">{agency.totalProjects || 0}</span>
      ),
    },
    {
      key: 'totalAgents',
      label: 'Agentes',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <span className="users-table__date">{agency.totalAgents || 0}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      width: '130px',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <StatusBadge
          user={{
            ...toIdentity(agency),
            enabled: agency.enabled !== false && agency.status === 'ACTIVE',
          }}
        />
      ),
    },
    {
      key: 'lastActivity',
      label: 'Última actividad',
      sortable: true,
      width: '150px',
      render: (_value: unknown, agency: InmobiliariaWithStats) => (
        <time
          className="users-table__date"
          dateTime={agency.lastActivity ? new Date(agency.lastActivity).toISOString() : undefined}
        >
          {formatRegistered(agency.lastActivity)}
        </time>
      ),
    },
  ];

  const actionColumn: AgencyTableColumn = {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    width: '150px',
    align: 'right',
    render: (_value: unknown, agency: InmobiliariaWithStats) => (
      <RowActions
        agency={agency}
        onViewDetail={() => onSelectAgency(agency)}
        onNotify={onNotifyAgency ? () => onNotifyAgency!(agency) : undefined}
      />
    ),
  };

  return (
    <DataTable
      data={agencies}
      columns={[...baseColumns, ...columns, actionColumn]}
      rowKey="id"
      onRowClick={onSelectAgency}
      isLoading={isLoading}
      striped
      hoverable
      emptyMessage="No se encontraron inmobiliarias"
      className="users-table__container"
    />
  );
}
