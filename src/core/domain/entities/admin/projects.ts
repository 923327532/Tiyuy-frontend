/**
 * Admin domain entities — Project management entities
 */
// Project lifecycle status
export type ProjectLifecycleStatus = 'ACTIVE' | 'PENDING' | 'PAST' | 'ENDING_SOON' | 'COMPLETED' | 'SUSPENDED';

// Project status
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED';

// Project type
export type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'INDUSTRIAL';

// Project phase
export type ProjectPhase = 'PLANNING' | 'CONSTRUCTION' | 'PRE_SALE' | 'SALE' | 'COMPLETED';

// Project entity for admin management
export interface ProjectAdminItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  lifecycleStatus: ProjectLifecycleStatus;
  phase: ProjectPhase;
  developerId: number;
  developerName: string;
  developerEmail: string;
  district: string;
  city: string;
  country: string;
  coverImageUrl?: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  priceRange: {
    min: number;
    max: number;
  };
  constructionProgress: number;
  startDate?: Date;
  estimatedDeliveryDate?: Date;
  launchDate?: Date;
  completionDate?: Date;
  viewsCount: number;
  favoritesCount: number;
  inquiriesCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isFeatured: boolean;
}

// Project statistics
export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
  projectsWithCover: number;
  projectsWithoutCover: number;
  coveragePercentage: number;
  totalUnits: number;
  soldUnits: number;
  availableUnits: number;
  averageConstructionProgress: number;
  // Extended stats for dashboard
  totalSalesValue: number;
  totalSoldUnits: number;
  conversionRate: number;
  totalAvailableUnits: number;
}

// Project moderation request
export interface ModerateProjectRequest {
  action: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'ACTIVATE' | 'DEACTIVATE';
  reason?: string;
  notes?: string;
}

