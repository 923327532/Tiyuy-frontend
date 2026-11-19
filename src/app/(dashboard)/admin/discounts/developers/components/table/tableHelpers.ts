/**
 * Display helpers for DiscountsTable
 */

import {
  DiscountStatus,
  DiscountType,
  DiscountApplicabilityScope,
  DeveloperSubscriptionDiscount,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';

export const getStatusBadgeClass = (status: DiscountStatus) => {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'INACTIVE': return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'EXPIRED': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'REVOKED': return 'bg-red-100 text-red-800 border-red-200';
    case 'EXHAUSTED': return 'bg-rose-100 text-rose-800 border-rose-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusLabel = (status: DiscountStatus) => {
  switch (status) {
    case 'ACTIVE': return 'Activo';
    case 'INACTIVE': return 'Inactivo';
    case 'EXPIRED': return 'Expirado';
    case 'REVOKED': return 'Revocado';
    case 'EXHAUSTED': return 'Agotado';
    default: return status;
  }
};

export const getTypeLabel = (type: DiscountType) => {
  return type === 'PERCENTAGE' ? 'Porcentaje' : 'Importe fijo';
};

export const getScopeLabel = (scope: DiscountApplicabilityScope) => {
  switch (scope) {
    case 'NEW_CONTRACT': return 'Nueva contratación';
    case 'RENEWAL': return 'Renovación';
    case 'BOTH': return 'Ambos';
    default: return scope;
  }
};

export const getDiscountDisplay = (discount: DeveloperSubscriptionDiscount) => {
  if (discount.type === 'PERCENTAGE') {
    return `${discount.percentage}%`;
  }
  const parts = [];
  if (discount.amountPen) parts.push(`S/${discount.amountPen.toLocaleString()}`);
  if (discount.amountUsd) parts.push(`$${discount.amountUsd.toLocaleString()}`);
  return parts.join(' / ');
};
