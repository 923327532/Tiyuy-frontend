/**
 * Admin domain entities
 * Aligned with backend Admin module structure
 */

// Admin role types matching backend AdminRoleType
export type AdminRoleType = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT';

// Department types matching backend DepartmentType
export type DepartmentType = 
  | 'USER_MANAGEMENT' 
  | 'PROPERTY_MANAGEMENT' 
  | 'COMMUNICATIONS' 
  | 'FINANCE' 
  | 'ANALYTICS'
  | 'ACTORS'
  | 'SYSTEM';

// Permission enum matching backend Permission.java
export type Permission =
  // User Management
  | 'USERS_VIEW' | 'USERS_CREATE' | 'USERS_UPDATE' | 'USERS_DELETE' 
  | 'USERS_CHANGE_ROLE' | 'USERS_VERIFY'
  // Property Management
  | 'PROPERTIES_VIEW' | 'PROPERTIES_MODERATE' | 'PROPERTIES_DELETE' | 'PROPERTIES_FEATURE'
  | 'PROJECTS_VIEW' | 'PROJECTS_MODERATE' | 'PROJECTS_DELETE'
  | 'AGENCIES_VIEW' | 'AGENCIES_MANAGE'
  // Communications
  | 'COMMUNICATIONS_VIEW' | 'COMMUNICATIONS_MANAGE' | 'EVENTS_VIEW' | 'CHAT_MONITOR'
  | 'GROUPS_VIEW' | 'GROUPS_MANAGE'
  // Finance
  | 'FINANCE_VIEW' | 'FINANCE_MANAGE_SUBSCRIPTIONS' | 'FINANCE_REFUNDS'
  | 'DISCOUNTS_CREATE' | 'DISCOUNTS_MANAGE'
  // Analytics
  | 'ANALYTICS_VIEW' | 'ANALYTICS_EXPORT' | 'ANALYTICS_DASHBOARD'
  // Admin Management
  | 'ADMINS_VIEW' | 'ADMINS_CREATE' | 'ADMINS_UPDATE' | 'ADMINS_DELETE' | 'DEPARTMENTS_MANAGE'
  // Global
  | 'NOTIFICATIONS_SEND' | 'AUDIT_LOGS_VIEW' | 'SYSTEM_CONFIG';

// Discount code status matching backend
export type DiscountCodeStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'USED';

// Discount applicability matching backend
export type DiscountApplicability = 'GLOBAL' | 'PLAN_SPECIFIC' | 'USER_SPECIFIC' | 'PROJECT_SPECIFIC' | 'AGENCY_SPECIFIC';

// Campaign status matching backend
export type CampaignStatus = 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE';

// Campaign alert type matching backend
export type CampaignAlertType = 'LAST_WEEK' | 'LAST_DAY' | 'STARTED' | 'ENDED' | 'USAGE_LIMIT_WARNING';

// Developer-Agent Association status
export type AssociationStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'REMOVED';

// Who requested the association
export type AssociationRequester = 'AGENT' | 'DEVELOPER' | 'ADMIN';

