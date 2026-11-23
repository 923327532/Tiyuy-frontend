'use client';

import { CampaignsHeader } from './components/header';
import { CampaignsStats } from './components/stats/CampaignsStats';
import { CampaignsOverviewCharts } from './components/stats/CampaignsOverviewCharts';
import { CampaignsFiltersBar } from './components/filters/CampaignsFiltersBar';
import { CampaignsAdvancedFilters } from './components/filters/CampaignsAdvancedFilters';
import { CampaignsListPanel } from './components/CampaignsListPanel';
import { CampaignsModals } from './components/CampaignsModals';
import { useCampaignsPage } from './hooks/useCampaignsPage';
import { CAMPAIGN_STATUS_BY_LABEL, EMPTY_CAMPAIGNS_FILTERS } from './config/campaigns.config';

const scrollToList = () => {
  document.getElementById('campaigns-list')?.scrollIntoView({ behavior: 'smooth' });
};

export function CampaignsPageView() {
  const p = useCampaignsPage();

  const handleStatus = (value: string) => {
    p.setStatusFilter(value);
    scrollToList();
  };

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <CampaignsHeader onRefresh={p.handleRefresh} isRefreshing={p.isLoading} />

      <CampaignsStats
        stats={p.stats}
        loading={p.statsLoading}
        onSelectStatus={handleStatus}
        onShowAll={() => {
          p.handleClearFilters();
          scrollToList();
        }}
      />

      <CampaignsOverviewCharts
        stats={p.stats}
        campaigns={p.campaigns}
        onOpenAllCampaigns={() => {
          p.handleClearFilters();
          scrollToList();
        }}
        onStatusSelect={(label) => handleStatus(CAMPAIGN_STATUS_BY_LABEL[label] || label)}
      />

      <CampaignsFiltersBar
        searchQuery={p.searchQuery}
        onSearchChange={p.setSearchQuery}
        statusFilter={p.statusFilter}
        onStatusChange={p.setStatusFilter}
        hasFilter={p.hasFilter}
        onClearFilters={p.handleClearFilters}
        onToggleFilters={() => p.setShowAdvancedFilters(!p.showAdvancedFilters)}
        onExport={p.handleExport}
        filtersOpen={p.showAdvancedFilters}
      />

      {p.showAdvancedFilters && (
        <CampaignsAdvancedFilters
          filters={p.advanced}
          onChange={p.setAdvancedField}
          onApply={() => p.setShowAdvancedFilters(false)}
          onClear={() => {
            (Object.keys(EMPTY_CAMPAIGNS_FILTERS) as (keyof typeof EMPTY_CAMPAIGNS_FILTERS)[]).forEach(
              (field) => p.setAdvancedField(field, EMPTY_CAMPAIGNS_FILTERS[field])
            );
          }}
          onClose={() => p.setShowAdvancedFilters(false)}
        />
      )}

      <div id="campaigns-list">
        <CampaignsListPanel
          campaigns={p.campaigns}
          isLoading={p.isLoading}
          error={p.error}
          hasFilter={p.hasFilter}
          canModerate={p.canModerate}
          selectedCampaigns={p.selectedCampaigns}
          onSelectionChange={p.setSelectedCampaigns}
          currentPage={p.currentPage}
          pageSize={p.pageSize}
          totalElements={p.totalElements}
          onPageChange={p.setCurrentPage}
          onPageSizeChange={p.setPageSize}
          onViewCampaign={p.handleViewCampaign}
          onAction={p.handleRequestAction}
          onClearFilters={p.handleClearFilters}
          onRetry={p.refetch}
        />
      </div>

      <CampaignsModals
        campaign={p.selectedCampaign}
        isViewOpen={p.isViewModalOpen}
        action={p.action}
        reason={p.reason}
        pending={p.pending}
        resetKey={p.resetKey}
        isNotifyOpen={p.isNotifyOpen}
        isNotifying={p.isNotifying}
        onCloseView={() => p.setIsViewModalOpen(false)}
        onCloseAction={() => p.setAction(null)}
        onCloseNotify={() => p.setIsNotifyOpen(false)}
        onReasonChange={p.setReason}
        onConfirm={p.handleConfirmAction}
        onNotify={p.handleNotify}
        onRequestAction={p.handleDetailAction}
        onRequestNotify={p.handleRequestNotify}
      />
    </div>
  );
}
