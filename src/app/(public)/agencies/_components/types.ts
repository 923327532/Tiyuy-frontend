export interface PublicAgency {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  city: string;
  shortDescription: string;
  agentsCount: number;
  activePropertiesCount: number;
  activeProjectsCount: number;
}

export interface PageResponse {
  content: PublicAgency[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const PAGE_SIZE = 9;
export const CITIES = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura', 'Ica'];