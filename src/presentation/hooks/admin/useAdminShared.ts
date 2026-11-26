/**
 * Shared internals for the split useAdmin hooks.
 */

import type { QueryClient } from '@tanstack/react-query';
import { AdminRepository } from '@/infrastructure/repositories/AdminRepository';

export const adminRepository = new AdminRepository();
export const ADMIN_QUERY_KEY = 'admin';

/**
 * Refresca todas las consultas del dashboard administrativo.
 * Usar en mutaciones para que los conteos no queden desactualizados.
 */
export const invalidateAdminDashboard = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'dashboard'] });

export interface NotifyDeveloperRequest {
  subject: string;
  message: string;
  includeProjectDetails?: boolean;
}

export interface AgentPlanDiscountRequest {
  planCode: string;
  discountPercentage?: number;
  customPricePen?: number;
  validFrom?: string;
  validUntil?: string;
  notes?: string;
}
