/**
 * Admin repository — Admin account and user management methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import {
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  CreateAdminAccountRequest,
  UserListItem,
  InternationalUserListItem,
  ChangeUserRoleRequest,
  UserPropertiesResponse,
  UserProjectsResponse,
} from '@/core/domain/entities/Admin';
import { DashboardSection } from './DashboardSection';

export abstract class UsersSection extends DashboardSection {
  // Admin User Management
  async getAllAdmins(params: PaginationParams): Promise<PaginatedResponse<AdminUser>> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/admins?${searchParams.toString()}`);
    return response.data;
  }

  async getAdminById(adminId: number): Promise<AdminUser> {
    const response = await axiosClient.get(`${this.basePath}/admins/${adminId}`);
    return response.data;
  }

  async getAdminByUserId(userId: number): Promise<AdminUser> {
    const response = await axiosClient.get(`${this.basePath}/admins/by-user/${userId}`);
    return response.data;
  }

  async createAdminUser(request: CreateAdminUserRequest): Promise<AdminUser> {
    const response = await axiosClient.post(`${this.basePath}/admins`, request);
    return response.data;
  }

  async updateAdminUser(adminId: number, request: UpdateAdminUserRequest): Promise<AdminUser> {
    const response = await axiosClient.put(`${this.basePath}/admins/${adminId}`, request);
    return response.data;
  }

  async deleteAdminUser(adminId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/admins/${adminId}`);
  }

  async toggleAdminStatus(adminId: number, active: boolean): Promise<AdminUser> {
    const response = await axiosClient.patch(`${this.basePath}/admins/${adminId}/status`, { active });
    return response.data;
  }

  // SuperAdmin: Create admin/support accounts (User creation)
  async createAdminAccount(request: CreateAdminAccountRequest): Promise<{ userId: number; email: string }> {
    const response = await axiosClient.post(`${this.basePath}/superadmin/create-admin`, request);
    return response.data;
  }

  async createSupportAccount(request: CreateAdminAccountRequest): Promise<{ userId: number; email: string }> {
    const response = await axiosClient.post(`${this.basePath}/superadmin/create-support`, request);
    return response.data;
  }

  // User Management
  async getAllUsers(
    role?: string,
    enabled?: boolean,
    keyword?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<UserListItem>> {
    const queryParams = new URLSearchParams();
    if (role) queryParams.set('role', role);
    if (enabled !== undefined) queryParams.set('enabled', enabled.toString());
    if (keyword) queryParams.set('keyword', keyword);
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.sort) queryParams.set('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/users?${queryParams.toString()}`);
    return response.data;
  }

  async getUserById(userId: number): Promise<UserListItem> {
    const response = await axiosClient.get(`${this.basePath}/users/${userId}`);
    return response.data;
  }

  // ── Usuarios internacionales (sección "Extranjeros") ─────────────────────
  async getInternationalUsers(
    params?: PaginationParams
  ): Promise<PaginatedResponse<InternationalUserListItem>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.sort) queryParams.set('sort', params.sort);

    const response = await axiosClient.get(`${this.basePath}/international?${queryParams.toString()}`);
    return response.data;
  }

  async approveInternationalUser(userId: number): Promise<InternationalUserListItem> {
    const response = await axiosClient.put(`${this.basePath}/international/${userId}/approve`);
    return response.data;
  }

  async rejectInternationalUser(userId: number, reason?: string): Promise<InternationalUserListItem> {
    const queryParams = new URLSearchParams();
    if (reason) queryParams.set('reason', reason);
    const response = await axiosClient.put(`${this.basePath}/international/${userId}/reject?${queryParams.toString()}`);
    return response.data;
  }

  async toggleUserStatus(userId: number, enabled: boolean, reason?: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('enabled', enabled.toString());
    if (reason) params.append('reason', reason);
    await axiosClient.put(`${this.basePath}/users/${userId}/status?${params.toString()}`);
  }

  async deleteUser(userId: number, reason?: string): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    await axiosClient.delete(`${this.basePath}/users/${userId}?${params.toString()}`);
  }

  async changeUserRole(userId: number, request: ChangeUserRoleRequest): Promise<void> {
    await axiosClient.put(`${this.basePath}/users/${userId}/role`, request);
  }

  async verifyUserEmail(userId: number): Promise<void> {
    await axiosClient.put(`${this.basePath}/users/${userId}/verify-email`);
  }

  async verifyUserPhone(userId: number): Promise<void> {
    await axiosClient.put(`${this.basePath}/users/${userId}/verify-phone`);
  }

  async getUserProperties(userId: number): Promise<UserPropertiesResponse> {
    const response = await axiosClient.get(`${this.basePath}/users/${userId}/properties`);
    return response.data;
  }

  async getUserProjects(userId: number): Promise<UserProjectsResponse> {
    const response = await axiosClient.get(`${this.basePath}/users/${userId}/projects`);
    return response.data;
  }

}
