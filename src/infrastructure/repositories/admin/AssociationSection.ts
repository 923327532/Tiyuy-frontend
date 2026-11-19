/**
 * Admin repository — Association and central discount methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  DeveloperAgentAssociation,
  CreateAssociationRequest,
  ReviewAssociationRequest,
  DeveloperSearchFilter,
  DeveloperResponse,
  CentralDiscountDto,
  CentralDiscountSummary,
} from '@/core/domain/entities/Admin';
import { DeveloperDiscountSection } from './DeveloperDiscountSection';

export abstract class AssociationSection extends DeveloperDiscountSection {
  // Developer-Agent Association endpoints
  async getMyDeveloperAssociation(): Promise<DeveloperAgentAssociation | null> {
    try {
      const response = await axiosClient.get(`${this.basePath}/developers/agents/me/developer-association`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async requestDeveloperAssociation(data: CreateAssociationRequest): Promise<DeveloperAgentAssociation> {
    const response = await axiosClient.post(`${this.basePath}/developers/agents/me/developer-association-requests`, data);
    return response.data;
  }

  async cancelDeveloperAssociationRequest(requestId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/agents/me/developer-association-requests/${requestId}`);
  }

  async searchDevelopers(params: DeveloperSearchFilter): Promise<PaginatedResponse<DeveloperResponse>> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.city) searchParams.append('city', params.city);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const url = `${this.basePath}/developers/search?${searchParams.toString()}`;
    console.log('AdminRepository.searchDevelopers - URL:', url);
    console.log('AdminRepository.searchDevelopers - params:', params);

    const response = await axiosClient.get(url);
    console.log('AdminRepository.searchDevelopers - response:', response.data);
    return response.data;
  }

  async getDeveloperAssociationRequests(developerId: number): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/association-requests`);
    return response.data;
  }

  async getDeveloperAssociationRequestsPaginated(developerId: number, status: string | null = null, page: number = 0, size: number = 6): Promise<PaginatedResponse<DeveloperAgentAssociation>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/association-requests/paginated?${params.toString()}`);
    return response.data;
  }

  async getDeveloperAgentAssociationsPaginated(developerId: number, status: string | null = null, page: number = 0, size: number = 6): Promise<PaginatedResponse<DeveloperAgentAssociation>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/associations/paginated?${params.toString()}`);
    return response.data;
  }

  async getAllPendingAssociationRequests(): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/association-requests/admin/all-pending`);
    return response.data;
  }

  async getAllAssociationRequests(status: string | null = null, page: number = 0, size: number = 10): Promise<PaginatedResponse<DeveloperAgentAssociation>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await axiosClient.get(`${this.basePath}/developers/association-requests/admin/all?${params.toString()}`);
    return response.data;
  }

  async approveDeveloperAssociation(associationId: number, data: ReviewAssociationRequest): Promise<void> {
    await axiosClient.post(`${this.basePath}/developers/association-requests/${associationId}/approve`, data);
  }

  async rejectDeveloperAssociation(associationId: number, data: ReviewAssociationRequest): Promise<void> {
    await axiosClient.post(`${this.basePath}/developers/association-requests/${associationId}/reject`, data);
  }

  async getDeveloperAgentAssociations(developerId: number): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/associations`);
    return response.data;
  }

  async removeDeveloperAgent(developerId: number, agentId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${developerId}/agents/${agentId}`);
  }

  async getAdminDeveloperAgents(developerId: number): Promise<DeveloperAgentAssociation[]> {
    const response = await axiosClient.get(`${this.basePath}/admin/developers/${developerId}/agents`);
    return response.data;
  }

  async addAdminDeveloperAgent(developerId: number, agentId: number): Promise<DeveloperAgentAssociation> {
    const response = await axiosClient.post(`${this.basePath}/admin/developers/${developerId}/agents`, { agentId });
    return response.data;
  }

  // ================== Central Discount Management ==================

  async getCentralDiscounts(params: {
    source?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<CentralDiscountDto>> {
    const response = await axiosClient.get('/admin/central-discounts', { params });
    return response.data;
  }

  async getCentralDiscountSummary(): Promise<CentralDiscountSummary> {
    const response = await axiosClient.get('/admin/central-discounts/summary');
    return response.data;
  }


}
