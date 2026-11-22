import type { ReactNode } from 'react';
import type { PropertyModerationItem, PropertyStatus } from '@/core/domain/entities/Admin';

export type PropertiesViewMode = 'table' | 'cards';

export type ModerationAction = 'APPROVE' | 'REJECT' | 'SUSPEND';

export interface PropertiesFiltersState {
  searchQuery: string;
  statusFilter: string;
}

export interface PropertyKpis {
  total: number;
  published: number;
  pending: number;
  suspended: number;
  rejected: number;
  reports: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export type PropertyColumnKey = keyof PropertyModerationItem;

export interface PropertyTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  render: (value: unknown, property: PropertyModerationItem) => ReactNode;
}

export const STATUS_TO_ACTION: Record<ModerationAction, PropertyStatus> = {
  APPROVE: 'PUBLISHED',
  REJECT: 'REJECTED',
  SUSPEND: 'SUSPENDED',
};

export interface PropertiesListPanelProps {
  properties: PropertyModerationItem[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;
  filters: PropertiesFiltersState;
  setFilters: (updates: Partial<PropertiesFiltersState>) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  viewMode: PropertiesViewMode;
  setViewMode: (mode: PropertiesViewMode) => void;
  selectedProperties: PropertyModerationItem[];
  setSelectedProperties: (items: PropertyModerationItem[]) => void;
  columns: PropertyTableColumn[];
  canModerate: boolean;
  canFeature: boolean;
  onViewDetail: (property: PropertyModerationItem) => void;
  onModerate: (property: PropertyModerationItem, action: ModerationAction) => void;
  onToggleFeatured: (property: PropertyModerationItem) => void;
  onDisable: (property: PropertyModerationItem) => void;
  onEnable: (property: PropertyModerationItem) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

export interface PropertyActionHandlers {
  onViewDetail: (property: PropertyModerationItem) => void;
  onModerate: (property: PropertyModerationItem, action: ModerationAction) => void;
  onToggleFeatured: (property: PropertyModerationItem) => void;
  onDisable: (property: PropertyModerationItem) => void;
  onEnable: (property: PropertyModerationItem) => void;
}
