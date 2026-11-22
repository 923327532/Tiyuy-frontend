/**
 * Marketing stats and promotion campaign hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// ================== Marketing Module Hooks ==================

export const useMarketingStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'marketing', 'stats'],
    queryFn: () => adminRepository.getMarketingStats(),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });
};

export const usePromotionCampaigns = (params?: { page?: number; size?: number; status?: string }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns', params],
    queryFn: () => adminRepository.getPromotionCampaigns(params),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const usePromotionCampaignById = (id: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns', id],
    queryFn: () => adminRepository.getPromotionCampaignById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useCreatePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: import('@/core/domain/entities/Admin').CreatePromotionCampaignRequest) =>
      adminRepository.createPromotionCampaign(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns'] });
    },
  });
};

export const useUpdatePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: import('@/core/domain/entities/Admin').UpdatePromotionCampaignRequest }) =>
      adminRepository.updatePromotionCampaign(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns'] });
    },
  });
};

export const useDeletePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.deletePromotionCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns'] });
    },
  });
};

export const useApprovePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.approvePromotionCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns'] });
    },
  });
};

export const useRejectPromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminRepository.rejectPromotionCampaign(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns'] });
    },
  });
};

export const useSuspendPromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminRepository.suspendPromotionCampaign(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns'] });
    },
  });
};

export const useReactivatePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.reactivatePromotionCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'campaigns'] });
    },
  });
};

