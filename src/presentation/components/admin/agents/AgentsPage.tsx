'use client';

import { AgentsStats } from './components/stats/AgentsStats';
import { AgentsListPanel } from './components/list/AgentsListPanel';
import { AgentsHeader } from './components/header/AgentsHeader';
import { AgentsOverviewCharts } from './components/stats/AgentsOverviewCharts';
import { AgentsFiltersBar } from './components/filters/AgentsFiltersBar';
import { AgentsAdvancedFilters } from './components/filters/AgentsAdvancedFilters';
import { AgentsModalsPanel } from './components/modals/AgentsModalsPanel';
import { useAgentsPage } from './hooks/useAgentsPage';
import { AdminActionErrorModal } from '@/presentation/components/admin/shared/action-modal/AdminActionErrorModal';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';
import '@/presentation/components/admin/agents/styles/AgentAdvancedFilters.css';

export function AgentsPage() {
  const a = useAgentsPage();

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <AgentsHeader />

      <AgentsStats
        stats={a.dashboardStats}
        loading={a.statsLoading}
        onSelectStatus={(status) => a.handleFilterChange({ status })}
        onSelectPlan={a.handlePlanSelect}
      />

      <AgentsOverviewCharts
        stats={a.dashboardStats}
        revenueChartData={a.revenueChartData}
        planDistributionData={a.planDistributionData}
        chartPeriod={a.chartPeriod}
        onChartPeriodChange={a.setChartPeriod}
        onPlanSelect={a.handlePlanSelect}
        onOpenPlanDetails={() => a.setIsPlanDetailsModalOpen(true)}
        onOpenFreeAgents={() => a.setIsFreeAgentsModalOpen(true)}
      />

      <AgentsFiltersBar
        searchQuery={a.searchQuery}
        onSearchChange={a.handleSearchChange}
        statusFilter={a.statusFilter}
        verificationFilter={a.verificationFilter}
        planFilter={a.planFilter}
        onFilterChange={a.handleFilterChange}
        hasFilter={a.hasFilter}
        onClearFilters={a.handleClearFilters}
        onToggleFilters={() => a.setShowFilters(!a.showFilters)}
        onExport={a.handleExport}
      />

      {a.showFilters && (
        <AgentsAdvancedFilters
          dateRange={a.dateRange}
          minRevenue={a.minRevenue}
          onDateRangeChange={a.handleDateRangeChange}
          onMinRevenueChange={a.handleMinRevenueChange}
          onApply={() => a.refetch()}
          onClear={a.handleClearFilters}
          onClose={() => a.setShowFilters(false)}
        />
      )}

      <AgentsListPanel
        agents={a.paginatedAgents}
        isLoading={a.isLoading}
        error={a.error?.message}
        hasFilter={a.hasFilter}
        canManage={a.canManageAgents}
        page={a.currentPage}
        pageSize={a.pageSize}
        total={a.filteredAgentsCount}
        onPageChange={a.setCurrentPage}
        onPageSizeChange={(size) => { a.setPageSize(size); a.setCurrentPage(1); }}
        onView={a.handleViewAgent}
        onStats={a.handleViewAgentStats}
        onToggleStatus={a.handleToggleStatus}
        onClearFilters={a.handleClearFilters}
      />

      <AgentsModalsPanel
        selectedAgent={a.selectedAgent}
        isStatsModalOpen={a.isStatsModalOpen}
        isViewModalOpen={a.isViewModalOpen}
        isPlanDetailsModalOpen={a.isPlanDetailsModalOpen}
        isFreeAgentsModalOpen={a.isFreeAgentsModalOpen}
        dashboardStats={a.dashboardStats}
        onCloseStats={() => a.setIsStatsModalOpen(false)}
        onViewDetailsFromStats={() => { a.setIsStatsModalOpen(false); a.setIsViewModalOpen(true); }}
        onCloseDetail={() => a.setIsViewModalOpen(false)}
        onClosePlanDetails={() => a.setIsPlanDetailsModalOpen(false)}
        onCloseFreeAgents={() => a.setIsFreeAgentsModalOpen(false)}
      />

      <AdminActionErrorModal error={a.actionError} onClose={a.clearActionError} />
    </div>
  );
}
