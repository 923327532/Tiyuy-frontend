'use client';

import { PropertyAnalyticsSection } from '@/presentation/components/admin/PropertyAnalytics/PropertyAnalyticsSection';
import { DashboardAttention } from './DashboardAttention';
import { DashboardHeader } from './DashboardHeader';
import { DashboardModerationCard } from './DashboardModerationCard';
import { DashboardPartialNotice } from './DashboardPartialNotice';
import { DashboardPropertiesDonut } from './DashboardPropertiesDonut';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { DashboardRevenueCard } from './DashboardRevenueCard';
import { DashboardSecondaryStats } from './DashboardSecondaryStats';
import { DashboardError, DashboardLoading } from './DashboardStates';
import type { RevenueSeriesPoint } from './dashboardTypes';
import { useAdminDashboard } from './useAdminDashboard';

interface DashboardOverviewProps {
  /** Nombre del usuario para el saludo (opcional). */
  userName?: string;
  /** Historial mensual de ingresos para la gráfica (opcional). */
  revenueSeries?: RevenueSeriesPoint[];
}

export function DashboardOverview({ userName, revenueSeries }: DashboardOverviewProps) {
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

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
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

      <DashboardQuickActions
        pendingProperties={dashboard.stats?.pendingProperties}
        canViewMarketing={dashboard.canViewMarketing}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <DashboardRevenueCard
            finance={dashboard.finance}
            marketing={dashboard.marketing}
            canViewMarketing={dashboard.canViewMarketing}
            financeUnavailable={dashboard.financeUnavailable}
            financeLoading={dashboard.loading.finance}
            series={revenueSeries}
          />

          <div className="grid gap-6 lg:grid-cols-2">
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

          <DashboardSecondaryStats
            stats={dashboard.stats}
            systemStats={dashboard.systemStats}
            systemLoading={dashboard.loading.system}
            systemUnavailable={dashboard.systemUnavailable}
          />
        </div>

        <aside className="min-w-0 space-y-6">
          <DashboardAttention
            items={dashboard.attention}
            overflow={dashboard.attentionOverflow}
            isLoading={false}
          />
          <DashboardRecentActivity
            items={dashboard.activity}
            isLoading={false}
            unreadCount={dashboard.unreadNotifications}
          />
        </aside>
      </div>

      <PropertyAnalyticsSection showRefresh={false} />
    </div>
  );
}