/**
 * DashboardOverview - Vista principal del dashboard administrativo
 * Componente refactorizado usando la nueva arquitectura modular
 */
'use client';

import {
  DashboardHeader,
  DashboardKpiStrip,
  DashboardQuickActions,
  DashboardRevenueCard,
  DashboardPropertiesDonut,
  DashboardModerationCard,
  DashboardAgentsPlans,
  DashboardProjectsCard,
  DashboardCampaignFunnel,
  DashboardAttention,
  DashboardRecentActivity,
  DashboardPartialNotice,
  DashboardLoading,
  DashboardError,
} from './components';
import { useAdminDashboard } from './hooks';
import type { DashboardOverviewProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

export function DashboardOverview({ userName }: DashboardOverviewProps) {
  const dashboard = useAdminDashboard();

  if (dashboard.isInitialLoading) {
    return <DashboardLoading />;
  }

  if (dashboard.isError) {
    return (
      <DashboardError
        error={dashboard.error}
        onRetry={dashboard.refetch}
        isRetrying={dashboard.isRefreshing}
      />
    );
  }

  const history = dashboard.financeHistory;
  const revenueSeries = history
    ? history.labels.map((label, index) => ({ label, value: history.revenue[index] ?? 0 }))
    : undefined;

  return (
    <div className="w-full min-w-0 space-y-6 p-3 sm:p-6 lg:p-8">
      <DashboardHeader
        userName={userName}
        generatedAt={dashboard.stats?.generatedAt}
        isRefreshing={dashboard.isRefreshing}
        onRefresh={dashboard.refetch}
      />

      <DashboardPartialNotice
        sections={dashboard.unavailableSections}
        onRetry={dashboard.refetch}
        isRetrying={dashboard.isRefreshing}
      />

      <DashboardKpiStrip
        stats={dashboard.stats}
        marketing={dashboard.marketing}
        canViewMarketing={dashboard.canViewMarketing}
        marketingLoading={dashboard.loading.marketing}
      />

      <DashboardQuickActions
        pendingProperties={dashboard.stats?.pendingProperties}
        canViewMarketing={dashboard.canViewMarketing}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <div className="min-w-0 space-y-6">
          <DashboardRevenueCard
            finance={dashboard.finance}
            marketing={dashboard.marketing}
            canViewMarketing={dashboard.canViewMarketing}
            financeUnavailable={dashboard.financeUnavailable}
            financeLoading={dashboard.loading.finance}
            series={revenueSeries}
            growthPct={dashboard.stats?.revenueGrowthPercent}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardModerationCard
              stats={dashboard.stats}
              expiredFeatured={dashboard.propertyAnalytics?.expiredFeatured}
              propertyUnavailable={dashboard.propertyUnavailable}
            />
            <DashboardPropertiesDonut
              stats={dashboard.stats}
              byStatus={dashboard.propertyAnalytics?.propertiesByStatus}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardAgentsPlans
              stats={dashboard.agentStats}
              loading={dashboard.loading.agents}
              unavailable={dashboard.agentsUnavailable}
            />
            <DashboardProjectsCard
              stats={dashboard.projectStats}
              loading={dashboard.loading.projects}
              unavailable={dashboard.projectsUnavailable}
            />
          </div>

          {dashboard.canViewMarketing && (
            <DashboardCampaignFunnel
              marketing={dashboard.marketing}
              loading={dashboard.loading.marketing}
              unavailable={dashboard.marketingUnavailable}
            />
          )}
        </div>

        <aside className="min-w-0 w-full space-y-6">
          <DashboardAttention
            items={dashboard.attention}
            overflow={dashboard.attentionOverflow}
            isLoading={false}
          />
          <DashboardRecentActivity
            items={dashboard.activity}
            isLoading={false}
          />
        </aside>
      </div>
    </div>
  );
}