/**
 * Excel export helper for developer subscription discounts.
 */

import type { DeveloperSubscriptionDiscount } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import {
  exportToModernExcel,
  type ModernExcelColumn,
} from '@/utils/modernExcelExport';

const COLUMNS: ModernExcelColumn<DeveloperSubscriptionDiscount>[] = [
  { header: 'ID', type: 'integer', value: (d) => d.id, totalLabel: 'TOTAL' },
  { header: 'Inmobiliaria', value: (d) => d.developerName },
  { header: 'RUC', value: (d) => d.developerRuc ?? '' },
  { header: 'Tipo', value: (d) => (d.type === 'PERCENTAGE' ? 'Porcentaje' : 'Importe fijo') },
  { header: 'Porcentaje %', type: 'percent', value: (d) => d.percentage ?? 0, total: true },
  { header: 'Importe PEN', type: 'currency', value: (d) => d.amountPen ?? 0, total: true },
  { header: 'Importe USD', type: 'currency', currency: '$', value: (d) => d.amountUsd ?? 0, total: true },
  { header: 'Alcance', value: (d) => (
    d.applicabilityScope === 'NEW_CONTRACT' ? 'Nueva contratación' :
    d.applicabilityScope === 'RENEWAL' ? 'Renovación' : 'Ambos'
  ) },
  { header: 'Planes aplicables', value: (d) => d.applicablePlanCodes?.join(', ') || 'Todos' },
  { header: 'Máx. desc. PEN', type: 'currency', value: (d) => d.maxDiscountPen ?? 0 },
  { header: 'Máx. desc. USD', type: 'currency', currency: '$', value: (d) => d.maxDiscountUsd ?? 0 },
  { header: 'Límite usos', type: 'integer', value: (d) => d.usageLimit ?? 0 },
  { header: 'Usos actuales', type: 'integer', value: (d) => d.currentUsage ?? 0, total: true },
  { header: 'Estado', type: 'status', value: (d) => d.status },
  { header: 'Válido desde', type: 'date', value: (d) => d.validFrom },
  { header: 'Válido hasta', type: 'date', value: (d) => d.validUntil ?? '' },
  { header: 'Motivo admin', value: (d) => d.adminReason ?? '' },
  { header: 'Creado por', value: (d) => d.createdByName ?? '' },
  { header: 'Creado el', type: 'datetime', value: (d) => d.createdAt },
];

export function exportDiscountsToExcel(
  discounts: DeveloperSubscriptionDiscount[],
  showNotification: (message: string, type: 'success' | 'error') => void,
  filters?: Record<string, unknown>
) {
  if (!discounts.length) {
    showNotification('No hay datos para exportar', 'error');
    return;
  }
  void exportToModernExcel({
    title: 'Reporte de Descuentos de Suscripción — TIYUY',
    fileName: `descuentos_suscripcion_desarrolladores_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Descuentos',
    rows: discounts,
    columns: COLUMNS,
    filters,
  });
  showNotification('Exportado correctamente', 'success');
}
