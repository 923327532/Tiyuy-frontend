/**
 * Admin domain entities — Inmobiliaria / agency entities and central discounts
 */
// ============================================
// INMOBILIARIA / DEVELOPER ENTITIES
// ============================================

export interface Inmobiliaria {
  id: number;
  name: string;
  ruc: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  managerName?: string;
  address?: string;
  city?: string;
  country?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

export interface InmobiliariaWithStats extends Inmobiliaria {
  totalAgents: number;
  activeAgents: number;
  totalProperties: number;
  activeProperties: number;
  totalProjects: number;
  activeProjects: number;
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED';
  currentPlan?: string;
  planExpiryDate?: Date;
  averageRating: number;
  totalSales: number;
  totalRentals: number;
  enabled: boolean;
  activeDiscounts?: number;
  revenue30Days?: number;
  lastActivity?: Date;
  revenueTotal?: number;
  totalElements?: number;
}

export interface InmobiliariaAgent {
  id: number;
  userId: number;
  inmobiliariaId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt: Date;
  totalSales: number;
  totalRentals: number;
  currentPlan?: string;
  planStatus?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  enabled?: boolean;
}

export interface InmobiliariaStatusHistory {
  id: number;
  inmobiliariaId: number;
  previousStatus?: string;
  newStatus: string;
  reason?: string;
  changedBy: string;
  createdAt: Date;
}

export interface CreateInmobiliariaRequest {
  name: string;
  ruc: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
}

export interface UpdateInmobiliariaRequest {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface AssignAgentToInmobiliariaRequest {
  userId: number;
  licenseNumber?: string;
}

export interface InmobiliariaDiscount {
  id: number;
  inmobiliariaId: number;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  validFrom: Date;
  validUntil?: Date;
  createdAt: Date;
  createdBy: number;
  isValid: boolean;
}

export interface CreateInmobiliariaDiscountRequest {
  inmobiliariaId: number;
  code: string;
  discountPercentage: number;
  maxUses?: number;
  validFrom?: Date;
  validUntil?: Date;
  applicableToAgents?: boolean; // Si es false, solo la inmobiliaria puede usarlo (no sus agentes)
}

export interface ApplyDirectDiscountRequest {
  discountPercentage: number;
  reason: string;
  applyToAllAgents?: boolean;
  expiresAt?: Date;
  maxAgents?: number;
}

export interface InmobiliariaFilter {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  city?: string;
  hasActiveSubscription?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// ================== Central Discount Management ==================

export interface CentralDiscountDto {
  id: number;
  code: string;
  discountPercentage: number;
  customPrice?: number;
  source: 'DISCOUNT_CODE' | 'AGENT' | 'DEVELOPER' | 'AGENCY_PLAN' | 'USER';
  sourceLabel: string;
  entityType: string;
  entityName: string;
  entityId?: number;
  status: string;
  usageCount: number;
  maxUsage: number;
  createdAt: string;
  expiresAt?: string;
  updatedAt?: string;
  notes?: string;
  applicability: string;
  assignedBy?: number;
  assignedByName?: string;
}

export interface CentralDiscountSummary {
  total: number;
  active: number;
  expired: number;
  inactive: number;
  users: number;
  agents: number;
  developers: number;
}

