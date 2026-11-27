'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import type { CentralDiscountDto } from '@/core/domain/entities/Admin';
import {
  UsersEmptyState,
  UsersErrorState,
  UsersLoadingState,
} from '@/presentation/components/admin/users/components/page-feedback';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';

import {
  DiscountDetailModal,
  DiscountsActionModal,
  type DiscountAction,
} from '../modals';
import { RecentActivityCardView } from './RecentActivityCardView';
import { RecentActivityFilters } from './RecentActivityFilters';
import { RecentActivityTable } from './RecentActivityTable';
import { useRecentActivity } from './useRecentActivity';

/** Actividad reciente con los mismos componentes compartidos que Usuarios y la lista de descuentos. */
export function RecentActivitySection() {
  const activity = useRecentActivity();
  const hasDiscounts = activity.discounts.length > 0;
  const [selected, setSelected] = useState<CentralDiscountDto | null>(null);
  const [action, setAction] = useState<DiscountAction | null>(null);
  const [reason, setReason] = useState('');

  const closeAction = () => {
    setAction(null);
    setReason('');
  };

  const requestAction = (discount: CentralDiscountDto, nextAction: DiscountAction) => {
    setSelected(discount);
    setReason('');
    setAction(nextAction);
  };

  return (
    <section aria-label="Actividad reciente" className="min-w-0">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <h3 className="text-sm font-semibold text-slate-800">Actividad Reciente</h3>
        </div>
        <span className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] tabular-nums">
          {activity.totalElements} registros
        </span>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200/85 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-3 py-3 sm:px-5">
          <RecentActivityFilters
            filters={activity.filters}
            hasFilter={activity.hasFilter}
            onSearchChange={activity.setSearchQuery}
            onFilterChange={activity.setFilter}
            onClear={activity.clearFilters}
          />
          {!activity.isLoading && hasDiscounts && (
            <UsersViewToggle value={activity.viewMode} onChange={activity.setViewMode} />
          )}
        </div>

        {activity.isLoading && <UsersLoadingState message="Cargando actividad..." />}
        {Boolean(activity.error) && (
          <UsersErrorState error={activity.error} onRetry={() => void activity.refetch()} />
        )}
        {!activity.isLoading && !activity.error && !hasDiscounts && (
          <UsersEmptyState
            onClear={activity.clearFilters}
            title="Sin actividad en este periodo"
            description={
              activity.hasFilter
                ? 'Ajusta la búsqueda, los filtros o el rango de fechas.'
                : 'Aún no hay descuentos aplicados en este rango de fechas.'
            }
          />
        )}

        {!activity.isLoading && !activity.error && hasDiscounts && (
          <>
            {activity.viewMode === 'table' ? (
              <RecentActivityTable discounts={activity.discounts} onSelect={setSelected} />
            ) : (
              <RecentActivityCardView discounts={activity.discounts} onSelect={setSelected} />
            )}
            <UsersPagination
              currentPage={activity.currentPage}
              pageSize={activity.pageSize}
              totalElements={activity.totalElements}
              onPageChange={activity.setCurrentPage}
              onPageSizeChange={activity.handlePageSizeChange}
              itemLabel="registros"
            />
          </>
        )}
      </div>

      <DiscountDetailModal
        discount={action ? null : selected}
        onClose={() => setSelected(null)}
        onToggleStatus={(discount) =>
          requestAction(discount, discount.status === 'ACTIVE' ? 'deactivate' : 'activate')
        }
        onDelete={(discount) => requestAction(discount, 'delete')}
      />

      <DiscountsActionModal
        discount={selected}
        action={action}
        reason={reason}
        onReasonChange={setReason}
        onClose={closeAction}
        onSuccess={() => {
          closeAction();
          setSelected(null);
        }}
      />
    </section>
  );
}
