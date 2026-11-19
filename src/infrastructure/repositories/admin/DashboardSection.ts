/**
 * Admin repository — Dashboard, audit log and catalog methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  AdminUser,
  DashboardStats,
  PropertyAnalyticsResponse,
  UserStats,
  FinanceStats,
  UserRegistrationHistory,
  AuditLogEntry,
  Department,
  Permission,
} from '@/core/domain/entities/Admin';
import { AdminRepositoryCore } from './AdminRepositoryCore';

export abstract class DashboardSection extends AdminRepositoryCore {
  // Dashboard & Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats`);
    return response.data;
  }

  async getPropertyAnalytics(): Promise<PropertyAnalyticsResponse> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/properties`);
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats/users`);
    return response.data;
  }

  async getFinanceStats(): Promise<FinanceStats> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats/finance`);
    return response.data;
  }

  async getUserRegistrationHistory(period: string = '1M'): Promise<UserRegistrationHistory> {
    const response = await axiosClient.get(`${this.basePath}/dashboard/stats/registration-history`, {
      params: { period }
    });
    return response.data;
  }

  // Audit Logs
  async getAuditLogs(
    entityType?: string,
    adminUserId?: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AuditLogEntry>> {
    const searchParams = new URLSearchParams();
    if (entityType) searchParams.append('entityType', entityType);
    if (adminUserId !== undefined) searchParams.append('adminUserId', adminUserId.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/audit-logs?${searchParams.toString()}`);
    return response.data;
  }

  async getAuditLogById(logId: number): Promise<AuditLogEntry> {
    const response = await axiosClient.get(`${this.basePath}/audit-logs/${logId}`);
    return response.data;
  }

  async getAuditLogsByUser(userId: number, params: PaginationParams): Promise<PaginatedResponse<AuditLogEntry>> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/audit-logs/user/${userId}?${searchParams.toString()}`);
    return response.data;
  }

  async getAuditLogsByEntity(entityType: string, entityId: number): Promise<AuditLogEntry[]> {
    const response = await axiosClient.get(`${this.basePath}/audit-logs/entity/${entityType}/${entityId}`);
    return response.data;
  }

  // Departments & Permissions
  async getAllDepartments(): Promise<Department[]> {
    const response = await axiosClient.get(`${this.basePath}/departments`);
    return response.data;
  }

  async getAllPermissions(): Promise<Permission[]> {
    const response = await axiosClient.get(`${this.basePath}/permissions`);
    return response.data;
  }

}
