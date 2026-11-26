/**
 * Agent management hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY, invalidateAdminDashboard } from './useAdminShared';
import { AgentPlanDiscountRequest } from './useAdminShared';

// Agent management hooks
export const useAgents = (
  role?: string,
  enabled?: boolean,
  keyword?: string,
  params: PaginationParams = { page: 0, size: 20 }
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agents', { role, enabled, keyword, params }],
    queryFn: () => adminRepository.getAgents(role, enabled, keyword, params),
    staleTime: 60 * 1000,
  });
};

export const useAgentById = (agentId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agents', agentId],
    queryFn: () => adminRepository.getAgentById(agentId),
    enabled: !!agentId,
  });
};

export const useToggleAgentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, verified, reason }: { agentId: number; verified: boolean; reason?: string }) =>
      adminRepository.toggleAgentVerification(agentId, verified, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agents'] });
      invalidateAdminDashboard(queryClient);
    },
  });
};

// Agent Dashboard hooks
export const useAgentDashboardStats = (period: string = '30D') => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agents', 'dashboard-stats', period],
    queryFn: () => adminRepository.getAgentDashboardStats(period),
  });
};

export const useAgentList = (params: PaginationParams = { page: 0, size: 20 }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agents', 'list', params],
    queryFn: () => adminRepository.getAgentList(params),
  });
};

// Agent Plan Discount hooks
export const useCreateAgentPlanDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, data }: { agentId: number; data: AgentPlanDiscountRequest }) =>
      adminRepository.createAgentPlanDiscount(agentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agents', 'plan-discounts'] });
    },
  });
};

export const useGetAgentPlanDiscounts = (agentId: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agents', 'plan-discounts', agentId],
    queryFn: () => adminRepository.getAgentPlanDiscounts(agentId!),
    enabled: !!agentId,
  });
};

export const useCalculateAgentPlanPrice = (agentId: number | null, planCode: string) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agents', 'plan-price', agentId, planCode],
    queryFn: () => adminRepository.calculateAgentPlanPrice(agentId!, planCode),
    enabled: !!agentId && !!planCode,
  });
};

