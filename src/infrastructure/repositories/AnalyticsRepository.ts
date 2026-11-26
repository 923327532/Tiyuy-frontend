import { axiosClient } from '../api/axios-client';
import { IAnalyticsRepository } from '@/core/domain/repositories/IAnalyticsRepository';
import {
  PropertyViewEvent,
  PropertyStats,
  DashboardStats,
  AuditLogEntry,
  AuditLogFilters,
  UserActivity,
  ActivityStats,
  CommunicationEvent,
  CommunicationStats,
  AdminNotification,
  NotificationPreference,
  SystemAlert,
  RealtimeEvent,
  DashboardMetrics,
  AdminAlert,
  AlertStats,
  AlertFilters
} from '@/core/domain/entities/Analytics';

// Type for paginated admin alerts response
export type PaginatedAdminAlerts = {
  content: AdminAlert[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export class AnalyticsRepository implements IAnalyticsRepository {
  async trackPropertyView(event: PropertyViewEvent): Promise<void> {
    await axiosClient.post(`/analytics/track/properties/${event.propertyId}`, {
      sessionId: event.sessionId,
      referrer: event.referrer,
      userAgent: event.userAgent,
      deviceType: event.deviceType,
    });
  }

  async getPropertyStats(propertyId: number): Promise<PropertyStats> {
    const response = await axiosClient.get(`/analytics/properties/${propertyId}/stats`);
    return response.data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await axiosClient.get('/analytics/dashboard');
    return response.data;
  }

  async trackView(propertyId: number, data: {
    sessionId: string;
    referrer: string;
    userAgent: string;
    deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET';
  }): Promise<void> {
    await axiosClient.post(`/analytics/track/properties/${propertyId}`, data);
  }

  // Audit Log endpoints
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<{ content: AuditLogEntry[]; totalElements: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.adminId) params.append('adminUserId', filters.adminId.toString());
    if (filters.action) params.append('action', filters.action);
    if (filters.department) params.append('departmentType', filters.department);
    if (filters.startDate) params.append('start', filters.startDate);
    if (filters.endDate) params.append('end', filters.endDate);

    const response = await axiosClient.get(`/admin/audit-logs?${params.toString()}`);
    return response.data;
  }

  async getAuditLogsByAction(action: string, page = 0, size = 20): Promise<{ content: AuditLogEntry[]; totalElements: number }> {
    const response = await axiosClient.get(`/admin/audit-logs/by-action?action=${action}&page=${page}&size=${size}`);
    return response.data;
  }

  async getAuditLogsByDepartment(department: string, page = 0, size = 20): Promise<{ content: AuditLogEntry[]; totalElements: number }> {
    const response = await axiosClient.get(`/admin/audit-logs/by-department?departmentType=${department}&page=${page}&size=${size}`);
    return response.data;
  }

  async getAuditLogsByDateRange(startDate: string, endDate: string, page = 0, size = 20): Promise<{ content: AuditLogEntry[]; totalElements: number }> {
    const response = await axiosClient.get(`/admin/audit-logs/by-date-range?start=${startDate}&end=${endDate}&page=${page}&size=${size}`);
    return response.data;
  }

  // Activity endpoints - Admin (datos de TODOS los usuarios) con paginación y filtro por fecha
  async getUserActivities(type?: string, startDate?: string, endDate?: string, page: number = 0, size: number = 20): Promise<{ content: UserActivity[]; totalElements: number; totalPages: number; number: number; size: number }> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('size', size.toString());

    // Usar endpoint de admin para obtener datos de todos los usuarios
    const response = await axiosClient.get(`/activity/admin/all?${params.toString()}`);
    return response.data;
  }

  async getActivityStats(dateRange?: string): Promise<ActivityStats> {
    const params = dateRange ? `?dateRange=${dateRange}` : '';
    // Usar endpoint de admin para obtener estadísticas globales
    const response = await axiosClient.get(`/activity/admin/stats${params}`);
    return response.data;
  }

  async getDailyActivityFlow(): Promise<Array<{ date: string; total: number; contacts: number; favorites: number; views: number; publications: number }>> {
    const response = await axiosClient.get('/activity/admin/daily-flow');
    return response.data;
  }

  async exportActivitiesToPDF(type?: string, dateRange?: string): Promise<Blob> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (dateRange) params.append('dateRange', dateRange);

    const response = await axiosClient.get(`/activity/export/pdf?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Communications endpoints
  async getCommunicationStats(): Promise<CommunicationStats> {
    const response = await axiosClient.get('/communications/stats');
    return response.data;
  }

  // Notifications endpoints
  async getNotificationPreferences(): Promise<NotificationPreference> {
    const response = await axiosClient.get('/notifications/preferences');
    return response.data;
  }

  async updateNotificationPreferences(preferences: NotificationPreference): Promise<NotificationPreference> {
    const response = await axiosClient.put('/notifications/preferences', preferences);
    return response.data;
  }

  async sendNotification(notification: Omit<AdminNotification, 'id'>): Promise<void> {
    await axiosClient.post('/admin/notifications/send', notification);
  }

  async getNotificationHistory(
    daysBack: number = 30,
    type?: string,
    page: number = 0,
    size: number = 10
  ): Promise<{
    content: Array<{
      id: number;
      title: string;
      message: string;
      type: string;
      createdAt: string;
      recipientCount: number;
    }>;
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> {
    const params = new URLSearchParams();
    params.append('daysBack', daysBack.toString());
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (type) params.append('type', type);
    
    const response = await axiosClient.get(`/admin/notifications/history?${params.toString()}`);
    return response.data;
  }

  async getNotificationTypes(): Promise<Array<{ value: string; label: string }>> {
    const response = await axiosClient.get('/admin/notifications/types');
    return response.data;
  }

  async deleteNotificationHistory(notificationId: number): Promise<void> {
    await axiosClient.delete(`/admin/notifications/history/${notificationId}`);
  }

  async sendNewPropertyNotification(propertyId: number, userIds?: number[]): Promise<string> {
    const params = userIds?.length ? `&userIds=${userIds.join(',')}` : '';
    const response = await axiosClient.post(`/notifications/new-property?propertyId=${propertyId}${params}`);
    return response.data;
  }

  async triggerSearchNotifications(propertyType: string, transactionType: string, district: string): Promise<string> {
    const params = new URLSearchParams({ propertyType, transactionType, district });
    const response = await axiosClient.post(`/notifications/trigger-search-notifications?${params.toString()}`);
    return response.data;
  }

  async triggerNewPropertyNotifications(propertyId: number): Promise<string> {
    const response = await axiosClient.post(`/notifications/trigger-new-property-notifications?propertyId=${propertyId}`);
    return response.data;
  }

  async triggerReactivationNotifications(): Promise<string> {
    const response = await axiosClient.post('/notifications/trigger-reactivation-notifications');
    return response.data;
  }

  // Admin Alerts endpoints - matches backend AdminAlertController
  async createAdminAlert(alert: Omit<AdminAlert, 'id' | 'createdAt'>): Promise<AdminAlert> {
    const response = await axiosClient.post('/admin/alerts', alert);
    return response.data;
  }

  async sendAdminAlertNow(alertId: number): Promise<void> {
    await axiosClient.post(`/admin/alerts/${alertId}/send`);
  }

  async getAdminAlerts(filters: AlertFilters = {}): Promise<PaginatedAdminAlerts> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    
    const response = await axiosClient.get(`/admin/alerts?${params.toString()}`);
    return response.data;
  }

  async getAdminAlertById(alertId: number): Promise<AdminAlert> {
    const response = await axiosClient.get(`/admin/alerts/${alertId}`);
    return response.data;
  }

  async deleteAdminAlert(alertId: number): Promise<void> {
    await axiosClient.delete(`/admin/alerts/${alertId}`);
  }

  async searchAdminAlerts(query: string): Promise<AdminAlert[]> {
    const response = await axiosClient.get(`/admin/alerts/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getAdminAlertStats(): Promise<AlertStats> {
    const response = await axiosClient.get('/admin/notifications/stats');
    return response.data;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await axiosClient.get('/admin/metrics/dashboard');
    return response.data;
  }

  // Admin alert by type endpoints
  async sendSystemAlert(alert: { subject: string; message: string; userIds?: number[]; roles?: string[]; agencyIds?: string[]; agentIds?: number[]; sendToAll?: boolean; sendEmail?: boolean; sendInApp?: boolean; sendPush?: boolean; }): Promise<AdminAlert> {
    const response = await axiosClient.post('/admin/alerts/system', alert);
    return response.data;
  }

  async sendPropertyAlert(alert: { subject: string; message: string; propertyId: number; userIds?: number[]; roles?: string[]; agencyIds?: string[]; agentIds?: number[]; sendToAll?: boolean; sendEmail?: boolean; sendInApp?: boolean; sendPush?: boolean; }): Promise<AdminAlert> {
    const response = await axiosClient.post('/admin/alerts/property', alert);
    return response.data;
  }

  async sendMessageAlert(alert: { subject: string; message: string; userIds?: number[]; roles?: string[]; agencyIds?: string[]; agentIds?: number[]; sendToAll?: boolean; sendEmail?: boolean; sendInApp?: boolean; sendPush?: boolean; }): Promise<AdminAlert> {
    const response = await axiosClient.post('/admin/alerts/message', alert);
    return response.data;
  }

  async sendAnnouncement(alert: { subject: string; message: string; userIds?: number[]; roles?: string[]; agencyIds?: string[]; agentIds?: number[]; sendToAll?: boolean; sendEmail?: boolean; sendInApp?: boolean; sendPush?: boolean; }): Promise<AdminAlert> {
    const response = await axiosClient.post('/admin/alerts/announcement', alert);
    return response.data;
  }

  async sendEmergencyAlert(alert: { subject: string; message: string; userIds?: number[]; roles?: string[]; agencyIds?: string[]; agentIds?: number[]; sendToAll?: boolean; sendEmail?: boolean; sendInApp?: boolean; sendPush?: boolean; }): Promise<AdminAlert> {
    const response = await axiosClient.post('/admin/alerts/emergency', alert);
    return response.data;
  }
}
