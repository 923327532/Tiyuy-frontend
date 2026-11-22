/**
 * Admin repository — Finance, subscription and plan methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  SubscriptionPlan,
  AgencyPlanDiscount,
  FinanceHistoryDto,
} from '@/core/domain/entities/Admin';
import { AgentSection } from './AgentSection';

export abstract class FinanceSection extends AgentSection {
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


}
