/**
 * Admin domain entities — Marketing module entities
 */
export interface PromotionCampaign {
  id: number;
  title: string;
  description?: string;
  promotionType: string;
  status: string;
  startDate: string;
  endDate?: string;
  pricePaid?: number;
  currency?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  placementLocation: string;
  displayOrder?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  conversionRate?: number;
  revenue?: number;
  createdAt: string;
  updatedAt?: string;
  /** ID del proyecto vinculado (opcional) */
  targetProjectId?: number | null;
  /** ID de la propiedad vinculada (opcional) */
  targetPropertyId?: number | null;
  /** Nombre del proyecto vinculado (para mostrar) */
  targetProjectName?: string;
  /** Nombre de la propiedad vinculada (para mostrar) */
  targetPropertyName?: string;
  /** Owner info */
  ownerId?: number;
  ownerRole?: string;
  /** Nombre del owner (inmobiliaria/agente) */
  ownerName?: string;
  /** Logo del owner (inmobiliaria/agente) */
  ownerLogoUrl?: string;
  /** Distrito/ubicación del proyecto vinculado */
  projectDistrict?: string;
  /** Tipo de proyecto (ej: "Departamentos", "Casas", etc.) */
  projectType?: string;
  /** Área desde (m²) del proyecto vinculado */
  projectAreaFrom?: string;
  /** Precio desde del proyecto vinculado */
  projectPriceFrom?: string;
  /** Moneda del precio */
  projectPriceCurrency?: string;
  /** Payment info */
  paymentId?: string;
  paymentConfirmed?: boolean;
  /** Lifecycle */
  active?: boolean;
  expired?: boolean;
  leads?: number;
  approvedBy?: number;
  approvedAt?: string;
  notes?: string;
}

export interface CreatePromotionCampaignRequest {
  promotionType: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  placementLocation: string;
  startDate: string;
  endDate: string;
  pricePaid: number;
  currency?: string;
  displayOrder?: number;
  targetProjectId?: number | null;
  targetPropertyId?: number | null;
}

export interface UpdatePromotionCampaignRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  pricePaid?: number;
  currency?: string;
  placementLocation?: string;
  displayOrder?: number;
}

export type BannerDisplayMode = 'SOLO_BANNER' | 'INTEGRATED';

export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: string;
  displayMode?: BannerDisplayMode;
  displayOrder?: number;
  startDate: string;
  endDate?: string;
  durationDays?: number;
  isActive: boolean;
  currentlyActive?: boolean;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBannerRequest {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: string;
  displayOrder?: number;
  startDate: string;
  endDate?: string;
  durationDays?: number;
}


export interface FestiveCampaign {
  id: number;
  name: string;
  description?: string;
  festiveType: string;
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  specialPricePen?: number;
  specialPriceUsd?: number;
  maxParticipants?: number;
  termsAndConditions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFestiveCampaignRequest {
  name: string;
  description?: string;
  festiveType: string;
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  specialPricePen?: number;
  specialPriceUsd?: number;
  maxParticipants?: number;
  termsAndConditions?: string;
}

