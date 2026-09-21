export type WalletTransactionType = 
  | 'DEPOSIT' 
  | 'WITHDRAWAL' 
  | 'SUBSCRIPTION' 
  | 'CREDIT_PURCHASE';

export type WalletTransactionStatus = 
  | 'PENDING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'REFUNDED';

export interface Wallet {
  balance: number;
  currency: string;
  availableCredits: number;
  totalCreditsPurchased: number;
  totalSpent: number;
}

export interface WalletTransaction {
  id: number;
  type: WalletTransactionType;
  amount: number;
  currency: string;
  status: WalletTransactionStatus;
  description: string;
  createdAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  features: string[];
  maxPublications: number;
  isFeatured: boolean;
  billingCycle?: BillingCycle;
  priceQuarterly?: number;
  priceYearly?: number;
  discountPctQuarterly?: number;
  discountPctYearly?: number;
  agencyDiscountedPrice?: number;
  hasAgencyDiscount?: boolean;
}

export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME';

export interface ActiveSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startsAt: Date;
  expiresAt: Date;
  remainingPublications: number;
  billingCycle?: BillingCycle;
  nextResetDate?: Date;
  billingAnchorDay?: number;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'FAILED';
  paymentMethod: 'CARD' | 'YAPE' | 'PLIN' | 'MERCADOPAGO';
  description: string;
  transactionId: string;
  errorMessage?: string;
  paidAt?: Date;
  createdAt: Date;
  phone?: string;
  lastFour?: string;
}

export interface PaymentRequest {
  token: string; // Token de MercadoPago
  amount: number;
  description: string;
  sessionId?: string; // Session ID para device fingerprint antifraude
  deviceSessionId?: string; // Device session ID de security.js (MP_DEVICE_SESSION_ID)
}
