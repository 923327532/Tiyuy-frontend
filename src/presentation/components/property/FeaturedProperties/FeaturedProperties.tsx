'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import { useFeaturedProperties } from '@/presentation/hooks/useFeaturedProperties';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface FeaturedPropertiesProps {
  hideViewAll?: boolean;
}

export function FeaturedProperties({ hideViewAll = false }: FeaturedPropertiesProps = {}) {
  const { data: properties = [], isLoading, error } = useFeaturedProperties();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [properties]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg sm:text-2xl font-semibold text-foreground flex items-center gap-2">Alojamientos populares</h2>
          <div className="flex gap-2">
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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

  if (error) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl mx-4">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Error al cargar propiedades</h3>
        <p className="text-[var(--text-secondary)] text-lg mb-6 max-w-md mx-auto">
          {error instanceof Error ? error.message : 'No se pudieron cargar las propiedades'}
        </p>
        <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mx-4">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">No hay propiedades disponibles</h3>
        <p className="text-[var(--text-secondary)] text-lg mb-6 max-w-md mx-auto">Sé el primero en publicar una propiedad o vuelve más tarde para descubrir nuevas oportunidades</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .carousel-card { width: calc(50% - 6px); flex-shrink: 0; }

        @media (min-width: 640px) { .carousel-card { width: calc((100% - 20px) / 2); } }
        @media (min-width: 768px) { .carousel-card { width: calc((100% - 2 * 24px) / 3); } }
        @media (min-width: 1024px) { .carousel-card { width: calc((100% - 3 * 24px) / 4); } }
        @media (min-width: 1280px) { .carousel-card { width: calc((100% - 4 * 24px) / 5); } }
        @media (min-width: 1536px) { .carousel-card { width: calc((100% - 5 * 24px) / 6); } }
        @media (min-width: 1800px) { .carousel-card { width: calc((100% - 6 * 24px) / 7); } }
      `}</style>

        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg sm:text-2xl font-semibold text-foreground flex items-center gap-2">
            Alojamientos populares
            <Link href="/properties" className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors ml-1">
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--text-primary)]" />
            </Link>
          </h2>
          <div className="flex gap-2">
            <button onClick={scrollLeft} disabled={!canScrollLeft} className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:shadow-md transition-all bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none" aria-label="Scroll izquierda"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={scrollRight} disabled={!canScrollRight} className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:shadow-md transition-all bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none" aria-label="Scroll derecha"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-3 hide-scrollbar pb-4">
          {properties.map((property) => (
            <div key={property.id} className="carousel-card">
              <PropertyCard property={property} />
            </div>
          ))}
          {!hideViewAll && (
            <div className="carousel-card">
              <Link href="/properties" className="flex flex-col items-center justify-center h-full min-h-[160px] sm:min-h-[320px] w-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]/70 rounded-[14px] sm:rounded-2xl border border-[var(--border-color)] transition-all hover:shadow-sm group">
                <div className="relative w-16 h-12 sm:w-32 sm:h-24 mb-3 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-0 left-0 w-10 h-10 sm:w-20 sm:h-20 bg-gray-200 rounded-lg sm:rounded-xl border-2 border-white shadow-sm -rotate-6 transform origin-bottom-left z-10 overflow-hidden"><div className="w-full h-full bg-blue-100/50"></div></div>
                  <div className="absolute top-2 right-0 w-10 h-10 sm:w-20 sm:h-20 bg-gray-200 rounded-lg sm:rounded-xl border-2 border-white shadow-sm rotate-6 transform origin-bottom-right z-20 overflow-hidden"><div className="w-full h-full bg-green-100/50"></div></div>
                  <div className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-20 sm:h-20 bg-gray-100 rounded-lg sm:rounded-xl border-2 border-white shadow-md z-30 overflow-hidden"><div className="w-full h-full flex items-center justify-center bg-gray-50"><Image className="w-4 h-4 sm:w-8 sm:h-8 text-gray-400" /></div></div>
                </div>
                <span className="text-[#003B95] font-semibold text-xs sm:text-lg group-hover:text-blue-800 transition-colors">Ver todo</span>
              </Link>
            </div>
          )}
        </div>
    </div>
  );
}
