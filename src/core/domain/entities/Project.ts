export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'COMPLETED';

export type ProjectLifecycleStatus = 'ACTIVE' | 'GRACE_PERIOD' | 'PENDING_DELETION' | 'DELETED' | 'SUSPENDED';

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  phase: 'PRE_SALE' | 'SALE' | 'DELIVERY' | 'PLOTTING' | 'PRE_LOTIZATION' | 'URBANIZATION' | 'REGISTRATION' | 'COMPLETED' | 'LAND_BANK';
  type: 'INDUSTRIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'RESIDENTIAL' | 'LOTIZATION' | 'LAND_SUBDIVISION' | 'LAND_BANK';
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  priceFrom: number;
  priceTo?: number;
  currency: 'PEN' | 'USD';
  // Ubicación completa
  district: string;
  province: string;
  region: string;
  urbanization?: string;
  address?: string;
  fullAddress?: string;
  street?: string;
  streetNumber?: string;
  number?: string; 
  latitude?: number;
  longitude?: number;
  areaFrom?: number;
  areaTo?: number;
  floors?: number;
  coverImageUrl?: string;
  constructionStart?: string; 
  startDate?: string; 
  estimatedDelivery: string;
  timeline?: Array<{
    id: number;
    phase: string;
    date: string;
    description: string;
  }>;
  amenities?: string[];
  certifications?: string[];
  milestones?: Array<{
    title: string;
    date: string;
    completed: boolean;
  }>;
  images?: string[];
  blueprints?: string[];
  renders?: string[];
  isFeatured: boolean;
  isVerified: boolean;
  viewsCount: number;
  contactsCount: number;
  publishedAt?: Date | string;
  
  // Lifecycle fields for subscription management
  lifecycleStatus?: ProjectLifecycleStatus;
  remainingGraceDays?: number;
  gracePeriodEnd?: string;
  canReactivate?: boolean;
}

export interface ProjectUnit {
  id: number;
  unitNumber: string;
  type: 'APARTMENT' | 'DUPLEX' | 'PENTHOUSE' | 'OFFICE' | 'STORE' | 'WAREHOUSE' | 'LOT';
  floor: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots: number;
  price: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'BLOCKED';
  view?: string;
  image?: string;        // Imagen de la unidad
  blueprintImage?: string; // Plano de la unidad
}

export interface ProjectSummary {
  id: number;
  slug: string;
  name: string;
  type: 'INDUSTRIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'RESIDENTIAL';
  phase: 'PRE_SALE' | 'SALE' | 'DELIVERY';
  status: ProjectStatus;
  priceFrom: number;
  priceTo?: number;
  currency: 'PEN' | 'USD';
  district: string;
  province: string;
  region: string;
  latitude?: number;
  longitude?: number;
  areaFrom?: number;
  areaTo?: number;
  bedrooms?: number;
  bathrooms?: number;
  totalUnits: number;
  availableUnits: number;
  coverImageUrl?: string;
  isFeatured: boolean;
  isVerified: boolean;
  viewsCount: number;
  publishedAt?: Date | string;
  // Lifecycle fields for subscription management
  lifecycleStatus?: ProjectLifecycleStatus;
  remainingGraceDays?: number;
}

export interface ProjectFull extends Project {
  developer: {
    id: number;
    companyName: string;
    ruc: string;
    email: string;
    phone: string;
  };
  units: ProjectUnit[];
  amenities: string[];
  images?: string[];
  blueprints?: string[];
  renders?: string[];
  socialMediaUrl?: string;
}

// Perfil público del desarrollador (al hacer clic en el desarrollador de un proyecto)
export interface DeveloperPublicProfile {
  userId: number;
  companyName: string;
  ruc: string;
  email: string;
  phone: string;
  photoUrl?: string;
  memberSince?: string;  // Cuándo se unió a Tiyuy
  totalActiveProjects: number;
  projects: DeveloperProject[];
}

export interface DeveloperProject {
  id: number;
  slug?: string;
  name?: string;
  type?: string;
  phase?: string;
  priceFrom: number;
  currency?: string;
  district?: string;
  coverImageUrl?: string;
}
