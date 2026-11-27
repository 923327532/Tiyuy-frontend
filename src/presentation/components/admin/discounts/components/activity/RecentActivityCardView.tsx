'use client';

import type { CentralDiscountDto } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';

import {
  getSourceLabel,
  getSourceVariant,
  getStatusLabel,
  getStatusVariant,
} from '../../config/discounts.config';
import {
  formatDiscountCurrency,
  formatDiscountDate,
} from '../../utils/discountFormat';

interface Props {
  discounts: CentralDiscountDto[];
  onSelect: (discount: CentralDiscountDto) => void;
}

export function RecentActivityCardView({ discounts, onSelect }: Props) {
  return (
    <ul className="grid min-w-0 grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {discounts.map((discount) => (
        <li key={`${discount.source}-${discount.id}-${discount.code}`} className="min-w-0">
          <article className="group flex h-full flex-col gap-3 rounded-xl border border-slate-200/85 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
            <button
              type="button"
              onClick={() => onSelect(discount)}
              className="flex flex-1 flex-col gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
              aria-label={`Ver detalle del descuento ${discount.code || ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{discount.code || '-'}</p>
                  <p className="mt-1 text-xs text-slate-500">{discount.assignedByName || '-'}</p>
                </div>
                <Badge variant={getStatusVariant(discount.status)} size="sm" dot>
                  {getStatusLabel(discount.status)}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getSourceVariant(discount.source)} size="sm">
                  {getSourceLabel(discount.source)}
                </Badge>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-teal-800">
                  {discount.discountPercentage}%
                </span>
                {discount.customPrice != null && (
                  <span className="text-xs tabular-nums text-slate-500">
                    {formatDiscountCurrency(discount.customPrice)}
                  </span>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="font-medium uppercase tracking-wider text-slate-400">Fecha</span>
                <time className="tabular-nums">{formatDiscountDate(discount.createdAt)}</time>
              </div>
            </button>
          </article>
        </li>
      ))}
    </ul>
  );
}
