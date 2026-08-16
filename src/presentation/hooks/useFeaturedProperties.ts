'use client';

import { useQuery } from '@tanstack/react-query';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import type { PropertySummary } from '@/core/domain/entities/Property';

const propertyRepo = new PropertyRepository();

const STALE_TIME = 5 * 60 * 1000; // 5 min
const CACHE_TIME = 30 * 60 * 1000; // 30 min

const LS_KEY = 'tiyuy-featured-properties-v2';

// InitQuery — dispara la query inmediatamente sin esperar que monte el componente
let featuredPropertiesPromise: Promise<PropertySummary[]> | null = null;

// Carga la sección "Alojamientos populares":
// 1) Destacadas SIEMPRE primero (el usuario espera que una propiedad destacada
//    salga en el home aunque tenga pocas vistas), 2) más vistas, 3) recientes en venta.
async function loadPopularProperties(): Promise<PropertySummary[]> {
  const featured = await propertyRepo.getFeaturedMix();

  const mostViewed = await propertyRepo.getMostViewed(0, 10);

  const seen = new Set<number>();
  const merged: PropertySummary[] = [];

  // Destacadas primero (curadas/patrocinadas)
  for (const p of featured) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      merged.push(p);
    }
  }

  // Populares (más vistas) para completar
  for (const p of mostViewed) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      merged.push(p);
    }
  }

  // Fallback: recientes en venta si aún no hay nada
  if (merged.length === 0) {
    const recentResult = await propertyRepo.search({
      transactionType: 'SALE' as any,
      page: 0,
      size: 10,
      sort: 'createdAt,desc',
    } as any);
    for (const p of (recentResult.properties || [])) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p);
      }
    }
  }

  const items = merged.slice(0, 10);
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
  return items;
}

export function prefetchFeaturedProperties() {
  if (featuredPropertiesPromise) return;
  featuredPropertiesPromise = loadPopularProperties().catch(() => {
    throw new Error('Error al cargar propiedades destacadas');
  });
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
      return loadPopularProperties();
    },
    initialData: cached,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });
}
