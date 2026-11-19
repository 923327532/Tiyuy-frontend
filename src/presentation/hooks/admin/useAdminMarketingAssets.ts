/**
 * Banner and festive campaign hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

export const useBanners = (params?: { page?: number; size?: number; location?: string }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'marketing', 'banners', params],
    queryFn: () => adminRepository.getBanners(params),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: import('@/core/domain/entities/Admin').CreateBannerRequest) =>
      adminRepository.createBanner(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'banners'] });
    },
  });
};

/**
 * Hook para crear un banner con subida de imagen (multipart/form-data).
 * La imagen se sube a S3 y el banner se crea con la URL resultante.
 */
export const useCreateBannerWithUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      image,
      title,
      placement,
      displayMode,
      description,
      linkUrl,
      durationDays,
      displayOrder,
    }: {
      image: File;
      title: string;
      placement: string;
      displayMode?: 'SOLO_BANNER' | 'INTEGRATED';
      description?: string;
      linkUrl?: string;
      durationDays?: number;
      displayOrder?: number;
    }) =>
      adminRepository.createBannerWithUpload(
        image,
        title,
        placement,
        displayMode,
        description,
        linkUrl,
        durationDays,
        displayOrder
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'banners'] });
    },
  });
};


export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: Partial<import('@/core/domain/entities/Admin').CreateBannerRequest> }) =>
      adminRepository.updateBanner(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'banners'] });
    },
  });
};

export const useToggleBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.toggleBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'banners'] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'banners'] });
    },
  });
};

export const useFestiveCampaigns = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'marketing', 'festive', params],
    queryFn: () => adminRepository.getFestiveCampaigns(params),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useCreateFestiveCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: import('@/core/domain/entities/Admin').CreateFestiveCampaignRequest) =>
      adminRepository.createFestiveCampaign(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'festive'] });
    },
  });
};

export const useUpdateFestiveCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: Partial<import('@/core/domain/entities/Admin').CreateFestiveCampaignRequest> }) =>
      adminRepository.updateFestiveCampaign(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'festive'] });
    },
  });
};

export const useDeleteFestiveCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.deleteFestiveCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'marketing', 'festive'] });
    },
  });
};

