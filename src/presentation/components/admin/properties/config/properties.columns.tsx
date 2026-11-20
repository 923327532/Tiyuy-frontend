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
        <div className="properties-cell-stack">
          <span className="properties-cell-primary">{property.ownerName || 'Sin nombre'}</span>
          <span className="properties-cell-secondary">{property.ownerEmail}</span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      sortable: true,
      render: (value) => <span className="properties-cell-price">{formatCurrency(Number(value))}</span>,
    },
    {
      key: 'district',
      label: 'Ubicación',
      sortable: true,
      render: (_value, property) => (
        <div className="properties-cell-stack">
          <span className="properties-cell-primary">{property.district || 'Sin distrito'}</span>
          <span className="properties-cell-secondary">#{property.id}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => <PropertyStatusBadge status={String(value)} />,
    },
    {
      key: 'isFeatured',
      label: 'Destacada',
      sortable: true,
      render: (value) => (
        <span className={value ? 'properties-cell-featured' : 'properties-cell-secondary'}>
          {value ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'viewsCount',
      label: 'Vistas',
      sortable: true,
      render: (value) => <span className="properties-cell-number">{Number(value ?? 0).toLocaleString('es-PE')}</span>,
    },
    {
      key: 'reportCount',
      label: 'Reportes',
      sortable: true,
      render: (value) => (
        <span className={Number(value) > 0 ? 'properties-cell-alert' : 'properties-cell-secondary'}>
          {Number(value ?? 0)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Creada',
      sortable: true,
      render: (value) => <span className="properties-cell-secondary">{formatDate(value as string | Date)}</span>,
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
