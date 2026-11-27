'use client';

import { useEffect, useState } from 'react';

import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { useCentralDiscounts } from '@/presentation/hooks/useAdmin';

const SEARCH_DEBOUNCE_MS = 300;

export interface RecentActivityFilters {
  searchQuery: string;
  sourceFilter: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_RECENT_ACTIVITY_FILTERS: RecentActivityFilters = {
  searchQuery: '',
  sourceFilter: 'all',
  statusFilter: 'all',
  dateFrom: '',
  dateTo: '',
};

export const hasRecentActivityFilters = (filters: RecentActivityFilters): boolean =>
  filters.searchQuery.trim().length > 0 ||
  filters.sourceFilter !== 'all' ||
  filters.statusFilter !== 'all' ||
  filters.dateFrom.length > 0 ||
  filters.dateTo.length > 0;

/** Filtros con debounce y paginación 1-based, reutilizando el hook de descuentos centrales. */
export function useRecentActivity() {
  const [filters, setFiltersState] = useState<RecentActivityFilters>(EMPTY_RECENT_ACTIVITY_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFiltersState((prev) => ({ ...prev, searchQuery: searchTerm.trim() }));
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error, refetch } = useCentralDiscounts({
    source: filters.sourceFilter !== 'all' ? filters.sourceFilter : undefined,
    status: filters.statusFilter !== 'all' ? filters.statusFilter : undefined,
    search: filters.searchQuery || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    page: currentPage - 1,
    size: pageSize,
  });

  const setFilter = (field: keyof Omit<RecentActivityFilters, 'searchQuery'>, value: string) => {
    setFiltersState((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFiltersState(EMPTY_RECENT_ACTIVITY_FILTERS);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    filters,
    setSearchQuery: setSearchTerm,
    setFilter,
    clearFilters,
    hasFilter: hasRecentActivityFilters(filters),
    viewMode,
    setViewMode,
    discounts: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
    isLoading,
    error,
    refetch,
    currentPage,
    setCurrentPage,
    pageSize,
    handlePageSizeChange,
  };
}

export type RecentActivityController = ReturnType<typeof useRecentActivity>;
