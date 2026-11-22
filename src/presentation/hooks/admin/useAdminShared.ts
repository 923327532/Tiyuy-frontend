/**
 * Shared internals for the split useAdmin hooks.
 */

import { AdminRepository } from '@/infrastructure/repositories/AdminRepository';

export const adminRepository = new AdminRepository();
export const ADMIN_QUERY_KEY = 'admin';

export interface NotifyDeveloperRequest {
  subject: string;
  message: string;
  includeProjectDetails?: boolean;
}

export interface AgentPlanDiscountRequest {
  planCode: string;
  discountPercentage: number;
  customPricePen?: number;
  validFrom?: string;
  validUntil?: string;
  notes?: string;
}
