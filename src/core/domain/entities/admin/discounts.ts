/**
 * Admin domain entities — Discount code entities
 */
// Discount code status matching backend
export type DiscountCodeStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'USED';

// Discount applicability matching backend
export type DiscountApplicability = 'GLOBAL' | 'PLAN_SPECIFIC' | 'USER_SPECIFIC' | 'PROJECT_SPECIFIC' | 'AGENCY_SPECIFIC';

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

