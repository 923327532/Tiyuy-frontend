/**
 * Admin repository — Developer subscription discount methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  DeveloperSubscriptionDiscount,
  CreateDeveloperSubscriptionDiscountRequest,
  UpdateDeveloperSubscriptionDiscountRequest,
  DeveloperSubscriptionDiscountFilters,
  DeveloperSubscriptionDiscountSummary,
  DiscountUsageHistory,
  DeveloperSubscriptionDiscountStats,
  DiscountStatus,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { DeveloperSection } from './DeveloperSection';

export abstract class DeveloperDiscountSection extends DeveloperSection {
  // ============================================
  // DEVELOPER SUBSCRIPTION DISCOUNTS (Direct discounts for subscriptions)
  // TODO: Backend endpoints need to be implemented
  // ============================================

  async getDeveloperSubscriptionDiscounts(
    filters: DeveloperSubscriptionDiscountFilters = {}
  ): Promise<PaginatedResponse<DeveloperSubscriptionDiscount>> {
    const searchParams = new URLSearchParams();
    if (filters.developerId) searchParams.append('developerId', filters.developerId.toString());
    if (filters.status) searchParams.append('status', filters.status);
    if (filters.type) searchParams.append('type', filters.type);
    if (filters.applicabilityScope) searchParams.append('applicabilityScope', filters.applicabilityScope);
    if (filters.dateFrom) searchParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) searchParams.append('dateTo', filters.dateTo);
    if (filters.search) searchParams.append('search', filters.search);
    if (filters.page !== undefined) searchParams.append('page', filters.page.toString());
    if (filters.size !== undefined) searchParams.append('size', filters.size.toString());
    if (filters.sort) searchParams.append('sort', filters.sort);

    const response = await axiosClient.get(`${this.basePath}/developers/subscription-discounts?${searchParams.toString()}`);
    return response.data;
  }

  async getDeveloperSubscriptionDiscountById(id: number): Promise<DeveloperSubscriptionDiscount> {
    const response = await axiosClient.get(`${this.basePath}/developers/subscription-discounts/${id}`);
    return response.data;
  }

  async createDeveloperSubscriptionDiscount(
    data: CreateDeveloperSubscriptionDiscountRequest
  ): Promise<DeveloperSubscriptionDiscount> {
    const response = await axiosClient.post(`${this.basePath}/developers/subscription-discounts`, data);
    return response.data;
  }

  async updateDeveloperSubscriptionDiscount(
    id: number,
    data: UpdateDeveloperSubscriptionDiscountRequest
  ): Promise<DeveloperSubscriptionDiscount> {
    const response = await axiosClient.put(`${this.basePath}/developers/subscription-discounts/${id}`, data);
    return response.data;
  }

  async deleteDeveloperSubscriptionDiscount(id: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/subscription-discounts/${id}`);
  }

  async revokeDeveloperSubscriptionDiscount(id: number, reason?: string): Promise<void> {
    await axiosClient.post(`${this.basePath}/developers/subscription-discounts/${id}/revoke`, { reason });
  }

  async toggleDeveloperSubscriptionDiscountStatus(
    id: number,
    status: DiscountStatus
  ): Promise<void> {
    await axiosClient.patch(`${this.basePath}/developers/subscription-discounts/${id}/status?status=${status}`);
  }

  async getDeveloperSubscriptionDiscountSummary(): Promise<DeveloperSubscriptionDiscountSummary> {
    const response = await axiosClient.get(`${this.basePath}/developers/subscription-discounts/summary`);
    return response.data;
  }

  async getDeveloperSubscriptionDiscountUsageHistory(
    discountId: number,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<DiscountUsageHistory>> {
    const response = await axiosClient.get(
      `${this.basePath}/developers/subscription-discounts/${discountId}/usage-history?page=${page}&size=${size}`
    );
    return response.data;
  }

  async getDeveloperSubscriptionDiscountStats(developerId: number): Promise<DeveloperSubscriptionDiscountStats> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/subscription-discount-stats`);
    return response.data;
  }

  // Public endpoints for checkout validation
  async validateDeveloperSubscriptionDiscount(
    developerId: number,
    planCode: string,
    currency: 'PEN' | 'USD',
    isRenewal: boolean
  ): Promise<{
    valid: boolean;
    discountId?: number;
    type?: 'PERCENTAGE' | 'FIXED_AMOUNT';
    percentage?: number;
    amountPen?: number;
    amountUsd?: number;
    originalPricePen?: number;
    originalPriceUsd?: number;
    discountedPricePen?: number;
    discountedPriceUsd?: number;
    maxDiscountPen?: number;
    maxDiscountUsd?: number;
    message: string;
  }> {
    const response = await axiosClient.post(`${this.basePath}/developers/validate-subscription-discount`, {
      developerId,
      planCode,
      currency,
      isRenewal,
    });
    return response.data;
  }

  async applyDeveloperSubscriptionDiscount(
    developerId: number,
    planCode: string,
    currency: 'PEN' | 'USD',
    isRenewal: boolean,
    subscriptionId?: number
  ): Promise<{
    success: boolean;
    discountId: number;
    discountAmountPen: number;
    discountAmountUsd: number;
    finalPricePen: number;
    finalPriceUsd: number;
    message: string;
  }> {
    const response = await axiosClient.post(`${this.basePath}/developers/apply-subscription-discount`, {
      developerId,
      planCode,
      currency,
      isRenewal,
      subscriptionId,
    });
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

}
