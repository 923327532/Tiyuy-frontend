/**
 * User management hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeUserRoleRequest } from '@/core/domain/entities/Admin';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// User management hooks
export const useUsers = (
  role?: string,
  enabled?: boolean,
  keyword?: string,
  params: PaginationParams = { page: 0, size: 20 }
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'users', { role, enabled, keyword, params }],
    queryFn: () => adminRepository.getAllUsers(role, enabled, keyword, params),
    staleTime: 60 * 1000,
  });
};

export const useUserById = (userId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'users', userId],
    queryFn: () => adminRepository.getUserById(userId),
    enabled: !!userId,
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, enabled, reason }: { userId: number; enabled: boolean; reason?: string }) =>
      adminRepository.toggleUserStatus(userId, enabled, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason?: string }) =>
      adminRepository.deleteUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] });
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, request }: { userId: number; request: ChangeUserRoleRequest }) =>
      adminRepository.changeUserRole(userId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] });
    },
  });
};

export const useVerifyUserEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => adminRepository.verifyUserEmail(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] });
    },
  });
};

export const useVerifyUserPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => adminRepository.verifyUserPhone(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] });
    },
  });
};

// ── Usuarios internacionales (sección "Extranjeros") ───────────────────────
export const useInternationalUsers = (params: PaginationParams = { page: 0, size: 20 }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'international', params],
    queryFn: () => adminRepository.getInternationalUsers(params),
    staleTime: 30 * 1000,
  });
};

export const useApproveInternationalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => adminRepository.approveInternationalUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'international'] });
    },
  });
};

export const useRejectInternationalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason?: string }) =>
      adminRepository.rejectInternationalUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'international'] });
    },
  });
};

export const useUserProperties = (userId: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'users', userId, 'properties'],
    queryFn: () => adminRepository.getUserProperties(userId!),
    enabled: !!userId,
  });
};

export const useUserProjects = (userId: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'users', userId, 'projects'],
    queryFn: () => adminRepository.getUserProjects(userId!),
    enabled: !!userId,
  });
};

