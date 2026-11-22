'use client';

import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';

interface StatusBadgeProps {
  agency: InmobiliariaWithStats;
}

export function StatusBadge({ agency }: StatusBadgeProps) {
  const isEnabled = agency.enabled !== false;
  const status = agency.status || 'INACTIVE';

  let className = 'agencies-table__badge ';
  let label: string = status;

  if (!isEnabled) {
    className += 'agencies-table__badge--inactive';
    label = 'Inactivo';
  } else if (status === 'ACTIVE') {
    className += 'agencies-table__badge--active';
  } else if (status === 'SUSPENDED') {
    className += 'agencies-table__badge--suspended';
  } else {
    className += 'agencies-table__badge--inactive';
  }

  return <span className={className}>{label}</span>;
}

interface PlanBadgeProps {
  agency: InmobiliariaWithStats;
}

export function PlanBadge({ agency }: PlanBadgeProps) {
  const plan = agency.currentPlan || 'Sin plan';

  let className = 'agencies-table__plan-badge ';
  if (plan === 'ENTERPRISE') className += 'agencies-table__plan-badge--enterprise';
  else if (plan === 'PROFESSIONAL') className += 'agencies-table__plan-badge--professional';
  else if (plan === 'BASIC') className += 'agencies-table__plan-badge--basic';
  else className += 'agencies-table__plan-badge--none';

  return <span className={className}>{plan}</span>;
}

interface DiscountBadgeProps {
  agency: InmobiliariaWithStats;
}

export function DiscountBadge({ agency }: DiscountBadgeProps) {
  const count = agency.activeDiscounts || 0;

  if (count === 0) {
    return <span className="agencies-table__discount-badge agencies-table__discount-badge--none">Sin descuento</span>;
  }

  return (
    <span className="agencies-table__discount-badge agencies-table__discount-badge--has">
      {count} activo{count > 1 ? 's' : ''}
    </span>
  );
}