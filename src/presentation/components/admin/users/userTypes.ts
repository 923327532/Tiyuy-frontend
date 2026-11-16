/**
 * Contrato de datos del módulo Usuarios (propuesta TIYUY).
 */

export type UserSegment = 'REAL_ESTATE_COMPANY' | 'BROKER' | 'INDIVIDUAL' | 'INVESTOR';

export type AccountState = 'ACTIVE' | 'IN_REVIEW' | 'SUSPENDED' | 'CLAIM_PENDING';

export type IdentityStatus = 'VERIFIED' | 'IN_REVIEW' | 'PENDING' | 'REJECTED';

export interface PolicyAlert {
  id: string;
  policy: 'SECURITY' | 'ANTI_DISCRIMINATION' | 'OTHER';
  summary: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

/** Libro de Reclamaciones y solicitudes de cambio o devolución. */
export interface FormalClaim {
  id: string;
  code: string;
  type: 'CLAIM' | 'COMPLAINT' | 'REFUND' | 'EXCHANGE';
  subject?: string;
  summary: string;
  status: 'OPEN' | 'IN_REVIEW' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  dueDate?: string;
}

export interface PaymentRecord {
  id: string;
  concept: string;
  method: 'MERCADO_PAGO' | 'YAPE' | 'PLIN' | 'CARD' | 'TRANSFER' | 'OTHER';
  amount: number;
  currency: 'PEN' | 'USD';
  status: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  date: string;
  paidAt?: string;
}

export interface ListingRecord {
  id: string;
  title: string;
  propertyType?: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
}

export interface CancellationRequest {
  id: string;
  service?: string;
  reason?: string;
  status: 'REQUESTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  requestedAt: string;
  scheduledFor?: string;
}

export interface AccessibilitySupport {
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  note?: string;
  requestedAt?: string;
}

export interface CompanyProfile {
  legalName?: string;
  ruc?: string;
  verified: boolean;
  activeProjects: number;
}

export interface BrokerPortfolio {
  forSale: number;
  forRent: number;
  /** Clave = enum PropertyType (HOUSE, APARTMENT, LAND, OFFICE, COMMERCIAL...). */
  byType?: Record<string, number>;
}

export interface UserDetailExtras {
  accountState?: AccountState;
  identityStatus?: IdentityStatus;
  company?: CompanyProfile;
  brokerPortfolio?: BrokerPortfolio;
  policyAlerts?: PolicyAlert[];
  openAlerts?: PolicyAlert[];
  cancellationRequest?: CancellationRequest | null;
  cancellationRequests?: CancellationRequest[];
  tickets?: SupportTicket[];
  openTickets?: SupportTicket[];
  claims?: FormalClaim[];
  formalClaims?: FormalClaim[];
  accessibilitySupport?: AccessibilitySupport | null;
  listings?: ListingRecord[];
  publishedListings?: ListingRecord[];
  payments?: PaymentRecord[];
  savedSearchesCount?: number;
  favoritesCount?: number;
  leadsCount?: number;
  failedLoginAttempts?: number;
  lastDevice?: string;
  notificationsEnabled?: boolean;
  newsletterSubscribed?: boolean;
}