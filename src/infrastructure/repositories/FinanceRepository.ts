import { apiClient } from '../api/axios-client';
import { IFinanceRepository } from '@/core/domain/repositories/IFinanceRepository';
import { Wallet, WalletTransaction, SubscriptionPlan, ActiveSubscription } from '@/core/domain/entities/Wallet';
import { ENDPOINTS } from '../api/endpoints';
import {
  WalletResponseDTO,
  WalletTransactionsPageDTO,
  SubscriptionPlanDTO,
  ActiveSubscriptionDTO,
} from '@/core/application/dtos/FinanceDTO';

export class FinanceRepository implements IFinanceRepository {
  async getWalletBalance(): Promise<Wallet> {
    const response = await apiClient.get<WalletResponseDTO>('/finance/wallet');
    
    return {
      balance: response.data.balance,
      currency: response.data.currency,
      availableCredits: response.data.availableCredits || 0,
      totalCreditsPurchased: response.data.totalCreditsPurchased || 0,
      totalSpent: response.data.totalSpent || 0,
    };
  }

  async getWalletTransactions(page = 0, size = 20): Promise<{
    content: WalletTransaction[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<WalletTransactionsPageDTO>(
      '/finance/wallet/transactions',
      { params: { page, size, sort: 'createdAt,desc' } }
    );

    return {
      content: response.data.content.map((item) => ({
        id: item.id,
        type: item.type as any,
        amount: item.amount,
        currency: item.currency,
        status: item.status as any,
        description: item.description,
        createdAt: new Date(item.createdAt),
      })),
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
    };
  }

  async getActiveSubscription(): Promise<ActiveSubscription | null> {
    try {
      const response = await apiClient.get<any>(ENDPOINTS.FINANCE.SUBSCRIPTIONS.ACTIVE);
      const data = response.data;

      if (!data || !data.isActive) return null;

      return {
        id: data.id,
        plan: {
          id: data.tier,
          name: data.tier,
          description: data.tier,
          price: 0,
          currency: 'PEN',
          durationDays: 30,
          features: [],
          maxPublications: data.publicationsLimit,
          isFeatured: false,
        },
        status: data.isActive ? 'ACTIVE' : 'EXPIRED',
        startsAt: new Date(data.startDate),
        expiresAt: new Date(data.endDate),
        remainingPublications: data.publicationsLimit - data.publicationsUsed,
      };
    } catch (error: any) {
      if (error?.response?.status === 204 || error?.response?.status === 404) {
        return null;
      }
      return null;
    }
  }

  async hasUserUsedFreePlan(userId: number): Promise<boolean> {
    const response = await apiClient.get(
      `${ENDPOINTS.FINANCE.SUBSCRIPTIONS.FREE_PLAN_USED}?userId=${userId}`
    );
    return response.data;
  }

  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<SubscriptionPlanDTO[]>(ENDPOINTS.FINANCE.SUBSCRIPTIONS.PLANS);
    return response.data.map(item => ({
      ...item,
      agencyDiscountedPrice: item.agencyDiscountedPrice,
      hasAgencyDiscount: item.hasAgencyDiscount,
    }));
  }

  async createMercadoPagoPreference(subscriptionId: string, frontendUrl?: string): Promise<any> {
    const response = await apiClient.post('/finance/mercadopago/create-preference', {
      subscriptionId,
      frontendUrl: frontendUrl || window.location.origin,
    });
    return response.data;
  }

  async subscribeToPlan(planId: string | number, paymentMethod: 'CARD' | 'MERCADOPAGO', discountCode?: string): Promise<ActiveSubscription> {
    // planId puede ser un número (ID del plan) o un string (tier)
    // El backend espera el tier como string (BASIC, PREMIUM, etc.)
    // Si planId es un número, necesitamos convertirlo al tier correspondiente
    let tier: string;
    
    // Convertir planId a string primero
    const planIdStr = String(planId);
    
    // Mapeo de IDs de plan a tiers del backend
    const planIdToTier: Record<string, string> = {
      '1': 'FREE',
      '2': 'BASIC',
      '3': 'PRO',
      '4': 'ENTERPRISE_TRIAL',
      '5': 'ENTERPRISE',
      '10': 'PLAN LANZAMIENTO'
    };
    
    // Si planId ya es un tier válido, usarlo directamente
    if (['FREE', 'BASIC', 'PRO', 'ENTERPRISE_TRIAL', 'ENTERPRISE', 'PLAN LANZAMIENTO'].includes(planIdStr.toUpperCase())) {
      tier = planIdStr.toUpperCase();
    } else if (planIdToTier[planIdStr]) {
      // Si es un ID numérico, convertir al tier correspondiente
      tier = planIdToTier[planIdStr];
    } else {
      // Fallback: usar el planId tal como está (asumiendo que ya es un tier)
      tier = planIdStr;
    }
    
    const body: any = {
      tier: tier,
      paymentMethod,
    };
    
    if (discountCode) {
      body.discountCode = discountCode;
    }
    
    const response = await apiClient.post<ActiveSubscriptionDTO>(ENDPOINTS.FINANCE.SUBSCRIPTIONS.SUBSCRIBE, body);

    const data = response.data;
    return {
      id: data.id,
      plan: data.plan,
      status: data.status as any,
      startsAt: new Date(data.startsAt),
      expiresAt: new Date(data.expiresAt),
      remainingPublications: data.remainingPublications,
    };
  }

  async getPlanPriceForUser(planId: number): Promise<{ finalPrice: number; originalPrice: number; currency: string }> {
    const response = await apiClient.get(`/finance/subscriptions/plans/${planId}/price`);
    return {
      finalPrice: Number(response.data.finalPrice),
      originalPrice: Number(response.data.originalPrice),
      currency: response.data.currency || 'PEN',
    };
  }

  async getAvailableDeveloperDiscountCodes(): Promise<{
    id: number;
    code: string;
    discountPercentage: number;
    maxUses: number | null;
    usedCount: number;
    status: string;
    validFrom: string;
    validUntil: string | null;
  }[]> {
    const response = await apiClient.get(`/admin/developers/available-discounts`);
    const result = response.data || [];
    return result;
  }
}
