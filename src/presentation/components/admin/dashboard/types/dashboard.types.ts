/**
 * Dashboard types - Tipos centralizados para el dashboard administrativo
 * Separados para evitar dependencias circulares y mejorar la mantenibilidad
 */

import type { LucideIcon } from 'lucide-react';
import type { DashboardStats, MarketingStats, FinanceStats, AgentDashboardStats, ProjectStats } from '@/core/domain/entities/Admin';
import type { PropertyAnalyticsResponse } from '@/core/domain/entities/Admin';

/** Tipos de severidad para elementos que requieren atención */
export type AttentionSeverity = 'critical' | 'warning' | 'info';

/** Elemento que requiere atención administrativa */
export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  count: number;
  severity: AttentionSeverity;
  href: string;
  actionLabel: string;
}

/** Elemento de actividad reciente */
export interface ActivityItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

/** KPI individual para la tira de indicadores */
export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  hint: string;
  href: string;
  icon: LucideIcon;
  unavailable?: boolean;
  loading?: boolean;
  progress?: { value: number; label: string };
  growth?: number;
}

/** Punto de datos para series temporales (gráficos) */
export interface RevenueSeriesPoint {
  label: string;
  value: number;
}

/** Sección no disponible en el dashboard */
export interface UnavailableSection {
  id: 'finance' | 'financeHistory' | 'property' | 'marketing' | 'discounts' | 'agents' | 'projects';
  label: string;
}

/** Estado de carga granular por sección */
export interface DashboardLoadingState {
  finance: boolean;
  marketing: boolean;
  agents: boolean;
  projects: boolean;
  notifications: boolean;
}

/** Props para el header del dashboard */
export interface DashboardHeaderProps {
  userName?: string;
  generatedAt?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

/** Props para el componente principal DashboardOverview */
export interface DashboardOverviewProps {
  userName?: string;
}

/** Props para la tira de KPIs */
export interface DashboardKpiStripProps {
  stats?: DashboardStats;
  finance?: FinanceStats;
  financeUnavailable?: boolean;
  projectStats?: ProjectStats;
  projectsUnavailable?: boolean;
  marketing?: MarketingStats;
  canViewMarketing: boolean;
  marketingLoading?: boolean;
}

/** Props para la tarjeta de ingresos */
export interface DashboardRevenueCardProps {
  finance?: FinanceStats;
  marketing?: MarketingStats;
  canViewMarketing: boolean;
  financeUnavailable: boolean;
  financeLoading?: boolean;
  series?: RevenueSeriesPoint[];
  growthPct?: number;
}

/** Props para el donut de propiedades */
export interface DashboardPropertiesDonutProps {
  stats?: DashboardStats;
  byStatus?: Record<string, number>;
  /** Total autoritativo del endpoint de analítica de propiedades. */
  total?: number;
}

/** Props para la tarjeta de moderación */
export interface DashboardModerationCardProps {
  stats?: DashboardStats;
  expiredFeatured?: number;
  propertyUnavailable: boolean;
}

/** Props para agentes y planes */
export interface DashboardAgentsPlansProps {
  stats?: AgentDashboardStats;
  loading?: boolean;
  unavailable?: boolean;
}

/** Props para proyectos */
export interface DashboardProjectsCardProps {
  stats?: ProjectStats;
  loading?: boolean;
  unavailable?: boolean;
}

/** Props para embudo de campañas */
export interface DashboardCampaignFunnelProps {
  marketing?: MarketingStats;
  loading?: boolean;
  unavailable?: boolean;
}

/** Props para acciones rápidas */
export interface DashboardQuickActionsProps {
  pendingProperties?: number;
  canViewMarketing: boolean;
}

/** Props para atención requerida */
export interface DashboardAttentionProps {
  items: AttentionItem[];
  overflow?: number;
  isLoading: boolean;
}

/** Props para actividad reciente */
export interface DashboardRecentActivityProps {
  items: ActivityItem[];
  isLoading: boolean;
}

/** Props para aviso parcial */
export interface DashboardPartialNoticeProps {
  sections: UnavailableSection[];
  onRetry: () => void;
  isRetrying: boolean;
}

/** Return type del hook useAdminDashboard */
export interface UseAdminDashboardReturn {
  stats: DashboardStats | undefined;
  finance: FinanceStats | undefined;
  financeHistoryUnavailable: boolean;
  propertyAnalytics: PropertyAnalyticsResponse | undefined;
  marketing: MarketingStats | undefined;
  financeHistory: { labels: string[]; revenue: number[] } | undefined;
  agentStats: AgentDashboardStats | undefined;
  projectStats: ProjectStats | undefined;
  canViewMarketing: boolean;
  attention: AttentionItem[];
  attentionOverflow: number;
  activity: ActivityItem[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error: unknown;
  loading: DashboardLoadingState;
  financeUnavailable: boolean;
  propertyUnavailable: boolean;
  marketingUnavailable: boolean;
  agentsUnavailable: boolean;
  projectsUnavailable: boolean;
  unavailableSections: UnavailableSection[];
  refetch: () => Promise<void>;
}