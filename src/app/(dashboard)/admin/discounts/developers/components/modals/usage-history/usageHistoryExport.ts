/**
 * CSV export helper for discount usage history
 */

import { format } from 'date-fns';
import {
  DiscountUsageHistory,
  DeveloperSubscriptionDiscount,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';

export function exportUsageHistory(
  usageHistory: PaginatedResponse<DiscountUsageHistory> | null,
  discount: DeveloperSubscriptionDiscount | null
) {
  if (!usageHistory?.content?.length) return;
  const headers = [
    'ID',
    'Inmobiliaria',
    'Plan',
    'Importe original PEN',
    'Importe original USD',
    'Descuento PEN',
    'Descuento USD',
    'Importe final PEN',
    'Importe final USD',
    'Moneda',
    'Tipo operación',
    'Fecha uso',
    'Suscripción ID',
    'Pago ID',
  ];
  const rows = usageHistory.content.map((u: DiscountUsageHistory) => [
    u.id.toString(),
    u.developerName,
    u.planName,
    u.originalAmountPen.toLocaleString(),
    u.originalAmountUsd.toLocaleString(),
    u.discountAmountPen.toLocaleString(),
    u.discountAmountUsd.toLocaleString(),
    u.finalAmountPen.toLocaleString(),
    u.finalAmountUsd.toLocaleString(),
    u.currency,
    u.operationType === 'NEW_CONTRACT' ? 'Nueva contratación' : 'Renovación',
    format(new Date(u.usedAt), 'dd/MM/yyyy HH:mm'),
    u.subscriptionId?.toString() || '',
    u.paymentId?.toString() || '',
  ]);
  const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.map((c: string) => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `historial_descuento_${discount?.id}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
