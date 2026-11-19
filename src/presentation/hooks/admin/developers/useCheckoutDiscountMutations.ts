import { useMutation } from '@tanstack/react-query';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';

/** Hooks públicos utilizados en el flujo de checkout. */

export function useValidateDeveloperSubscriptionDiscount() {
  return useMutation({
    mutationFn: ({
      developerId,
      planCode,
      currency,
      isRenewal,
    }: {
      developerId: number;
      planCode: string;
      currency: 'PEN' | 'USD';
      isRenewal: boolean;
    }) => adminRepository.validateDeveloperSubscriptionDiscount(developerId, planCode, currency, isRenewal),
  });
}

export function useApplyDeveloperSubscriptionDiscount() {
  return useMutation({
    mutationFn: ({
      developerId,
      planCode,
      currency,
      isRenewal,
      subscriptionId,
    }: {
      developerId: number;
      planCode: string;
      currency: 'PEN' | 'USD';
      isRenewal: boolean;
      subscriptionId?: number;
    }) => adminRepository.applyDeveloperSubscriptionDiscount(developerId, planCode, currency, isRenewal, subscriptionId),
  });
}
