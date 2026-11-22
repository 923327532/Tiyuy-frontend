/**
 * Custom hook for Developer Subscription Discounts page logic
 */

import { useState, useMemo, useCallback } from 'react';
import {
  useDeveloperSubscriptionDiscounts as useDeveloperSubscriptionDiscountsQuery,
  useDeveloperSubscriptionDiscountSummary,
  useCreateDeveloperSubscriptionDiscount,
  useUpdateDeveloperSubscriptionDiscount,
  useDeleteDeveloperSubscriptionDiscount,
  useRevokeDeveloperSubscriptionDiscount,
  useToggleDeveloperSubscriptionDiscountStatus,
  useDevelopers,
} from '@/presentation/hooks/admin/useDevelopers';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import {
  DeveloperSubscriptionDiscount,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { FormData, ValidationErrors, DEFAULT_FORM_DATA } from '../utils/validation';
import { ExtendedFilters, UseDeveloperSubscriptionDiscountsReturn } from './types';
import { useDiscountActions } from './discountActions';

export function useDeveloperSubscriptionDiscountsPage(): UseDeveloperSubscriptionDiscountsReturn {
  const { hasPermission } = usePermissions();
  const canManageDiscounts = hasPermission('DISCOUNTS_MANAGE') || hasPermission('DISCOUNTS_CREATE');

  // Filters state
  const [filters, setFilters] = useState<ExtendedFilters>({
    search: '',
    status: 'ALL',
    type: 'ALL',
    applicabilityScope: 'ALL',
    dateFrom: '',
    dateTo: '',
    page: 0,
    size: 20,
    sort: 'createdAt,desc',
  });
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [editingDiscount, setEditingDiscount] = useState<DeveloperSubscriptionDiscount | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Detail modals
  const [detailDiscount, setDetailDiscount] = useState<DeveloperSubscriptionDiscount | null>(null);
  const [usageHistoryDiscount, setUsageHistoryDiscount] = useState<DeveloperSubscriptionDiscount | null>(null);
  const [statsDeveloper, setStatsDeveloper] = useState<InmobiliariaWithStats | null>(null);

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch developers
  const { data: developersData } = useDevelopers({ size: 1000 });
  const allDevelopers = useMemo(() => {
    return developersData?.content?.map((d: InmobiliariaWithStats) => ({
      id: d.id,
      name: d.name,
    })) || [];
  }, [developersData]);

  const developers = useMemo(() => allDevelopers, [allDevelopers]);

  // Fetch discounts - convert filters to match API expectations
  const apiFilters = useMemo(() => ({
    ...filters,
    status: filters.status === 'ALL' ? undefined : filters.status,
    type: filters.type === 'ALL' ? undefined : filters.type,
    applicabilityScope: filters.applicabilityScope === 'ALL' ? undefined : filters.applicabilityScope,
  }), [filters]);

  const {
    data: discountsData,
    isLoading,
    error,
    refetch,
  } = useDeveloperSubscriptionDiscountsQuery(apiFilters);

  // Fetch summary
  const { data: summary } = useDeveloperSubscriptionDiscountSummary();

  // Mutations
  const createMutation = useCreateDeveloperSubscriptionDiscount();
  const updateMutation = useUpdateDeveloperSubscriptionDiscount();
  const deleteMutation = useDeleteDeveloperSubscriptionDiscount();
  const revokeMutation = useRevokeDeveloperSubscriptionDiscount();
  const toggleStatusMutation = useToggleDeveloperSubscriptionDiscountStatus();

  const discounts = discountsData?.content || [];
  const totalElements = discountsData?.totalElements || 0;
  const totalPages = discountsData?.totalPages || 0;

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const hasActiveFilters = useMemo(() => Boolean(
    filters.search ||
    (filters.status && filters.status !== 'ALL') ||
    (filters.type && filters.type !== 'ALL') ||
    (filters.applicabilityScope && filters.applicabilityScope !== 'ALL') ||
    filters.dateFrom ||
    filters.dateTo
  ), [filters]);

  const actions = useDiscountActions({
    formData,
    editingDiscount,
    discounts,
    setFilters,
    setSortBy,
    setFormData,
    setFormErrors,
    setEditingDiscount,
    setIsFormModalOpen,
    setDetailDiscount,
    setUsageHistoryDiscount,
    setStatsDeveloper,
    createMutation,
    updateMutation,
    deleteMutation,
    revokeMutation,
    toggleStatusMutation,
    showNotification,
    refetch,
  });

  return {
    // Data
    discounts,
    summary: summary ?? null,
    developers,
    allDevelopers: developersData?.content || [],
    isLoading,
    error,
    totalElements,
    totalPages,

    // Filters
    filters,
    setFilters,
    sortBy,
    setSortBy,
    showAdvancedFilters,
    setShowAdvancedFilters,
    hasActiveFilters,

    // Form
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    editingDiscount,
    setEditingDiscount,
    isFormModalOpen,
    setIsFormModalOpen,

    // Modals
    detailDiscount,
    setDetailDiscount,
    usageHistoryDiscount,
    setUsageHistoryDiscount,
    statsDeveloper,
    setStatsDeveloper,

    // Notification
    notification,
    setNotification,

    // Permissions
    canManageDiscounts,

    // Actions
    ...actions,
    refetch,
  };
}
