/**
 * Table container with loading/error/empty states for developer discounts
 */

import { DeveloperSubscriptionDiscount } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { DiscountsTable, Pagination } from './table';

interface DiscountsPanelProps {
  isLoading: boolean;
  error: Error | null;
  discounts: DeveloperSubscriptionDiscount[];
  hasActiveFilters: boolean;
  canManageDiscounts: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onRetry: () => void;
  onClearFilters: () => void;
  onCreate: () => void;
  onViewDetail: (discount: DeveloperSubscriptionDiscount) => void;
  onViewUsageHistory: (discount: DeveloperSubscriptionDiscount) => void;
  onEdit: (discount: DeveloperSubscriptionDiscount) => void;
  onToggleStatus: (discount: DeveloperSubscriptionDiscount, newStatus: DeveloperSubscriptionDiscount['status']) => void;
  onRevoke: (discount: DeveloperSubscriptionDiscount) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function DiscountsPanel({
  isLoading,
  error,
  discounts,
  hasActiveFilters,
  canManageDiscounts,
  currentPage,
  pageSize,
  totalPages,
  totalElements,
  onRetry,
  onClearFilters,
  onCreate,
  onViewDetail,
  onViewUsageHistory,
  onEdit,
  onToggleStatus,
  onRevoke,
  onPageChange,
  onPageSizeChange,
}: DiscountsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-500" />
          <span className="ml-3 text-sm font-medium text-slate-500">Cargando descuentos...</span>
        </div>
      ) : error ? (
        <div className="px-6 py-12 text-center text-sm text-rose-600">
          Error: {error instanceof Error ? error.message : 'Error desconocido'}
          <button
            type="button"
            onClick={onRetry}
            className="ml-2 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 underline"
          >
            Reintentar
          </button>
        </div>
      ) : !discounts.length ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">No se encontraron descuentos</p>
          <p className="mt-1 text-sm text-slate-500">
            {hasActiveFilters ? 'Intenta ajustar tu búsqueda o filtros.' : 'Aún no hay descuentos de suscripción registrados.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Limpiar filtros
            </button>
          )}
          {canManageDiscounts && !hasActiveFilters && (
            <button
              type="button"
              onClick={onCreate}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Crear primer descuento
            </button>
          )}
        </div>
      ) : (
        <>
          <DiscountsTable
            discounts={discounts}
            canManage={canManageDiscounts}
            onViewDetail={onViewDetail}
            onViewUsageHistory={onViewUsageHistory}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onRevoke={onRevoke}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      )}
    </div>
  );
}
