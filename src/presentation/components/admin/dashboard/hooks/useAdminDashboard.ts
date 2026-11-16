/**
 * useAdminDashboard - Hook principal para el dashboard administrativo
 * Orquesta todas las consultas de datos necesarias para el dashboard
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDashboardStats,
  useDiscountCodes,
  useAgentDashboardStats,
  useFinanceHistory,
  useFinanceStats,
  useMarketingStats,
  useProjectStats,
  usePropertyAnalytics,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { useUnifiedNotifications } from '@/presentation/hooks/useUnifiedNotifications';
import type {
  ActivityItem,
  UnavailableSection,
  UseAdminDashboardReturn,
} from '@/presentation/components/admin/dashboard/types/dashboard.types';
import { buildAttentionItems } from '@/presentation/components/admin/dashboard/utils/attention.utils';

const DISCOUNT_PAGE_SIZE = 50;
const MAX_ACTIVITY_ITEMS = 6;

export function useAdminDashboard(): UseAdminDashboardReturn {
  const queryClient = useQueryClient();
  const { isSuperAdmin, isRegularAdmin } = usePermissions();
  const canViewMarketing = isSuperAdmin || isRegularAdmin;

  const statsQuery = useDashboardStats();
  const financeQuery = useFinanceStats();
  const propertyQuery = usePropertyAnalytics();
  const marketingQuery = useMarketingStats({ enabled: canViewMarketing });
  const discountsQuery = useDiscountCodes({ page: 0, size: DISCOUNT_PAGE_SIZE });
  const financeHistoryQuery = useFinanceHistory('1M');
  const agentsQuery = useAgentDashboardStats();
  const projectStatsQuery = useProjectStats();
  const notifications = useUnifiedNotifications('general');

  // Calcula elementos que requieren atención
  const { attention, attentionOverflow } = useMemo(
    () =>
      buildAttentionItems({
        stats: statsQuery.data,
        property: propertyQuery.data,
        marketing: marketingQuery.data,
        discounts: discountsQuery.data?.content ?? [],
        unreadCount: notifications.unreadCount,
        canViewMarketing,
      }),
    [
      canViewMarketing,
      discountsQuery.data,
      marketingQuery.data,
      notifications.unreadCount,
      propertyQuery.data,
      statsQuery.data,
    ],
  );

  // Actividad reciente
  const activity = useMemo<ActivityItem[]>(() => {
    return [...notifications.notifications]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, MAX_ACTIVITY_ITEMS)
      .map(({ id, title, message, createdAt, read }) => ({
        id,
        title,
        message,
        createdAt,
        read,
      }));
  }, [notifications.notifications]);

  // Funciones de refetch
  const { refetch: refetchStats } = statsQuery;
  const { refetch: refetchFinance } = financeQuery;
  const { refetch: refetchProperty } = propertyQuery;
  const { refetch: refetchMarketing } = marketingQuery;
  const { refetch: refetchDiscounts } = discountsQuery;
  const { refetch: refetchHistory } = financeHistoryQuery;
  const { refetch: refetchAgents } = agentsQuery;
  const { refetch: refetchProjectStats } = projectStatsQuery;

  const refetch = useCallback(async () => {
    const tasks: Promise<unknown>[] = [
      refetchStats(),
      refetchFinance(),
      refetchProperty(),
      refetchDiscounts(),
      refetchHistory(),
      refetchAgents(),
      refetchProjectStats(),
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'general'],
        refetchType: 'active',
      }),
    ];

    if (canViewMarketing) tasks.push(refetchMarketing());

    await Promise.allSettled(tasks);
  }, [
    canViewMarketing,
    queryClient,
    refetchAgents,
    refetchDiscounts,
    refetchHistory,
    refetchProjectStats,
    refetchFinance,
    refetchMarketing,
    refetchProperty,
    refetchStats,
  ]);

  // Estados de carga
  const isInitialLoading = statsQuery.isLoading;

  const isRefreshing =
    statsQuery.isFetching ||
    financeQuery.isFetching ||
    propertyQuery.isFetching ||
    marketingQuery.isFetching ||
    discountsQuery.isFetching ||
    financeHistoryQuery.isFetching ||
    agentsQuery.isFetching ||
    projectStatsQuery.isFetching;

  // Secciones no disponibles
  const unavailableSections = useMemo<UnavailableSection[]>(() => {
    const list: UnavailableSection[] = [];
    if (financeQuery.isError) list.push({ id: 'finance', label: 'Finanzas' });
    if (propertyQuery.isError) list.push({ id: 'property', label: 'Analítica de propiedades' });
    if (canViewMarketing && marketingQuery.isError)
      list.push({ id: 'marketing', label: 'Marketing y leads' });
    if (discountsQuery.isError) list.push({ id: 'discounts', label: 'Descuentos' });
    if (agentsQuery.isError) list.push({ id: 'agents', label: 'Corredores y planes' });
    if (projectStatsQuery.isError) list.push({ id: 'projects', label: 'Estadísticas de proyectos' });
    return list;
  }, [
    agentsQuery.isError,
    projectStatsQuery.isError,
    canViewMarketing,
    discountsQuery.isError,
    financeQuery.isError,
    marketingQuery.isError,
    propertyQuery.isError,
  ]);

  return {
    stats: statsQuery.data,
    finance: financeQuery.data,
    propertyAnalytics: propertyQuery.data,
    marketing: marketingQuery.data,
    financeHistory: financeHistoryQuery.data,
    agentStats: agentsQuery.data,
    projectStats: projectStatsQuery.data,
    canViewMarketing,
    attention,
    attentionOverflow,
    activity,
    isInitialLoading,
    isRefreshing,
    isError: statsQuery.isError,
    error: statsQuery.error,
    loading: {
      finance: financeQuery.isLoading,
      marketing: canViewMarketing && marketingQuery.isLoading,
      agents: agentsQuery.isLoading,
      projects: projectStatsQuery.isLoading,
    },
    financeUnavailable: financeQuery.isError,
    propertyUnavailable: propertyQuery.isError,
    marketingUnavailable: canViewMarketing && marketingQuery.isError,
    agentsUnavailable: agentsQuery.isError,
    projectsUnavailable: projectStatsQuery.isError,
    unavailableSections,
    refetch,
  };
}