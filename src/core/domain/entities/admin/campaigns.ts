/**
 * Admin domain entities — Campaign entities
 */
// Campaign status matching backend
export type CampaignStatus = 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE';

// Campaign alert type matching backend
export type CampaignAlertType = 'LAST_WEEK' | 'LAST_DAY' | 'STARTED' | 'ENDED' | 'USAGE_LIMIT_WARNING';

// Campaign entity matching backend
export interface Campaign {
  id: number;
  title: string;
  name?: string;
  description?: string;
  promotionalMessage?: string;
  imageUrl?: string;
  link?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  startDate: Date;
  endDate: Date;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  styles?: Record<string, string>;
  lastAlertSent?: Date;
  // Additional properties for campaign management
  discountCodeCode?: string;
  discountCodeId?: number;
  targetAudience?: string;
  usageCount?: number;
  revenueGenerated?: number;
  autoApply?: boolean;
}

// Create campaign request matching backend
export interface CreateCampaignRequest {
  title: string;
  description?: string;
  promotionalMessage?: string;
  imageUrl?: string;
  link?: string;
  startDate: Date;
  endDate: Date;
  styles?: Record<string, string>;
}

// Update campaign request matching backend
export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  promotionalMessage?: string;
  imageUrl?: string;
  link?: string;
  status?: 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  startDate?: Date;
  endDate?: Date;
  styles?: Record<string, string>;
}

// Campaign alert matching backend
export interface CampaignAlert {
  id: number;
  campaignId?: number;
  discountCodeId?: number;
  alertType: 'LAST_WEEK' | 'LAST_DAY' | 'STARTED' | 'ENDED' | 'USAGE_LIMIT_WARNING';
  message: string;
  sentAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

