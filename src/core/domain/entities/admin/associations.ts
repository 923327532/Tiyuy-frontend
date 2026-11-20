/**
 * Admin domain entities — Developer / agent associations
 */
// Developer-Agent Association status
export type AssociationStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'REMOVED';

// Who requested the association
export type AssociationRequester = 'AGENT' | 'DEVELOPER' | 'ADMIN';

// Developer-Agent Association entity
export interface DeveloperAgentAssociation {
  id: number;
  developerId: number;
  developerName: string;
  developerRuc?: string;
  developerCity?: string;
  developerCurrentPlan?: string;
  agentId: number;
  agentFirstName?: string;
  agentLastName?: string;
  agentEmail: string;
  status: AssociationStatus;
  requestedBy?: AssociationRequester;
  requestedAt?: Date;
  reviewedAt?: Date;
  reviewedByName?: string;
  notes?: string;
  joinedAt?: Date;
  isVerified?: boolean;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request to create association
export interface CreateAssociationRequest {
  developerId: number;
  notes?: string;
}

// Request to approve/reject association
export interface ReviewAssociationRequest {
  notes?: string;
}

// Developer (Inmobiliaria) response from backend
export interface DeveloperResponse {
  id: number;
  email: string;
  companyName: string;
  ruc?: string;
  phone?: string;
  managerName?: string;
  city?: string;
  address?: string;
  totalProjects?: number;
  totalAgents?: number;
  enabled: boolean;
  status: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface DeveloperDiscountTarget {
  id: number;
  name: string;
  ruc?: string;
  email?: string;
  managerName?: string;
  currentPlan?: string;
  revenue30Days?: number;
}

// Search filter for developers
export interface DeveloperSearchFilter {
  query?: string;
  city?: string;
  page?: number;
  size?: number;
  sort?: string;
}

