'use client';

import { Plus } from 'lucide-react';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { useAgenciesDiscounts } from './hooks/useAgenciesDiscounts';
import { DiscountsFilters } from './components/DiscountsFilters';
import { DiscountsTable } from './components/DiscountsTable';
import { CreateDiscountModal } from './components/CreateDiscountModal';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';
import '@/presentation/components/admin/users/components/pagination/styles/UsersPagination.css';

export default function AgenciesDiscountsPage() {
  const { hasPermission } = usePermissions();
  const canManageDiscounts = hasPermission('DISCOUNTS_CREATE') || hasPermission('DISCOUNTS_MANAGE');

  const {
    data, isLoading, error,
    filters,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    showFilters, setShowFilters,
    developers,
    isCreateModalOpen, setIsCreateModalOpen,
    newDiscount, setNewDiscount,
    isCreatePending,
    hasFilters,
    handleFilterChange,
    handleClearFilters,
    handleCreateDiscount,
    handleToggleStatus,
    handleDeleteDiscount,
    handleExport,
    fetchData,
  } = useAgenciesDiscounts();

  return (
    <div className="admin-page space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Códigos de Descuento</h1>
          <p className="text-xs sm:text-sm text-gray-600">Gestiona todos los códigos de descuento de inmobiliarias</p>
        </div>
        {canManageDiscounts && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear Descuento
          </button>
        )}
      </div>

      {/* Filters */}
      <DiscountsFilters
        filters={filters}
        developers={developers}
        hasFilters={hasFilters}
        canManageDiscounts={canManageDiscounts}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        onApply={fetchData}
        onCreate={() => setIsCreateModalOpen(true)}
      />

      {/* Table */}
      <DiscountsTable
        isLoading={isLoading}
        error={error}
        data={data}
        hasFilters={hasFilters}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        onClearFilters={handleClearFilters}
        onToggleStatus={handleToggleStatus}
        onDeleteDiscount={handleDeleteDiscount}
      />

      {/* Create Modal */}
      <CreateDiscountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        developers={developers}
        newDiscount={newDiscount}
        setNewDiscount={setNewDiscount}
        isCreatePending={isCreatePending}
        onSubmit={handleCreateDiscount}
      />
    </div>
  );
}
