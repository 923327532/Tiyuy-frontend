/**
 * Admin repository — Project moderation methods.
 */
import { axiosClient } from '@/infrastructure/api/axios-client';
import { PaginationParams, PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import { PropertySection } from './PropertySection';

export abstract class ProjectSection extends PropertySection {
  // Project Management
  async getProjectsForAdmin(
    status?: string,
    keyword?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    if (keyword) searchParams.append('keyword', keyword);
    if (pagination?.page !== undefined) searchParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) searchParams.append('size', pagination.size.toString());
    if (pagination?.sort) searchParams.append('sort', pagination.sort);

    const response = await axiosClient.get(`${this.basePath}/projects?${searchParams.toString()}`);
    
    // Transform backend format (priceFrom/priceTo) to frontend format (priceRange.min/max)
    const data = response.data;
    if (data.content && Array.isArray(data.content)) {
      data.content = data.content.map((project: any) => ({
        ...project,
        priceRange: {
          min: project.priceFrom || 0,
          max: project.priceTo || 0
        },
        // Add default values for fields that may be missing from backend
        soldUnits: project.soldUnits || 0,
        constructionProgress: project.constructionProgress || 0,
        lifecycleStatus: project.lifecycleStatus || project.status || 'DRAFT',
        city: project.city || project.province || '',
        country: project.country || 'Peru',
        viewsCount: project.viewsCount || 0,
        favoritesCount: project.favoritesCount || 0,
        inquiriesCount: project.inquiriesCount || 0,
        isActive: project.isActive ?? true,
      }));
    }
    
    return data;
  }

  async getProjectStats(): Promise<any> {
    const url = `${this.basePath}/projects/project-stats`;
    console.log('[AdminRepository] Fetching project stats from:', url);
    const response = await axiosClient.get(url);
    console.log('[AdminRepository] Project stats response:', response.data);
    return response.data;
  }

  async moderateProject(projectId: number, request: any): Promise<void> {
    await axiosClient.put(`${this.basePath}/projects/${projectId}/moderate`, request);
  }

  async toggleFeaturedProject(projectId: number, featured: boolean): Promise<void> {
    if (featured) {
      await axiosClient.post(`/featured/projects/${projectId}`);
    } else {
      await axiosClient.delete(`/featured/projects/${projectId}`);
    }
  }

  async deleteProject(projectId: number, reason?: string): Promise<void> {
    const searchParams = reason ? new URLSearchParams({ reason }) : '';
    await axiosClient.delete(`${this.basePath}/projects/${projectId}${searchParams ? `?${searchParams.toString()}` : ''}`);
  }

  async getProjectReports(projectId: number): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/projects/${projectId}/reports`);
    return response.data;
  }

  async getProjectComments(projectId: number): Promise<any[]> {
    const response = await axiosClient.get(`${this.basePath}/projects/${projectId}/comments`);
    return response.data;
  }

  async deleteProjectComment(projectId: number, commentId: number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/projects/${projectId}/comments/${commentId}`);
  }

  async notifyProjectDeveloper(projectId: number, request: any): Promise<void> {
    await axiosClient.post(`${this.basePath}/projects/${projectId}/notify-developer`, request);
  }

  async disableProjectByAdmin(projectId: number, reason?: string, notifyDeveloper: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyDeveloper', notifyDeveloper.toString());
    await axiosClient.post(`${this.basePath}/projects/${projectId}/disable?${params.toString()}`);
  }

  async getProjectsSalesHistory(): Promise<{ labels: string[]; revenue: number[]; developers: number[]; projects: number[]; planDistribution: Record<string, Record<string, number>> }> {
    const response = await axiosClient.get(`${this.basePath}/projects/sales-history`);
    return response.data;
  }

  async getProjectsByStatus(): Promise<{ labels: string[]; values: number[] }> {
    const response = await axiosClient.get(`${this.basePath}/projects/by-status`);
    return response.data;
  }

  async enableProjectByAdmin(projectId: number, reason?: string, notifyDeveloper: boolean = true): Promise<void> {
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    params.append('notifyDeveloper', notifyDeveloper.toString());
    await axiosClient.post(`${this.basePath}/projects/${projectId}/enable?${params.toString()}`);
  }

  async reviewReport(reportId: number, approve: boolean, notes?: string): Promise<void> {
    await axiosClient.post(`${this.basePath}/reports/${reportId}/review`, {
      approve,
      notes
    });
  }


}
