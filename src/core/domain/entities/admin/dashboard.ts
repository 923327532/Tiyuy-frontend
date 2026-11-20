/**
 * Admin domain entities — Dashboard, analytics and marketing overview stats
 */
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

// Property analytics snapshot (GET /admin/dashboard/properties)
export interface PropertyAnalyticsResponse {
  totalProperties: number;
  propertiesByStatus: Record<string, number>;
  propertiesByType: Record<string, number>;
  propertiesByTransactionType: Record<string, number>;
  verified: number;
  unverified: number;
  featured: number;
  expiredFeatured: number;
  availableFeaturedSlots: number;
  generatedAt: string;
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

