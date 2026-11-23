/**
 * Marketing stats and promotion campaign hooks.
 */
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { PromotionCampaignQueryParams } from '@/core/domain/entities/Admin';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

const MARKETING_KEY = [ADMIN_QUERY_KEY, 'marketing'] as const;

/** Refresca listado, métricas y gráficos tras una moderación. */
function invalidateMarketing(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: MARKETING_KEY });
}

// ================== Marketing Module Hooks ==================

export const useMarketingStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...MARKETING_KEY, 'stats'],
    queryFn: () => adminRepository.getMarketingStats(),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });
};

export const usePromotionCampaigns = (params?: PromotionCampaignQueryParams) => {
  return useQuery({
    queryKey: [...MARKETING_KEY, 'campaigns', params],
    queryFn: () => adminRepository.getPromotionCampaigns(params),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const usePromotionCampaignById = (id: number | null) => {
  return useQuery({
    queryKey: [...MARKETING_KEY, 'campaigns', id],
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
    onSuccess: () => invalidateMarketing(queryClient),
  });
};

export const useUpdatePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: import('@/core/domain/entities/Admin').UpdatePromotionCampaignRequest }) =>
      adminRepository.updatePromotionCampaign(id, request),
    onSuccess: () => invalidateMarketing(queryClient),
  });
};

export const useDeletePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.deletePromotionCampaign(id),
    onSuccess: () => invalidateMarketing(queryClient),
  });
};

export const useApprovePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.approvePromotionCampaign(id),
    onSuccess: () => invalidateMarketing(queryClient),
  });
};

export const useRejectPromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminRepository.rejectPromotionCampaign(id, reason),
    onSuccess: () => invalidateMarketing(queryClient),
  });
};

export const useSuspendPromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminRepository.suspendPromotionCampaign(id, reason),
    onSuccess: () => invalidateMarketing(queryClient),
  });
};

export const useReactivatePromotionCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.reactivatePromotionCampaign(id),
    onSuccess: () => invalidateMarketing(queryClient),
  });
};

export const useNotifyCampaignOwner = () => {
  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: import('@/core/domain/entities/Admin').NotifyCampaignOwnerRequest;
    }) => adminRepository.notifyCampaignOwner(id, request),
  });
};
