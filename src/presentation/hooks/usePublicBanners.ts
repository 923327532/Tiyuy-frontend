'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApiClient } from '@/infrastructure/api/axios-client';

export interface PublicBanner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  description?: string;
  placement: string;
  displayMode?: 'SOLO_BANNER' | 'INTEGRATED';
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

const STALE_TIME = 10 * 60 * 1000; // 10 min
const CACHE_TIME = 60 * 60 * 1000; // 60 min

/**
 * Hook para obtener banners públicos activos por ubicación.
 * Usa React Query para cachear resultados y evitar requests duplicados.
 */
export function usePublicBanners(placement: string = 'SLIDER') {
  return useQuery<PublicBanner[]>({
    queryKey: ['public-banners', placement],
    queryFn: async () => {
      const response = await publicApiClient.get(
        `/v1/public/marketing/banners/placement/${placement}`
      );
      const sorted = (response.data || []).sort(
        (a: PublicBanner, b: PublicBanner) => a.displayOrder - b.displayOrder
      );
      return sorted;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });
}