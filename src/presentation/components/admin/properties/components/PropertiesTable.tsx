'use client';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { DataTable } from '@/presentation/components/ui/DataTable';

import type { PropertyActionHandlers, PropertyTableColumn } from '../types/properties.types';
import { PropertyRowActions } from './table/PropertyRowActions';
import './styles/properties-table.css';

interface PropertiesTableProps extends PropertyActionHandlers {
  properties: PropertyModerationItem[];
  columns: PropertyTableColumn[];
  selectedProperties: PropertyModerationItem[];
  onSelectionChange: (items: PropertyModerationItem[]) => void;
  canModerate: boolean;
  canFeature: boolean;
  isLoading: boolean;
}

export function PropertiesTable({
  properties,
  columns,
  selectedProperties,
  onSelectionChange,
  canModerate,
  canFeature,
  isLoading,
  onViewDetail,
  onModerate,
  onToggleFeatured,
  onDisable,
  onEnable,
}: PropertiesTableProps) {
  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      width: '180px',
      render: (_value: unknown, property: PropertyModerationItem) => (
        <PropertyRowActions
          property={property}
          canModerate={canModerate}
          canFeature={canFeature}
          onViewDetail={onViewDetail}
          onModerate={onModerate}
          onToggleFeatured={onToggleFeatured}
          onDisable={onDisable}
          onEnable={onEnable}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={properties}
      columns={tableColumns}
      rowKey="id"
      selectedRows={selectedProperties}
      onSelectionChange={onSelectionChange}
      onRowClick={onViewDetail}
      isLoading={isLoading}
      striped
      hoverable
      emptyMessage="No se encontraron propiedades"
      className="properties-table__container"
    />
  );
}
