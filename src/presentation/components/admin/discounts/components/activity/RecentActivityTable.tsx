'use client';

import type { CentralDiscountDto } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import { DataTable, type Column } from '@/presentation/components/ui/DataTable';

import {
  getSourceLabel,
  getSourceVariant,
  getStatusLabel,
  getStatusVariant,
} from '../../config/discounts.config';
import { formatDiscountDate } from '../../utils/discountFormat';

interface Props {
  discounts: CentralDiscountDto[];
  onSelect: (discount: CentralDiscountDto) => void;
}

export function RecentActivityTable({ discounts, onSelect }: Props) {
  const columns: Column<CentralDiscountDto>[] = [
    {
      key: 'code',
      label: 'CODIGO',
      minWidth: '140px',
      render: (_value, row) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(row);
          }}
          className="font-semibold text-slate-900 transition-colors hover:text-teal-700"
        >
          {row.code || 'Sin código'}
        </button>
      ),
    },
    {
      key: 'source',
      label: 'ORIGEN',
      minWidth: '130px',
      render: (_value, row) => (
        <Badge variant={getSourceVariant(row.source)} size="sm">
          {getSourceLabel(row.source)}
        </Badge>
      ),
    },
    {
      key: 'discountPercentage',
      label: 'DESCUENTO',
      minWidth: '120px',
      render: (_value, row) => (
        <span className="font-semibold tabular-nums text-slate-900">
          {row.discountPercentage}%
        </span>
      ),
    },
    {
      key: 'assignedByName',
      label: 'ASIGNADO',
      minWidth: '150px',
      render: (_value, row) => (
        <span className="text-slate-600">{row.assignedByName || '-'}</span>
      ),
    },
    {
      key: 'status',
      label: 'ESTADO',
      minWidth: '110px',
      render: (_value, row) => (
        <Badge variant={getStatusVariant(row.status)} size="sm" dot>
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'FECHA',
      minWidth: '120px',
      render: (_value, row) => (
        <span className="text-slate-500 tabular-nums">{formatDiscountDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div
      className="activity-table min-w-0 w-full"
      role="region"
      tabIndex={0}
      aria-label="Listado de actividad reciente de descuentos"
    >
      <DataTable
        data={discounts}
        columns={columns}
        rowKey={(row) => `${row.source}-${row.id}-${row.code}-${row.createdAt}`}
        onRowClick={onSelect}
        rowClassName={() => 'cursor-pointer'}
        striped
        hoverable
        tableClassName="min-w-[860px]"
        emptyMessage="Sin actividad en este periodo"
      />
    </div>
  );
}