// Developer-Agent Association entity
export interface DeveloperAgentAssociation {
  id: number;
  developerId: number;
  developerName: string;
  developerRuc?: string;
  developerCity?: string;
  developerCurrentPlan?: string;
  agentId: number;
  agentFirstName?: string;
  agentLastName?: string;
  agentEmail: string;
  status: AssociationStatus;
  requestedBy?: AssociationRequester;
  requestedAt?: Date;
  reviewedAt?: Date;
  reviewedByName?: string;
  notes?: string;
  joinedAt?: Date;
  isVerified?: boolean;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request to create association
export interface CreateAssociationRequest {
  developerId: number;
  notes?: string;
}

// Request to approve/reject association
export interface ReviewAssociationRequest {
  notes?: string;
}

// Developer (Inmobiliaria) response from backend
export interface DeveloperResponse {
  id: number;
  email: string;
  companyName: string;
  ruc?: string;
  phone?: string;
  enabled: boolean;
  status: string;
  totalAgents: number;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Search filter for developers
export interface DeveloperSearchFilter {
  query?: string;
  city?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Department entity
export interface Department {
  id: number;
  type: DepartmentType;
  displayName: string;
  description: string;
}

// Admin user entity matching AdminUserResponse from backend
export interface AdminUser {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roleType: AdminRoleType;
  departments: DepartmentType[];
  permissions?: Permission[];
  additionalPermissions?: Permission[];
  active: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

// Request to create a new admin/support account (User) via SuperAdminController
export interface CreateAdminAccountRequest {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Admin user creation request (matches backend CreateAdminUserRequest DTO)
export interface CreateAdminUserRequest {
  userId: number;
  roleType: AdminRoleType;
  departments: DepartmentType[];
  additionalPermissions: Permission[];
}

// Admin user update request (matches backend UpdateAdminUserRequest DTO)
export interface UpdateAdminUserRequest {
  departments?: DepartmentType[];
  additionalPermissions?: Permission[];
  active?: boolean;
}

// Dashboard stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalProperties: number;
  publishedProperties: number;
  pendingProperties: number;
  rejectedProperties: number;
  totalProjects: number;
  activeProjects: number;
  totalPayments: number;
  paymentsToday: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalChatMessages: number;
  totalEvents: number;
  pendingReports: number;
  usersByRole: Record<string, number>;
  propertiesByType: Record<string, number>;
  propertiesByStatus: Record<string, number>;
  generatedAt: string;
  // Porcentajes de crecimiento (vs período anterior)
  usersGrowthPercent: number;
  propertiesGrowthPercent: number;
  projectsGrowthPercent: number;
  revenueGrowthPercent: number;
}

// User stats
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
}

// User registration history for chart data
export interface UserRegistrationHistory {
  period: string;
  startDate: string;
  endDate: string;
  totalRegistrations: number;
  dataPoints: RegistrationDataPoint[];
}

export interface RegistrationDataPoint {
  date: string;
  count: number;
  actualDate?: string;
}

// Finance stats
export interface FinanceStats {
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalPayments: number;
  paymentsToday: number;
  averageTransactionValue: number;
  refundsTotal: number;
  refundsCount: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  newSubscriptionsToday: number;
  totalTransactions: number;
  transactionsToday: number;
  totalWalletBalance: number;
}

// User list item for admin management
export interface UserListItem {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dni: string;
  role: 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  enabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  publishedPropertiesCount: number;
  publishedProjectsCount: number;
  city?: string;
  country?: string;
  profilePhotoUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

// Change user role request
export interface ChangeUserRoleRequest {
  newRole: 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  reason?: string;
}

// Usuario internacional para la sección "Extranjeros" del panel admin.
// El administrador compara la foto del documento con la selfie y aprueba/rechaza.
export interface InternationalUserListItem {
  userId: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  documentType: string; // INTERNATIONAL
  issuingCountry: string;
  internationalDocumentType: string; // PASSPORT | NATIONAL_ID | RESIDENCE_PERMIT
  internationalDocumentNumber: string;
  documentImageUrl?: string;
  selfieImageUrl?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW';
  verificationResult?: string;
  verifiedAt?: Date;
  enabled: boolean;
  createdAt: Date;
}

// User properties response from admin endpoint
export interface UserPropertiesResponse {
  userId: number;
  userEmail: string;
  userName: string;
  totalProperties: number;
  properties: UserPropertySummary[];
}

export interface UserPropertySummary {
  id: number;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'SUSPENDED';
  price: number;
  district: string;
  city: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
  viewsCount: number;
  createdAt: Date;
  publishedAt?: Date;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  description?: string;
}

// User projects response from admin endpoint
export interface UserProjectsResponse {
  userId: number;
  userEmail: string;
  userName: string;
  totalProjects: number;
  projects: UserProjectSummary[];
}

export interface UserProjectSummary {
  id: number;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED';
  phase: 'PLANNING' | 'CONSTRUCTION' | 'PRE_SALE' | 'SALE' | 'COMPLETED';
  district: string;
  city: string;
  coverImageUrl?: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  constructionProgress: number;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  publishedAt?: Date;
}


// Property status type including admin disabled
export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'REJECTED'
  | 'RENTED'
  | 'SOLD'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'DISABLED_BY_ADMIN';

// Property moderation DTO
export interface PropertyModerationItem {
  id: number;
  title: string;
  slug: string;
  status: PropertyStatus;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  price: number;
  district: string;
  createdAt: Date;
  publishedAt?: Date;
  isFeatured: boolean;
  viewsCount: number;
  reportCount: number;
  thumbnailUrl?: string;
}

// Property comment for admin review
export interface PropertyComment {
  id: number;
  propertyId: number;
  propertyTitle: string;
  userId: number;
  userName: string;
  userEmail: string;
  content: string;
  rating?: number;
  isFlagged: boolean;
  flagReason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Request to notify property owner
export interface NotifyOwnerRequest {
  subject: string;
  message: string;
  includePropertyDetails?: boolean;
}

// Moderate property request
export interface ModeratePropertyRequest {
  action: 'APPROVE' | 'REJECT' | 'SUSPEND';
  reason?: string;
  notes?: string;
}

// Audit log entry
export interface AuditLogEntry {
  id: number;
  adminUserId: number;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: number;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Admin navigation item
export interface AdminNavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  requiredPermissions: Permission[];
  department: DepartmentType;
  badge?: number;
}

// Project lifecycle status
export type ProjectLifecycleStatus = 'ACTIVE' | 'PENDING' | 'PAST' | 'ENDING_SOON' | 'COMPLETED' | 'SUSPENDED';

// Project status
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED';

// Project type
export type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'INDUSTRIAL';

// Project phase
export type ProjectPhase = 'PLANNING' | 'CONSTRUCTION' | 'PRE_SALE' | 'SALE' | 'COMPLETED';

// Project entity for admin management
export interface ProjectAdminItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  lifecycleStatus: ProjectLifecycleStatus;
  phase: ProjectPhase;
  developerId: number;
  developerName: string;
  developerEmail: string;
  district: string;
  city: string;
  country: string;
  coverImageUrl?: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  priceRange: {
    min: number;
    max: number;
  };
  constructionProgress: number;
  startDate?: Date;
  estimatedDeliveryDate?: Date;
  launchDate?: Date;
  completionDate?: Date;
  viewsCount: number;
  favoritesCount: number;
  inquiriesCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isFeatured: boolean;
}

// Project statistics
export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
  projectsWithCover: number;
  projectsWithoutCover: number;
  coveragePercentage: number;
  totalUnits: number;
  soldUnits: number;
  availableUnits: number;
  averageConstructionProgress: number;
  // Extended stats for dashboard
  totalSalesValue: number;
  totalSoldUnits: number;
  conversionRate: number;
  totalAvailableUnits: number;
}

// Project moderation request
export interface ModerateProjectRequest {
  action: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'ACTIVATE' | 'DEACTIVATE';
  reason?: string;
  notes?: string;
}

// Campaign entity matching backend
export interface Campaign {
  id: number;
  title: string;
  name?: string;
  description?: string;
  promotionalMessage?: string;
  imageUrl?: string;
  link?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  startDate: Date;
  endDate: Date;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  styles?: Record<string, string>;
  lastAlertSent?: Date;
  // Additional properties for campaign management
  discountCodeCode?: string;
  discountCodeId?: number;
  targetAudience?: string;
  usageCount?: number;
  revenueGenerated?: number;
  autoApply?: boolean;
}

// Create campaign request matching backend
export interface CreateCampaignRequest {
  title: string;
  description?: string;
  promotionalMessage?: string;
  imageUrl?: string;
  link?: string;
  startDate: Date;
  endDate: Date;
  styles?: Record<string, string>;
}

// Update campaign request matching backend
export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  promotionalMessage?: string;
  imageUrl?: string;
  link?: string;
  status?: 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  startDate?: Date;
  endDate?: Date;
  styles?: Record<string, string>;
}

// Campaign alert matching backend
export interface CampaignAlert {
  id: number;
  campaignId?: number;
  discountCodeId?: number;
  alertType: 'LAST_WEEK' | 'LAST_DAY' | 'STARTED' | 'ENDED' | 'USAGE_LIMIT_WARNING';
  message: string;
  sentAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

// Discount code entity matching backend
export interface DiscountCode {
  id: number;
  code: string;
  discountPercentage: number;
  applicability: 'GLOBAL' | 'PLAN_SPECIFIC' | 'USER_SPECIFIC' | 'PROJECT_SPECIFIC' | 'AGENCY_SPECIFIC';
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'USED';
  usageLimit?: number;
  currentUsage: number;
  singleUse: boolean;
  startDate: Date;
  endDate: Date;
  applicablePlan?: string;
  applicableUserId?: number;
  applicableAgencyId?: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  lastAlertSent?: Date;
}

// Create discount code request matching backend
export interface CreateDiscountCodeRequest {
  code: string;
  discountPercentage: number;
  applicability: 'GLOBAL' | 'PLAN_SPECIFIC' | 'USER_SPECIFIC' | 'PROJECT_SPECIFIC' | 'AGENCY_SPECIFIC';
  usageLimit?: number;
  singleUse: boolean;
  startDate: Date;
  endDate: Date;
  applicablePlan?: string;
  applicableUserId?: number;
  applicableAgencyId?: number;
  minimumAmount?: number;
  maximumDiscount?: number;
}

// Agent dashboard stats matching backend
export interface AgentDashboardStats {
  totalRevenue: number;
  totalRevenuePrevious: number;
  monthlyRevenue: number;
  monthlyRevenuePrevious: number;
  weeklyRevenue: number;
  weeklyRevenuePrevious: number;
  activeAgents: number;
  activeAgentsPrevious: number;
  totalAgents: number;
  conversionRate: number;
  conversionRatePrevious: number;
  freeAgents: number;
  freeAgentsPrevious: number;
  lostPotentialRevenue: number;
  topAgents: AgentRevenueItem[];
  revenueChart: {
    labels: string[];
    revenue: number[];
    conversion: number[];
  };
  planDistribution: {
    labels: string[];
    values: number[];
    total: number;
  };
  freeAgentList: AgentFreeItem[];
}

export interface AgentRevenueItem {
  agentId: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl?: string;
  city?: string;
  country?: string;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  conversionRate: number;
  currentPlan: string;
  isActive: boolean;
  memberSince: string;
}

export interface AgentFreeItem {
  agentId: number;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  status: string;
  potentialRevenue: number;
  createdAt: string;
}

export interface AgentListItem {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  dni?: string;
  city?: string;
  country?: string;
  profilePhotoUrl?: string;
  enabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  currentPlan: string;
  planExpiresAt?: Date;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  conversionRate: number;
  propertiesCount: number;
  lastLoginAt?: Date;
  createdAt: Date;
}

// Update discount code request matching backend
export interface UpdateDiscountCodeRequest {
  code?: string;
  discountPercentage?: number;
  applicability?: 'GLOBAL' | 'PLAN_SPECIFIC' | 'USER_SPECIFIC' | 'PROJECT_SPECIFIC' | 'AGENCY_SPECIFIC';
  usageLimit?: number;
  singleUse?: boolean;
  startDate?: Date;
  endDate?: Date;
  applicablePlan?: string;
  applicableUserId?: number;
  applicableAgencyId?: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'USED';
}

// Discount calculation result matching backend
export interface DiscountCalculationResult {
  valid: boolean;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  discountPercentage: number;
  code: string;
  message?: string;
}

// Discount code usage response
export interface DiscountCodeUsageResponse {
  id: number;
  userId: number;
  userEmail: string;
  subscriptionTier: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentId?: number;
  usedAt: Date;
  ipAddress?: string;
}

// Subscription plan entity - matches backend SubscriptionPlanResponse
export interface SubscriptionPlan {
  id: number;
  code: string;
  displayName: string;
  description: string;
  priceInPen: number;
  priceInUsd: number;
  currency: string;
  durationDays: number;
  publicationsLimit: number;
  projectsLimit: number;
  photosLimit: number;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME';
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  agencyDiscountCount?: number;
  // Legacy field mapping for backwards compatibility
  name?: string;
  limits?: {
    properties: number;
    projects: number;
    photos: number;
    featuredListings: number;
  };
}

// Agency-specific discount for a plan
export interface AgencyPlanDiscount {
  id: number;
  agencyId: number;
  agencyName?: string;
  planId: number;
  planName?: string;
  originalPricePen: number;
  originalPriceUsd: number;
  customPricePen?: number;
  customPriceUsd?: number;
  discountPercentage?: number;
  finalPrice: number;
  notes?: string;
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription entity
export interface Subscription {
  id: number;
  userId: number;
  tier: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: Date;
  endDate?: Date;
  paymentMethod: string;
  price: number;
  currency: string;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Admin subscription entity with additional user information
export interface AdminSubscription extends Subscription {
  userEmail: string;
  amount: number;
}

// Payment transaction entity
export interface PaymentTransaction {
  id: number;
  userId: number;
  subscriptionId?: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentId?: string;
  referenceId?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction entity for admin finance view (matches backend response)
export interface Transaction {
  id: number;
  userId: number;
  userEmail: string;
  type: 'PAYMENT' | 'REFUND' | 'CREDIT';
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
}

// Wallet entity
export interface Wallet {
  id: number;
  userId: number;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// Finance stats for admin
export interface FinanceStatsDto {
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  newSubscriptionsToday: number;
  totalTransactions: number;
  transactionsToday: number;
  averageTransactionValue: number;
  refundsTotal: number;
  refundsCount: number;
  totalWalletBalance: number;
}

export interface FinanceHistoryDto {
  labels: string[];
  revenue: number[];
  subscriptions: number[];
  transactions: number[];
  period: string;
  summary: {
    totalRevenue: number;
    totalSubscriptions: number;
    totalTransactions: number;
    revenueGrowth: number;
    subscriptionsGrowth: number;
    transactionsGrowth: number;
  };
}

// Admin sidebar section
export interface AdminSidebarSection {
  title: string;
  department: DepartmentType;
  items: AdminNavItem[];
}

// ============================================
// INMOBILIARIA / DEVELOPER ENTITIES
// ============================================

export interface Inmobiliaria {
  id: number;
  name: string;
  ruc: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  managerName?: string;
  address?: string;
  city?: string;
  country?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

export interface InmobiliariaWithStats extends Inmobiliaria {
  totalAgents: number;
  activeAgents: number;
  totalProperties: number;
  activeProperties: number;
  totalProjects: number;
  activeProjects: number;
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED';
  currentPlan?: string;
  planExpiryDate?: Date;
  averageRating: number;
  totalSales: number;
  totalRentals: number;
  enabled: boolean;
  activeDiscounts?: number;
  revenue30Days?: number;
  lastActivity?: Date;
}

export interface InmobiliariaAgent {
  id: number;
  userId: number;
  inmobiliariaId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt: Date;
  totalSales: number;
  totalRentals: number;
  currentPlan?: string;
  planStatus?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

export interface InmobiliariaStatusHistory {
  id: number;
  inmobiliariaId: number;
  previousStatus?: string;
  newStatus: string;
  reason?: string;
  changedBy: string;
  createdAt: Date;
}

export interface CreateInmobiliariaRequest {
  name: string;
  ruc: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
}

export interface UpdateInmobiliariaRequest {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface AssignAgentToInmobiliariaRequest {
  userId: number;
  licenseNumber?: string;
}

export interface InmobiliariaDiscount {
  id: number;
  inmobiliariaId: number;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  validFrom: Date;
  validUntil?: Date;
  createdAt: Date;
  createdBy: number;
  isValid: boolean;
}

export interface CreateInmobiliariaDiscountRequest {
  inmobiliariaId: number;
  code: string;
  discountPercentage: number;
  maxUses?: number;
  validFrom?: Date;
  validUntil?: Date;
  applicableToAgents?: boolean; // Si es false, solo la inmobiliaria puede usarlo (no sus agentes)
}

export interface ApplyDirectDiscountRequest {
  discountPercentage: number;
  reason: string;
  applyToAllAgents?: boolean;
  expiresAt?: Date;
  maxAgents?: number;
}

export interface InmobiliariaFilter {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  city?: string;
  hasActiveSubscription?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// ================== Central Discount Management ==================

export interface CentralDiscountDto {
  id: number;
  code: string;
  discountPercentage: number;
  customPrice?: number;
  source: 'DISCOUNT_CODE' | 'AGENT' | 'DEVELOPER' | 'AGENCY_PLAN' | 'USER';
  sourceLabel: string;
  entityType: string;
  entityName: string;
  entityId?: number;
  status: string;
  usageCount: number;
  maxUsage: number;
  createdAt: string;
  expiresAt?: string;
  updatedAt?: string;
  notes?: string;
  applicability: string;
  assignedBy?: number;
  assignedByName?: string;
}

export interface CentralDiscountSummary {
  total: number;
  active: number;
  expired: number;
  inactive: number;
  users: number;
  agents: number;
  developers: number;
}

// ================== Marketing Module Types ==================

export interface MarketingStats {
  totalCampaigns: number;
  activeCampaigns: number;
  pendingApproval: number;
  expiredCampaigns: number;
  totalBanners: number;
  activeBanners: number;
  totalFestiveCampaigns: number;
  activeFestiveCampaigns: number;
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  totalConversions: number;
  averageCTR: number;
  impressionsGrowth?: number;
  conversionsGrowth?: number;
  conversionRateGrowth?: number;
  clicksGrowth?: number;
  revenueGrowth?: number;
  ctrGrowth?: number;
  leadsGrowth?: number;
  /** Daily stats for charts (clicks & impressions per day) */
  dailyStats?: DailyStat[];
}

export interface DailyStat {
  date: string;
  clicks: number;
  impressions: number;
}



export interface PromotionCampaign {
  id: number;
  title: string;
  description?: string;
  promotionType: string;
  status: string;
  startDate: string;
  endDate?: string;
  pricePaid?: number;
  currency?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  placementLocation: string;
  displayOrder?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  conversionRate?: number;
  revenue?: number;
  createdAt: string;
  updatedAt?: string;
  /** ID del proyecto vinculado (opcional) */
  targetProjectId?: number | null;
  /** ID de la propiedad vinculada (opcional) */
  targetPropertyId?: number | null;
  /** Nombre del proyecto vinculado (para mostrar) */
  targetProjectName?: string;
  /** Nombre de la propiedad vinculada (para mostrar) */
  targetPropertyName?: string;
  /** Owner info */
  ownerId?: number;
  ownerRole?: string;
  /** Nombre del owner (inmobiliaria/agente) */
  ownerName?: string;
  /** Logo del owner (inmobiliaria/agente) */
  ownerLogoUrl?: string;
  /** Distrito/ubicación del proyecto vinculado */
  projectDistrict?: string;
  /** Tipo de proyecto (ej: "Departamentos", "Casas", etc.) */
  projectType?: string;
  /** Área desde (m²) del proyecto vinculado */
  projectAreaFrom?: string;
  /** Precio desde del proyecto vinculado */
  projectPriceFrom?: string;
  /** Moneda del precio */
  projectPriceCurrency?: string;
  /** Payment info */
  paymentId?: string;
  paymentConfirmed?: boolean;
  /** Lifecycle */
  active?: boolean;
  expired?: boolean;
  leads?: number;
  approvedBy?: number;
  approvedAt?: string;
  notes?: string;
}

export interface CreatePromotionCampaignRequest {
  promotionType: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  placementLocation: string;
  startDate: string;
  endDate: string;
  pricePaid: number;
  currency?: string;
  displayOrder?: number;
  targetProjectId?: number | null;
  targetPropertyId?: number | null;
}

export interface UpdatePromotionCampaignRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  pricePaid?: number;
  currency?: string;
  placementLocation?: string;
  displayOrder?: number;
}

export type BannerDisplayMode = 'SOLO_BANNER' | 'INTEGRATED';

export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: string;
  displayMode?: BannerDisplayMode;
  displayOrder?: number;
  startDate: string;
  endDate?: string;
  durationDays?: number;
  isActive: boolean;
  currentlyActive?: boolean;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBannerRequest {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: string;
  displayOrder?: number;
  startDate: string;
  endDate?: string;
  durationDays?: number;
}


export interface FestiveCampaign {
  id: number;
  name: string;
  description?: string;
  festiveType: string;
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  specialPricePen?: number;
  specialPriceUsd?: number;
  maxParticipants?: number;
  termsAndConditions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFestiveCampaignRequest {
  name: string;
  description?: string;
  festiveType: string;
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  specialPricePen?: number;
  specialPriceUsd?: number;
  maxParticipants?: number;
  termsAndConditions?: string;
}

// ============================================================
// Support Tickets (Centro de Soporte/Incidencias)
// ============================================================

export type TicketSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketCategory = 
  | 'WRONG_EMAIL' 
  | 'PASSWORD_CHANGE' 
  | 'SYSTEM_ERROR' 
  | 'PAYMENT_ISSUE' 
  | 'ACCOUNT_ISSUE' 
  | 'PROPERTY_ISSUE' 
  | 'OTHER';

export interface SupportTicket {
  id: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  subject: string;
  description: string;
  category: TicketCategory;
  severity: TicketSeverity;
  status: TicketStatus;
  adminNotes?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolvedBy?: number;
  resolvedByName?: string;
  createdAt: string;
  updatedAt?: string;
  // Guest fields for non-authenticated users
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface SupportTicketStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  criticalTickets: number;
  averageResolutionTimeHours: number;
  ticketsByCategory: Record<string, number>;
  ticketsBySeverity: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  ticketsLast7Days: number;
  ticketsLast30Days: number;
}

export interface CreateSupportTicketRequest {
  subject: string;
  description: string;
  category: TicketCategory;
  severity?: TicketSeverity;
  // Guest fields for non-authenticated users
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface UpdateSupportTicketStatusRequest {
  status: TicketStatus;
  adminNotes?: string;
}

