/**
 * Subscription plan hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SubscriptionPlan,
  AgencyPlanDiscount,
} from '@/core/domain/entities/Admin';
import { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// Finance and Monetization hooks

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'],
    queryFn: () => adminRepository.getSubscriptionPlans(),
  });
};

export const useActiveSubscriptionPlans = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans', 'active'],
    queryFn: async () => {
      console.log('Fetching active subscription plans...');
      try {
        const plans = await adminRepository.getActiveSubscriptionPlans();
        console.log('Active subscription plans fetched:', plans);
        return plans;
      } catch (error) {
        console.error('Error fetching active subscription plans:', error);
        throw error;
      }
    },
  });
};

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plan: Partial<SubscriptionPlan>) =>
      adminRepository.createSubscriptionPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, plan }: { planId: number; plan: Partial<SubscriptionPlan> }) =>
      adminRepository.updateSubscriptionPlan(planId, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => adminRepository.deleteSubscriptionPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

export const useTogglePlanStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => adminRepository.togglePlanStatus(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'subscriptions', 'plans'] });
    },
  });
};

// Agency discount hooks
export const useAgencyPlanDiscounts = (planId?: number) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'plans', planId, 'agency-discounts'],
    queryFn: () => adminRepository.getAgencyPlanDiscounts(planId!),
    enabled: !!planId,
  });
};

export const useCreateAgencyDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, discount }: { planId: number; discount: Partial<AgencyPlanDiscount> }) =>
      adminRepository.createAgencyDiscount(planId, discount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'plans', variables.planId, 'agency-discounts'] });
    },
  });
};

export const useRemoveAgencyDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (discountId: number) => adminRepository.removeAgencyDiscount(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'plans'] });
    },
  });
};

export const useAdminSubscriptions = (
  status?: string,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'subscriptions', status, pagination],
    queryFn: () => adminRepository.getAdminSubscriptions(status, pagination),
  });
};

export const usePaymentTransactions = (
  status?: string,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'transactions', status, pagination],
    queryFn: () => adminRepository.getPaymentTransactions(status, pagination),
  });
};

export const useRefundTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: number; reason: string }) =>
      adminRepository.refundTransaction(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'finance', 'stats'] });
    },
  });
};

