export interface PropertyResponseDTO {
  id: number;
  slug: string;
  title: string;
  type: string;
  transactionType: string;
  status: string;
  price: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  description?: string;
  location: {
    fullAddress: string;
    district: string;
    province: string;
    region: string;
    latitude?: number;
    longitude?: number;
  };
  media: Array<{
    id: number;
    url: string;
    type: string;
    isCover: boolean;
  }>;
  coverPhotoUrl?: string;  // Agregado para compatibilidad con backend
  owner: {
    id: number;
    name: string;
    email: string;
    photoUrl?: string;
  };
  viewsCount: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface PropertySearchResponseDTO {
  content: PropertyResponseDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
}
