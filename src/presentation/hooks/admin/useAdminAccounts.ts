/**
 * Admin account hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  CreateAdminAccountRequest,
} from '@/core/domain/entities/Admin';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// Admin user management hooks
export const useAdmins = (params: PaginationParams = { page: 0, size: 20 }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'admins', params],
    queryFn: () => adminRepository.getAllAdmins(params),
    staleTime: 60 * 1000,
  });
};

export const useAdminById = (adminId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'admins', adminId],
    queryFn: () => adminRepository.getAdminById(adminId),
    enabled: !!adminId,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateAdminUserRequest) => adminRepository.createAdminUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'admins'] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ adminId, request }: { adminId: number; request: UpdateAdminUserRequest }) =>
      adminRepository.updateAdminUser(adminId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'admins'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'admins', variables.adminId] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (adminId: number) => adminRepository.deleteAdminUser(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'admins'] });
    },
  });
};

export const useToggleAdminStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ adminId, active }: { adminId: number; active: boolean }) =>
      adminRepository.toggleAdminStatus(adminId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'admins'] });
    },
  });
};

// SuperAdmin: Create admin/support account hooks
export const useCreateAdminAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateAdminAccountRequest) => adminRepository.createAdminAccount(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'admins'] });
    },
  });
};

export const useCreateSupportAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateAdminAccountRequest) => adminRepository.createSupportAccount(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'admins'] });
    },
  });
};

