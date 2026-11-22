'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminRepository } from '@/infrastructure/repositories/AdminRepository';
import { usePropertiesForModeration } from '@/presentation/hooks/useAdmin';
import { EMPTY_KPIS } from '../config/properties.constants';
import type {
  PropertiesFiltersState,
  PropertiesViewMode,
  PropertyKpis,
} from '../types/properties.types';

export function usePropertiesData() {
  const [filters, setFiltersState] = useState<PropertiesFiltersState>({
    searchQuery: '',
    statusFilter: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<PropertiesViewMode>('table');

  const setFilters = (updates: Partial<PropertiesFiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const status = filters.statusFilter !== 'all' ? filters.statusFilter : undefined;
  const keyword = filters.searchQuery.trim() || undefined;

  const propertiesQuery = usePropertiesForModeration(status, keyword, {
    page: currentPage - 1,
    size: pageSize,
  });

  const statsQuery = useQuery({
    queryKey: ['admin', 'properties', 'moderation-stats'],
    queryFn: () => adminRepository.getPropertyModerationStats(),
    staleTime: 30 * 1000,
  });

  const rawStats = statsQuery.data ?? EMPTY_KPIS;
  const kpis: PropertyKpis = {
    total: Number(rawStats.total ?? 0),
    published: Number(rawStats.published ?? 0),
    pending: Number(rawStats.pending ?? 0),
    suspended: Number(rawStats.suspended ?? 0),
    rejected: Number(rawStats.rejected ?? 0),
    reports: Number(rawStats.reports ?? 0),
  };

  const clearFilters = () => {
    setFiltersState({ searchQuery: '', statusFilter: 'all' });
    setCurrentPage(1);
  };

  return {
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    properties: propertiesQuery.data?.content ?? [],
    totalElements: propertiesQuery.data?.totalElements ?? 0,
    isLoading: propertiesQuery.isLoading,
    error: propertiesQuery.error,
    refetch: () => {
      void propertiesQuery.refetch();
      void statsQuery.refetch();
    },
    kpis,
    clearFilters,
  };
}
