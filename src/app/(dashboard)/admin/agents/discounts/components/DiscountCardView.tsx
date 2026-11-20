'use client';

import { CalendarClock, RefreshCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { AgentDiscount } from '@/core/domain/entities/AgentDiscount';
import { getDiscountStatusConfig } from './discountStatus';

interface DiscountCardViewProps {
  discounts: AgentDiscount[];
  canManage: boolean;
  onToggleStatus: (id: number) => void;
  onRemove: (id: number) => void;
}

export function DiscountCardView({
  discounts,
  canManage,
  onToggleStatus,
  onRemove,
}: DiscountCardViewProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {discounts.map((discount) => {
        const config = getDiscountStatusConfig(discount.status);
        const isExpired = Boolean(discount.expiresAt && new Date(discount.expiresAt) < new Date());
        const usagePercentage = discount.maxUsage
          ? Math.round((discount.usageCount / discount.maxUsage) * 100)
          : 0;
        const usageTone = usagePercentage >= 80
          ? 'agent-discounts__usage-fill--danger'
          : usagePercentage >= 50
            ? 'agent-discounts__usage-fill--warning'
            : '';

        return (
          <li key={discount.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8CED5] hover:shadow-md">
              <div className="flex-1 p-5">
                {/* Code + status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="agent-discounts__code-badge">{discount.discountCode.code}</span>
                    <p className="mt-2 text-xs text-slate-500">
                      Asignado el {format(new Date(discount.assignedAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <span className={`agent-discounts__status-badge ${config.className}`}>
                    <span className="agent-discounts__status-dot" />
                    {config.label}
                  </span>
                </div>

                {/* Type */}
                <div className="mt-4">
                  <span className="agent-discounts__type-badge">
                    {discount.discountCode.applicability === 'USER_SPECIFIC' ? 'Personalizado' : 'General'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Valor</p>
                    <p className="agent-discounts__value mt-1">-{discount.discountCode.discountPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Uso</p>
                    <p className="agent-discounts__usage mt-1">
                      {discount.usageCount} / {discount.maxUsage || '∞'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Expira</p>
                    <p className={`agent-discounts__expiry mt-1 ${isExpired ? 'agent-discounts__expiry--expired' : ''}`}>
                      {discount.expiresAt ? format(new Date(discount.expiresAt), 'dd/MM/yyyy') : '—'}
                    </p>
                  </div>
                </div>

                {discount.maxUsage && (
                  <div className="agent-discounts__usage-track agent-discounts__usage-track--full mt-3" aria-hidden="true">
                    <div
                      className={`agent-discounts__usage-fill ${usageTone}`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                  <CalendarClock className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                  <span className="truncate">
                    {discount.expiresAt ? (isExpired ? 'Expirado' : 'Vigente') : 'Sin expiración'}
                  </span>
                </div>
                {canManage && (
                  <div className="agent-discounts__row-actions">
                    <button
                      type="button"
                      className="agent-discounts__icon-btn"
                      onClick={() => onToggleStatus(discount.id)}
                      title="Cambiar estado"
                      aria-label="Cambiar estado"
                    >
                      <RefreshCw aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="agent-discounts__icon-btn agent-discounts__icon-btn--danger"
                      onClick={() => onRemove(discount.id)}
                      title="Eliminar"
                      aria-label="Eliminar"
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
