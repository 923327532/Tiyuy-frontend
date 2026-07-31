export type PropertyType = 
  | 'APARTMENT' 
  | 'HOUSE' 
  | 'LAND' 
  | 'OFFICE' 
  | 'COMMERCIAL' 
  | 'ROOM';

export type TransactionType = 'SALE' | 'RENT';

export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'RENTED' | 'SOLD' | 'PAUSED' | 'INACTIVE';

export type PropertyLifecycleStatus = 'ACTIVE' | 'GRACE_PERIOD' | 'PENDING_DELETION' | 'DELETED' | 'SUSPENDED';

export type Currency = 'PEN' | 'USD';

export interface PropertyLocation {
  fullAddress: string;
  region: string;
  province: string;
  district: string;
  urbanization?: string;
  street?: string;
  streetNumber?: string;
  apartmentNumber?: string;
  latitude?: number;
  longitude?: number;
  showExactAddress: boolean;
}

export interface PropertyMedia {
  id: number;
  url: string;
  webpUrl?: string;
  type: 'IMAGE' | 'VIDEO' | 'VIRTUAL_TOUR';
  isCover: boolean;
  order: number;
}

export interface PropertyOwner {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface PropertySEO {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  canonicalUrl: string;
  schemaJson?: string;
}

export interface Property {
  id: number;
  title?: string;
  type: PropertyType;
  transactionType: TransactionType;
  status: PropertyStatus;
  
  // Precio
  price: number;
  currency: Currency;
  pricePerSqm?: number;
  isNegotiable: boolean;
  
  // Características básicas
  bedrooms?: number;
  bathrooms?: number;
  halfBathrooms?: number;
  parkingSpots?: number;
  totalArea?: number;
  builtArea?: number;
  
  // Descripción
  description?: string;
  
  // Extras
  floor?: number;
  totalFloors?: number;
  age?: number;
  constructionYear?: number;
  maintenanceFee?: number;
  
  // Ubicación
  location: PropertyLocation;
  
  // Multimedia
  media: PropertyMedia[];
  coverPhotoUrl?: string;
  
  // Propietario
  owner: PropertyOwner;
  
  // SEO
  seo: PropertySEO;
  
  // Estadísticas
  viewsCount: number;
  favoritesCount: number;
  contactsCount: number;
  
  // Estados
  isFeatured: boolean;
  isVerified: boolean;
  
  // Lifecycle fields for subscription management
  lifecycleStatus?: PropertyLifecycleStatus;
  remainingGraceDays?: number;
  gracePeriodEnd?: Date;
  canReactivate?: boolean;
  
  // Fechas
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

export interface PropertySummary {
  id: number;
  slug: string;
  title: string;
  type: PropertyType;
  transactionType: TransactionType;
  status: PropertyStatus;
  price: number;
  currency: Currency;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  district: string;
  province: string;
  coverPhotoUrl?: string;
  isFeatured: boolean;
  isVerified: boolean;
  viewsCount: number;
  publishedAt?: Date | string;
  // Lifecycle fields for subscription management
  lifecycleStatus?: PropertyLifecycleStatus;
  remainingGraceDays?: number;
}

// ─── Map-specific types ────────────────────────────────────────────────

export interface MapPropertySummary {
  id: number;
  title: string;
  slug: string;
  price: number;
  currency: Currency;
  type: PropertyType;
  transactionType: TransactionType;
  mainPhotoUrl?: string;
  district: string;
  province: string;
  region: string;
  latitude: number;
  longitude: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  isFeatured?: boolean;
}

export type MapCoverageType = 'EXACT_DISTRICT' | 'NEARBY_DISTRICTS' | 'METRO_AREA' | 'PROVINCE' | 'REGION' | 'NO_RESULTS';

export interface MapCoverageInfo {
  coverage: MapCoverageType;
  searchedDistrict: string;
  nearbyDistricts: string[];
  message: string;
}

export interface MapSearchResult {
  properties: MapPropertySummary[];
  requestedArea: string;
  effectiveCoverage: MapCoverageType;
  coverageMessage: string;
  districtsIncluded: string[];
  totalResults: number;
}
