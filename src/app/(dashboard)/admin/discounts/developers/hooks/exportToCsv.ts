/**
 * CSV export helper for developer subscription discounts
 */

import { format } from 'date-fns';
import { DeveloperSubscriptionDiscount } from '@/core/domain/entities/DeveloperSubscriptionDiscount';

export function exportDiscountsToCsv(
  discounts: DeveloperSubscriptionDiscount[],
  showNotification: (message: string, type: 'success' | 'error') => void
) {
  if (!discounts.length) {
    showNotification('No hay datos para exportar', 'error');
    return;
  }
  const headers = [
    'ID', 'Inmobiliaria', 'RUC', 'Tipo', 'Porcentaje %', 'Importe PEN', 'Importe USD',
    'Alcance', 'Planes aplicables', 'Máx. desc. PEN', 'Máx. desc. USD', 'Límite usos',
    'Usos actuales', 'Estado', 'Válido desde', 'Válido hasta', 'Motivo admin',
    'Creado por', 'Creado el'
  ];
  const rows = discounts.map((d: DeveloperSubscriptionDiscount) => [
    d.id.toString(), d.developerName, d.developerRuc || '',
    d.type === 'PERCENTAGE' ? 'Porcentaje' : 'Importe fijo',
    d.percentage?.toString() || '', d.amountPen?.toString() || '', d.amountUsd?.toString() || '',
    d.applicabilityScope === 'NEW_CONTRACT' ? 'Nueva contratación' :
      d.applicabilityScope === 'RENEWAL' ? 'Renovación' : 'Ambos',
    d.applicablePlanCodes?.join(', ') || 'Todos',
    d.maxDiscountPen?.toString() || '', d.maxDiscountUsd?.toString() || '',
    d.usageLimit?.toString() || 'Ilimitado', d.currentUsage.toString(), d.status,
    format(new Date(d.validFrom), 'dd/MM/yyyy'),
    d.validUntil ? format(new Date(d.validUntil), 'dd/MM/yyyy') : 'Sin expiración',
    d.adminReason, d.createdByName, format(new Date(d.createdAt), 'dd/MM/yyyy HH:mm')
  ]);
  const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.map((c: string) => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `descuentos_suscripcion_desarrolladores_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showNotification('Exportado correctamente', 'success');
}
