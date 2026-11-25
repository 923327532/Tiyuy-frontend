/**
 * Admin repository — Discount code and campaign methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  DiscountCode,
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignAlert,
} from '@/core/domain/entities/Admin';
import { UsersSection } from './UsersSection';

export abstract class DiscountCampaignSection extends UsersSection {
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

  // Campaigns - Use /v1/admin/marketing/campaigns endpoints (matches AdminMarketingController)
  async getAllCampaigns(params: PaginationParams): Promise<PaginatedResponse<Campaign>> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`/v1/admin/marketing/campaigns?${searchParams.toString()}`);
    return response.data;
  }

  async getCampaignById(campaignId: number): Promise<Campaign> {
    const response = await axiosClient.get(`/v1/admin/marketing/campaigns/${campaignId}`);
    return response.data;
  }

  async createCampaign(request: CreateCampaignRequest): Promise<Campaign> {
    const response = await axiosClient.post(`/v1/admin/marketing/campaigns`, request);
    return response.data;
  }

  async updateCampaign(campaignId: number, request: UpdateCampaignRequest): Promise<Campaign> {
    const response = await axiosClient.put(`/v1/admin/marketing/campaigns/${campaignId}`, request);
    return response.data;
  }

  async deleteCampaign(campaignId: number): Promise<void> {
    await axiosClient.delete(`/v1/admin/marketing/campaigns/${campaignId}`);
  }

  async getCampaignAlerts(): Promise<CampaignAlert[]> {
    const response = await axiosClient.get(`/v1/admin/marketing/campaigns/alerts`);
    return response.data;
  }

}
