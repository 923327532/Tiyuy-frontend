/**
 * Property moderation hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ModeratePropertyRequest,
  NotifyOwnerRequest,
} from '@/core/domain/entities/Admin';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// Property moderation hooks
export const usePropertiesForModeration = (
  status?: string,
  keyword?: string,
  params: PaginationParams = { page: 0, size: 20 }
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'properties', { status, keyword, params }],
    queryFn: () => adminRepository.getPropertiesForModeration(status, keyword, params),
    staleTime: 30 * 1000,
  });
};

export const useModerateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, request }: { propertyId: number; request: ModeratePropertyRequest }) =>
      adminRepository.moderateProperty(propertyId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'properties'] });
    },
  });
};

export const useToggleFeaturedProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, featured }: { propertyId: number; featured: boolean }) =>
      adminRepository.toggleFeaturedProperty(propertyId, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'properties'] });
    },
  });
};

// Property reports and comments hooks
export const usePropertyReports = (propertyId: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'properties', propertyId, 'reports'],
    queryFn: () => adminRepository.getPropertyReports(propertyId!),
    enabled: !!propertyId,
    staleTime: 30 * 1000,
  });
};

export const usePropertyComments = (propertyId: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'properties', propertyId, 'comments'],
    queryFn: () => adminRepository.getPropertyComments(propertyId!),
    enabled: !!propertyId,
    staleTime: 30 * 1000,
  });
};

export const useDeletePropertyComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, commentId }: { propertyId: number; commentId: number }) =>
      adminRepository.deletePropertyComment(propertyId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'properties', variables.propertyId, 'comments'] });
    },
  });
};

export const useNotifyPropertyOwner = () => {
  return useMutation({
    mutationFn: ({ propertyId, request }: { propertyId: number; request: NotifyOwnerRequest }) =>
      adminRepository.notifyPropertyOwner(propertyId, request),
    onSuccess: () => {
      // No need to invalidate queries, just notification sent
    },
  });
};

export const useDisablePropertyByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, reason, notifyOwner }: { propertyId: number; reason?: string; notifyOwner?: boolean }) =>
      adminRepository.disablePropertyByAdmin(propertyId, reason, notifyOwner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'properties'] });
    },
  });
};

export const useEnablePropertyByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, reason, notifyOwner }: { propertyId: number; reason?: string; notifyOwner?: boolean }) =>
      adminRepository.enablePropertyByAdmin(propertyId, reason, notifyOwner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'properties'] });
    },
  });
};

