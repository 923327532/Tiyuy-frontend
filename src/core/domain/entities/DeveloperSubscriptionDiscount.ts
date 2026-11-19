/**
 * Developer Subscription Discount Entities
 * Direct discounts for developers (inmobiliarias) on subscription contracting and renewal
 * Aligned with backend DeveloperSubscriptionDiscount entity (to be implemented)
 */

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type DiscountApplicabilityScope = 'NEW_CONTRACT' | 'RENEWAL' | 'BOTH';
export type DiscountStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'REVOKED' | 'EXHAUSTED';

export interface DeveloperSubscriptionDiscount {
  id: number;
  developerId: number;
  developerName: string;
  developerRuc?: string;
  
  // Discount configuration
  type: DiscountType;
  percentage?: number;        // For PERCENTAGE type (0.01 - 100)
  amountPen?: number;         // For FIXED_AMOUNT type (PEN)
  amountUsd?: number;         // For FIXED_AMOUNT type (USD)
  
  // Applicability
  applicabilityScope: DiscountApplicabilityScope;  // NEW_CONTRACT, RENEWAL, BOTH
  applicablePlanCodes?: string[];  // Optional: specific plans, null = all plans
  
  // Limits
  maxDiscountPen?: number;    // Maximum discount cap in PEN
  maxDiscountUsd?: number;    // Maximum discount cap in USD
  usageLimit?: number;        // Total usage limit (null = unlimited)
  currentUsage: number;       // Current usage count
  
  // Validity period
  validFrom: string;          // ISO date string
  validUntil?: string;        // ISO date string (null = no expiration)
  
  // Status & metadata
  status: DiscountStatus;
  adminReason: string;        // Administrative reason for the discount
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  isValid: boolean;
  isExpired: boolean;
  remainingUses: number | null;
}

export interface CreateDeveloperSubscriptionDiscountRequest {
  developerId: number;
  type: DiscountType;
  percentage?: number;
  amountPen?: number;
  amountUsd?: number;
  applicabilityScope: DiscountApplicabilityScope;
  applicablePlanCodes?: string[];
  maxDiscountPen?: number;
  maxDiscountUsd?: number;
  usageLimit?: number;
  validFrom: string;
  validUntil?: string;
  adminReason: string;
}

export interface UpdateDeveloperSubscriptionDiscountRequest {
  type?: DiscountType;
  percentage?: number;
  amountPen?: number;
  amountUsd?: number;
  applicabilityScope?: DiscountApplicabilityScope;
  applicablePlanCodes?: string[];
  maxDiscountPen?: number;
  maxDiscountUsd?: number;
  usageLimit?: number;
  validFrom?: string;
  validUntil?: string;
  adminReason?: string;
  status?: DiscountStatus;
}

export interface DeveloperSubscriptionDiscountFilters {
  developerId?: number;
  status?: DiscountStatus;
  type?: DiscountType;
  applicabilityScope?: DiscountApplicabilityScope;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface DeveloperSubscriptionDiscountSummary {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  revoked: number;
  exhausted: number;
  totalUsage: number;
  totalDiscountAmountPen: number;
  totalDiscountAmountUsd: number;
}

export interface DiscountUsageHistory {
  id: number;
  discountId: number;
  developerId: number;
  developerName: string;
  planCode: string;
  planName: string;
  originalAmountPen: number;
  originalAmountUsd: number;
  discountAmountPen: number;
  discountAmountUsd: number;
  finalAmountPen: number;
  finalAmountUsd: number;
  currency: 'PEN' | 'USD';
  operationType: 'NEW_CONTRACT' | 'RENEWAL';
  usedAt: string;
  subscriptionId?: number;
  paymentId?: number;
}

export interface DeveloperSubscriptionDiscountStats {
  developerId: number;
  developerName: string;
  totalDiscounts: number;
  activeDiscounts: number;
  totalUsage: number;
  totalDiscountGivenPen: number;
  totalDiscountGivenUsd: number;
  currentMonthUsage: number;
  currentMonthDiscountPen: number;
  currentMonthDiscountUsd: number;
}