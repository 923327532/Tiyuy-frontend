import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';
import {
  InmobiliariaWithStats,
  InmobiliariaAgent,
  InmobiliariaDiscount,
  InmobiliariaStatusHistory,
  InmobiliariaFilter,
  CreateInmobiliariaDiscountRequest,
  ApplyDirectDiscountRequest,
} from '@/core/domain/entities/Admin';

const DEVELOPERS_QUERY_KEY = 'developers';

export function useDevelopers(filter?: InmobiliariaFilter) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, filter],
    queryFn: () => adminRepository.getDevelopers(filter),
  });
}

export function useDeveloperDiscountTargets(search: string) {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-targets', normalizedSearch],
    queryFn: () => adminRepository.searchDeveloperDiscountTargets(normalizedSearch),
    enabled: normalizedSearch.length > 0,
  });
}

export function useDeveloperById(id: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'detail', id],
    queryFn: () => adminRepository.getDeveloperById(id),
    enabled: !!id,
  });
}

export function useDeveloperAgents(developerId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'agents', developerId],
    queryFn: () => adminRepository.getDeveloperAgents(developerId),
    enabled: !!developerId,
  });
}

export function useDeveloperDiscountCodes(developerId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', developerId],
    queryFn: () => adminRepository.getDeveloperDiscountCodes(developerId),
    enabled: !!developerId,
  });
}

export function useAvailableDeveloperDiscountCodes() {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', 'available'],
    queryFn: () => adminRepository.getAgentDiscounts(),
  });
}

export function useAgentDiscountCodes(userId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', 'agent', userId],
    queryFn: () => adminRepository.getAgentDiscounts({ agentId: userId }),
    enabled: !!userId,
  });
}

export function useDeveloperStatusHistory(developerId: number, page: number = 0, size: number = 5) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', developerId, page, size],
    queryFn: () => adminRepository.getDeveloperStatusHistory(developerId, page, size),
    enabled: !!developerId,
  });
}

export function useClearDeveloperStatusHistory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (developerId: number) => adminRepository.clearDeveloperStatusHistory(developerId),
    onSuccess: (_, developerId) => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', developerId] });
    },
  });
}

export function useDeleteStatusHistoryEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ developerId, entryId }: { developerId: number; entryId: number }) =>
      adminRepository.deleteStatusHistoryEntry(developerId, entryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId] });
    },
  });
}


export function useDeveloperStats(developerId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'stats', developerId],
    queryFn: () => adminRepository.getDeveloperStats(developerId),
    enabled: !!developerId,
  });
}

export function useChangeDeveloperStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: string; reason?: string; notifyDeveloper?: boolean } }) =>
      adminRepository.changeDeveloperStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.id] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.id, 0] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.id, 1] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.id, 2] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.id, 3] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.id, 4] });
    },
  });
}

export function useAssignAgentToDeveloper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ developerId, data }: { developerId: number; data: { agentId: number; licenseNumber?: string } }) =>
      adminRepository.assignAgentToDeveloper(developerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'agents', variables.developerId] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'stats', variables.developerId] });
    },
  });
}

export function useRemoveAgentFromDeveloper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ developerId, agentId, reason }: { developerId: number; agentId: number; reason?: string }) =>
      adminRepository.removeAgentFromDeveloper(developerId, agentId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'agents', variables.developerId] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'stats', variables.developerId] });
    },
  });
}

export function useCreateDeveloperDiscountCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ developerId, data }: { developerId: number; data: CreateInmobiliariaDiscountRequest }) =>
      adminRepository.createDeveloperDiscountCode(developerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', variables.developerId] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 0] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 1] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 2] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 3] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 4] });
    },
  });
}

export function useToggleDeveloperDiscountCodeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discountId, status }: { discountId: number; status: string }) =>
      adminRepository.toggleDeveloperDiscountCodeStatus(discountId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes'] });
    },
  });
}

export function useDeleteDeveloperDiscountCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountId: number) => adminRepository.deleteDeveloperDiscountCode(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes'] });
    },
  });
}

export function useApplyDirectDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ developerId, data }: { developerId: number; data: ApplyDirectDiscountRequest }) =>
      adminRepository.applyDirectDiscountToDeveloper(developerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'stats', variables.developerId] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', variables.developerId] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 0] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 1] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 2] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 3] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', variables.developerId, 4] });
    },
  });
}

export function useValidateDeveloperDiscountCode() {
  return useMutation({
    mutationFn: ({ code, planCode }: { code: string; planCode: string }) =>
      adminRepository.validateDeveloperDiscountCode(code, planCode),
  });
}

export function useUseDeveloperDiscountCode() {
  return useMutation({
    mutationFn: ({ code, planCode, userId }: { code: string; planCode: string; userId: number }) =>
      adminRepository.useDeveloperDiscountCode(code, planCode, userId),
  });
}

export function useNotifyDeveloper() {
  return useMutation({
    mutationFn: ({ developerId, data }: { developerId: number; data: { subject: string; message: string; sendEmail: boolean; sendInApp: boolean } }) =>
      adminRepository.notifyDeveloper(developerId, data),
  });
}
