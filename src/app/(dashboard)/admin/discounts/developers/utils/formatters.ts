/**
 * Formatters for Developer Subscription Discounts
 */

import { format } from 'date-fns';
import { DeveloperSubscriptionDiscount, DiscountStatus, DiscountType, DiscountApplicabilityScope } from '@/core/domain/entities/DeveloperSubscriptionDiscount';

export const getStatusBadgeClass = (status: DiscountStatus): string => {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'INACTIVE': return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'EXPIRED': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'REVOKED': return 'bg-red-100 text-red-800 border-red-200';
    case 'EXHAUSTED': return 'bg-rose-100 text-rose-800 border-rose-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusLabel = (status: DiscountStatus): string => {
  switch (status) {
    case 'ACTIVE': return 'Activo';
    case 'INACTIVE': return 'Inactivo';
    case 'EXPIRED': return 'Expirado';
    case 'REVOKED': return 'Revocado';
    case 'EXHAUSTED': return 'Agotado';
    default: return status;
  }
};

export const getTypeLabel = (type: DiscountType): string => {
  return type === 'PERCENTAGE' ? 'Porcentaje' : 'Importe fijo';
};

export const getScopeLabel = (scope: DiscountApplicabilityScope): string => {
  switch (scope) {
    case 'NEW_CONTRACT': return 'Nueva contratación';
    case 'RENEWAL': return 'Renovación';
    case 'BOTH': return 'Ambos';
    default: return scope;
  }
};

export const getDiscountDisplay = (discount: DeveloperSubscriptionDiscount): string => {
  if (discount.type === 'PERCENTAGE') {
    return `${discount.percentage}%`;
  }
  const parts: string[] = [];
  if (discount.amountPen) parts.push(`S/${discount.amountPen.toLocaleString()}`);
  if (discount.amountUsd) parts.push(`$${discount.amountUsd.toLocaleString()}`);
  return parts.join(' / ');
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'dd/MM/yyyy');
};

export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
};

export const isExpired = (discount: DeveloperSubscriptionDiscount): boolean => {
  if (!discount.validUntil) return false;
  return new Date(discount.validUntil) < new Date();
};

export const getUsagePercentage = (discount: DeveloperSubscriptionDiscount): number => {
  if (!discount.usageLimit) return 0;
  return Math.round((discount.currentUsage / discount.usageLimit) * 100);
};

export const getUsageProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};