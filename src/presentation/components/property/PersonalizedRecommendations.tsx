'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertySummary } from '@/core/domain/entities/Property';
import { PropertyCard } from './PropertyCard/PropertyCard';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import { mapSpanishPropertyType, mapTransactionType } from '@/core/application/mappers/PropertyTypeMapper';
import { Image } from 'lucide-react';

interface RecommendationProps {
  title: string;
  properties: any[];
  currentPropertyId?: number;
  currentTransactionType?: string;
  currentDistrict?: string;
  currentProvince?: string;
  currentType?: string;
}

export function PersonalizedRecommendations({ 
  title, 
  properties: _externalProperties, 
  currentPropertyId,
  currentTransactionType,
  currentDistrict,
  currentProvince,
  currentType
}: RecommendationProps) {
  const [recommendations, setRecommendations] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const propertyRepo = new PropertyRepository();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setNoResults(false);

        // Intentar cargar desde localStorage (última búsqueda del usuario)
        const lastSearchRaw = localStorage.getItem('lastSearch');
        let filters: any = { page: 0, size: 5, sort: 'createdAt,desc' };

        if (lastSearchRaw) {
          try {
            const lastSearch = JSON.parse(lastSearchRaw);
            if (lastSearch.transactionType) filters.transactionType = mapTransactionType(lastSearch.transactionType);
            if (lastSearch.type) filters.type = mapSpanishPropertyType(lastSearch.type);
            if (lastSearch.district) filters.district = lastSearch.district;
          } catch (e) {
            // ignore
          }
        }

        // Si no hay búsqueda previa, usar datos de la propiedad actual
        if (!filters.transactionType && currentTransactionType) {
          filters.transactionType = currentTransactionType;
        }
        if (!filters.type && currentType) {
          filters.type = mapSpanishPropertyType(currentType);
        }
        
        // Ubicación: usar SOLO un campo (district o province) para evitar
        // errores de JOIN duplicado en el backend (PropertySpecification)
        if (!filters.district && currentDistrict) {
          filters.district = currentDistrict;
        } else if (!filters.district && !filters.province && currentProvince) {
          filters.province = currentProvince;
        }
        // Si ya tenemos district del localStorage, NO agregar province

        const result = await propertyRepo.search(filters);
        
        // Filtrar la propiedad actual si está presente
        let filtered = result.properties || [];
        if (currentPropertyId) {
          filtered = filtered.filter(p => p.id !== currentPropertyId);
        }

        if (filtered.length > 0) {
          setRecommendations(filtered.slice(0, 5));
        } else {
          setNoResults(true);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [currentPropertyId, currentTransactionType, currentDistrict, currentProvince, currentType]);

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-lg sm:text-2xl font-semibold text-[var(--text-primary)] mb-4">{title}</h2>
        <div className="flex overflow-x-auto hide-scrollbar gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-[160px] sm:w-[280px] md:w-[320px] lg:w-[240px] xl:w-[190px] 2xl:w-[220px] flex-shrink-0">
              <div className="bg-transparent rounded-none border-none overflow-hidden animate-pulse">
                <div className="w-full aspect-square bg-[var(--bg-tertiary)] rounded-[14px]" />
                <div className="pt-2 space-y-1.5">
                  <div className="h-3.5 bg-[var(--bg-tertiary)] rounded w-full" />
                  <div className="h-3 bg-[var(--bg-tertiary)] rounded w-2/3" />
                  <div className="h-3 bg-[var(--bg-tertiary)] rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (noResults || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <h2 className="text-lg sm:text-2xl font-semibold text-[var(--text-primary)] mb-4">{title}</h2>

      {/* NOTA: ancho fijo por card para evitar que PropertyCard (min-w-[200px] en sm+)
          desborde su contenedor y las cards se sobrepongan en columnas angostas. */}
      <div className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-4 hide-scrollbar pb-4">
        {recommendations.map((property) => (
          <div key={property.id} className="w-[160px] sm:w-[240px] flex-shrink-0">
            <PropertyCard property={property} />
          </div>
        ))}
        
        {/* Tarjeta Ver todo */}
        <div className="w-[160px] sm:w-[240px] flex-shrink-0">
          <Link
            href="/properties"
            className="flex flex-col items-center justify-center h-full min-h-[160px] sm:min-h-[320px] w-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]/70 rounded-[14px] sm:rounded-2xl border border-[var(--border-color)] transition-all hover:shadow-sm group"
          >
            <div className="relative w-16 h-12 sm:w-32 sm:h-24 mb-3 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 left-0 w-10 h-10 sm:w-20 sm:h-20 bg-[var(--bg-tertiary)] rounded-lg sm:rounded-xl border-2 border-[var(--bg-card)] shadow-[0_1px_2px_var(--shadow-color)] -rotate-6 transform origin-bottom-left z-10 overflow-hidden">
                <div className="w-full h-full bg-blue-100/50"></div>
              </div>
              <div className="absolute top-2 right-0 w-10 h-10 sm:w-20 sm:h-20 bg-[var(--bg-tertiary)] rounded-lg sm:rounded-xl border-2 border-[var(--bg-card)] shadow-[0_1px_2px_var(--shadow-color)] rotate-6 transform origin-bottom-right z-20 overflow-hidden">
                <div className="w-full h-full bg-green-100/50"></div>
              </div>
              <div className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-20 sm:h-20 bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border-2 border-[var(--bg-card)] shadow-[0_4px_6px_var(--shadow-color)] z-30 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]">
                  <Image className="w-4 h-4 sm:w-8 sm:h-8 text-[var(--text-tertiary)]" />
                </div>
              </div>
            </div>
            <span className="text-[var(--brand-primary)] font-semibold text-xs sm:text-lg group-hover:text-[var(--brand-primary-dark)] transition-colors">Ver todo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
