import { useQuery } from '@tanstack/react-query';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';
import type { DeveloperSubscriptionDiscountFilters } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { SUBSCRIPTION_DISCOUNTS_QUERY_KEY } from './queryKeys';

export function useDeveloperSubscriptionDiscounts(
  filters: DeveloperSubscriptionDiscountFilters = {}
) {
  return useQuery({
    queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY, 'list', filters],
    queryFn: () => adminRepository.getDeveloperSubscriptionDiscounts(filters),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
}

export function useDeveloperSubscriptionDiscountById(id: number) {
  return useQuery({
    queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY, 'detail', id],
    queryFn: () => adminRepository.getDeveloperSubscriptionDiscountById(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useDeveloperSubscriptionDiscountSummary() {
  return useQuery({
    queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY, 'summary'],
    queryFn: () => adminRepository.getDeveloperSubscriptionDiscountSummary(),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
}

export function useDeveloperSubscriptionDiscountUsageHistory(
  discountId: number,
  page: number = 0,
  size: number = 20
) {
  return useQuery({
    queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY, 'usage-history', discountId, page, size],
    queryFn: () => adminRepository.getDeveloperSubscriptionDiscountUsageHistory(discountId, page, size),
    enabled: !!discountId,
    staleTime: 30000,
  });
}

export function useDeveloperSubscriptionDiscountStats(developerId: number) {
  return useQuery({
    queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY, 'stats', developerId],
    queryFn: () => adminRepository.getDeveloperSubscriptionDiscountStats(developerId),
    enabled: !!developerId,
    staleTime: 30000,
  });
}
