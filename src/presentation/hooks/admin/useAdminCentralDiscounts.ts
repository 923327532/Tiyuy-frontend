/**
 * Central discount hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// ================== Central Discount Management Hooks ==================

export const useCentralDiscounts = (params: {
  source?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'central-discounts', params],
    queryFn: () => adminRepository.getCentralDiscounts(params),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useCentralDiscountSummary = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'central-discounts', 'summary'],
    queryFn: () => adminRepository.getCentralDiscountSummary(),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

