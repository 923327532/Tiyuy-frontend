/**
 * Admin repository — Agent discount and agent dashboard methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  AgentDashboardStats,
  AgentListItem,
  DiscountCode,
} from '@/core/domain/entities/Admin';
import {
  AgentDiscount,
  AgentDiscountFilters,
  AgentDiscountSummary,
  AssignDiscountToAgentRequest,
  CreateAgentDiscountRequest,
} from '@/core/domain/entities/AgentDiscount';
import { ProjectSection } from './ProjectSection';

export abstract class AgentSection extends ProjectSection {
  // Agent Discount Management
  async getAgentDiscounts(
    filters: AgentDiscountFilters = {},
    params: PaginationParams = { page: 0, size: 20 }
  ): Promise<PaginatedResponse<AgentDiscount>> {
    const searchParams = new URLSearchParams();
    if (filters.agentId) searchParams.append('userId', filters.agentId.toString());
    if (filters.status) searchParams.append('status', filters.status.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/discounts/assignments?${searchParams.toString()}`);
    return response.data;
  }

  async getAgentDiscountSummary(agentId: number): Promise<AgentDiscountSummary> {
    const response = await axiosClient.get(`${this.basePath}/discounts/agent/${agentId}/summary`);
    return response.data;
  }

  async assignDiscountToAgent(request: AssignDiscountToAgentRequest): Promise<AgentDiscount> {
    const response = await axiosClient.post(`${this.basePath}/discounts/assignments`, request);
    return response.data;
  }

  async createAgentDiscount(request: CreateAgentDiscountRequest): Promise<AgentDiscount> {
    const response = await axiosClient.post(`${this.basePath}/discounts`, request);
    return response.data;
  }

  async removeDiscountFromAgent(assignmentId: number): Promise<void> {
    const response = await axiosClient.delete(`${this.basePath}/discounts/assignments/${assignmentId}`);
    return response.data;
  }

  async toggleAgentDiscountStatus(assignmentId: number): Promise<AgentDiscount> {
    const response = await axiosClient.put(`${this.basePath}/discounts/assignments/${assignmentId}/toggle`);
    return response.data;
  }

  async getAvailableDiscountsForAgent(agentId: number): Promise<DiscountCode[]> {
    const response = await axiosClient.get(`${this.basePath}/discounts/available?agentId=${agentId}`);
    return response.data;
  }

  // Agent Plan Discount Management - Custom pricing per agent per plan
  async createAgentPlanDiscount(
    agentId: number, 
    data: { 
      planCode: string; 
      discountPercentage?: number; 
      customPricePen?: number;
      validFrom?: string;
      validUntil?: string;
      notes?: string;
    }
  ): Promise<any> {
    const response = await axiosClient.post(`${this.basePath}/agents/${agentId}/plan-discounts`, data);
    return response.data;
  }

  async getAgentPlanDiscounts(agentId: number): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/agents/${agentId}/plan-discounts`);
    return response.data;
  }

  async removeAgentPlanDiscount(agentId: number, discountId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/agents/${agentId}/plan-discounts/${discountId}`);
  }

  async calculateAgentPlanPrice(agentId: number, planCode: string): Promise<any> {
    const response = await axiosClient.get(`${this.basePath}/agents/${agentId}/plan-price?planCode=${planCode}`);
    return response.data;
  }

  // Agent Dashboard
  async getAgentDashboardStats(period?: string): Promise<AgentDashboardStats> {
    const response = await axiosClient.get(`${this.basePath}/agents/dashboard-stats`, {
      params: period ? { period } : undefined,
    });
    return response.data;
  }

  async getAgentList(params: PaginationParams): Promise<PaginatedResponse<AgentListItem>> {
    const response = await axiosClient.get(`${this.basePath}/agents`, { params });
    return response.data;
  }

}
