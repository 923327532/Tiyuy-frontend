/**
 * Admin Repository Implementation
 * HTTP adapter for admin module backend endpoints
 */

import { axiosClient } from '@/infrastructure/api/axios-client';
import {
  IAdminRepository,
  PaginationParams,
  PaginatedResponse,
} from '@/core/domain/repositories/IAdminRepository';
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
  InternationalUserListItem,
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
  DeveloperAgentAssociation,
  CreateAssociationRequest,
  ReviewAssociationRequest,
  DeveloperSearchFilter,
  DeveloperResponse,
  InmobiliariaWithStats,
  CreateInmobiliariaDiscountRequest,
  ApplyDirectDiscountRequest,
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
  Inmobiliaria,
  InmobiliariaAgent,
  InmobiliariaDiscount,
  InmobiliariaFilter,
  InmobiliariaStatusHistory,
  CreateInmobiliariaRequest,
  UpdateInmobiliariaRequest,
  AssignAgentToInmobiliariaRequest,
  CentralDiscountDto,
  CentralDiscountSummary,
  MarketingStats,
  PromotionCampaign,
  CreatePromotionCampaignRequest,
  UpdatePromotionCampaignRequest,
  Banner,
  CreateBannerRequest,
  FestiveCampaign,
  CreateFestiveCampaignRequest,
  SupportTicket,
  SupportTicketStats,
  CreateSupportTicketRequest,
  UpdateSupportTicketStatusRequest,
} from '@/core/domain/entities/Admin';

import { PropertyReport } from '@/core/domain/entities/Moderation';
import {
  AgentDiscount,
  AgentDiscountFilters,
  AgentDiscountSummary,
  AssignDiscountToAgentRequest,
  CreateAgentDiscountRequest,
} from '@/core/domain/entities/AgentDiscount';

export class AdminRepository implements IAdminRepository {
  private readonly basePath = '/admin';

