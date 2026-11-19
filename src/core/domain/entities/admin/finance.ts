/**
 * Admin domain entities — Subscriptions, payments and finance stats
 */
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

