/**
 * Admin domain entities — Agent dashboard entities
 */
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

