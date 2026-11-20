/**
 * Finance history and dashboard hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceHistoryDto } from '@/core/domain/entities/Admin';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

export const useFinanceHistory = (period: string = '1M') => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'financeHistory', period],
    queryFn: async () => {
      try {
        return await adminRepository.getFinanceHistory(period);
      } catch (error) {
        console.error('Error fetching finance history:', error);
        return {
          labels: [],
          revenue: [],
          subscriptions: [],
          transactions: [],
          period,
          summary: {
            totalRevenue: 0,
            totalSubscriptions: 0,
            totalTransactions: 0,
            revenueGrowth: 0,
            subscriptionsGrowth: 0,
            transactionsGrowth: 0,
          },
        } as FinanceHistoryDto;
      }
    },
    staleTime: 0, // No caché - datos frescos siempre
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

// ─── Finance Dashboard Hooks ────────────────────────────────────────────────

export const useFinanceDashboard = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'dashboard'],
    queryFn: () => adminRepository.getFinanceDashboard(),
  });
};

export const usePaymentsSummary = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'payments-summary'],
    queryFn: () => adminRepository.getPaymentsSummary(),
  });
};

export const useFailedPaymentsList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'failed-payments'],
    queryFn: () => adminRepository.getFailedPaymentsList(),
  });
};

export const useTopPayersList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'top-payers'],
    queryFn: () => adminRepository.getTopPayersList(),
  });
};

export const usePendingSubscriptionsList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'pending-subscriptions'],
    queryFn: () => adminRepository.getPendingSubscriptionsList(),
  });
};

export const useMonthlyRevenuesList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'monthly-revenues'],
    queryFn: () => adminRepository.getMonthlyRevenuesList(),
  });
};

export const useActiveSubscriptionsList = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'finance', 'active-subscriptions'],
    queryFn: () => adminRepository.getActiveSubscriptionsList(),
  });
};


