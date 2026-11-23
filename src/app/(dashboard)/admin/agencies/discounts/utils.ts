/**
 * Helpers for the Agencies Discounts page: badges y exportación Excel.
 */

import { exportToModernExcel, type ModernExcelColumn } from '@/utils/modernExcelExport';
import type { FilterState } from './types';
import type { DeveloperDiscountCode } from './types';

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-800';
    case 'INACTIVE': return 'bg-slate-100 text-slate-800';
    case 'EXPIRED': return 'bg-rose-100 text-rose-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'Activo';
    case 'INACTIVE': return 'Inactivo';
    case 'EXPIRED': return 'Expirado';
    default: return status;
  }
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  EXPIRED: 'Expirado',
  EXHAUSTED: 'Agotado',
  USED: 'Usado',
};

const COLUMNS: ModernExcelColumn<DeveloperDiscountCode>[] = [
  { header: 'ID', type: 'integer', value: (d) => d.id, totalLabel: 'TOTAL' },
  { header: 'Código', value: (d) => d.code },
  { header: 'Inmobiliaria', value: (d) => d.developer.name },
  { header: 'Email', value: (d) => d.developer.email },
  { header: 'Descuento %', type: 'percent', value: (d) => d.discountPercentage ?? 0, total: true },
  { header: 'Usos', type: 'integer', value: (d) => d.usedCount ?? 0, total: true },
  { header: 'Máx. Usos', type: 'integer', value: (d) => d.maxUses ?? 0 },
  { header: 'Estado', type: 'status', value: (d) => STATUS_LABELS[d.status] ?? d.status },
  { header: 'Válido Desde', type: 'date', value: (d) => d.validFrom },
  { header: 'Válido Hasta', type: 'date', value: (d) => d.validUntil ?? '' },
  { header: 'Válido', type: 'status', value: (d) => (d.isValid ? 'Sí' : 'No') },
];

export function exportDiscountsExcel(
  content: DeveloperDiscountCode[],
  filters?: FilterState
) {
  if (!content.length) return;
  void exportToModernExcel({
    title: 'Reporte de Descuentos — TIYUY',
    fileName: `descuentos_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Descuentos',
    rows: content,
    columns: COLUMNS,
    filters: filters ? { ...filters } : undefined,
  });
}