  // Dashboard & Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    const url = `${this.basePath}/dashboard/stats`;
    console.log(' Making GET request to:', url);
    const response = await axiosClient.get(url);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats/users`);
    return response.data;
  }

  async getFinanceStats(): Promise<FinanceStats> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats/finance`);
    return response.data;
  }

  async getUserRegistrationHistory(period: string = '1M'): Promise<UserRegistrationHistory> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats/registration-history`, {
      params: { period }
    });
    return response.data;
  }

  // Admin User Management
  async getAllAdmins(params: PaginationParams): Promise<PaginatedResponse<AdminUser>> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/admins?${searchParams.toString()}`);
    return response.data;
  }

  async getAdminById(adminId: number): Promise<AdminUser> {
    const response = await axiosClient.get(`${this.basePath}/admins/${adminId}`);
    return response.data;
  }

  async getAdminByUserId(userId: number): Promise<AdminUser> {
    const response = await axiosClient.get(`${this.basePath}/admins/by-user/${userId}`);
    return response.data;
  }

  async createAdminUser(request: CreateAdminUserRequest): Promise<AdminUser> {
    const response = await axiosClient.post(`${this.basePath}/admins`, request);
    return response.data;
  }

  async updateAdminUser(adminId: number, request: UpdateAdminUserRequest): Promise<AdminUser> {
    const response = await axiosClient.put(`${this.basePath}/admins/${adminId}`, request);
    return response.data;
  }

  async deleteAdminUser(adminId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/admins/${adminId}`);
  }

  async toggleAdminStatus(adminId: number, active: boolean): Promise<AdminUser> {
    const response = await axiosClient.patch(`${this.basePath}/admins/${adminId}/status`, { active });
    return response.data;
  }

  // SuperAdmin: Create admin/support accounts (User creation)
  async createAdminAccount(request: CreateAdminAccountRequest): Promise<{ userId: number; email: string }> {
    const response = await axiosClient.post(`${this.basePath}/superadmin/create-admin`, request);
    return response.data;
  }

  async createSupportAccount(request: CreateAdminAccountRequest): Promise<{ userId: number; email: string }> {
    const response = await axiosClient.post(`${this.basePath}/superadmin/create-support`, request);
    return response.data;
  }

  // User Management
  async getAllUsers(
    role?: string,
    enabled?: boolean,
    keyword?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<UserListItem>> {
    const queryParams = new URLSearchParams();
    if (role) queryParams.set('role', role);
    if (enabled !== undefined) queryParams.set('enabled', enabled.toString());
    if (keyword) queryParams.set('keyword', keyword);
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.sort) queryParams.set('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/users?${queryParams.toString()}`);
    return response.data;
  }

  async getUserById(userId: number): Promise<UserListItem> {
    const response = await axiosClient.get(`${this.basePath}/users/${userId}`);
    return response.data;
  }

  // ── Usuarios internacionales (sección "Extranjeros") ─────────────────────
  async getInternationalUsers(
    params?: PaginationParams
  ): Promise<PaginatedResponse<InternationalUserListItem>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.sort) queryParams.set('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/international?${queryParams.toString()}`);
    return response.data;
  }

  async approveInternationalUser(userId: number): Promise<InternationalUserListItem> {
    const response = await axiosClient.put(`${this.basePath}/international/${userId}/approve`);
    return response.data;
  }

  async rejectInternationalUser(userId: number, reason?: string): Promise<InternationalUserListItem> {
    const queryParams = new URLSearchParams();
    if (reason) queryParams.set('reason', reason);
    const response = await axiosClient.put(`${this.basePath}/international/${userId}/reject?${queryParams.toString()}`);
    return response.data;
  }

  async toggleUserStatus(userId: number, enabled: boolean, reason?: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('enabled', enabled.toString());
    if (reason) params.append('reason', reason);
    await axiosClient.put(`${this.basePath}/users/${userId}/status?${params.toString()}`);
  }

  async deleteUser(userId: number, reason?: string): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    await axiosClient.delete(`${this.basePath}/users/${userId}?${params.toString()}`);
  }

  async changeUserRole(userId: number, request: ChangeUserRoleRequest): Promise<void> {
    await axiosClient.put(`${this.basePath}/users/${userId}/role`, request);
  }

  async verifyUserEmail(userId: number): Promise<void> {
    await axiosClient.put(`${this.basePath}/users/${userId}/verify-email`);
  }

  async verifyUserPhone(userId: number): Promise<void> {
    await axiosClient.put(`${this.basePath}/users/${userId}/verify-phone`);
  }

  async getUserProperties(userId: number): Promise<UserPropertiesResponse> {
    const response = await axiosClient.get(`${this.basePath}/users/${userId}/properties`);
    return response.data;
  }

  async getUserProjects(userId: number): Promise<UserProjectsResponse> {
    const response = await axiosClient.get(`${this.basePath}/users/${userId}/projects`);
    return response.data;
  }

  // Discount Codes
  async getAllDiscountCodes(params: PaginationParams): Promise<PaginatedResponse<DiscountCode>> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/discounts?${searchParams.toString()}`);
    return response.data;
  }

  async getDiscountCodeById(codeId: number): Promise<DiscountCode> {
    const response = await axiosClient.get(`${this.basePath}/discounts/${codeId}`);
    return response.data;
  }

  async getDiscountCodeByCode(code: string): Promise<DiscountCode> {
    const response = await axiosClient.get(`${this.basePath}/discounts/by-code/${code}`);
    return response.data;
  }

  async createDiscountCode(request: CreateDiscountCodeRequest): Promise<DiscountCode> {
    const response = await axiosClient.post(`${this.basePath}/discounts`, request);
    return response.data;
  }

  async updateDiscountCode(codeId: number, request: UpdateDiscountCodeRequest): Promise<DiscountCode> {
    const response = await axiosClient.put(`${this.basePath}/discounts/${codeId}`, request);
    return response.data;
  }

  async deleteDiscountCode(codeId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/discounts/${codeId}`);
  }

  async validateDiscountCode(code: string, amount: number): Promise<{ valid: boolean; discount?: number }> {
    const response = await axiosClient.get(`${this.basePath}/discounts/validate`, {
      params: { code, amount },
    });
    return response.data;
  }

  // Campaigns
  async getAllCampaigns(params: PaginationParams): Promise<PaginatedResponse<Campaign>> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/campaigns?${searchParams.toString()}`);
    return response.data;
  }

  async getCampaignById(campaignId: number): Promise<Campaign> {
    const response = await axiosClient.get(`${this.basePath}/campaigns/${campaignId}`);
    return response.data;
  }

  async createCampaign(request: CreateCampaignRequest): Promise<Campaign> {
    const response = await axiosClient.post(`${this.basePath}/campaigns`, request);
    return response.data;
  }

  async updateCampaign(campaignId: number, request: UpdateCampaignRequest): Promise<Campaign> {
    const response = await axiosClient.put(`${this.basePath}/campaigns/${campaignId}`, request);
    return response.data;
  }

  async deleteCampaign(campaignId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/campaigns/${campaignId}`);
  }

  async getCampaignAlerts(): Promise<CampaignAlert[]> {
    const response = await axiosClient.get(`${this.basePath}/campaigns/alerts`);
    return response.data;
  }

  // Property Moderation
  async getPropertiesForModeration(
    status?: string,
    keyword?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<PropertyModerationItem>> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    if (keyword) searchParams.append('keyword', keyword);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await axiosClient.get(`${this.basePath}/properties?${searchParams.toString()}`);
    return response.data;
  }

  async getPropertyForModeration(propertyId: number): Promise<PropertyModerationItem> {
    const response = await axiosClient.get(`${this.basePath}/properties/${propertyId}`);
    return response.data;
  }

  async moderateProperty(propertyId: number, request: ModeratePropertyRequest): Promise<void> {
    await axiosClient.put(`${this.basePath}/properties/${propertyId}/moderate`, request);
  }

  async toggleFeaturedProperty(propertyId: number, featured: boolean): Promise<void> {
    if (featured) {
      await axiosClient.post(`/featured/properties/${propertyId}`);
    } else {
      await axiosClient.delete(`/featured/properties/${propertyId}`);
    }
  }

  async deletePropertyAsAdmin(propertyId: number, reason?: string): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    await axiosClient.delete(`${this.basePath}/properties/${propertyId}?${params.toString()}`);
  }

  async getPropertyReports(propertyId: number): Promise<PropertyReport[]> {
    const response = await axiosClient.get(`${this.basePath}/properties/${propertyId}/reports`);
    return response.data;
  }

  async getPropertyComments(propertyId: number): Promise<PropertyComment[]> {
    const response = await axiosClient.get(`${this.basePath}/properties/${propertyId}/comments`);
    return response.data;
  }

  async deletePropertyComment(propertyId: number, commentId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/properties/${propertyId}/comments/${commentId}`);
  }

  async notifyPropertyOwner(propertyId: number, request: NotifyOwnerRequest): Promise<void> {
    await axiosClient.post(`${this.basePath}/properties/${propertyId}/notify-owner`, request);
  }

  async disablePropertyByAdmin(propertyId: number, reason?: string, notifyOwner: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyOwner', notifyOwner.toString());
    await axiosClient.post(`${this.basePath}/properties/${propertyId}/disable?${params.toString()}`);
  }

  async enablePropertyByAdmin(propertyId: number, reason?: string, notifyOwner: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyOwner', notifyOwner.toString());
    await axiosClient.post(`${this.basePath}/properties/${propertyId}/enable?${params.toString()}`);
  }

  // Agent Management
  async getAgents(
    role?: string,
    enabled?: boolean,
    keyword?: string,
    params: PaginationParams = { page: 0, size: 20 }
  ): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    if (role) searchParams.append('role', role);
    if (enabled !== undefined) searchParams.append('enabled', enabled.toString());
    if (keyword) searchParams.append('keyword', keyword);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    // Use the same endpoint as agencies page but filter by AGENT role
    const response = await axiosClient.get(`${this.basePath}/users?${searchParams.toString()}`);
    return response.data;
  }

  async getAgentById(agentId: number): Promise<any> {
    const response = await axiosClient.get(`${this.basePath}/users/${agentId}`);
    return response.data;
  }

  async toggleAgentVerification(agentId: number, verified: boolean, reason?: string): Promise<void> {
    // This would need to be implemented in backend - for now use user status toggle
    const params = new URLSearchParams();
    params.append('enabled', verified.toString());
    if (reason) params.append('reason', reason);
    await axiosClient.put(`${this.basePath}/users/${agentId}/status?${params.toString()}`);
  }

  // Audit Logs
  async getAuditLogs(
    entityType?: string,
    adminUserId?: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AuditLogEntry>> {
    const searchParams = new URLSearchParams();
    if (entityType) searchParams.append('entityType', entityType);
    if (adminUserId !== undefined) searchParams.append('adminUserId', adminUserId.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/audit-logs?${searchParams.toString()}`);
    return response.data;
  }

  async getAuditLogById(logId: number): Promise<AuditLogEntry> {
    const response = await axiosClient.get(`${this.basePath}/audit-logs/${logId}`);
    return response.data;
  }

  async getAuditLogsByUser(userId: number, params: PaginationParams): Promise<PaginatedResponse<AuditLogEntry>> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/audit-logs/user/${userId}?${searchParams.toString()}`);
    return response.data;
  }

  async getAuditLogsByEntity(entityType: string, entityId: number): Promise<AuditLogEntry[]> {
    const response = await axiosClient.get(`${this.basePath}/audit-logs/entity/${entityType}/${entityId}`);
    return response.data;
  }

  // Departments & Permissions
  async getAllDepartments(): Promise<Department[]> {
    const response = await axiosClient.get(`${this.basePath}/departments`);
    return response.data;
  }

  async getAllPermissions(): Promise<Permission[]> {
    const response = await axiosClient.get(`${this.basePath}/permissions`);
    return response.data;
  }

  // Project Management
  async getProjectsForAdmin(
    status?: string,
    keyword?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    if (keyword) searchParams.append('keyword', keyword);
    if (pagination?.page !== undefined) searchParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) searchParams.append('size', pagination.size.toString());
    if (pagination?.sort) searchParams.append('sort', pagination.sort);

    const response = await axiosClient.get(`${this.basePath}/projects?${searchParams.toString()}`);
    
    // Transform backend format (priceFrom/priceTo) to frontend format (priceRange.min/max)
    const data = response.data;
    if (data.content && Array.isArray(data.content)) {
      data.content = data.content.map((project: any) => ({
        ...project,
        priceRange: {
          min: project.priceFrom || 0,
          max: project.priceTo || 0
        },
        // Add default values for fields that may be missing from backend
        soldUnits: project.soldUnits || 0,
        constructionProgress: project.constructionProgress || 0,
        lifecycleStatus: project.lifecycleStatus || project.status || 'DRAFT',
        city: project.city || project.province || '',
        country: project.country || 'Peru',
        viewsCount: project.viewsCount || 0,
        favoritesCount: project.favoritesCount || 0,
        inquiriesCount: project.inquiriesCount || 0,
        isActive: project.isActive ?? true,
      }));
    }
    
    return data;
  }

  async getProjectStats(): Promise<any> {
    const url = `${this.basePath}/projects/project-stats`;
    console.log('[AdminRepository] Fetching project stats from:', url);
    const response = await axiosClient.get(url);
    console.log('[AdminRepository] Project stats response:', response.data);
    return response.data;
  }

  async moderateProject(projectId: number, request: any): Promise<void> {
    await axiosClient.put(`${this.basePath}/projects/${projectId}/moderate`, request);
  }

  async toggleFeaturedProject(projectId: number, featured: boolean): Promise<void> {
    if (featured) {
      await axiosClient.post(`/featured/projects/${projectId}`);
    } else {
      await axiosClient.delete(`/featured/projects/${projectId}`);
    }
  }

  async deleteProject(projectId: number, reason?: string): Promise<void> {
    const searchParams = reason ? new URLSearchParams({ reason }) : '';
    await axiosClient.delete(`${this.basePath}/projects/${projectId}${searchParams ? `?${searchParams.toString()}` : ''}`);
  }

  async getProjectReports(projectId: number): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/projects/${projectId}/reports`);
    return response.data;
  }

  async getProjectComments(projectId: number): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/projects/${projectId}/comments`);
    return response.data;
  }

  async deleteProjectComment(projectId: number, commentId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/projects/${projectId}/comments/${commentId}`);
  }

  async notifyProjectDeveloper(projectId: number, request: any): Promise<void> {
    await axiosClient.post(`${this.basePath}/projects/${projectId}/notify-developer`, request);
  }

  async disableProjectByAdmin(projectId: number, reason?: string, notifyDeveloper: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyDeveloper', notifyDeveloper.toString());
    await axiosClient.post(`${this.basePath}/projects/${projectId}/disable?${params.toString()}`);
  }

  async getProjectsSalesHistory(): Promise<{ labels: string[]; revenue: number[]; developers: number[]; projects: number[]; planDistribution: Record<string, Record<string, number>> }> {
    const response = await axiosClient.get(`${this.basePath}/projects/sales-history`);
    return response.data;
  }

  async getProjectsByStatus(): Promise<{ labels: string[]; values: number[] }> {
    const response = await axiosClient.get(`${this.basePath}/projects/by-status`);
    return response.data;
  }

  async enableProjectByAdmin(projectId: number, reason?: string, notifyDeveloper: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyDeveloper', notifyDeveloper.toString());
    await axiosClient.post(`${this.basePath}/projects/${projectId}/enable?${params.toString()}`);
  }

  async reviewReport(reportId: number, approve: boolean, notes?: string): Promise<void> {
    await axiosClient.post(`${this.basePath}/reports/${reportId}/review`, {
      approve,
      notes
    });
  }

  // Finance and Monetization
  async getActiveSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const url = `${this.basePath}/subscription-plans/active`;
    const response = await axiosClient.get(url);

    const content = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.content)
        ? response.data.content
        : [];

    return content.map((item: any) => ({
      id: Number(item.id),
      code: String(item.code ?? ''),
      displayName: String(item.displayName ?? item.name ?? ''),
      description: String(item.description ?? ''),
      priceInPen: Number(item.priceInPen ?? 0),
      priceInUsd: Number(item.priceInUsd ?? 0),
      currency: String(item.currency ?? 'PEN'),
      durationDays: Number(item.durationDays ?? 0),
      publicationsLimit: Number(item.publicationsLimit ?? 0),
      projectsLimit: Number(item.projectsLimit ?? 0),
      photosLimit: Number(item.photosLimit ?? 0),
      isActive: Boolean(item.isActive),
      isFeatured: Boolean(item.isFeatured),
      displayOrder: Number(item.displayOrder ?? 0),
      billingCycle: item.billingCycle,
      features: Array.isArray(item.features) ? item.features : [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      agencyDiscountCount: Number(item.agencyDiscountCount ?? 0),
      name: item.name ?? item.code ?? '',
      limits: item.limits
    }));
  }

  async getAdminSubscriptions(
    status?: string,
    pagination?: PaginationParams
  ): Promise<any> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    if (pagination?.page !== undefined) searchParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) searchParams.append('size', pagination.size.toString());
    if (pagination?.sort) searchParams.append('sort', pagination.sort);

    const response = await axiosClient.get(`${this.basePath}/reports/subscriptions/active?${searchParams.toString()}`);
    return response.data;
  }

  async getPaymentTransactions(
    status?: string,
    pagination?: PaginationParams
  ): Promise<any> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    if (pagination?.page !== undefined) searchParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) searchParams.append('size', pagination.size.toString());
    if (pagination?.sort) searchParams.append('sort', pagination.sort);

    const response = await axiosClient.get(`${this.basePath}/reports/dashboard?${searchParams.toString()}`);
    return response.data;
  }

  async getFinanceDashboard(): Promise<any> {
    const response = await axiosClient.get(`${this.basePath}/reports/dashboard`);
    return response.data;
  }

  async getPaymentsSummary(): Promise<any> {
    const response = await axiosClient.get(`${this.basePath}/reports/payments/summary`);
    return response.data;
  }

  async getFailedPaymentsList(): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/reports/payments/failed`);
    return response.data;
  }

  async getTopPayersList(): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/reports/users/top-payers`);
    return response.data;
  }

  async getPendingSubscriptionsList(): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/reports/subscriptions/pending-activation`);
    return response.data;
  }

  async getMonthlyRevenuesList(): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/reports/revenues/monthly`);
    return response.data;
  }

  async getActiveSubscriptionsList(): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/reports/subscriptions/active`);
    return response.data;
  }

  async refundTransaction(transactionId: number, reason: string): Promise<void> {
    await axiosClient.post(`${this.basePath}/reports/subscriptions/${transactionId}/cancel?reason=${encodeURIComponent(reason)}`);
  }

  // Automation
  async triggerManualAutomation(): Promise<string> {
    const response = await axiosClient.post('/subscriptions/purchase/admin/trigger-automation');
    return response.data;
  }

  // Agent Discount Management
  async getAgentDiscounts(
    filters: AgentDiscountFilters = {},
    params: PaginationParams = { page: 0, size: 20 }
  ): Promise<PaginatedResponse<AgentDiscount>> {
    const searchParams = new URLSearchParams();
    if (filters.agentId) searchParams.append('userId', filters.agentId.toString());
    if (filters.status) searchParams.append('status', filters.status.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/discounts/assignments?${searchParams.toString()}`);
    return response.data;
  }

  async getAgentDiscountSummary(agentId: number): Promise<AgentDiscountSummary> {
    const response = await axiosClient.get(`${this.basePath}/discounts/agent/${agentId}/summary`);
    return response.data;
  }

  async assignDiscountToAgent(request: AssignDiscountToAgentRequest): Promise<AgentDiscount> {
    const response = await axiosClient.post(`${this.basePath}/discounts/assignments`, request);
    return response.data;
  }

  async createAgentDiscount(request: CreateAgentDiscountRequest): Promise<AgentDiscount> {
    const response = await axiosClient.post(`${this.basePath}/discounts`, request);
    return response.data;
  }

  async removeDiscountFromAgent(assignmentId: number): Promise<void> {
    const response = await axiosClient.delete(`${this.basePath}/discounts/assignments/${assignmentId}`);
    return response.data;
  }

  async toggleAgentDiscountStatus(assignmentId: number): Promise<AgentDiscount> {
    const response = await axiosClient.put(`${this.basePath}/discounts/assignments/${assignmentId}/toggle`);
    return response.data;
  }

  async getAvailableDiscountsForAgent(agentId: number): Promise<DiscountCode[]> {
    const response = await axiosClient.get(`${this.basePath}/discounts/available?agentId=${agentId}`);
    return response.data;
  }

  // Agent Plan Discount Management - Custom pricing per agent per plan
  async createAgentPlanDiscount(
    agentId: number, 
    data: { 
      planCode: string; 
      discountPercentage: number; 
      customPricePen?: number;
      validFrom?: string;
      validUntil?: string;
      notes?: string;
    }
  ): Promise<any> {
    const response = await axiosClient.post(`${this.basePath}/agents/${agentId}/plan-discounts`, data);
    return response.data;
  }

  async getAgentPlanDiscounts(agentId: number): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/agents/${agentId}/plan-discounts`);
    return response.data;
  }

  async removeAgentPlanDiscount(agentId: number, discountId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/agents/${agentId}/plan-discounts/${discountId}`);
  }

  async calculateAgentPlanPrice(agentId: number, planCode: string): Promise<any> {
    const response = await axiosClient.get(`${this.basePath}/agents/${agentId}/plan-price?planCode=${planCode}`);
    return response.data;
  }

  // Subscription Plan Management
  async createSubscriptionPlan(plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await axiosClient.post(`${this.basePath}/subscription-plans`, plan);
    return response.data;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await axiosClient.get(`${this.basePath}/subscription-plans`);

    const content = Array.isArray(response.data?.content)
      ? response.data.content
      : Array.isArray(response.data)
        ? response.data
        : [];

    return content.map((item: any) => ({
      id: Number(item.id),
      code: String(item.code ?? ''),
      displayName: String(item.displayName ?? item.name ?? ''),
      description: String(item.description ?? ''),
      priceInPen: Number(item.priceInPen ?? 0),
      priceInUsd: Number(item.priceInUsd ?? 0),
      currency: String(item.currency ?? 'PEN'),
      durationDays: Number(item.durationDays ?? 0),
      publicationsLimit: Number(item.publicationsLimit ?? 0),
      projectsLimit: Number(item.projectsLimit ?? 0),
      photosLimit: Number(item.photosLimit ?? 0),
      isActive: Boolean(item.isActive),
      isFeatured: Boolean(item.isFeatured),
      displayOrder: Number(item.displayOrder ?? 0),
      billingCycle: item.billingCycle,
      features: Array.isArray(item.features) ? item.features : [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      agencyDiscountCount: Number(item.agencyDiscountCount ?? 0),
      name: item.name ?? item.code ?? '',
      limits: item.limits
    }));
  }

  async getFinanceHistory(period: string = '1M'): Promise<FinanceHistoryDto> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats/finance/history`, {
      params: { period }
    });
    return response.data;
  }

  async updateSubscriptionPlan(planId: number, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await axiosClient.put(`${this.basePath}/subscription-plans/${planId}`, plan);
    return response.data;
  }

  async deleteSubscriptionPlan(planId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/subscription-plans/${planId}`);
  }

  async togglePlanStatus(planId: number): Promise<SubscriptionPlan> {
    const response = await axiosClient.patch(`${this.basePath}/subscription-plans/${planId}/toggle-status`);
    return response.data;
  }

  // Agency Plan Discounts
  async getAgencyPlanDiscounts(planId: number): Promise<AgencyPlanDiscount[]> {
    const response = await axiosClient.get(`${this.basePath}/subscription-plans/${planId}/agency-discounts`);
    return response.data;
  }

  async createAgencyDiscount(planId: number, discount: Partial<AgencyPlanDiscount>): Promise<AgencyPlanDiscount> {
    const response = await axiosClient.post(`${this.basePath}/subscription-plans/${planId}/agency-discounts`, discount);
    return response.data;
  }

  async removeAgencyDiscount(discountId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/subscription-plans/agency-discounts/${discountId}`);
  }

  // Search by RUC/DNI
  async searchAgencyByRuc(ruc: string): Promise<{id: number, name: string, ruc: string, type: string, found: boolean}> {
    const response = await axiosClient.get(`${this.basePath}/subscription-plans/search/agency?ruc=${ruc}`);
    return response.data;
  }

  async searchAgentByDni(dni: string): Promise<{id: number, name: string, dni: string, type: string, found: boolean}> {
    const response = await axiosClient.get(`${this.basePath}/subscription-plans/search/agent?dni=${dni}`);
    return response.data;
  }

  // Agent Dashboard
  async getAgentDashboardStats(): Promise<AgentDashboardStats> {
    const response = await axiosClient.get(`${this.basePath}/agents/dashboard-stats`);
    return response.data;
  }

  async getAgentList(params: PaginationParams): Promise<PaginatedResponse<AgentListItem>> {
    const response = await axiosClient.get(`${this.basePath}/agents`, { params });
    return response.data;
  }

  // ============================================
  // DEVELOPER / INMOBILIARIA MANAGEMENT
  // ============================================

  async getDevelopers(filter?: InmobiliariaFilter): Promise<PaginatedResponse<InmobiliariaWithStats>> {
    const searchParams = new URLSearchParams();
    if (filter?.search) searchParams.append('search', filter.search);
    if (filter?.status) searchParams.append('status', filter.status);
    if (filter?.page !== undefined) searchParams.append('page', filter.page.toString());
    if (filter?.size !== undefined) searchParams.append('size', filter.size.toString());

    const response = await axiosClient.get(`${this.basePath}/developers?${searchParams.toString()}`);
    return response.data;
  }

  async getDeveloperById(id: number): Promise<InmobiliariaWithStats> {
    const response = await axiosClient.get(`${this.basePath}/developers/${id}`);
    return response.data;
  }

  async changeDeveloperStatus(id: number, data: { status: string; reason?: string; notifyDeveloper?: boolean }): Promise<void> {
    console.log('[DEBUG AdminRepository] changeDeveloperStatus llamado:', { id, data });
    console.log('[DEBUG AdminRepository] URL:', `${this.basePath}/developers/${id}/status`);
    try {
      const response = await axiosClient.put(`${this.basePath}/developers/${id}/status`, data);
      console.log('[DEBUG AdminRepository] Respuesta exitosa:', response.status);
    } catch (error) {
      console.error('[DEBUG AdminRepository] Error en petición:', error);
      throw error;
    }
  }

  async getDeveloperStatusHistory(
    id: number,
    page: number = 0,
    size: number = 10
  ): Promise<{ content: InmobiliariaStatusHistory[]; totalElements: number; totalPages: number; number: number }> {
    const response = await axiosClient.get(
      `${this.basePath}/developers/${id}/status-history?page=${page}&size=${size}&sort=createdAt,desc`
    );
    return response.data;
  }

  async clearDeveloperStatusHistory(id: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${id}/status-history/clear`);
  }

  async deleteStatusHistoryEntry(developerId: number, entryId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${developerId}/status-history/${entryId}`);
  }

  async addDeveloperStatusHistory(developerId: number, data: {
    previousStatus?: string;
    newStatus: string;
    reason?: string;
    changedBy?: string;
  }): Promise<InmobiliariaStatusHistory> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/status-history`, data);
    return response.data;
  }

  async getDeveloperAgents(id: number): Promise<InmobiliariaAgent[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${id}/agents`);
    return response.data;
  }

  async assignAgentToDeveloper(developerId: number, data: { agentId: number; licenseNumber?: string }): Promise<InmobiliariaAgent> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/agents`, data);
    return response.data;
  }

  async removeAgentFromDeveloper(developerId: number, agentId: number, reason?: string): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${developerId}/agents/${agentId}`, {
      params: { reason }
    });
  }

  async getDeveloperDiscountCodes(developerId: number): Promise<InmobiliariaDiscount[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/discount-codes`);
    return response.data;
  }

  async createDeveloperDiscountCode(developerId: number, data: CreateInmobiliariaDiscountRequest): Promise<InmobiliariaDiscount> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/discount-codes`, data);
    return response.data;
  }

  async toggleDeveloperDiscountCodeStatus(discountId: number, status: string): Promise<void> {
    await axiosClient.patch(`${this.basePath}/developers/discount-codes/${discountId}/status?status=${status}`);
  }

  async deleteDeveloperDiscountCode(discountId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/discount-codes/${discountId}`);
  }

  async applyDirectDiscountToDeveloper(developerId: number, data: ApplyDirectDiscountRequest): Promise<{ discountId: number; appliedCount: number; failedCount: number }> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/apply-discount`, data);
    return response.data;
  }

  async notifyDeveloper(developerId: number, data: { subject: string; message: string; sendEmail: boolean; sendInApp: boolean }): Promise<void> {
    await axiosClient.post(`${this.basePath}/developers/${developerId}/notify`, data);
  }

  async getDeveloperStats(developerId: number): Promise<{
    developerId: number;
    totalAgents: number;
    activeAgents: number;
    verifiedAgents: number;
    inactiveAgents: number;
    totalDiscountCodes: number;
    hasActiveDirectDiscount: boolean;
  }> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/stats`);
    return response.data;
  }

  // Public endpoints for agents using discount codes
  async validateDeveloperDiscountCode(code: string, planCode: string): Promise<{
    valid: boolean;
    code: string;
    discountPercentage?: number;
    originalPrice?: number;
    discountedPrice?: number;
    message: string;
  }> {
    const response = await axiosClient.post(`${this.basePath}/developers/validate-discount`, {
      code,
      planCode
    });
    return response.data;
  }

  async useDeveloperDiscountCode(code: string, planCode: string, userId: number): Promise<{
    valid: boolean;
    code: string;
    discountPercentage?: number;
    originalPrice?: number;
    discountedPrice?: number;
    message: string;
  }> {
    const response = await axiosClient.post(`${this.basePath}/developers/use-discount`, {
      code,
      planCode,
      userId
    });
    return response.data;
  }

  // Developer-Agent Association endpoints
  async getMyDeveloperAssociation(): Promise<DeveloperAgentAssociation | null> {
    try {
      const response = await axiosClient.get(`${this.basePath}/developers/agents/me/developer-association`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async requestDeveloperAssociation(data: CreateAssociationRequest): Promise<DeveloperAgentAssociation> {
    const response = await axiosClient.post(`${this.basePath}/developers/agents/me/developer-association-requests`, data);
    return response.data;
  }

  async cancelDeveloperAssociationRequest(requestId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/agents/me/developer-association-requests/${requestId}`);
  }

  async searchDevelopers(params: DeveloperSearchFilter): Promise<PaginatedResponse<DeveloperResponse>> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.city) searchParams.append('city', params.city);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const url = `${this.basePath}/developers/search?${searchParams.toString()}`;
    console.log('AdminRepository.searchDevelopers - URL:', url);
    console.log('AdminRepository.searchDevelopers - params:', params);

    const response = await axiosClient.get(url);
    console.log('AdminRepository.searchDevelopers - response:', response.data);
    return response.data;
  }

  async getDeveloperAssociationRequests(developerId: number): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/association-requests`);
    return response.data;
  }

  async getDeveloperAssociationRequestsPaginated(developerId: number, status: string | null = null, page: number = 0, size: number = 6): Promise<PaginatedResponse<DeveloperAgentAssociation>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/association-requests/paginated?${params.toString()}`);
    return response.data;
  }

  async getDeveloperAgentAssociationsPaginated(developerId: number, status: string | null = null, page: number = 0, size: number = 6): Promise<PaginatedResponse<DeveloperAgentAssociation>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/associations/paginated?${params.toString()}`);
    return response.data;
  }

  async getAllPendingAssociationRequests(): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/association-requests/admin/all-pending`);
    return response.data;
  }

  async getAllAssociationRequests(status: string | null = null, page: number = 0, size: number = 10): Promise<PaginatedResponse<DeveloperAgentAssociation>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await axiosClient.get(`${this.basePath}/developers/association-requests/admin/all?${params.toString()}`);
    return response.data;
  }

  async approveDeveloperAssociation(associationId: number, data: ReviewAssociationRequest): Promise<void> {
    await axiosClient.post(`${this.basePath}/developers/association-requests/${associationId}/approve`, data);
  }

  async rejectDeveloperAssociation(associationId: number, data: ReviewAssociationRequest): Promise<void> {
    await axiosClient.post(`${this.basePath}/developers/association-requests/${associationId}/reject`, data);
  }

  async getDeveloperAgentAssociations(developerId: number): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/associations`);
    return response.data;
  }

  async removeDeveloperAgent(developerId: number, agentId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${developerId}/agents/${agentId}`);
  }

  async getAdminDeveloperAgents(developerId: number): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/admin/developers/${developerId}/agents`);
    return response.data;
  }

  async addAdminDeveloperAgent(developerId: number, agentId: number): Promise<DeveloperAgentAssociation> {
    const response = await axiosClient.post(`${this.basePath}/admin/developers/${developerId}/agents`, { agentId });
    return response.data;
  }

  // ================== Central Discount Management ==================

  async getCentralDiscounts(params: {
    source?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<CentralDiscountDto>> {
    const response = await axiosClient.get('/admin/central-discounts', { params });
    return response.data;
  }

  async getCentralDiscountSummary(): Promise<CentralDiscountSummary> {
    const response = await axiosClient.get('/admin/central-discounts/summary');
    return response.data;
  }

  // ================== Marketing Module ==================

  async getMarketingStats(): Promise<MarketingStats> {
    const response = await axiosClient.get('/v1/admin/marketing/stats');
    return response.data;
  }

  async getPromotionCampaigns(params?: { page?: number; size?: number; status?: string }): Promise<PaginatedResponse<PromotionCampaign>> {
    const response = await axiosClient.get('/v1/admin/marketing/campaigns', { params });
    return response.data;
  }

  async getPromotionCampaignById(id: number): Promise<PromotionCampaign> {
    const response = await axiosClient.get(`/v1/admin/marketing/campaigns/${id}`);
    return response.data;
  }

  async createPromotionCampaign(request: CreatePromotionCampaignRequest): Promise<PromotionCampaign> {
    const response = await axiosClient.post('/v1/admin/marketing/campaigns', request);
    return response.data;
  }

  async updatePromotionCampaign(id: number, request: UpdatePromotionCampaignRequest): Promise<PromotionCampaign> {
    const response = await axiosClient.put(`/v1/admin/marketing/campaigns/${id}`, request);
    return response.data;
  }

  async deletePromotionCampaign(id: number): Promise<void> {
    await axiosClient.delete(`/v1/admin/marketing/campaigns/${id}`);
  }

  async approvePromotionCampaign(id: number): Promise<void> {
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/approve`);
  }

  async rejectPromotionCampaign(id: number, reason?: string): Promise<void> {
    const params = reason ? { reason } : {};
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/reject`, null, { params });
  }

  async suspendPromotionCampaign(id: number, reason?: string): Promise<void> {
    const params = reason ? { reason } : {};
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/suspend`, null, { params });
  }

  async reactivatePromotionCampaign(id: number): Promise<void> {
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/reactivate`);
  }

  async getBanners(params?: { page?: number; size?: number; location?: string }): Promise<Banner[]> {
    const response = await axiosClient.get('/v1/admin/marketing/banners');
    return response.data;
  }

  async createBanner(request: CreateBannerRequest): Promise<Banner> {
    const response = await axiosClient.post('/v1/admin/marketing/banners', request);
    return response.data;
  }

  /**
   * Create a banner with image upload (multipart/form-data).
   * The image is uploaded to S3 and the banner is created with the resulting URL.
   */
  async createBannerWithUpload(
    image: File,
    title: string,
    placement: string,
    displayMode?: 'SOLO_BANNER' | 'INTEGRATED',
    description?: string,
    linkUrl?: string,
    durationDays?: number,
    displayOrder?: number
  ): Promise<Banner> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('placement', placement);
    if (displayMode) formData.append('displayMode', displayMode);
    if (description) formData.append('description', description);
    if (linkUrl) formData.append('linkUrl', linkUrl);
    if (durationDays !== undefined) formData.append('durationDays', String(durationDays));
    if (displayOrder !== undefined) formData.append('displayOrder', String(displayOrder));

    const response = await axiosClient.post('/v1/admin/marketing/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }


  async updateBanner(id: number, request: Partial<CreateBannerRequest>): Promise<Banner> {
    const response = await axiosClient.put(`/v1/admin/marketing/banners/${id}`, request);
    return response.data;
  }

  async deleteBanner(id: number): Promise<void> {
    await axiosClient.delete(`/v1/admin/marketing/banners/${id}`);
  }

  async getFestiveCampaigns(params?: { page?: number; size?: number }): Promise<FestiveCampaign[]> {
    const response = await axiosClient.get('/v1/admin/marketing/festive');
    return response.data;
  }

  async createFestiveCampaign(request: CreateFestiveCampaignRequest): Promise<FestiveCampaign> {
    const response = await axiosClient.post('/v1/admin/marketing/festive', request);
    return response.data;
  }

  async updateFestiveCampaign(id: number, request: Partial<CreateFestiveCampaignRequest>): Promise<FestiveCampaign> {
    const response = await axiosClient.put(`/v1/admin/marketing/festive/${id}`, request);
    return response.data;
  }

  async deleteFestiveCampaign(id: number): Promise<void> {
    await axiosClient.delete(`/v1/admin/marketing/festive/${id}`);
  }

  // ==================== Support Tickets ====================

  async getSupportTickets(params?: {
    status?: string;
    category?: string;
    severity?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<SupportTicket>> {
    const response = await axiosClient.get('/v1/admin/support/tickets', { params });
    return response.data;
  }

  async getSupportTicketById(ticketId: number): Promise<SupportTicket> {
    const response = await axiosClient.get(`/v1/admin/support/tickets/${ticketId}`);
    return response.data;
  }

  async getSupportTicketStats(): Promise<SupportTicketStats> {
    const response = await axiosClient.get('/v1/admin/support/tickets/stats');
    return response.data;
  }

  async createSupportTicket(request: CreateSupportTicketRequest): Promise<SupportTicket> {
    const response = await axiosClient.post('/v1/admin/support/tickets', request);
    return response.data;
  }

  async updateSupportTicketStatus(ticketId: number, request: UpdateSupportTicketStatusRequest): Promise<SupportTicket> {
    const response = await axiosClient.put(`/v1/admin/support/tickets/${ticketId}/status`, request);
    return response.data;
  }

  async notifyTicketUser(ticketId: number, data: { subject: string; message: string; sendEmail: boolean; sendInApp: boolean }): Promise<void> {
    await axiosClient.post(`/v1/admin/support/tickets/${ticketId}/notify`, data);
  }

}

// Export singleton instance
export const adminRepository = new AdminRepository();


