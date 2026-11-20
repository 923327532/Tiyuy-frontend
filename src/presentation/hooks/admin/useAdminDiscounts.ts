/**
 * Discount hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
} from '@/core/domain/entities/Admin';
import {
  AgentDiscountFilters,
  AssignDiscountToAgentRequest,
  CreateAgentDiscountRequest,
} from '@/core/domain/entities/AgentDiscount';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// Discount code hooks
export const useDiscountCodes = (
  params: PaginationParams = { page: 0, size: 20 },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'discounts', params],
    queryFn: () => adminRepository.getAllDiscountCodes(params),
    staleTime: 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

export const useDiscountCodeById = (codeId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'discounts', codeId],
    queryFn: () => adminRepository.getDiscountCodeById(codeId),
    enabled: !!codeId,
  });
};

// Agent Discount Management hooks
export const useAgentDiscounts = (
  filters: AgentDiscountFilters = {},
  params: PaginationParams = { page: 0, size: 20 }
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agent-discounts', { filters, params }],
    queryFn: () => adminRepository.getAgentDiscounts(filters, params),
    staleTime: 60 * 1000,
  });
};

export const useAgentDiscountSummary = (agentId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agent-discounts', 'summary', agentId],
    queryFn: () => adminRepository.getAgentDiscountSummary(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000,
  });
};

export const useAvailableDiscountsForAgent = (agentId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agent-discounts', 'available', agentId],
    queryFn: () => adminRepository.getAvailableDiscountsForAgent(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000,
  });
};

export const useAssignDiscountToAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AssignDiscountToAgentRequest) =>
      adminRepository.assignDiscountToAgent(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useCreateAgentDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateAgentDiscountRequest) =>
      adminRepository.createAgentDiscount(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useRemoveDiscountFromAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: number) =>
      adminRepository.removeDiscountFromAgent(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useToggleAgentDiscountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (discountId: number) =>
      adminRepository.toggleAgentDiscountStatus(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useCreateDiscountCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateDiscountCodeRequest) => adminRepository.createDiscountCode(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useUpdateDiscountCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ codeId, request }: { codeId: number; request: UpdateDiscountCodeRequest }) =>
      adminRepository.updateDiscountCode(codeId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useDeleteDiscountCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (codeId: number) => adminRepository.deleteDiscountCode(codeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

