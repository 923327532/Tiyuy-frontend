/**
 * Contrato de datos del módulo Usuarios (propuesta TIYUY).
 * Todo lo de `UserDetailExtras` es lo que el backend debe entregar para la ficha completa;
 * la interfaz ya está lista para consumirlo.
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
  /** Código visible, p. ej. "LR-000123". */
  code: string;
  type: 'CLAIM' | 'COMPLAINT' | 'REFUND' | 'EXCHANGE';
  summary: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  /** Fecha límite de respuesta, si aplica. */
  dueDate?: string;
}

export interface PaymentRecord {
  id: string;
  concept: string;
  method: 'MERCADO_PAGO' | 'YAPE' | 'PLIN' | 'OTHER';
  amount: number;
  currency: 'PEN' | 'USD';
  status: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paidAt: string;
}

export interface ListingRecord {
  id: string;
  title: string;
  /** Enum PropertyStatus del backend. */
  status: string;
  createdAt: string;
}

export interface CancellationRequest {
  id: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
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
  identityStatus?: IdentityStatus;
  company?: CompanyProfile;
  brokerPortfolio?: BrokerPortfolio;
  policyAlerts?: PolicyAlert[];
  cancellationRequest?: CancellationRequest | null;
  tickets?: SupportTicket[];
  claims?: FormalClaim[];
  accessibilitySupport?: AccessibilitySupport | null;
  listings?: ListingRecord[];
  payments?: PaymentRecord[];
}