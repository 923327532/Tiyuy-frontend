/**
 * Project moderation hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModerateProjectRequest } from '@/core/domain/entities/Admin';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';
import { NotifyDeveloperRequest } from './useAdminShared';

// Project management hooks
export const useProjectsForAdmin = (
  status?: string,
  keyword?: string,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'projects', status, keyword, pagination],
    queryFn: () => adminRepository.getProjectsForAdmin(status, keyword, pagination),
  });
};

export const useProjectStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'projects', 'stats'],
    queryFn: async () => {
      try {
        const data = await adminRepository.getProjectStats();
        console.log('[useProjectStats] Data received:', data);
        return data;
      } catch (error) {
        console.error('[useProjectStats] Error fetching stats:', error);
        throw error;
      }
    },
  });
};

export const useModerateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, request }: { projectId: number; request: ModerateProjectRequest }) =>
      adminRepository.moderateProject(projectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'projects'] });
    },
  });
};

export const useToggleFeaturedProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, featured }: { projectId: number; featured: boolean }) =>
      adminRepository.toggleFeaturedProject(projectId, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, reason }: { projectId: number; reason?: string }) =>
      adminRepository.deleteProject(projectId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'projects'] });
    },
  });
};

// Project reports and comments hooks
export const useProjectReports = (projectId: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'projects', projectId, 'reports'],
    queryFn: () => adminRepository.getProjectReports(projectId!),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
};

export const useProjectComments = (projectId: number | null) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'projects', projectId, 'comments'],
    queryFn: () => adminRepository.getProjectComments(projectId!),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
};

export const useDeleteProjectComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, commentId }: { projectId: number; commentId: number }) =>
      adminRepository.deleteProjectComment(projectId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'projects', variables.projectId, 'comments'] });
    },
  });
};

export const useNotifyProjectDeveloper = () => {
  return useMutation({
    mutationFn: ({ projectId, request }: { projectId: number; request: NotifyDeveloperRequest }) =>
      adminRepository.notifyProjectDeveloper(projectId, request),
    onSuccess: () => {
      // No need to invalidate queries, just notification sent
    },
  });
};

export const useDisableProjectByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, reason, notifyDeveloper }: { projectId: number; reason?: string; notifyDeveloper?: boolean }) =>
      adminRepository.disableProjectByAdmin(projectId, reason, notifyDeveloper),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'projects'] });
    },
  });
};

export const useEnableProjectByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, reason, notifyDeveloper }: { projectId: number; reason?: string; notifyDeveloper?: boolean }) =>
      adminRepository.enableProjectByAdmin(projectId, reason, notifyDeveloper),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'projects'] });
    },
  });
};

export const useReviewReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, approve, notes }: { reportId: number; approve: boolean; notes?: string }) =>
      adminRepository.reviewReport(reportId, approve, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'projects'] });
    },
  });
};

