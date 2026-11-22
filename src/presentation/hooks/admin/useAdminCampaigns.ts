/**
 * Campaign hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from '@/core/domain/entities/Admin';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// Campaign hooks
export const useCampaigns = (params: PaginationParams = { page: 0, size: 20 }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'campaigns', params],
    queryFn: () => adminRepository.getAllCampaigns(params),
    staleTime: 60 * 1000,
  });
};

export const useCampaignById = (campaignId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'campaigns', campaignId],
    queryFn: () => adminRepository.getCampaignById(campaignId),
    enabled: !!campaignId,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCampaignRequest) => adminRepository.createCampaign(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'campaigns'] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ campaignId, request }: { campaignId: number; request: UpdateCampaignRequest }) =>
      adminRepository.updateCampaign(campaignId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'campaigns'] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaignId: number) => adminRepository.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'campaigns'] });
    },
  });
};

