import { Property, PropertySummary, PropertyMedia, MapSearchResult } from '../entities/Property';
import { PropertyFilter, PropertySearchResult } from '../entities/PropertyFilter';

export interface IPropertyRepository {
  // Búsqueda
  search(filters: PropertyFilter): Promise<PropertySearchResult>;
  searchForMap(filters: PropertyFilter): Promise<MapSearchResult>;
  getBySlug(slug: string): Promise<Property>;
  getById(id: number): Promise<Property>;
  
  // Gestión
  create(data: CreatePropertyData): Promise<Property>;
  update(id: number, data: UpdatePropertyData): Promise<Property>;
  publish(id: number): Promise<PropertySummary>;
  delete(id: number): Promise<void>;
  
  // Mis propiedades
  getMyProperties(page?: number, size?: number): Promise<PropertySearchResult>;
  
  // Propiedades destacadas
  getFeaturedProperties(page?: number, size?: number): Promise<PropertySearchResult>;
  
  // Multimedia
  uploadPhotos(propertyId: number, files: File[]): Promise<PropertyMedia[]>;
  deletePhoto(mediaId: number): Promise<void>;
  setCoverPhoto(propertyId: number, mediaId: number): Promise<void>;
}

export interface CreatePropertyData {
  type: string;
  transactionType: string;
  price: number;
  currency: string;
  description?: string;
  fullAddress: string;
  region: string;
  province: string;
  district: string;
  latitude?: number;
  longitude?: number;
  showExactAddress: boolean;
  
  // Campos para propiedades residenciales (APARTMENT, HOUSE)
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  totalArea?: number;
  builtArea?: number;
  
  // Campos para habitaciones
  roomArea?: number;
  maxCapacity?: number;
  bathroomType?: 'PRIVATE' | 'SHARED';
  roomDetails?: {
    isFurnished?: boolean;
    hasPrivateBathroom?: boolean;
    genderPreference?: string;
    minAge?: number;
    maxAge?: number;
    allowsPets?: boolean;
    allowsSmoking?: boolean;
    allowsCouples?: boolean;
    hasSharedKitchen?: boolean;
    hasSharedLivingRoom?: boolean;
    houseRules?: string;
    currentRoommates?: number;
    totalCapacity?: number;
    availableFrom?: string;
    minimumStayMonths?: number;
  };
  
  // Campos para terrenos
  frontage?: number;
  depth?: number;
  perimeter?: number;
  landUse?: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED';
  
  // Campos para oficinas
  usableArea?: number;
  officeFloors?: number;
  officeType?: 'PRIVATE' | 'COWORKING' | 'SERVED';
  
  // Campos adicionales
  floor?: number;
  age?: number;
  maintenanceFee?: number;
}

export interface UpdatePropertyData {
  userId: number;
  title?: string;
  description?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  totalArea?: number;
  builtArea?: number;
  maintenanceFee?: number;
}
