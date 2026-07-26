'use client';

import { useQuery } from '@tanstack/react-query';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import type { PropertySummary } from '@/core/domain/entities/Property';

const propertyRepo = new PropertyRepository();

const STALE_TIME = 5 * 60 * 1000; // 5 min
const CACHE_TIME = 30 * 60 * 1000; // 30 min

const LS_KEY = 'tiyuy-featured-properties';

// InitQuery — dispara la query inmediatamente sin esperar que monte el componente
let featuredPropertiesPromise: Promise<PropertySummary[]> | null = null;

export function prefetchFeaturedProperties() {
  if (featuredPropertiesPromise) return;
  featuredPropertiesPromise = (async () => {
    try {
      const mixProps = await propertyRepo.getFeaturedMix();
      if (mixProps.length > 0) {
        const items = mixProps.slice(0, 10);
        try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
        return items;
      }
      const recentResult = await propertyRepo.search({
        transactionType: 'SALE' as any,
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
      } as any);
      const items = (recentResult.properties || []).slice(0, 10);
      try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
      return items;
    } catch {
      throw new Error('Error al cargar propiedades destacadas');
    }
  })();
}

export function useFeaturedProperties() {
  // Cargar datos cacheados en localStorage como initialData (instantáneo para visitantes que regresan)
  const cached = typeof window !== 'undefined'
    ? (() => { try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) as PropertySummary[] : undefined; } catch { return undefined; } })()
    : undefined;

  return useQuery<PropertySummary[]>({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      // Si ya se inició el prefetch, esperar esa promesa
      if (featuredPropertiesPromise) {
        return featuredPropertiesPromise;
      }
      const mixProps = await propertyRepo.getFeaturedMix();
      if (mixProps.length > 0) {
        const items = mixProps.slice(0, 10);
        try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
        return items;
      }
      const recentResult = await propertyRepo.search({
        transactionType: 'SALE' as any,
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
      } as any);
      const items = (recentResult.properties || []).slice(0, 10);
      try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
      return items;
    },
    initialData: cached,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });
}
