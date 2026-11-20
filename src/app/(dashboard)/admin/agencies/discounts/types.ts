/**
 * Types and constants for the Agencies Discounts page
 */

export interface DeveloperDiscountCode {
  id: number;
  code: string;
  discountPercentage: number;
  maxUses: number | null;
  usedCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  validFrom: string;
  validUntil: string | null;
  isValid: boolean;
  developer: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface FilterState {
  searchQuery: string;
  statusFilter: string;
  developerFilter: string;
  dateFrom: string;
  dateTo: string;
}

export interface NewDiscountForm {
  developerId: string;
  code: string;
  discountPercentage: string;
  maxUses: string;
  validFrom: string;
  validUntil: string;
  applicableToAgents: boolean;
}

export const EMPTY_NEW_DISCOUNT: NewDiscountForm = {
  developerId: '',
  code: '',
  discountPercentage: '',
  maxUses: '',
  validFrom: '',
  validUntil: '',
  applicableToAgents: true,
};

export const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
  { value: 'EXPIRED', label: 'Expirado' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Más recientes' },
  { value: 'createdAt,asc', label: 'Más antiguos' },
  { value: 'code,asc', label: 'Código A-Z' },
  { value: 'discountPercentage,desc', label: 'Mayor descuento' },
];
