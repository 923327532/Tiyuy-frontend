/**
 * Admin hooks for React Query integration
 * Follows hexagonal architecture - hooks orchestrate use cases
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRepository } from '@/infrastructure/repositories/AdminRepository';
import {
  AdminUser,
  CreateAdminAccountRequest,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  DashboardStats,
  UserStats,
  FinanceStats,
  FinanceHistoryDto,
  UserRegistrationHistory,
  UserListItem,
  ChangeUserRoleRequest,
  DiscountCode,
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignAlert,
  PropertyModerationItem,
  ModeratePropertyRequest,
  AuditLogEntry,
  Department,
  Permission,
  SubscriptionPlan,
  AgencyPlanDiscount,
  UserPropertiesResponse,
  UserProjectsResponse,
  PropertyComment,
  NotifyOwnerRequest,
  AgentDashboardStats,
  AgentListItem,
} from '@/core/domain/entities/Admin';
import { PropertyReport } from '@/core/domain/entities/Moderation';
import {
  AgentDiscount,
  AgentDiscountFilters,
  AgentDiscountSummary,
  AssignDiscountToAgentRequest,
  CreateAgentDiscountRequest,
} from '@/core/domain/entities/AgentDiscount';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';

const adminRepository = new AdminRepository();
const ADMIN_QUERY_KEY = 'admin';

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'stats'],
    queryFn: async () => {
      console.log(' Calling getDashboardStats...');
      try {
        const result = await adminRepository.getDashboardStats();
        console.log(' Dashboard stats received:', result);
        return result;
      } catch (error) {
        console.error(' Error fetching dashboard stats:', error);
        // Retornar datos por defecto en caso de error 500
        return {
          totalUsers: 0,
          activeUsers: 0,
          newUsersToday: 0,
          newUsersThisWeek: 0,
          newUsersThisMonth: 0,
          totalProperties: 0,
          publishedProperties: 0,
          pendingProperties: 0,
          rejectedProperties: 0,
          totalProjects: 0,
          activeProjects: 0,
          totalPayments: 0,
          paymentsToday: 0,
          totalRevenue: 0,
          revenueToday: 0,
          revenueThisWeek: 0,
          revenueThisMonth: 0,
          totalChatMessages: 0,
          totalEvents: 0,
          pendingReports: 0,
          usersByRole: {},
          propertiesByType: {},
          propertiesByStatus: {},
          generatedAt: new Date().toISOString(),
          usersGrowthPercent: 0,
          propertiesGrowthPercent: 0,
          projectsGrowthPercent: 0,
          revenueGrowthPercent: 0
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'userStats'],
    queryFn: async () => {
      try {
        return await adminRepository.getUserStats();
      } catch (error) {
        console.error(' Error fetching user stats:', error);
        return {
          totalUsers: 0,
          activeUsers: 0,
          newUsersToday: 0,
          newUsersThisWeek: 0,
          newUsersThisMonth: 0,
          usersByRole: {},
          usersByStatus: {}
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserRegistrationHistory = (period: string = '1M') => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'registrationHistory', period],
    queryFn: async () => {
      try {
        return await adminRepository.getUserRegistrationHistory(period);
      } catch (error) {
        console.error(' Error fetching registration history:', error);
        return {
          period: period,
          startDate: '',
          endDate: '',
          totalRegistrations: 0,
          dataPoints: []
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFinanceStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'financeStats'],
    queryFn: async () => {
      console.log('Fetching finance stats from backend...');
      try {
        const stats = await adminRepository.getFinanceStats();
        console.log('Finance stats received:', stats);
        return stats;
      } catch (error) {
        console.error(' Error fetching finance stats:', error);
        return {
          totalRevenue: 0,
          revenueToday: 0,
          revenueThisWeek: 0,
          revenueThisMonth: 0,
          totalPayments: 0,
          paymentsToday: 0,
          averageTransactionValue: 0,
          refundsTotal: 0,
          refundsCount: 0,
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          newSubscriptionsToday: 0,
          totalTransactions: 0,
          transactionsToday: 0,
          totalWalletBalance: 0
        };
      }
    },
    staleTime: 0, // No caché - siempre datos frescos
    refetchOnWindowFocus: true, // Refrescar al enfocar ventana
    refetchOnReconnect: true, // Refrescar al reconectar
  });
};

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
    },
  });
};

// Discount code hooks
export const useDiscountCodes = (params: PaginationParams = { page: 0, size: 20 }) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'discounts', params],
    queryFn: () => adminRepository.getAllDiscountCodes(params),
    staleTime: 60 * 1000,
  });
};

export const useDiscountCodeById = (codeId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'discounts', codeId],
    queryFn: () => adminRepository.getDiscountCodeById(codeId),
    enabled: !!codeId,
  });
};

// Agent Discount Management hooks
export const useAgentDiscounts = (
  filters: AgentDiscountFilters = {},
  params: PaginationParams = { page: 0, size: 20 }
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agent-discounts', { filters, params }],
    queryFn: () => adminRepository.getAgentDiscounts(filters, params),
    staleTime: 60 * 1000,
  });
};

export const useAgentDiscountSummary = (agentId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agent-discounts', 'summary', agentId],
    queryFn: () => adminRepository.getAgentDiscountSummary(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000,
  });
};

export const useAvailableDiscountsForAgent = (agentId: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agent-discounts', 'available', agentId],
    queryFn: () => adminRepository.getAvailableDiscountsForAgent(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000,
  });
};

export const useAssignDiscountToAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AssignDiscountToAgentRequest) =>
      adminRepository.assignDiscountToAgent(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useCreateAgentDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateAgentDiscountRequest) =>
      adminRepository.createAgentDiscount(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useRemoveDiscountFromAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: number) =>
      adminRepository.removeDiscountFromAgent(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useToggleAgentDiscountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (discountId: number) =>
      adminRepository.toggleAgentDiscountStatus(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'agent-discounts'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useCreateDiscountCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateDiscountCodeRequest) => adminRepository.createDiscountCode(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useUpdateDiscountCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ codeId, request }: { codeId: number; request: UpdateDiscountCodeRequest }) =>
      adminRepository.updateDiscountCode(codeId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

export const useDeleteDiscountCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (codeId: number) => adminRepository.deleteDiscountCode(codeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'discounts'] });
    },
  });
};

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
  const queryClient = useQueryClient();
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
    mutationFn: ({ projectId, request }: { projectId: number; request: any }) =>
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, request }: { projectId: number; request: any }) =>
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

// Finance and Monetization hooks

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'],
    queryFn: () => adminRepository.getSubscriptionPlans(),
  });
};

export const useActiveSubscriptionPlans = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans', 'active'],
    queryFn: async () => {
      console.log('Fetching active subscription plans...');
      try {
        const plans = await adminRepository.getActiveSubscriptionPlans();
        console.log('Active subscription plans fetched:', plans);
        return plans;
      } catch (error) {
        console.error('Error fetching active subscription plans:', error);
        throw error;
      }
    },
  });
};

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plan: Partial<SubscriptionPlan>) =>
      adminRepository.createSubscriptionPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, plan }: { planId: number; plan: Partial<SubscriptionPlan> }) =>
      adminRepository.updateSubscriptionPlan(planId, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => adminRepository.deleteSubscriptionPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

export const useTogglePlanStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => adminRepository.togglePlanStatus(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

// Agency discount hooks
export const useAgencyPlanDiscounts = (planId?: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'plans', planId, 'agency-discounts'],
    queryFn: () => adminRepository.getAgencyPlanDiscounts(planId!),
    enabled: !!planId,
  });
};

export const useCreateAgencyDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, discount }: { planId: number; discount: Partial<AgencyPlanDiscount> }) =>
      adminRepository.createAgencyDiscount(planId, discount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'plans', variables.planId, 'agency-discounts'] });
    },
  });
};

export const useRemoveAgencyDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (discountId: number) => adminRepository.removeAgencyDiscount(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'plans'] });
    },
  });
};

export const useAdminSubscriptions = (
  status?: string,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'subscriptions', status, pagination],
    queryFn: () => adminRepository.getAdminSubscriptions(status, pagination),
  });
};

export const usePaymentTransactions = (
  status?: string,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'transactions', status, pagination],
    queryFn: () => adminRepository.getPaymentTransactions(status, pagination),
  });
};

export const useRefundTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: number; reason: string }) =>
      adminRepository.refundTransaction(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'finance', 'stats'] });
    },
  });
};

// Agent Dashboard hooks
export const useAgentDashboardStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'agents', 'dashboard-stats'],
    queryFn: () => adminRepository.getAgentDashboardStats(),
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
    mutationFn: ({ agentId, data }: { agentId: number; data: any }) => 
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

export const useFinanceHistory = (period: string = '1M') => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'financeHistory', period],
    queryFn: async () => {
      try {
        return await adminRepository.getFinanceHistory(period);
      } catch (error) {
        console.error('Error fetching finance history:', error);
        return {
          labels: [],
          revenue: [],
          subscriptions: [],
          transactions: [],
          period,
          summary: {
            totalRevenue: 0,
            totalSubscriptions: 0,
            totalTransactions: 0,
            revenueGrowth: 0,
            subscriptionsGrowth: 0,
            transactionsGrowth: 0,
          },
        } as FinanceHistoryDto;
      }
    },
    staleTime: 0, // No caché - datos frescos siempre
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

// ================== Central Discount Management Hooks ==================

export const useCentralDiscounts = (params: {
  source?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'central-discounts', params],
    queryFn: () => adminRepository.getCentralDiscounts(params),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useCentralDiscountSummary = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'central-discounts', 'summary'],
    queryFn: () => adminRepository.getCentralDiscountSummary(),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

// ================== Marketing Module Hooks ==================

export const useMarketingStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'marketing', 'stats'],
    queryFn: () => adminRepository.getMarketingStats(),
    staleTime: 30000,
    refetchOnWindowFocus: true,
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

// ─── Finance Dashboard Hooks ────────────────────────────────────────────────

export const useFinanceDashboard = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'dashboard'],
    queryFn: () => adminRepository.getFinanceDashboard(),
  });
};

export const usePaymentsSummary = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'payments-summary'],
    queryFn: () => adminRepository.getPaymentsSummary(),
  });
};

export const useFailedPaymentsList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'failed-payments'],
    queryFn: () => adminRepository.getFailedPaymentsList(),
  });
};

export const useTopPayersList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'top-payers'],
    queryFn: () => adminRepository.getTopPayersList(),
  });
};

export const usePendingSubscriptionsList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'pending-subscriptions'],
    queryFn: () => adminRepository.getPendingSubscriptionsList(),
  });
};

export const useMonthlyRevenuesList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'monthly-revenues'],
    queryFn: () => adminRepository.getMonthlyRevenuesList(),
  });
};

export const useActiveSubscriptionsList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'active-subscriptions'],
    queryFn: () => adminRepository.getActiveSubscriptionsList(),
  });
};


