/**
 * Admin repository — Support ticket methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  SupportTicket,
  SupportTicketStats,
  CreateSupportTicketRequest,
  UpdateSupportTicketStatusRequest,
} from '@/core/domain/entities/Admin';
import { MarketingSection } from './MarketingSection';

export abstract class SupportSection extends MarketingSection {
  // ==================== Support Tickets ====================

  async getSupportTickets(params?: {
    status?: string;
    category?: string;
    severity?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<SupportTicket>> {
    const response = await axiosClient.get('/v1/admin/support/tickets', { params });
    return response.data;
  }

  async getSupportTicketById(ticketId: number): Promise<SupportTicket> {
    const response = await axiosClient.get(`/v1/admin/support/tickets/${ticketId}`);
    return response.data;
  }

  async getSupportTicketStats(): Promise<SupportTicketStats> {
    const response = await axiosClient.get('/v1/admin/support/tickets/stats');
    return response.data;
  }

  async createSupportTicket(request: CreateSupportTicketRequest): Promise<SupportTicket> {
    const response = await axiosClient.post('/v1/admin/support/tickets', request);
    return response.data;
  }

  async updateSupportTicketStatus(ticketId: number, request: UpdateSupportTicketStatusRequest): Promise<SupportTicket> {
    const response = await axiosClient.put(`/v1/admin/support/tickets/${ticketId}/status`, request);
    return response.data;
  }

  async notifyTicketUser(ticketId: number, data: { subject: string; message: string; sendEmail: boolean; sendInApp: boolean }): Promise<void> {
    await axiosClient.post(`/v1/admin/support/tickets/${ticketId}/notify`, data);
  }


}
