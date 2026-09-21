'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import { useFilteredProperties } from '@/presentation/hooks/useFilteredProperties';
import type { PropertyFilter } from '@/core/domain/entities/PropertyFilter';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface FilteredPropertiesProps {
  title: string;
  viewAllLink: string;
  filter: PropertyFilter;
  hideViewAll?: boolean;
  emptyMessage?: string;
}

export function FilteredProperties({
  title,
  viewAllLink,
  filter,
  hideViewAll = false,
  emptyMessage = 'No hay propiedades disponibles en esta categoria',
}: FilteredPropertiesProps) {
  const { data: properties = [], isLoading, error } = useFilteredProperties(filter);
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

  const scrollByAmount = () => {
    if (!scrollContainerRef.current) return 280;
    if (window.innerWidth < 640) {
      return scrollContainerRef.current.clientWidth / 2;
    }
    return scrollContainerRef.current.clientWidth;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex-1 min-w-0" />
          <div className="flex gap-4 sm:gap-5 md:gap-6 pb-4 px-8 flex-shrink-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-[85vw] sm:w-[280px] md:w-[320px] lg:w-[240px] xl:w-[190px] 2xl:w-[220px] flex-shrink-0">
                <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden animate-pulse">
                  <div className="w-full aspect-square bg-[var(--bg-tertiary)]" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[var(--bg-tertiary)] rounded-full w-24" />
                    <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
                    <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3" />
                    <div className="h-5 bg-[var(--bg-tertiary)] rounded w-20 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-[var(--text-secondary)]">{error instanceof Error ? error.message : 'Error al cargar'}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[var(--text-secondary)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (max-width: 639px) {
          .filtered-grid-mobile {
            display: flex;
            overflow-x: auto;
            gap: 10px;
            padding-bottom: 8px;
            scroll-snap-type: x mandatory;
          }
          .filtered-grid-mobile .carousel-card {
            min-width: calc(50% - 5px);
            flex-shrink: 0;
            scroll-snap-align: start;
          }
          .filtered-grid-mobile .view-all-card {
            display: none;
          }
        }

        @media (min-width: 640px) {
          .filtered-grid-mobile {
            display: flex;
            overflow-x: auto;
            gap: 16px;
            padding-bottom: 16px;
          }
          .carousel-card { 
            width: calc((100% - 20px) / 2); 
            flex-shrink: 0;
          }
          .filtered-grid-mobile .view-all-card {
            display: flex;
          }
        }
        @media (min-width: 768px) {
          .carousel-card { width: calc((100% - 2 * 24px) / 3); }
        }
        @media (min-width: 1024px) {
          .carousel-card { width: calc((100% - 3 * 24px) / 4); }
        }
        @media (min-width: 1280px) {
          .carousel-card { width: calc((100% - 4 * 24px) / 5); }
        }
        @media (min-width: 1536px) {
          .carousel-card { width: calc((100% - 5 * 24px) / 6); }
        }
        @media (min-width: 1800px) {
          .carousel-card { width: calc((100% - 6 * 24px) / 7); }
        }
      `}</style>

      <div className="w-full">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            {title}
            <Link href={viewAllLink} className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors ml-1">
              <ChevronRight className="w-4 h-4 text-[var(--text-primary)]" />
            </Link>
          </h2>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:shadow-md transition-all bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              aria-label="Scroll izquierda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:shadow-md transition-all bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              aria-label="Scroll derecha"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="filtered-grid-mobile"
        >
          {properties.map((property) => (
            <div key={property.id} className="carousel-card">
              <PropertyCard property={property} />
            </div>
          ))}

          {!hideViewAll && (
            <div className="carousel-card view-all-card">
              <Link href={viewAllLink} className="flex flex-col items-center justify-center h-full min-h-[320px] w-full bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] transition-all hover:shadow-md group">
                <div className="relative w-32 h-24 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gray-200 rounded-xl border-2 border-white shadow-sm -rotate-6 transform origin-bottom-left z-10 overflow-hidden">
                    <div className="w-full h-full bg-blue-100/50"></div>
                  </div>
                  <div className="absolute top-2 right-0 w-20 h-20 bg-gray-200 rounded-xl border-2 border-white shadow-sm rotate-6 transform origin-bottom-right z-20 overflow-hidden">
                    <div className="w-full h-full bg-green-100/50"></div>
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-100 rounded-xl border-2 border-white shadow-md z-30 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <span className="text-[#003B95] font-semibold text-lg group-hover:text-blue-800 transition-colors">Ver todo</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}