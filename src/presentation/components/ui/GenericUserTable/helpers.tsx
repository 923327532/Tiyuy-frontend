import { Badge } from '@/presentation/components/ui/Badge';
import type { GenericAction, GenericColumn, GenericUser, UserTypeConfig } from './types';
import { UserIdentityCell } from './components/UserIdentityCell';
import { RowActions } from './components/RowActions';

/** Default column definitions that work for both user types */
export function getDefaultColumns<T extends GenericUser>(
  config: UserTypeConfig<T>,
  actions?: GenericAction<T>[],
  onRowClick?: (user: T) => void
): GenericColumn<T>[] {
  const columns: GenericColumn<T>[] = [
    {
      key: 'user',
      label: 'Usuario',
      sortable: true,
      width: '280px',
      minWidth: '240px',
      render: (_value, user) => (
        <UserIdentityCell
          user={user}
          config={config}
          isDisabled={config.isDisabled?.(user) ?? false}
        />
      ),
    },
    {
      key: 'country',
      label: 'País',
      sortable: true,
      width: '140px',
      minWidth: '120px',
      render: (_value, user) => config.getCountry?.(user) ?? '—',
    },
    {
      key: 'documentType',
      label: 'Documento',
      sortable: true,
      width: '140px',
      minWidth: '120px',
      render: (_value, user) => config.getDocumentType?.(user) ?? '—',
    },
    {
      key: 'documentNumber',
      label: 'N° documento',
      sortable: true,
      width: '160px',
      minWidth: '140px',
      className: 'generic-table__td--mono',
      render: (_value, user) => config.getDocumentNumber?.(user) ?? '—',
    },
    {
      key: 'registeredAt',
      label: 'Registro',
      sortable: true,
      width: '140px',
      minWidth: '120px',
      render: (_value, user) => formatDate(config.getRegisteredAt(user)),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      width: '140px',
      minWidth: '120px',
      render: (_value, user) => {
        const status = config.getStatus(user);
        return (
          <Badge variant={status.variant} size="sm" dot className="generic-table__badge">
            {status.label}
          </Badge>
        );
      },
    },
  ];

  // Add actions column if actions are provided
  if (actions && actions.length > 0) {
    columns.push({
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      width: '180px',
      minWidth: '160px',
      align: 'right',
      render: (_value, user) => (
        <RowActions
          user={user}
          actions={actions}
          onRowClick={onRowClick}
        />
      ),
    });
  }

  return columns;
}

/** Format date for display */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
