/**
 * Admin domain entities — Support tickets
 */
// ============================================================
// Support Tickets (Centro de Soporte/Incidencias)
// ============================================================

export type TicketSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketCategory = 
  | 'WRONG_EMAIL' 
  | 'PASSWORD_CHANGE' 
  | 'SYSTEM_ERROR' 
  | 'PAYMENT_ISSUE' 
  | 'ACCOUNT_ISSUE' 
  | 'PROPERTY_ISSUE' 
  | 'OTHER';

export interface SupportTicket {
  id: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  subject: string;
  description: string;
  category: TicketCategory;
  severity: TicketSeverity;
  status: TicketStatus;
  adminNotes?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolvedBy?: number;
  resolvedByName?: string;
  createdAt: string;
  updatedAt?: string;
  // Guest fields for non-authenticated users
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface SupportTicketStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  criticalTickets: number;
  averageResolutionTimeHours: number;
  ticketsByCategory: Record<string, number>;
  ticketsBySeverity: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  ticketsLast7Days: number;
  ticketsLast30Days: number;
}

export interface CreateSupportTicketRequest {
  subject: string;
  description: string;
  category: TicketCategory;
  severity?: TicketSeverity;
  // Guest fields for non-authenticated users
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface UpdateSupportTicketStatusRequest {
  status: TicketStatus;
  adminNotes?: string;
}

