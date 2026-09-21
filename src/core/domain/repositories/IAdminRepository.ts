/**
 * Admin repository interface (port)
 * Defines contracts for admin module operations
 */

import {
  AdminUser,
  CreateAdminAccountRequest,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  DashboardStats,
  UserStats,
  FinanceStats,
  FinanceHistoryDto,
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
  AuditLogEntry,
  Department,
  Permission,
  CentralDiscountDto,
  CentralDiscountSummary,
} from '@/core/domain/entities/Admin';

// Pagination types (aligned with backend Page response)
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface IAdminRepository {
  // Dashboard & Analytics
  getDashboardStats(): Promise<DashboardStats>;
  getUserStats(): Promise<UserStats>;
  getFinanceStats(): Promise<FinanceStats>;
  getFinanceHistory(period?: string): Promise<FinanceHistoryDto>;

  // Admin User Management (requires SUPER_ADMIN)
  getAllAdmins(params: PaginationParams): Promise<PaginatedResponse<AdminUser>>;
  getAdminById(adminId: number): Promise<AdminUser>;
  getAdminByUserId(userId: number): Promise<AdminUser>;
  createAdminUser(request: CreateAdminUserRequest): Promise<AdminUser>;
  updateAdminUser(adminId: number, request: UpdateAdminUserRequest): Promise<AdminUser>;
  deleteAdminUser(adminId: number): Promise<void>;
  toggleAdminStatus(adminId: number, active: boolean): Promise<AdminUser>;

  // SuperAdmin: Create admin/support accounts (User creation)
  createAdminAccount(request: CreateAdminAccountRequest): Promise<{ userId: number; email: string }>;
  createSupportAccount(request: CreateAdminAccountRequest): Promise<{ userId: number; email: string }>;

  // User Management
  getAllUsers(
    role?: string,
    enabled?: boolean,
    keyword?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<UserListItem>>;
  getUserById(userId: number): Promise<UserListItem>;
  toggleUserStatus(userId: number, enabled: boolean, reason?: string): Promise<void>;
  changeUserRole(userId: number, request: ChangeUserRoleRequest): Promise<void>;
  verifyUserEmail(userId: number): Promise<void>;

  // Usuarios internacionales (sección "Extranjeros")
  getInternationalUsers(params?: PaginationParams): Promise<PaginatedResponse<InternationalUserListItem>>;
  approveInternationalUser(userId: number): Promise<InternationalUserListItem>;
  rejectInternationalUser(userId: number, reason?: string): Promise<InternationalUserListItem>;

  // Discount Codes
  getAllDiscountCodes(params: PaginationParams): Promise<PaginatedResponse<DiscountCode>>;
  getDiscountCodeById(codeId: number): Promise<DiscountCode>;
  getDiscountCodeByCode(code: string): Promise<DiscountCode>;
  createDiscountCode(request: CreateDiscountCodeRequest): Promise<DiscountCode>;
  updateDiscountCode(codeId: number, request: UpdateDiscountCodeRequest): Promise<DiscountCode>;
  deleteDiscountCode(codeId: number): Promise<void>;
  validateDiscountCode(code: string, amount: number): Promise<{ valid: boolean; discount?: number }>;

  // Campaigns
  getAllCampaigns(params: PaginationParams): Promise<PaginatedResponse<Campaign>>;
  getCampaignById(campaignId: number): Promise<Campaign>;
  createCampaign(request: CreateCampaignRequest): Promise<Campaign>;
  updateCampaign(campaignId: number, request: UpdateCampaignRequest): Promise<Campaign>;
  deleteCampaign(campaignId: number): Promise<void>;
  getCampaignAlerts(): Promise<CampaignAlert[]>;

  // Property Moderation
  getPropertiesForModeration(
    status?: string,
    keyword?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<PropertyModerationItem>>;
  getPropertyForModeration(propertyId: number): Promise<PropertyModerationItem>;
  moderateProperty(propertyId: number, request: ModeratePropertyRequest): Promise<void>;
  toggleFeaturedProperty(propertyId: number, featured: boolean): Promise<void>;
  deletePropertyAsAdmin(propertyId: number, reason?: string): Promise<void>;

  // Audit Logs
  getAuditLogs(
    entityType?: string,
    adminUserId?: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AuditLogEntry>>;
  getAuditLogById(logId: number): Promise<AuditLogEntry>;
  getAuditLogsByUser(userId: number, params: PaginationParams): Promise<PaginatedResponse<AuditLogEntry>>;
  getAuditLogsByEntity(entityType: string, entityId: number): Promise<AuditLogEntry[]>;

  // Departments & Permissions
  getAllDepartments(): Promise<Department[]>;
  getAllPermissions(): Promise<Permission[]>;

  // Automation
  triggerManualAutomation(): Promise<string>;

  // Central Discount Management
  getCentralDiscounts(params: {
    source?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<CentralDiscountDto>>;
  getCentralDiscountSummary(): Promise<CentralDiscountSummary>;

  // Marketing Module
  getMarketingStats(): Promise<import('@/core/domain/entities/Admin').MarketingStats>;
  getPromotionCampaigns(params?: { page?: number; size?: number; status?: string }): Promise<PaginatedResponse<import('@/core/domain/entities/Admin').PromotionCampaign>>;
  getPromotionCampaignById(id: number): Promise<import('@/core/domain/entities/Admin').PromotionCampaign>;
  createPromotionCampaign(request: import('@/core/domain/entities/Admin').CreatePromotionCampaignRequest): Promise<import('@/core/domain/entities/Admin').PromotionCampaign>;
  updatePromotionCampaign(id: number, request: import('@/core/domain/entities/Admin').UpdatePromotionCampaignRequest): Promise<import('@/core/domain/entities/Admin').PromotionCampaign>;
  deletePromotionCampaign(id: number): Promise<void>;
  getBanners(params?: { page?: number; size?: number; location?: string }): Promise<import('@/core/domain/entities/Admin').Banner[]>;
  createBanner(request: import('@/core/domain/entities/Admin').CreateBannerRequest): Promise<import('@/core/domain/entities/Admin').Banner>;
  updateBanner(id: number, request: Partial<import('@/core/domain/entities/Admin').CreateBannerRequest>): Promise<import('@/core/domain/entities/Admin').Banner>;
  deleteBanner(id: number): Promise<void>;
  getFestiveCampaigns(params?: { page?: number; size?: number }): Promise<import('@/core/domain/entities/Admin').FestiveCampaign[]>;
  createFestiveCampaign(request: import('@/core/domain/entities/Admin').CreateFestiveCampaignRequest): Promise<import('@/core/domain/entities/Admin').FestiveCampaign>;
  updateFestiveCampaign(id: number, request: Partial<import('@/core/domain/entities/Admin').CreateFestiveCampaignRequest>): Promise<import('@/core/domain/entities/Admin').FestiveCampaign>;
  deleteFestiveCampaign(id: number): Promise<void>;

  // Support Tickets (Centro de Soporte/Incidencias)
  getSupportTickets(params?: {
    status?: string;
    category?: string;
    severity?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<import('@/core/domain/entities/Admin').SupportTicket>>;
  getSupportTicketById(ticketId: number): Promise<import('@/core/domain/entities/Admin').SupportTicket>;
  getSupportTicketStats(): Promise<import('@/core/domain/entities/Admin').SupportTicketStats>;
  createSupportTicket(request: import('@/core/domain/entities/Admin').CreateSupportTicketRequest): Promise<import('@/core/domain/entities/Admin').SupportTicket>;
  updateSupportTicketStatus(ticketId: number, request: import('@/core/domain/entities/Admin').UpdateSupportTicketStatusRequest): Promise<import('@/core/domain/entities/Admin').SupportTicket>;
  notifyTicketUser(ticketId: number, data: { subject: string; message: string; sendEmail: boolean; sendInApp: boolean }): Promise<void>;
}


