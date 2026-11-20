/**
 * Admin repository — Marketing module methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  MarketingStats,
  PromotionCampaign,
  CreatePromotionCampaignRequest,
  UpdatePromotionCampaignRequest,
  Banner,
  CreateBannerRequest,
  FestiveCampaign,
  CreateFestiveCampaignRequest,
  BannerDisplayMode,
} from '@/core/domain/entities/Admin';
import { AssociationSection } from './AssociationSection';

export abstract class MarketingSection extends AssociationSection {
  // ================== Marketing Module ==================

  async getMarketingStats(): Promise<MarketingStats> {
    const response = await axiosClient.get('/v1/admin/marketing/stats');
    return response.data;
  }

  async getPromotionCampaigns(params?: { page?: number; size?: number; status?: string }): Promise<PaginatedResponse<PromotionCampaign>> {
    const response = await axiosClient.get('/v1/admin/marketing/campaigns', { params });
    return response.data;
  }

  async getPromotionCampaignById(id: number): Promise<PromotionCampaign> {
    const response = await axiosClient.get(`/v1/admin/marketing/campaigns/${id}`);
    return response.data;
  }

  async createPromotionCampaign(request: CreatePromotionCampaignRequest): Promise<PromotionCampaign> {
    const response = await axiosClient.post('/v1/admin/marketing/campaigns', request);
    return response.data;
  }

  async updatePromotionCampaign(id: number, request: UpdatePromotionCampaignRequest): Promise<PromotionCampaign> {
    const response = await axiosClient.put(`/v1/admin/marketing/campaigns/${id}`, request);
    return response.data;
  }

  async deletePromotionCampaign(id: number): Promise<void> {
    await axiosClient.delete(`/v1/admin/marketing/campaigns/${id}`);
  }

  async approvePromotionCampaign(id: number): Promise<void> {
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/approve`);
  }

  async rejectPromotionCampaign(id: number, reason?: string): Promise<void> {
    const params = reason ? { reason } : {};
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/reject`, null, { params });
  }

  async suspendPromotionCampaign(id: number, reason?: string): Promise<void> {
    const params = reason ? { reason } : {};
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/suspend`, null, { params });
  }

  async reactivatePromotionCampaign(id: number): Promise<void> {
    await axiosClient.post(`/v1/admin/marketing/campaigns/${id}/reactivate`);
  }

  async getBanners(params?: { page?: number; size?: number; location?: string }): Promise<Banner[]> {
    const response = await axiosClient.get('/v1/admin/marketing/banners');
    return response.data;
  }

  async createBanner(request: CreateBannerRequest): Promise<Banner> {
    const response = await axiosClient.post('/v1/admin/marketing/banners', request);
    return response.data;
  }

  /**
   * Create a banner with image upload (multipart/form-data).
   * The image is uploaded to S3 and the banner is created with the resulting URL.
   */
  async createBannerWithUpload(
    image: File,
    title: string,
    placement: string,
    displayMode?: 'SOLO_BANNER' | 'INTEGRATED',
    description?: string,
    linkUrl?: string,
    durationDays?: number,
    displayOrder?: number
  ): Promise<Banner> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('placement', placement);
    if (displayMode) formData.append('displayMode', displayMode);
    if (description) formData.append('description', description);
    if (linkUrl) formData.append('linkUrl', linkUrl);
    if (durationDays !== undefined) formData.append('durationDays', String(durationDays));
    if (displayOrder !== undefined) formData.append('displayOrder', String(displayOrder));

    const response = await axiosClient.post('/v1/admin/marketing/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }


  async updateBanner(id: number, request: Partial<CreateBannerRequest>): Promise<Banner> {
    const response = await axiosClient.put(`/v1/admin/marketing/banners/${id}`, request);
    return response.data;
  }

  async toggleBanner(id: number): Promise<void> {
    await axiosClient.post(`/v1/admin/marketing/banners/${id}/toggle`);
  }

  async deleteBanner(id: number): Promise<void> {
    await axiosClient.delete(`/v1/admin/marketing/banners/${id}`);
  }

  async getFestiveCampaigns(params?: { page?: number; size?: number }): Promise<FestiveCampaign[]> {
    const response = await axiosClient.get('/v1/admin/marketing/festive');
    return response.data;
  }

  async createFestiveCampaign(request: CreateFestiveCampaignRequest): Promise<FestiveCampaign> {
    const response = await axiosClient.post('/v1/admin/marketing/festive', request);
    return response.data;
  }

  async updateFestiveCampaign(id: number, request: Partial<CreateFestiveCampaignRequest>): Promise<FestiveCampaign> {
    const response = await axiosClient.put(`/v1/admin/marketing/festive/${id}`, request);
    return response.data;
  }

  async deleteFestiveCampaign(id: number): Promise<void> {
    await axiosClient.delete(`/v1/admin/marketing/festive/${id}`);
  }


}
