/**
 * Helpers for the Agencies Discounts page
 */

import { DeveloperDiscountCode } from './types';

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

export function exportDiscountsCsv(content: DeveloperDiscountCode[]) {
  const headers = ['ID', 'Código', 'Inmobiliaria', 'Email', 'Descuento %', 'Usos', 'Máx. Usos', 'Estado', 'Válido Desde', 'Válido Hasta', 'Válido'];
  const rows = content.map(d => [
    d.id,
    d.code,
    d.developer.name,
    d.developer.email,
    d.discountPercentage,
    d.usedCount,
    d.maxUses || 'Ilimitado',
    d.status,
    new Date(d.validFrom).toLocaleDateString('es-PE'),
    d.validUntil ? new Date(d.validUntil).toLocaleDateString('es-PE') : 'Sin expiración',
    d.isValid ? 'Sí' : 'No',
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `descuentos_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
