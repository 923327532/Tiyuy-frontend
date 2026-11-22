/**
 * Admin repository — Developer / inmobiliaria methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  InmobiliariaFilter,
  InmobiliariaWithStats,
  DeveloperResponse,
  InmobiliariaStatusHistory,
  InmobiliariaAgent,
  InmobiliariaDiscount,
  CreateInmobiliariaDiscountRequest,
  ApplyDirectDiscountRequest,
} from '@/core/domain/entities/Admin';
import { FinanceSection } from './FinanceSection';

export abstract class DeveloperSection extends FinanceSection {
  // ============================================
  // DEVELOPER / INMOBILIARIA MANAGEMENT
  // ============================================

  async getDevelopers(filter?: InmobiliariaFilter): Promise<PaginatedResponse<InmobiliariaWithStats>> {
    const searchParams = new URLSearchParams();
    if (filter?.search) searchParams.append('search', filter.search);
    if (filter?.status) searchParams.append('status', filter.status);
    if (filter?.page !== undefined) searchParams.append('page', filter.page.toString());
    if (filter?.size !== undefined) searchParams.append('size', filter.size.toString());

    const response = await axiosClient.get(`${this.basePath}/developers?${searchParams.toString()}`);
    return response.data;
  }

  async searchDeveloperDiscountTargets(search: string): Promise<PaginatedResponse<DeveloperResponse>> {
    const searchParams = new URLSearchParams({
      search,
      page: '0',
      size: '10',
    });
    const response = await axiosClient.get(`${this.basePath}/developers?${searchParams.toString()}`);
    return response.data;
  }

  async getDeveloperById(id: number): Promise<InmobiliariaWithStats> {
    const response = await axiosClient.get(`${this.basePath}/developers/${id}`);
    return response.data;
  }

  async changeDeveloperStatus(id: number, data: { status: string; reason?: string; notifyDeveloper?: boolean }): Promise<void> {
    console.log('[DEBUG AdminRepository] changeDeveloperStatus llamado:', { id, data });
    console.log('[DEBUG AdminRepository] URL:', `${this.basePath}/developers/${id}/status`);
    try {
      const response = await axiosClient.put(`${this.basePath}/developers/${id}/status`, data);
      console.log('[DEBUG AdminRepository] Respuesta exitosa:', response.status);
    } catch (error) {
      console.error('[DEBUG AdminRepository] Error en petición:', error);
      throw error;
    }
  }

  async getDeveloperStatusHistory(
    id: number,
    page: number = 0,
    size: number = 10
  ): Promise<{ content: InmobiliariaStatusHistory[]; totalElements: number; totalPages: number; number: number }> {
    const response = await axiosClient.get(
      `${this.basePath}/developers/${id}/status-history?page=${page}&size=${size}&sort=createdAt,desc`
    );
    return response.data;
  }

  async clearDeveloperStatusHistory(id: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${id}/status-history/clear`);
  }

  async deleteStatusHistoryEntry(developerId: number, entryId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${developerId}/status-history/${entryId}`);
  }

  async addDeveloperStatusHistory(developerId: number, data: {
    previousStatus?: string;
    newStatus: string;
    reason?: string;
    changedBy?: string;
  }): Promise<InmobiliariaStatusHistory> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/status-history`, data);
    return response.data;
  }

  async getDeveloperAgents(id: number): Promise<InmobiliariaAgent[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${id}/agents`);
    return response.data;
  }

  async assignAgentToDeveloper(developerId: number, data: { agentId: number; licenseNumber?: string }): Promise<InmobiliariaAgent> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/agents`, data);
    return response.data;
  }

  async removeAgentFromDeveloper(developerId: number, agentId: number, reason?: string): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/${developerId}/agents/${agentId}`, {
      params: { reason }
    });
  }

  async getDeveloperDiscountCodes(developerId: number): Promise<InmobiliariaDiscount[]> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/discount-codes`);
    return response.data;
  }

  async createDeveloperDiscountCode(developerId: number, data: CreateInmobiliariaDiscountRequest): Promise<InmobiliariaDiscount> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/discount-codes`, data);
    return response.data;
  }

  async toggleDeveloperDiscountCodeStatus(discountId: number, status: string): Promise<void> {
    await axiosClient.patch(`${this.basePath}/developers/discount-codes/${discountId}/status?status=${status}`);
  }

  async deleteDeveloperDiscountCode(discountId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/developers/discount-codes/${discountId}`);
  }

  async applyDirectDiscountToDeveloper(developerId: number, data: ApplyDirectDiscountRequest): Promise<{ discountId: number; appliedCount: number; failedCount: number }> {
    const response = await axiosClient.post(`${this.basePath}/developers/${developerId}/apply-discount`, data);
    return response.data;
  }

  async notifyDeveloper(developerId: number, data: { subject: string; message: string; sendEmail: boolean; sendInApp: boolean }): Promise<void> {
    await axiosClient.post(`${this.basePath}/developers/${developerId}/notify`, data);
  }

  async getDeveloperStats(developerId: number): Promise<{
    developerId: number;
    totalAgents: number;
    activeAgents: number;
    verifiedAgents: number;
    inactiveAgents: number;
    totalDiscountCodes: number;
    hasActiveDirectDiscount: boolean;
  }> {
    const response = await axiosClient.get(`${this.basePath}/developers/${developerId}/stats`);
    return response.data;
  }


}
