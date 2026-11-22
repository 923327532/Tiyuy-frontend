/**
 * Discounts table renderer
 */

import {
  DeveloperSubscriptionDiscount,
  DiscountStatus,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import DiscountRow from './DiscountRow';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getTypeLabel,
  getScopeLabel,
  getDiscountDisplay,
} from './tableHelpers';

export interface DiscountsTableProps {
  discounts: DeveloperSubscriptionDiscount[];
  canManage: boolean;
  onViewDetail: (discount: DeveloperSubscriptionDiscount) => void;
  onViewUsageHistory: (discount: DeveloperSubscriptionDiscount) => void;
  onEdit: (discount: DeveloperSubscriptionDiscount) => void;
  onToggleStatus: (discount: DeveloperSubscriptionDiscount, newStatus: DiscountStatus) => void;
  onRevoke: (discount: DeveloperSubscriptionDiscount) => void;
}

export default function DiscountsTableContent({
  discounts,
  canManage,
  onViewDetail,
  onViewUsageHistory,
  onEdit,
  onToggleStatus,
  onRevoke,
}: DiscountsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Inmobiliaria</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Tipo</th>
            <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Descuento</th>
            <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Alcance</th>
            <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Límites</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Vigencia</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Estado</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Usos</th>
            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {discounts.map((discount) => (
            <DiscountRow
              key={discount.id}
              discount={discount}
              canManage={canManage}
              onViewDetail={onViewDetail}
              onViewUsageHistory={onViewUsageHistory}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onRevoke={onRevoke}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusLabel={getStatusLabel}
              getTypeLabel={getTypeLabel}
              getScopeLabel={getScopeLabel}
              getDiscountDisplay={getDiscountDisplay}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
