'use client';

import { CalendarDays, Hash, Repeat2 } from 'lucide-react';
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
  formatDiscountNumber,
} from '../../utils/discountFormat';

interface Props {
  discounts: CentralDiscountDto[];
}

export function DiscountCardView({ discounts }: Props) {
  return (
    <ul className="discounts-cards grid min-w-0 grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {discounts.map((discount) => (
        <li key={discount.id} className="min-w-0">
          <article className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{discount.code || '-'}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {discount.assignedByName || discount.entityName || 'Sin asignar'}
                </p>
              </div>
              <Badge variant={getStatusVariant(discount.status)} size="sm" dot>
                {getStatusLabel(discount.status)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getSourceVariant(discount.source)} size="sm">
                {discount.sourceLabel || getSourceLabel(discount.source)}
              </Badge>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-teal-800">
                {discount.discountPercentage}%
              </span>
              {discount.customPrice != null && (
                <span className="text-[11px] font-medium tabular-nums text-slate-600">
                  {formatDiscountCurrency(discount.customPrice)}
                </span>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-3 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Repeat2 className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Usos</dt>
                <dd className="tabular-nums">
                  {formatDiscountNumber(discount.usageCount)}/{discount.maxUsage || '∞'}
                </dd>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Creado</dt>
                <dd>{formatDiscountDate(discount.createdAt)}</dd>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-slate-400">
                <Hash className="h-3.5 w-3.5" aria-hidden="true" />
                <dt className="sr-only">Aplicabilidad</dt>
                <dd className="truncate">{discount.applicability || '-'}</dd>
              </div>
            </dl>
          </article>
        </li>
      ))}
    </ul>
  );
}
