'use client';

import { BarChart3, Eye, UserPlus, UserX } from 'lucide-react';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import { DataTable } from '@/presentation/components/ui/DataTable';
import type { Column } from '@/presentation/components/ui/DataTable';
import { Badge } from '@/presentation/components/ui/Badge';
import { IconButton } from '@/presentation/components/ui/Button';
import { UserIdentityCell } from '@/presentation/components/admin/users/components/table/components/UserIdentityCell';
import {
  StatusBadge,
  VerificationBadges,
} from '@/presentation/components/admin/users/components/table/components/UserBadges';
import { formatRegistered } from '@/presentation/components/admin/users/utils/users.utils';
import '@/presentation/components/admin/users/components/table/styles/UsersTable.css';

interface Props {
  agents: AgentListItem[];
  canManage?: boolean;
  onView: (agent: AgentListItem) => void;
  onStats: (agent: AgentListItem) => void;
  onToggleStatus: (agent: AgentListItem) => void;
}

export function AgentsTableView({ agents, canManage, onView, onStats, onToggleStatus }: Props) {
  const columns: Column<AgentListItem>[] = [
    {
      key: 'email',
      label: 'Agente',
      sortable: true,
      width: '280px',
      render: (_value, agent) => <UserIdentityCell user={agent} />,
    },
    {
      key: 'enabled',
      label: 'Estado',
      sortable: true,
      width: '120px',
      render: (_value, agent) => <StatusBadge user={agent} />,
    },
    {
      key: 'emailVerified',
      label: 'Verificación',
      width: '150px',
      render: (_value, agent) => <VerificationBadges user={agent} />,
    },
    {
      key: 'currentPlan',
      label: 'Plan',
      sortable: true,
      width: '140px',
      render: (_value, agent) => (
        <Badge variant="info" size="sm" className="users-table__badge users-table__badge--info">
          {agent.currentPlan || 'Free'}
        </Badge>
      ),
    },
    {
      key: 'monthRevenue',
      label: 'Mes',
      sortable: true,
      width: '120px',
      render: (_value, agent) => (
        <span className="users-table__date">${(agent.monthRevenue || 0).toLocaleString()}</span>
      ),
    },
    {
      key: 'conversionRate',
      label: 'Conversión',
      sortable: true,
      width: '120px',
      render: (_value, agent) => (
        <span className="users-table__date">{(agent.conversionRate || 0).toFixed(1)}%</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Miembro',
      sortable: true,
      width: '130px',
      render: (_value, agent) => (
        <time
          className="users-table__date"
          dateTime={agent.createdAt ? new Date(agent.createdAt).toISOString() : undefined}
        >
          {formatRegistered(agent.createdAt)}
        </time>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '160px',
      align: 'right',
      render: (_value, agent) => (
        <div className="users-table__actions" onClick={(event) => event.stopPropagation()}>
          <IconButton
            variant="ghost"
            size="sm"
            className="users-table__action-btn users-table__action-btn--view"
            icon={<Eye className="w-4 h-4" aria-hidden="true" />}
            ariaLabel={`Ver detalle de ${agent.email}`}
            onClick={() => onView(agent)}
          />
          <IconButton
            variant="ghost"
            size="sm"
            className="users-table__action-btn users-table__action-btn--properties"
            icon={<BarChart3 className="w-4 h-4" aria-hidden="true" />}
            ariaLabel={`Estadísticas de ${agent.email}`}
            onClick={() => onStats(agent)}
          />
          {canManage && (
            <IconButton
              variant="ghost"
              size="sm"
              className={`users-table__action-btn ${
                agent.enabled
                  ? 'users-table__action-btn--suspend'
                  : 'users-table__action-btn--activate'
              }`}
              icon={agent.enabled ? <UserX className="w-4 h-4" aria-hidden="true" /> : <UserPlus className="w-4 h-4" aria-hidden="true" />}
              ariaLabel={agent.enabled ? `Desactivar a ${agent.email}` : `Activar a ${agent.email}`}
              onClick={() => onToggleStatus(agent)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={agents}
      columns={columns}
      rowKey="id"
      onRowClick={onView}
      striped
      hoverable
      emptyMessage="No se encontraron agentes"
      className="users-table__container"
    />
  );
}
