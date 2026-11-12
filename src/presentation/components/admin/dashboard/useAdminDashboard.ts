'use client';

import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDashboardStats,
  useDiscountCodes,
  useFinanceStats,
  useMarketingStats,
  usePropertyAnalytics,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { useSystemStats } from '@/presentation/hooks/useSystemStats';
import { useUnifiedNotifications } from '@/presentation/hooks/useUnifiedNotifications';
import type { ActivityItem, AttentionItem } from './dashboardTypes';
import { daysUntil } from './dashboardUtils';

const EXPIRING_SOON_DAYS = 7;
const DISCOUNT_PAGE_SIZE = 50;
const MAX_ATTENTION_ITEMS = 6;
const MAX_ACTIVITY_ITEMS = 6;
const CRITICAL_PENDING_PROPERTIES = 10;
const LOW_FEATURED_SLOTS_RATIO = 0.1;

const SEVERITY_WEIGHT: Record<AttentionItem['severity'], number> = {
  critical: 3,
  warning: 2,
  info: 1,
};

export interface UnavailableSection {
  id: 'finance' | 'property' | 'system' | 'marketing' | 'discounts';
  label: string;
}

export function useAdminDashboard() {
  const queryClient = useQueryClient();
  const { isSuperAdmin, isRegularAdmin } = usePermissions();
  const canViewMarketing = isSuperAdmin || isRegularAdmin;

  const statsQuery = useDashboardStats();
  const financeQuery = useFinanceStats();
  const propertyQuery = usePropertyAnalytics();
  const systemQuery = useSystemStats();
  const marketingQuery = useMarketingStats({ enabled: canViewMarketing });
  const discountsQuery = useDiscountCodes({ page: 0, size: DISCOUNT_PAGE_SIZE });
  const notifications = useUnifiedNotifications('general');

  // Se calcula la lista completa para poder informar cuántos pendientes
  // quedaron fuera del recorte visual (antes se descartaban en silencio).
  const { attention, attentionOverflow } = useMemo(() => {
    const items: AttentionItem[] = [];
    const stats = statsQuery.data;
    const property = propertyQuery.data;
    const marketing = marketingQuery.data;
    const discounts = discountsQuery.data?.content ?? [];

    if (stats?.pendingProperties && stats.pendingProperties > 0) {
      items.push({
        id: 'pending-properties',
        title: 'Propiedades pendientes de moderación',
        description: `${stats.pendingProperties} publicación(es) esperan revisión para salir al mercado.`,
        count: stats.pendingProperties,
        severity:
          stats.pendingProperties > CRITICAL_PENDING_PROPERTIES ? 'critical' : 'warning',
        href: '/admin/properties',
        actionLabel: 'Revisar',
      });
    }

    if (stats?.pendingReports && stats.pendingReports > 0) {
      items.push({
        id: 'pending-reports',
        title: 'Reportes pendientes',
        description: `${stats.pendingReports} reporte(s) de propiedades requieren revisión.`,
        count: stats.pendingReports,
        severity: 'critical',
        href: '/admin/properties',
        actionLabel: 'Atender',
      });
    }

    if (property?.expiredFeatured && property.expiredFeatured > 0) {
      items.push({
        id: 'expired-featured',
        title: 'Destacados vencidos',
        description: `${property.expiredFeatured} destacado(s) vencido(s) aún ocupan un cupo.`,
        count: property.expiredFeatured,
        severity: 'warning',
        href: '/admin/properties',
        actionLabel: 'Gestionar',
      });
    }

    if (property?.unverified && property.unverified > 0) {
      items.push({
        id: 'unverified-properties',
        title: 'Propiedades sin verificar',
        description: `${property.unverified} propiedad(es) aún no tienen verificación.`,
        count: property.unverified,
        severity: 'info',
        href: '/admin/properties',
        actionLabel: 'Verificar',
      });
    }

    if (property) {
      const capacity =
        property.featured + property.expiredFeatured + property.availableFeaturedSlots;

      if (capacity > 0 && property.availableFeaturedSlots / capacity <= LOW_FEATURED_SLOTS_RATIO) {
        items.push({
          id: 'low-featured-slots',
          title: 'Cupos de destacados casi agotados',
          description: `Quedan ${property.availableFeaturedSlots} de ${capacity} cupos disponibles.`,
          count: property.availableFeaturedSlots,
          severity: 'warning',
          href: '/admin/properties',
          actionLabel: 'Gestionar',
        });
      }
    }

    if (canViewMarketing && marketing?.pendingApproval && marketing.pendingApproval > 0) {
      items.push({
        id: 'pending-campaigns',
        title: 'Campañas por aprobar',
        description: `${marketing.pendingApproval} campaña(s) promocional(es) esperan aprobación.`,
        count: marketing.pendingApproval,
        severity: 'warning',
        href: '/admin/campaigns',
        actionLabel: 'Revisar',
      });
    }

    const activeDiscounts = discounts.filter((d) => d.status === 'ACTIVE');
    const expiringDiscounts = activeDiscounts.filter((d) => {
      const days = daysUntil(d.endDate);
      return days !== null && days >= 0 && days <= EXPIRING_SOON_DAYS;
    }).length;

    if (expiringDiscounts > 0) {
      items.push({
        id: 'expiring-discounts',
        title: 'Descuentos por vencer',
        description: `${expiringDiscounts} código(s) vencen en los próximos ${EXPIRING_SOON_DAYS} días.`,
        count: expiringDiscounts,
        severity: 'warning',
        href: '/admin/discounts',
        actionLabel: 'Revisar',
      });
    }

    const exhaustedDiscounts = discounts.filter((d) => d.status === 'EXHAUSTED').length;

    if (exhaustedDiscounts > 0) {
      items.push({
        id: 'exhausted-discounts',
        title: 'Descuentos agotados',
        description: `${exhaustedDiscounts} código(s) alcanzaron su límite de uso.`,
        count: exhaustedDiscounts,
        severity: 'info',
        href: '/admin/discounts',
        actionLabel: 'Ver códigos',
      });
    }

    if (notifications.unreadCount > 0) {
      items.push({
        id: 'unread-notifications',
        title: 'Notificaciones sin leer',
        description: `${notifications.unreadCount} aviso(s) del sistema siguen pendientes.`,
        count: notifications.unreadCount,
        severity: 'info',
        href: '/admin/notifications',
        actionLabel: 'Abrir',
      });
    }

    // Severidad primero; a igual severidad, el que acumula más trabajo arriba.
    const sorted = items.sort(
      (a, b) =>
        SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity] || b.count - a.count,
    );

    return {
      attention: sorted.slice(0, MAX_ATTENTION_ITEMS),
      attentionOverflow: Math.max(0, sorted.length - MAX_ATTENTION_ITEMS),
    };
  }, [
    canViewMarketing,
    discountsQuery.data,
    marketingQuery.data,
    notifications.unreadCount,
    propertyQuery.data,
    statsQuery.data,
  ]);

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

  const { refetch: refetchStats } = statsQuery;
  const { refetch: refetchFinance } = financeQuery;
  const { refetch: refetchProperty } = propertyQuery;
  const { refetch: refetchSystem } = systemQuery;
  const { refetch: refetchMarketing } = marketingQuery;
  const { refetch: refetchDiscounts } = discountsQuery;

  const refetch = useCallback(async () => {
    const tasks: Promise<unknown>[] = [
      refetchStats(),
      refetchFinance(),
      refetchProperty(),
      refetchSystem(),
      refetchDiscounts(),
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'general'],
        refetchType: 'active',
      }),
    ];

    if (canViewMarketing) tasks.push(refetchMarketing());

    // allSettled: una consulta caída no debe cancelar el refresco de las demás.
    await Promise.allSettled(tasks);
  }, [
    canViewMarketing,
    queryClient,
    refetchDiscounts,
    refetchFinance,
    refetchMarketing,
    refetchProperty,
    refetchStats,
    refetchSystem,
  ]);

  // Solo "stats" bloquea la pantalla completa; el resto carga dentro de cada tarjeta.
  const isInitialLoading = statsQuery.isLoading;

  const isRefreshing =
    statsQuery.isFetching ||
    financeQuery.isFetching ||
    propertyQuery.isFetching ||
    systemQuery.isFetching ||
    marketingQuery.isFetching ||
    discountsQuery.isFetching;

  const unavailableSections = useMemo<UnavailableSection[]>(() => {
    const list: UnavailableSection[] = [];
    if (financeQuery.isError) list.push({ id: 'finance', label: 'Finanzas' });
    if (propertyQuery.isError) list.push({ id: 'property', label: 'Analítica de propiedades' });
    if (systemQuery.isError) list.push({ id: 'system', label: 'Grupos y canales' });
    if (canViewMarketing && marketingQuery.isError)
      list.push({ id: 'marketing', label: 'Marketing y leads' });
    if (discountsQuery.isError) list.push({ id: 'discounts', label: 'Descuentos' });
    return list;
  }, [
    canViewMarketing,
    discountsQuery.isError,
    financeQuery.isError,
    marketingQuery.isError,
    propertyQuery.isError,
    systemQuery.isError,
  ]);

  return {
    stats: statsQuery.data,
    finance: financeQuery.data,
    propertyAnalytics: propertyQuery.data,
    systemStats: systemQuery.data,
    marketing: marketingQuery.data,
    canViewMarketing,
    attention,
    attentionOverflow,
    activity,
    unreadNotifications: notifications.unreadCount,
    isInitialLoading,
    isRefreshing,
    isError: statsQuery.isError,
    error: statsQuery.error,
    loading: {
      finance: financeQuery.isLoading,
      system: systemQuery.isLoading,
      marketing: canViewMarketing && marketingQuery.isLoading,
      discounts: discountsQuery.isLoading,
    },
    financeUnavailable: financeQuery.isError,
    propertyUnavailable: propertyQuery.isError,
    systemUnavailable: systemQuery.isError,
    marketingUnavailable: canViewMarketing && marketingQuery.isError,
    discountsUnavailable: discountsQuery.isError,
    unavailableSections,
    refetch,
  };
}