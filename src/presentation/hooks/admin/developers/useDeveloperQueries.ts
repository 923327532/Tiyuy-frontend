import { useQuery } from '@tanstack/react-query';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';
import type { InmobiliariaFilter } from '@/core/domain/entities/Admin';
import { DEVELOPERS_QUERY_KEY } from './queryKeys';

export function useDevelopers(filter?: InmobiliariaFilter) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, filter],
    queryFn: () => adminRepository.getDevelopers(filter),
  });
}

export function useDeveloperDiscountTargets(search: string) {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-targets', normalizedSearch],
    queryFn: () => adminRepository.searchDeveloperDiscountTargets(normalizedSearch),
    enabled: normalizedSearch.length > 0,
  });
}

export function useDeveloperById(id: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'detail', id],
    queryFn: () => adminRepository.getDeveloperById(id),
    enabled: !!id,
  });
}

export function useDeveloperAgents(developerId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'agents', developerId],
    queryFn: () => adminRepository.getDeveloperAgents(developerId),
    enabled: !!developerId,
  });
}

export function useDeveloperDiscountCodes(developerId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', developerId],
    queryFn: () => adminRepository.getDeveloperDiscountCodes(developerId),
    enabled: !!developerId,
  });
}

export function useAvailableDeveloperDiscountCodes() {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', 'available'],
    queryFn: () => adminRepository.getAgentDiscounts(),
  });
}

export function useAgentDiscountCodes(userId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'discount-codes', 'agent', userId],
    queryFn: () => adminRepository.getAgentDiscounts({ agentId: userId }),
    enabled: !!userId,
  });
}

export function useDeveloperStatusHistory(developerId: number, page: number = 0, size: number = 5) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'status-history', developerId, page, size],
    queryFn: () => adminRepository.getDeveloperStatusHistory(developerId, page, size),
    enabled: !!developerId,
  });
}

export function useDeveloperStats(developerId: number) {
  return useQuery({
    queryKey: [DEVELOPERS_QUERY_KEY, 'stats', developerId],
    queryFn: () => adminRepository.getDeveloperStats(developerId),
    enabled: !!developerId,
  });
}
