/**
 * Excel export helper for discount usage history.
 */

import type {
  DiscountUsageHistory,
  DeveloperSubscriptionDiscount,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import type { PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  exportToModernExcel,
  type ModernExcelColumn,
} from '@/utils/modernExcelExport';

const COLUMNS: ModernExcelColumn<DiscountUsageHistory>[] = [
  { header: 'ID', type: 'integer', value: (u) => u.id, totalLabel: 'TOTAL' },
  { header: 'Inmobiliaria', value: (u) => u.developerName },
  { header: 'Plan', value: (u) => u.planName },
  { header: 'Importe original PEN', type: 'currency', value: (u) => u.originalAmountPen ?? 0, total: true },
  { header: 'Importe original USD', type: 'currency', currency: '$', value: (u) => u.originalAmountUsd ?? 0, total: true },
  { header: 'Descuento PEN', type: 'currency', value: (u) => u.discountAmountPen ?? 0, total: true },
  { header: 'Descuento USD', type: 'currency', currency: '$', value: (u) => u.discountAmountUsd ?? 0, total: true },
  { header: 'Importe final PEN', type: 'currency', value: (u) => u.finalAmountPen ?? 0, total: true },
  { header: 'Importe final USD', type: 'currency', currency: '$', value: (u) => u.finalAmountUsd ?? 0, total: true },
  { header: 'Moneda', value: (u) => u.currency },
  { header: 'Tipo operación', value: (u) => (u.operationType === 'NEW_CONTRACT' ? 'Nueva contratación' : 'Renovación') },
  { header: 'Fecha uso', type: 'datetime', value: (u) => u.usedAt },
  { header: 'Suscripción ID', value: (u) => u.subscriptionId ?? '' },
  { header: 'Pago ID', value: (u) => u.paymentId ?? '' },
];

export function exportUsageHistory(
  usageHistory: PaginatedResponse<DiscountUsageHistory> | null,
  discount: DeveloperSubscriptionDiscount | null
) {
  if (!usageHistory?.content?.length) return;
  void exportToModernExcel({
    title: 'Historial de Uso de Descuento — TIYUY',
    fileName: `historial_descuento_${discount?.id}_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Historial',
    rows: usageHistory.content,
    columns: COLUMNS,
    filters: { Descuento: discount?.id ?? '-' },
  });
}
