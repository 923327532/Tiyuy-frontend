/**
 * Agencies Types - Tipos centralizados para el panel de gestión de inmobiliarias
 */

import type {
  InmobiliariaWithStats,
  InmobiliariaAgent,
  InmobiliariaDiscount,
  InmobiliariaStatusHistory,
} from '@/core/domain/entities/Admin';
import type { LucideIcon } from 'lucide-react';

/** Modo de vista: tabla o tarjetas */
export type ViewMode = 'table' | 'cards';

/** Filtros de búsqueda y filtrado de inmobiliarias */
export interface AgenciesFiltersState {
  searchQuery: string;
  statusFilter: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | '';
  planFilter: string;
  discountFilter: string;
  sortBy: string;
}

/** Opciones de filtro para dropdowns */
export interface FilterOption {
  value: string;
  label: string;
}

/** Props para tarjetas de estadísticas */
export interface AgenciesStatsProps {
  agencies: InmobiliariaWithStats[];
  loading?: boolean;
}

/** Props para barra de búsqueda y filtros */
export interface AgenciesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  planFilter: string;
  onPlanChange: (value: string) => void;
  discountFilter: string;
  onDiscountChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  statusOptions: FilterOption[];
  planOptions: FilterOption[];
  discountOptions: FilterOption[];
  sortOptions: FilterOption[];
}

/** Columna de la tabla de inmobiliarias */
export interface AgencyTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, agency: InmobiliariaWithStats) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

/** Props para la tabla de inmobiliarias */
export interface AgenciesTableProps {
  agencies: InmobiliariaWithStats[];
  columns: AgencyTableColumn[];
  selectedAgencyId?: number;
  recentlyUpdatedAgencyId?: number | null;
  onSelectAgency: (agency: InmobiliariaWithStats) => void;
  onNotifyAgency?: (agency: InmobiliariaWithStats) => void;
  isLoading?: boolean;
}

/** Props para vista de tarjetas */
export interface AgencyCardViewProps {
  agencies: InmobiliariaWithStats[];
  onSelectAgency: (agency: InmobiliariaWithStats) => void;
  onNotifyAgency?: (agency: InmobiliariaWithStats) => void;
  selectedAgencyId?: number;
  recentlyUpdatedAgencyId?: number | null;
}

/** Props para modal de detalle */
export interface AgencyDetailModalProps {
  agency: InmobiliariaWithStats | null;
  agents: InmobiliariaAgent[];
  discounts: InmobiliariaDiscount[];
  stats?: any;
  statusHistory: InmobiliariaStatusHistory[];
  historyPage: number;
  totalHistoryPages: number;
  totalHistoryElements: number;
  onHistoryPageChange: (page: number) => void;
  onClearHistory: () => void;
  onDeleteHistoryEntry: (entryId: number) => void;
  onClose: () => void;
  onActivate: () => void;
  onSuspend: () => void;
  onBlock: () => void;
  onCreateDiscount: () => void;
  onApplyDirectDiscount: () => void;
  onNotify: () => void;
  isChangingStatus?: boolean;
  isLoading?: boolean;
  isFullscreen?: boolean;
}

/** Props para modales de confirmación */
export interface AgencyActionModalProps {
  agency: InmobiliariaWithStats | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: 'danger' | 'warning' | 'primary';
}

/** Estado del modal de detalle */
export interface AgencyDetailModalState {
  activeTab: 'overview' | 'agents' | 'discounts' | 'history';
}

/** Props para pestañas del detalle */
export interface DetailTabProps {
  agency: InmobiliariaWithStats;
  agents: InmobiliariaAgent[];
  discounts: InmobiliariaDiscount[];
  stats?: any;
  statusHistory: InmobiliariaStatusHistory[];
  historyPage: number;
  totalHistoryPages: number;
  totalHistoryElements: number;
  onHistoryPageChange: (page: number) => void;
  onClearHistory: () => void;
  onDeleteHistoryEntry: (entryId: number) => void;
  onActivate: () => void;
  onSuspend: () => void;
  onBlock: () => void;
  onCreateDiscount: () => void;
  onApplyDirectDiscount: () => void;
  onNotify: () => void;
  onViewAgentDetail?: (agent: InmobiliariaAgent) => void;
  isChangingStatus?: boolean;
  loading?: boolean;
}