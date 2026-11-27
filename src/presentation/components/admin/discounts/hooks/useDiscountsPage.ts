'use client';

import { useEffect, useState } from 'react';

import type { CentralDiscountDto } from '@/core/domain/entities/Admin';
import {
  useCentralDiscounts,
  useCentralDiscountSummary,
} from '@/presentation/hooks/useAdmin';

import {
  EMPTY_DISCOUNT_FILTERS,
  hasDiscountFilters,
  type DiscountFilterState,
  type DiscountTab,
} from '../config/discounts.config';

const SEARCH_DEBOUNCE_MS = 300;

export function useDiscountsPage() {
  const [activeTab, setActiveTabState] = useState<DiscountTab>('applier');
  const [filters, setFiltersState] = useState<DiscountFilterState>(EMPTY_DISCOUNT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // La búsqueda viaja al backend solo después de la pausa, evitando una request por tecla.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFiltersState((prev) => ({ ...prev, searchQuery: searchTerm.trim() }));
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const { data: discountsData, isLoading, error, refetch } = useCentralDiscounts({
    source: filters.sourceFilter !== 'all' ? filters.sourceFilter : undefined,
    status: filters.statusFilter !== 'all' ? filters.statusFilter : undefined,
    search: filters.searchQuery || undefined,
    page: currentPage - 1,
    size: pageSize,
  });
  const { data: summary, isLoading: summaryLoading } = useCentralDiscountSummary();

  const discounts = discountsData?.content ?? [];
  const totalElements = discountsData?.totalElements ?? 0;
  const hasFilter = hasDiscountFilters(filters);

  const setActiveTab = (tab: DiscountTab) => setActiveTabState(tab);

  const setSearchQuery = (value: string) => setSearchTerm(value);

  const setFilter = (field: keyof Omit<DiscountFilterState, 'searchQuery'>, value: string) => {
    setFiltersState((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFiltersState(EMPTY_DISCOUNT_FILTERS);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    activeTab,
    setActiveTab,
    filters,
    setSearchQuery,
    setFilter,
    hasFilter,
    handleClearFilters,
    discounts,
    totalElements,
    isLoading,
    error,
    refetch,
    summary,
    summaryLoading,
    currentPage,
    setCurrentPage,
    pageSize,
    handlePageSizeChange,
  };
}

export type DiscountPageController = ReturnType<typeof useDiscountsPage>;
export type DiscountList = CentralDiscountDto[];
