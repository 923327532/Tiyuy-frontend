/**
 * Consultas y mutaciones de inmobiliarias, extraídas de useAgencies.
 */

import type {
  InmobiliariaWithStats,
  InmobiliariaAgent,
  InmobiliariaDiscount,
  InmobiliariaStatusHistory,
} from '@/core/domain/entities/Admin';
import {
  useDevelopers,
  useDeveloperAgents,
  useDeveloperDiscountCodes,
  useDeveloperStats,
  useDeveloperStatusHistory,
  useChangeDeveloperStatus,
  useCreateDeveloperDiscountCode,
  useApplyDirectDiscount,
  useRemoveAgentFromDeveloper,
  useToggleDeveloperDiscountCodeStatus,
  useDeleteDeveloperDiscountCode,
  useNotifyDeveloper,
  useClearDeveloperStatusHistory,
  useDeleteStatusHistoryEntry,
} from '@/presentation/hooks/admin/useDevelopers';
import type { AgenciesFiltersState } from '@/presentation/components/admin/agencies/types/agencies.types';
import { HISTORY_PAGE_SIZE } from './useAgencies.types';

export interface AgenciesDataInput {
  filters: AgenciesFiltersState;
  currentPage: number;
  pageSize: number;
  selectedAgency: InmobiliariaWithStats | null;
  historyPage: number;
}

export interface AgenciesData {
  agencies: InmobiliariaWithStats[];
  totalElements: number;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  agencyAgents: InmobiliariaAgent[];
  agencyDiscounts: InmobiliariaDiscount[];
  agencyStats: any;
  statusHistory: InmobiliariaStatusHistory[];
  totalHistoryPages: number;
  totalHistoryElements: number;
  changeStatusMutation: ReturnType<typeof useChangeDeveloperStatus>;
  createDiscountMutation: ReturnType<typeof useCreateDeveloperDiscountCode>;
  applyDirectDiscountMutation: ReturnType<typeof useApplyDirectDiscount>;
  removeAgentMutation: ReturnType<typeof useRemoveAgentFromDeveloper>;
  toggleDiscountMutation: ReturnType<typeof useToggleDeveloperDiscountCodeStatus>;
  deleteDiscountMutation: ReturnType<typeof useDeleteDeveloperDiscountCode>;
  notifyDeveloperMutation: ReturnType<typeof useNotifyDeveloper>;
  clearHistoryMutation: ReturnType<typeof useClearDeveloperStatusHistory>;
  deleteHistoryEntryMutation: ReturnType<typeof useDeleteStatusHistoryEntry>;
}

export function useAgenciesData({
  filters,
  currentPage,
  pageSize,
  selectedAgency,
  historyPage,
}: AgenciesDataInput): AgenciesData {
  const { data: developersData, isLoading, error, refetch } = useDevelopers({
    search: filters.searchQuery,
    status: filters.statusFilter || undefined,
    hasActiveSubscription: filters.planFilter ? filters.planFilter === 'ACTIVE' : undefined,
    page: currentPage - 1,
    size: pageSize,
    sort: filters.sortBy,
  });

  const agencies = developersData?.content || [];
  const totalElements = developersData?.totalElements || 0;

  const { data: developerAgents } = useDeveloperAgents(selectedAgency?.id || 0);
  const { data: developerDiscounts } = useDeveloperDiscountCodes(selectedAgency?.id || 0);
  const { data: developerStats } = useDeveloperStats(selectedAgency?.id || 0);
  const { data: statusHistoryData } = useDeveloperStatusHistory(
    selectedAgency?.id || 0,
    historyPage,
    HISTORY_PAGE_SIZE
  );

  const agencyAgents = developerAgents || [];
  const agencyDiscounts = developerDiscounts || [];
  const agencyStats = developerStats;
  const statusHistory = statusHistoryData?.content || [];
  const totalHistoryPages = statusHistoryData?.totalPages || 1;
  const totalHistoryElements = statusHistoryData?.totalElements || 0;

  // Mutaciones
  const changeStatusMutation = useChangeDeveloperStatus();
  const createDiscountMutation = useCreateDeveloperDiscountCode();
  const applyDirectDiscountMutation = useApplyDirectDiscount();
  const removeAgentMutation = useRemoveAgentFromDeveloper();
  const toggleDiscountMutation = useToggleDeveloperDiscountCodeStatus();
  const deleteDiscountMutation = useDeleteDeveloperDiscountCode();
  const notifyDeveloperMutation = useNotifyDeveloper();
  const clearHistoryMutation = useClearDeveloperStatusHistory();
  const deleteHistoryEntryMutation = useDeleteStatusHistoryEntry();

  return {
    agencies,
    totalElements,
    isLoading,
    error,
    refetch,
    agencyAgents,
    agencyDiscounts,
    agencyStats,
    statusHistory,
    totalHistoryPages,
    totalHistoryElements,
    changeStatusMutation,
    createDiscountMutation,
    applyDirectDiscountMutation,
    removeAgentMutation,
    toggleDiscountMutation,
    deleteDiscountMutation,
    notifyDeveloperMutation,
    clearHistoryMutation,
    deleteHistoryEntryMutation,
  };
}
