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
import {
  formatDiscountCurrency,
  formatDiscountDate,
  formatDiscountNumber,
} from '../../utils/discountFormat';

interface Props {
  discounts: CentralDiscountDto[];
}

export function DiscountsTable({ discounts }: Props) {
  const columns: Column<CentralDiscountDto>[] = [
    {
      key: 'code',
      label: 'Código',
      minWidth: '140px',
      render: (_value, row) => (
        <span className="font-semibold text-slate-900">{row.code || '-'}</span>
      ),
    },
    {
      key: 'source',
      label: 'Origen',
      minWidth: '140px',
      render: (_value, row) => (
        <Badge variant={getSourceVariant(row.source)} size="sm">
          {row.sourceLabel || getSourceLabel(row.source)}
        </Badge>
      ),
    },
    {
      key: 'discountPercentage',
      label: 'Descuento',
      minWidth: '120px',
      render: (_value, row) => (
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums text-slate-900">{row.discountPercentage}%</span>
          {row.customPrice != null && (
            <span className="text-[11px] text-slate-500 tabular-nums">
              {formatDiscountCurrency(row.customPrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'assignedByName',
      label: 'Asignado a',
      minWidth: '160px',
      render: (_value, row) => (
        <span className="text-slate-600">{row.assignedByName || row.entityName || '-'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      minWidth: '110px',
      render: (_value, row) => (
        <Badge variant={getStatusVariant(row.status)} size="sm" dot>
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      key: 'usageCount',
      label: 'Usos',
      minWidth: '90px',
      align: 'center',
      render: (_value, row) => (
        <span className="tabular-nums text-slate-600">
          {formatDiscountNumber(row.usageCount)}/{row.maxUsage || '∞'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Creado',
      minWidth: '120px',
      render: (_value, row) => (
        <span className="text-slate-500">{formatDiscountDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div
      className="discounts-table min-w-0 w-full"
      tabIndex={0}
      role="region"
      aria-label="Listado de descuentos"
    >
      <DataTable
        data={discounts}
        columns={columns}
        rowKey="id"
        striped
        hoverable
        tableClassName="min-w-[860px]"
        emptyMessage="No se encontraron descuentos"
      />
    </div>
  );
}
