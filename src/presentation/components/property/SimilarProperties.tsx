'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property, PropertySummary } from '@/core/domain/entities/Property';
import { PropertyCard } from './PropertyCard/PropertyCard';
import { Image } from 'lucide-react';

interface SimilarPropertiesProps {
  currentProperty: Property;
  maxItems?: number;
}

interface SimilarPropertiesResponse {
  properties: PropertySummary[];
  totalResults: number;
  locationLevel: string;
  transactionType: string;
}

const TRANSACTION_LABELS: Record<string, string> = {
  RENT: 'Alquiler',
  SALE: 'Venta',
};

export function SimilarProperties({ currentProperty, maxItems = 5 }: SimilarPropertiesProps) {
  const [data, setData] = useState<SimilarPropertiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError(false);
        // Llamar al endpoint con filtros adicionales: precio similar y tamaño
        const params = new URLSearchParams({
          maxResults: String(maxItems),
        });
        
        // Agregar filtro de precio similar (+/- 30%)
        if (currentProperty.price) {
          const minPrice = Math.round(currentProperty.price * 0.7);
          const maxPrice = Math.round(currentProperty.price * 1.3);
          params.append('minPrice', String(minPrice));
          params.append('maxPrice', String(maxPrice));
        }
        
        // Agregar filtro de tamaño similar (+/- 30%)
        if (currentProperty.totalArea) {
          const minArea = Math.round(currentProperty.totalArea * 0.7);
          const maxArea = Math.round(currentProperty.totalArea * 1.3);
          params.append('minArea', String(minArea));
          params.append('maxArea', String(maxArea));
        }
        
        // Agregar filtro de dormitorios similares
        if (currentProperty.bedrooms) {
          params.append('bedrooms', String(currentProperty.bedrooms));
        }
        
        const res = await fetch(`/api/properties/${currentProperty.id}/similar?${params}`);
        if (res.ok) {
          const json: SimilarPropertiesResponse = await res.json();
          setData(json);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [currentProperty.id, currentProperty.price, currentProperty.totalArea, currentProperty.bedrooms, maxItems]);

  // Estado de carga
  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">
          Propiedades similares en {currentProperty.location?.district || 'la zona'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: Math.min(maxItems, 5) }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-square bg-[var(--bg-tertiary)] rounded-xl mb-3" />
              <div className="space-y-2 p-1">
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" />
                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2" />
                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error al cargar
  if (error) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">
          Propiedades similares
        </h3>
        <p className="text-[var(--text-secondary)] text-sm text-center py-8">
          No tenemos recomendaciones disponibles en este momento.
        </p>
      </div>
    );
  }

  // Sin resultados
  if (!data || data.properties.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">
          Propiedades similares
        </h3>
        <p className="text-[var(--text-secondary)] text-sm text-center py-8">
          No tenemos recomendaciones disponibles.
        </p>
      </div>
    );
  }

  // Determinar el titulo segun el nivel de ubicacion alcanzado
  const transactionLabel = TRANSACTION_LABELS[data.transactionType] || data.transactionType;
  const locationLabel = data.locationLevel !== 'nacional'
    ? `en ${data.locationLevel}`
    : 'en todo el pais';

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-6">
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">
        Propiedades similares {locationLabel}
      </h3>
      <p className="text-xs text-[var(--text-tertiary)] mb-4">
        {transactionLabel} - {data.totalResults} propiedad{data.totalResults !== 1 ? 'es' : ''} encontrada{data.totalResults !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {data.properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
        
        {/* Tarjeta Ver todo */}
        <Link
          href="/properties"
          className="flex flex-col items-center justify-center min-h-[280px] w-full bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] transition-all hover:shadow-[0_4px_6px_var(--shadow-color)] group"
        >
          <div className="relative w-28 h-20 mb-4 group-hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 left-0 w-16 h-16 bg-[var(--bg-tertiary)] rounded-xl border-2 border-[var(--bg-card)] shadow-[0_1px_2px_var(--shadow-color)] -rotate-6 transform origin-bottom-left z-10 overflow-hidden">
              <div className="w-full h-full bg-blue-100/50"></div>
            </div>
            <div className="absolute top-2 right-0 w-16 h-16 bg-[var(--bg-tertiary)] rounded-xl border-2 border-[var(--bg-card)] shadow-[0_1px_2px_var(--shadow-color)] rotate-6 transform origin-bottom-right z-20 overflow-hidden">
              <div className="w-full h-full bg-green-100/50"></div>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-16 bg-[var(--bg-secondary)] rounded-xl border-2 border-[var(--bg-card)] shadow-[0_4px_6px_var(--shadow-color)] z-30 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]">
                <Image className="w-7 h-7 text-[var(--text-tertiary)]" />
              </div>
            </div>
          </div>
          <span className="text-[var(--brand-primary)] font-semibold text-base group-hover:text-[var(--brand-primary-hover)] transition-colors">Ver todo</span>
        </Link>
      </div>
    </div>
  );
}
