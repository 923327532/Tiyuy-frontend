/**
 * Banner and festive campaign hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/presentation/store/toastStore';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

export interface BannerUploadPayload {
  image?: File | null;
  title: string;
  placement: string;
  displayMode?: 'SOLO_BANNER' | 'INTEGRATED';
  description?: string;
  linkUrl?: string;
  durationDays?: number;
  displayOrder?: number;
}

const BANNERS_KEY = [ADMIN_QUERY_KEY, 'marketing', 'banners'];

const bannerErrorMessage = (error: unknown, fallback: string): string => {
  const response = (error as { response?: { data?: { message?: string } } })?.response;
  return response?.data?.message || fallback;
};

export const useBanners = (params?: { page?: number; size?: number; location?: string }) => {
  return useQuery({
    queryKey: [...BANNERS_KEY, params],
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
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success('Banner creado correctamente');
    },
    onError: (error) => toast.error(bannerErrorMessage(error, 'No se pudo crear el banner')),
  });
};

/**
 * Crear banner subiendo la imagen al backend (la URL se guarda en S3).
 */
export const useCreateBannerWithUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ image, title, placement, displayMode, description, linkUrl, durationDays, displayOrder }: BannerUploadPayload) =>
      adminRepository.createBannerWithUpload(
        image as File,
        title,
        placement,
        displayMode,
        description,
        linkUrl,
        durationDays,
        displayOrder
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success('Banner creado correctamente');
    },
    onError: (error) => toast.error(bannerErrorMessage(error, 'No se pudo crear el banner')),
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: Partial<import('@/core/domain/entities/Admin').CreateBannerRequest> }) =>
      adminRepository.updateBanner(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success('Banner actualizado correctamente');
    },
    onError: (error) => toast.error(bannerErrorMessage(error, 'No se pudo actualizar el banner')),
  });
};

/**
 * Editar banner con reemplazo opcional de imagen (multipart/form-data).
 */
export const useUpdateBannerWithUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, image, title, placement, displayMode, description, linkUrl, durationDays, displayOrder }: { id: number } & BannerUploadPayload) =>
      adminRepository.updateBannerWithUpload(
        id,
        image ?? null,
        title,
        placement,
        displayMode,
        description,
        linkUrl,
        durationDays,
        displayOrder
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success('Banner actualizado correctamente');
    },
    onError: (error) => toast.error(bannerErrorMessage(error, 'No se pudo actualizar el banner')),
  });
};

export const useToggleBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.toggleBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
    },
    onError: (error) => toast.error(bannerErrorMessage(error, 'No se pudo cambiar el estado del banner')),
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRepository.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success('Banner eliminado correctamente');
    },
    onError: (error) => toast.error(bannerErrorMessage(error, 'No se pudo eliminar el banner')),
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

