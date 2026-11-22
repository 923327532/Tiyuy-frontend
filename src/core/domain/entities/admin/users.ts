/**
 * Admin domain entities — User management entities
 */
// User list item for admin management
export interface UserListItem {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dni: string;
  role: 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  enabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  publishedPropertiesCount: number;
  publishedProjectsCount: number;
  city?: string;
  country?: string;
  profilePhotoUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

// Change user role request
export interface ChangeUserRoleRequest {
  newRole: 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  reason?: string;
}

// Usuario internacional para la sección "Extranjeros" del panel admin.
// El administrador compara la foto del documento con la selfie y aprueba/rechaza.
export interface InternationalUserListItem {
  userId: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  documentType: string; // INTERNATIONAL
  issuingCountry: string;
  internationalDocumentType: string; // PASSPORT | NATIONAL_ID | RESIDENCE_PERMIT
  internationalDocumentNumber: string;
  documentImageUrl?: string;
  selfieImageUrl?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW';
  verificationResult?: string;
  verifiedAt?: Date;
  enabled: boolean;
  createdAt: Date;
}

// User properties response from admin endpoint
export interface UserPropertiesResponse {
  userId: number;
  userEmail: string;
  userName: string;
  totalProperties: number;
  properties: UserPropertySummary[];
}

export interface UserPropertySummary {
  id: number;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'SUSPENDED';
  price: number;
  district: string;
  city: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
  viewsCount: number;
  createdAt: Date;
  publishedAt?: Date;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  description?: string;
}

// User projects response from admin endpoint
export interface UserProjectsResponse {
  userId: number;
  userEmail: string;
  userName: string;
  totalProjects: number;
  projects: UserProjectSummary[];
}

export interface UserProjectSummary {
  id: number;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED';
  phase: 'PLANNING' | 'CONSTRUCTION' | 'PRE_SALE' | 'SALE' | 'COMPLETED';
  district: string;
  city: string;
  coverImageUrl?: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  constructionProgress: number;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  publishedAt?: Date;
}


