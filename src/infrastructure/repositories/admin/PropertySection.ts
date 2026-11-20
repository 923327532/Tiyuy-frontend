/**
 * Admin repository — Property moderation and agent methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  PropertyModerationItem,
  ModeratePropertyRequest,
  PropertyComment,
  NotifyOwnerRequest,
} from '@/core/domain/entities/Admin';
import { PropertyReport } from '@/core/domain/entities/Moderation';
import { DiscountCampaignSection } from './DiscountCampaignSection';

export abstract class PropertySection extends DiscountCampaignSection {
  // Property Moderation
  async getPropertiesForModeration(
    status?: string,
    keyword?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<PropertyModerationItem>> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    if (keyword) searchParams.append('keyword', keyword);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await axiosClient.get(`${this.basePath}/properties?${searchParams.toString()}`);
    return response.data;
  }

  async getPropertyForModeration(propertyId: number): Promise<PropertyModerationItem> {
    const response = await axiosClient.get(`${this.basePath}/properties/${propertyId}`);
    return response.data;
  }

  async getPropertyModerationStats(): Promise<Record<string, number>> {
    const response = await axiosClient.get(`${this.basePath}/properties/stats`);
    return response.data;
  }

  async moderateProperty(propertyId: number, request: ModeratePropertyRequest): Promise<void> {
    await axiosClient.put(`${this.basePath}/properties/${propertyId}/moderate`, request);
  }

  async toggleFeaturedProperty(propertyId: number, featured: boolean): Promise<void> {
    if (featured) {
      await axiosClient.post(`/featured/properties/${propertyId}`);
    } else {
      await axiosClient.delete(`/featured/properties/${propertyId}`);
    }
  }

  async deletePropertyAsAdmin(propertyId: number, reason?: string): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    await axiosClient.delete(`${this.basePath}/properties/${propertyId}?${params.toString()}`);
  }

  async getPropertyReports(propertyId: number): Promise<PropertyReport[]> {
    const response = await axiosClient.get(`${this.basePath}/properties/${propertyId}/reports`);
    return response.data;
  }

  async getPropertyComments(propertyId: number): Promise<PropertyComment[]> {
    const response = await axiosClient.get(`${this.basePath}/properties/${propertyId}/comments`);
    return response.data;
  }

  async deletePropertyComment(propertyId: number, commentId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/properties/${propertyId}/comments/${commentId}`);
  }

  async notifyPropertyOwner(propertyId: number, request: NotifyOwnerRequest): Promise<void> {
    await axiosClient.post(`${this.basePath}/properties/${propertyId}/notify-owner`, request);
  }

  async disablePropertyByAdmin(propertyId: number, reason?: string, notifyOwner: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyOwner', notifyOwner.toString());
    await axiosClient.post(`${this.basePath}/properties/${propertyId}/disable?${params.toString()}`);
  }

  async enablePropertyByAdmin(propertyId: number, reason?: string, notifyOwner: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyOwner', notifyOwner.toString());
    await axiosClient.post(`${this.basePath}/properties/${propertyId}/enable?${params.toString()}`);
  }

  // Agent Management
  async getAgents(
    role?: string,
    enabled?: boolean,
    keyword?: string,
    params: PaginationParams = { page: 0, size: 20 }
  ): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    if (role) searchParams.append('role', role);
    if (enabled !== undefined) searchParams.append('enabled', enabled.toString());
    if (keyword) searchParams.append('keyword', keyword);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    // Use the same endpoint as agencies page but filter by AGENT role
    const response = await axiosClient.get(`${this.basePath}/users?${searchParams.toString()}`);
    return response.data;
  }

  async getAgentById(agentId: number): Promise<any> {
    const response = await axiosClient.get(`${this.basePath}/users/${agentId}`);
    return response.data;
  }

  async toggleAgentVerification(agentId: number, verified: boolean, reason?: string): Promise<void> {
    // This would need to be implemented in backend - for now use user status toggle
    const params = new URLSearchParams();
    params.append('enabled', verified.toString());
    if (reason) params.append('reason', reason);
    await axiosClient.put(`${this.basePath}/users/${agentId}/status?${params.toString()}`);
  }


}
