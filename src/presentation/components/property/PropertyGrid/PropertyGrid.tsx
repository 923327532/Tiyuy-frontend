'use client';

import { PropertySummary } from '@/core/domain/entities/Property';
import { PropertyCard } from '../PropertyCard';
import { Home } from 'lucide-react';

interface PropertyGridProps {
  properties: PropertySummary[];
  isLoading?: boolean;
}

export function PropertyGrid({ properties, isLoading }: PropertyGridProps) {
  if (isLoading) {
    return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {[...Array(10)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-16">
        <Home className="w-14 h-14 text-[var(--text-muted)] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[var(--text-secondary)] mb-2">
          No se encontraron propiedades
        </h3>
        <p className="text-[var(--text-muted)]">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-square bg-[var(--bg-tertiary)] rounded-xl mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" />
        <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-20" />
      </div>
    </div>
  );
}
