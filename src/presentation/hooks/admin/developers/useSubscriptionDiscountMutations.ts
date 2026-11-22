import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';
import type {
  CreateDeveloperSubscriptionDiscountRequest,
  UpdateDeveloperSubscriptionDiscountRequest,
  DiscountStatus,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { DEVELOPERS_QUERY_KEY, SUBSCRIPTION_DISCOUNTS_QUERY_KEY } from './queryKeys';

export function useCreateDeveloperSubscriptionDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeveloperSubscriptionDiscountRequest) =>
      adminRepository.createDeveloperSubscriptionDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DEVELOPERS_QUERY_KEY] });
    },
  });
}

export function useUpdateDeveloperSubscriptionDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeveloperSubscriptionDiscountRequest }) =>
      adminRepository.updateDeveloperSubscriptionDiscount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY, 'detail', variables.id] });
    },
  });
}

export function useDeleteDeveloperSubscriptionDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountId: number) => adminRepository.deleteDeveloperSubscriptionDiscount(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY] });
    },
  });
}

export function useRevokeDeveloperSubscriptionDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discountId, reason }: { discountId: number; reason?: string }) =>
      adminRepository.revokeDeveloperSubscriptionDiscount(discountId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY] });
    },
  });
}

export function useToggleDeveloperSubscriptionDiscountStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discountId, status }: { discountId: number; status: DiscountStatus }) =>
      adminRepository.toggleDeveloperSubscriptionDiscountStatus(discountId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_DISCOUNTS_QUERY_KEY] });
    },
  });
}
