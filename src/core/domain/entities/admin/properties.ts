/**
 * Admin domain entities — Property moderation entities
 */
// Property status type including admin disabled
export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'REJECTED'
  | 'RENTED'
  | 'SOLD'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'DISABLED_BY_ADMIN';

// Property moderation DTO
export interface PropertyModerationItem {
  id: number;
  title: string;
  slug: string;
  status: PropertyStatus;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  price: number;
  district: string;
  createdAt: Date;
  publishedAt?: Date;
  isFeatured: boolean;
  viewsCount: number;
  reportCount: number;
  thumbnailUrl?: string;
}

// Property comment for admin review
export interface PropertyComment {
  id: number;
  propertyId: number;
  propertyTitle: string;
  userId: number;
  userName: string;
  userEmail: string;
  content: string;
  rating?: number;
  isFlagged: boolean;
  flagReason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Request to notify property owner
export interface NotifyOwnerRequest {
  subject: string;
  message: string;
  includePropertyDetails?: boolean;
}

// Moderate property request (matches backend ModeratePropertyRequest DTO)
export interface ModeratePropertyRequest {
  status: PropertyStatus;
  reason?: string;
  notifyOwner?: boolean;
}

// Audit log entry
export interface AuditLogEntry {
  id: number;
  adminUserId: number;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: number;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

