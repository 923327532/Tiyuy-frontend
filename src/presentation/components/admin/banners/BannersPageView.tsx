'use client';

import { useMemo } from 'react';
import { BannerFormModal } from './components/BannerFormModal';
import { BannersFiltersBar } from './components/BannersFiltersBar';
import { BannersHeader } from './components/BannersHeader';
import { BannersListPanel } from './components/BannersListPanel';
import { BannersStats } from './components/BannersStats';
import { useBannersPage } from './hooks/useBannersPage';
import { getBannerStatus } from './utils/bannerFormat';

const scrollToList = () => {
  document.getElementById('banners-list')?.scrollIntoView({ behavior: 'smooth' });
};

export function BannersPageView() {
  const page = useBannersPage();

  const activeCount = useMemo(
    () => page.banners.filter((banner) => getBannerStatus(banner) === 'active').length,
    [page.banners]
  );

  return (
    <div className="admin-page space-y-3 sm:space-y-4">
      <BannersHeader
        onRefresh={page.refetch}
        onCreate={() => page.setIsCreateOpen(true)}
        isRefreshing={page.isRefreshing}
        activeCount={activeCount}
        totalCount={page.banners.length}
      />

      <BannersStats
        banners={page.banners}
        stats={page.stats}
        loading={page.isLoading}
        onSelectStatus={(status) => {
          page.setStatusFilter(status);
          scrollToList();
        }}
      />

      <div id="banners-list">
        <BannersFiltersBar
          searchQuery={page.searchQuery}
          onSearchChange={page.setSearchQuery}
          placement={page.placementFilter}
          onPlacementChange={page.setPlacementFilter}
          status={page.statusFilter}
          onStatusChange={page.setStatusFilter}
          hasFilter={page.hasFilter}
          onClearFilters={page.handleClearFilters}
          onExport={page.handleExport}
          resultCount={page.filteredBanners.length}
          totalCount={page.banners.length}
        />

        <BannersListPanel
          banners={page.paginatedBanners}
          isLoading={page.isLoading}
          error={page.error}
          hasFilter={page.hasFilter}
          currentPage={page.currentPage}
          pageSize={page.pageSize}
          totalElements={page.totalElements}
          onPageChange={page.setCurrentPage}
          onPageSizeChange={page.setPageSize}
          onEdit={page.setEditingBanner}
          onToggle={(banner) => void page.handleToggle(banner)}
          onDelete={page.handleDelete}
          onClearFilters={page.handleClearFilters}
          onRetry={page.refetch}
          busyId={page.busyId}
        />
      </div>

      <BannerFormModal
        isOpen={page.isCreateOpen}
        onClose={() => page.setIsCreateOpen(false)}
        onSubmit={page.handleCreate}
        isSubmitting={page.isSubmitting}
      />

      <BannerFormModal
        key={page.editingBanner?.id ?? 'edit'}
        isOpen={page.editingBanner !== null}
        banner={page.editingBanner}
        onClose={() => page.setEditingBanner(null)}
        onSubmit={page.handleUpdate}
        isSubmitting={page.isSubmitting}
      />
    </div>
  );
}
