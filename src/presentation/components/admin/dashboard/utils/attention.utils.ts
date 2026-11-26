/**
 * attention.utils - Construye los elementos que requieren atención en el dashboard
 * Lógica pura, separada del hook para facilitar su lectura y testing
 */

import type {
  DashboardStats,
  DiscountCode,
  MarketingStats,
  PropertyAnalyticsResponse,
} from '@/core/domain/entities/Admin';
import type { AttentionItem } from '@/presentation/components/admin/dashboard/types/dashboard.types';
import { daysUntil } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';

const EXPIRING_SOON_DAYS = 7;
const MAX_ATTENTION_ITEMS = 6;
const CRITICAL_PENDING_PROPERTIES = 10;
const LOW_FEATURED_SLOTS_RATIO = 0.1;

const SEVERITY_WEIGHT: Record<AttentionItem['severity'], number> = {
  critical: 3,
  warning: 2,
  info: 1,
};

export interface BuildAttentionParams {
  stats?: DashboardStats;
  property?: PropertyAnalyticsResponse;
  marketing?: MarketingStats;
  discounts: DiscountCode[];
  /** true cuando la lista de descuentos está paginada y solo vemos la primera página. */
  discountHasMorePages?: boolean;
  unreadCount: number;
  canViewMarketing: boolean;
}

export interface AttentionResult {
  attention: AttentionItem[];
  attentionOverflow: number;
}

export function buildAttentionItems({
  stats,
  property,
  marketing,
  discounts,
  discountHasMorePages = false,
  unreadCount,
  canViewMarketing,
}: BuildAttentionParams): AttentionResult {
  const items: AttentionItem[] = [];
  const discountCountPrefix = discountHasMorePages ? 'Al menos ' : '';

  if (stats?.pendingProperties && stats.pendingProperties > 0) {
    items.push({
      id: 'pending-properties',
      title: 'Propiedades pendientes de moderación',
      description: `${stats.pendingProperties} publicación(es) esperan revisión para salir al mercado.`,
      count: stats.pendingProperties,
      severity: stats.pendingProperties > CRITICAL_PENDING_PROPERTIES ? 'critical' : 'warning',
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
    const capacity = property.featured + property.expiredFeatured + property.availableFeaturedSlots;

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

  const activeDiscounts = discounts.filter((discount) => discount.status === 'ACTIVE');
  const expiringDiscounts = activeDiscounts.filter((discount) => {
    const days = daysUntil(discount.endDate);
    return days !== null && days >= 0 && days <= EXPIRING_SOON_DAYS;
  }).length;

  if (expiringDiscounts > 0) {
    items.push({
      id: 'expiring-discounts',
      title: 'Descuentos por vencer',
      description: `${discountCountPrefix}${expiringDiscounts} código(s) vencen en los próximos ${EXPIRING_SOON_DAYS} días.`,
      count: expiringDiscounts,
      severity: 'warning',
      href: '/admin/discounts',
      actionLabel: 'Revisar',
    });
  }

  const exhaustedDiscounts = discounts.filter((discount) => discount.status === 'EXHAUSTED').length;

  if (exhaustedDiscounts > 0) {
    items.push({
      id: 'exhausted-discounts',
      title: 'Descuentos agotados',
      description: `${discountCountPrefix}${exhaustedDiscounts} código(s) alcanzaron su límite de uso.`,
      count: exhaustedDiscounts,
      severity: 'info',
      href: '/admin/discounts',
      actionLabel: 'Ver códigos',
    });
  }

  if (unreadCount > 0) {
    items.push({
      id: 'unread-notifications',
      title: 'Notificaciones sin leer',
      description: `${unreadCount} aviso(s) del sistema siguen pendientes.`,
      count: unreadCount,
      severity: 'info',
      href: '/admin/notifications',
      actionLabel: 'Abrir',
    });
  }

  const sorted = items.sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity] || b.count - a.count,
  );

  return {
    attention: sorted.slice(0, MAX_ATTENTION_ITEMS),
    attentionOverflow: Math.max(0, sorted.length - MAX_ATTENTION_ITEMS),
  };
}
