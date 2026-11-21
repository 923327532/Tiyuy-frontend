import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import type { PropertyTableColumn } from '../types/properties.types';
import { formatCurrency, formatDate } from '../utils/properties.utils';
import { PropertyIdentityCell } from '../components/table/PropertyIdentityCell';
import { PropertyStatusBadge } from '../components/table/PropertyStatusBadge';

export function getPropertyColumns(): PropertyTableColumn[] {
  return [
    {
      key: 'title',
      label: 'Propiedad',
      sortable: true,
      render: (_value, property) => <PropertyIdentityCell property={property} />,
    },
    {
      key: 'ownerName',
      label: 'Propietario',
      sortable: true,
      render: (_value, property) => (
        <div className="properties-cell-stack properties-cell-owner">
          <span className="properties-cell-primary" title={property.ownerName || ''}>
            {property.ownerName || 'Sin nombre'}
          </span>
          <span className="properties-cell-secondary" title={property.ownerEmail || ''}>
            {property.ownerEmail}
          </span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      sortable: true,
      render: (value) => (
        <span className="properties-cell-price">{formatCurrency(Number(value))}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => <PropertyStatusBadge status={String(value)} />,
    },
    {
      key: 'viewsCount',
      label: 'Métricas',
      sortable: true,
      render: (_value, property) => {
        const reports = Number(property.reportCount ?? 0);
        return (
          <div className="properties-cell-metrics">
            <span className="properties-cell-number" title="Vistas">
              {Number(property.viewsCount ?? 0).toLocaleString('es-PE')} vistas
            </span>
            {reports > 0 && (
              <span className="properties-cell-alert" title="Reportes activos">
                {reports} rep.
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Creada',
      sortable: true,
      render: (value) => (
        <span className="properties-cell-secondary">{formatDate(value as string | Date)}</span>
      ),
    },
  ];
}

export function getPropertySummary(properties: PropertyModerationItem[], totalElements: number) {
  const published = properties.filter((p) => p.status === 'PUBLISHED').length;
  const pending = properties.filter((p) => p.status === 'PENDING').length;
  const suspended = properties.filter((p) => p.status === 'SUSPENDED').length;
  const rejected = properties.filter((p) => p.status === 'REJECTED').length;

  return { total: totalElements, published, pending, suspended, rejected };
}
