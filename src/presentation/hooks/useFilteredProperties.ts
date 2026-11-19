'use client';

import { useQuery } from '@tanstack/react-query';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import type { PropertySummary } from '@/core/domain/entities/Property';
import type { PropertyFilter } from '@/core/domain/entities/PropertyFilter';

const propertyRepo = new PropertyRepository();

const STALE_TIME = 5 * 60 * 1000; // 5 min
const CACHE_TIME = 30 * 60 * 1000; // 30 min

const LS_PREFIX = 'tiyuy-filtered-';

function makeCacheKey(filter: PropertyFilter): string {
  return `${filter.type || ''}-${filter.transactionType || ''}-${filter.district || ''}`;
}

let activePrefetches: Map<string, Promise<PropertySummary[]>> = new Map();

export function prefetchFilteredProperties(filter: PropertyFilter) {
  const key = makeCacheKey(filter);
  if (activePrefetches.has(key)) return;

  const promise = (async () => {
    try {
      const result = await propertyRepo.search({
        ...filter,
        page: 0,
        size: 15,
        sort: 'createdAt,desc',
      });
      const items = result.properties || [];
      try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(items)); } catch {}
      return items;
    } catch {
      return [];
    }
  })();

  activePrefetches.set(key, promise);
}

export function useFilteredProperties(filter: PropertyFilter) {
  const key = makeCacheKey(filter);
  const queryKey = ['filtered-properties', filter.type, filter.transactionType, filter.district];

  // Intentar cargar desde localStorage
  const cached = typeof window !== 'undefined'
    ? (() => { try { const raw = localStorage.getItem(LS_PREFIX + key); return raw ? JSON.parse(raw) as PropertySummary[] : undefined; } catch { return undefined; } })()
    : undefined;

  return useQuery<PropertySummary[]>({
    queryKey,
    queryFn: async () => {
      // Esperar prefetch si está activo
      const existing = activePrefetches.get(key);
      if (existing) {
        activePrefetches.delete(key);
        return existing;
      }
      const result = await propertyRepo.search({
        ...filter,
        page: 0,
        size: 15,
        sort: 'createdAt,desc',
      });
      const items = result.properties || [];
      try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(items)); } catch {}
      return items;
    },
    initialData: cached,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });
}
