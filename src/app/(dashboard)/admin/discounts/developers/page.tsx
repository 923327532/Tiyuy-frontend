/**
 * Admin Developer Subscription Discounts Page
 * Manage direct subscription discounts for developers (inmobiliarias)
 * Modular architecture with separated concerns
 */

'use client';

import { useMemo } from 'react';
import {
  useDeveloperSubscriptionDiscountsPage,
} from './hooks/useDeveloperSubscriptionDiscounts';
import {
  SummaryCards,
} from './components/summary';
import {
  FiltersBar,
  AdvancedFilters,
} from './components/filters';
import DiscountsPanel from './components/DiscountsPanel';
import {
  DeveloperSubscriptionDiscountFormModal,
  DeveloperSubscriptionDiscountDetailModal,
  DeveloperSubscriptionDiscountUsageHistoryModal,
  DeveloperSubscriptionDiscountStatsModal,
} from './components/modals';

export default function DeveloperSubscriptionDiscountsPage() {
  const {
    // Data
    discounts,
    summary,
    developers,
    isLoading,
    error,
    totalElements,
    totalPages,
    
    // Filters
    filters,
    setFilters,
    sortBy,
    setSortBy,
    showAdvancedFilters,
    setShowAdvancedFilters,
    hasActiveFilters,
    
    // Form
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    editingDiscount,
    setEditingDiscount,
    isFormModalOpen,
    setIsFormModalOpen,
    
    // Modals
    detailDiscount,
    setDetailDiscount,
    usageHistoryDiscount,
    setUsageHistoryDiscount,
    statsDeveloper,
    setStatsDeveloper,
    
    // Notification
    notification,
    setNotification,
    
    // Permissions
    canManageDiscounts,
    
    // Actions
    handleFilterChange,
    handleClearFilters,
    handleSubmitForm,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleViewDetail,
    handleViewUsageHistory,
    handleViewStats,
    handleToggleStatus,
    handleRevokeDiscount,
    handleDeleteDiscount,
    handleExport,
    refetch,
  } = useDeveloperSubscriptionDiscountsPage();

  // Convert ExtendedFilters to DeveloperSubscriptionDiscountFilters for components
  const apiFilters = useMemo(() => ({
    ...filters,
    status: filters.status === 'ALL' ? undefined : filters.status,
    type: filters.type === 'ALL' ? undefined : filters.type,
    applicabilityScope: filters.applicabilityScope === 'ALL' ? undefined : filters.applicabilityScope,
  }), [filters]);

  return (
    <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-2 sm:top-4 right-2 sm:right-4 z-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg text-xs sm:text-sm ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Descuentos de Suscripción - Desarrolladores</h1>
          <p className="text-xs sm:text-sm text-gray-600">Descuentos directos para contratación y renovación de planes de inmobiliarias</p>
        </div>
        {canManageDiscounts && (
          <button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Crear Descuento
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Filters */}
      <FiltersBar
        filters={apiFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onSortChange={setSortBy}
        onExport={handleExport}
        onCreate={handleOpenCreateModal}
        developers={developers}
        hasActiveFilters={hasActiveFilters}
        canManage={canManageDiscounts}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        sortBy={sortBy}
      />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <AdvancedFilters
          filters={apiFilters}
          onFilterChange={handleFilterChange}
          onSortChange={setSortBy}
          onApply={refetch}
          onClose={() => setShowAdvancedFilters(false)}
          sortBy={sortBy}
        />
      )}

      {/* Table Container */}
      <DiscountsPanel
        isLoading={isLoading}
        error={error}
        discounts={discounts}
        hasActiveFilters={hasActiveFilters}
        canManageDiscounts={canManageDiscounts}
        currentPage={filters.page || 0}
        pageSize={filters.size || 20}
        totalPages={totalPages}
        totalElements={totalElements}
        onRetry={refetch}
        onClearFilters={handleClearFilters}
        onCreate={handleOpenCreateModal}
        onViewDetail={handleViewDetail}
        onViewUsageHistory={handleViewUsageHistory}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        onRevoke={handleRevokeDiscount}
        onPageChange={(page: number) => handleFilterChange('page', page)}
        onPageSizeChange={(size: number) => handleFilterChange('size', size)}
      />

      {/* Modals */}
      <DeveloperSubscriptionDiscountFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingDiscount(null); }}
        editingDiscount={editingDiscount}
        onSubmit={handleSubmitForm}
        isPending={false}
      />

      <DeveloperSubscriptionDiscountDetailModal
        isOpen={!!detailDiscount}
        onClose={() => setDetailDiscount(null)}
        discount={detailDiscount}
        onEdit={handleOpenEditModal}
        onViewUsageHistory={handleViewUsageHistory}
        canManage={canManageDiscounts}
      />

      <DeveloperSubscriptionDiscountUsageHistoryModal
        isOpen={!!usageHistoryDiscount}
        onClose={() => setUsageHistoryDiscount(null)}
        discount={usageHistoryDiscount}
      />

      <DeveloperSubscriptionDiscountStatsModal
        isOpen={!!statsDeveloper}
        onClose={() => setStatsDeveloper(null)}
        developer={statsDeveloper}
      />
    </div>
  );
}