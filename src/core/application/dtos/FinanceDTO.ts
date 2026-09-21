export interface WalletResponseDTO {
  balance: number;
  currency: string;
  availableCredits: number;
  totalCreditsPurchased: number;
  totalSpent: number;
}

export interface WalletTransactionDTO {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
}

export interface WalletTransactionsPageDTO {
  content: WalletTransactionDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface SubscriptionPlanDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  features: string[];
  maxPublications: number;
  isFeatured: boolean;
  agencyDiscountedPrice?: number;
  hasAgencyDiscount?: boolean;
}

export interface ActiveSubscriptionDTO {
  id: string;
  plan: SubscriptionPlanDTO;
  status: string;
  startsAt: string;
  expiresAt: string;
  remainingPublications: number;
}
