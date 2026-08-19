'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import { useFilteredProperties } from '@/presentation/hooks/useFilteredProperties';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface SectionConfig {
  title: string;
  viewAllLink: string;
  filter: { type: string; transactionType?: string };
  key: string;
}

const ALL_SECTIONS: SectionConfig[] = [
  {
    title: 'Departamentos para alquilar',
    viewAllLink: '/rent/departamentos/lima',
    filter: { type: 'APARTMENT', transactionType: 'RENT' },
    key: 'apartment-rent',
  },
  {
    title: 'Casas disponibles para compra',
    viewAllLink: '/sale/casas/lima',
    filter: { type: 'HOUSE', transactionType: 'SALE' },
    key: 'house-sale',
  },
  {
    title: 'Espacios para tu negocio',
    viewAllLink: '/sale/oficinas/lima',
    filter: { type: 'COMMERCIAL' },
    key: 'commercial',
  },
  {
    title: 'Terrenos y lotes de inversión',
    viewAllLink: '/sale/terrenos/lima',
    filter: { type: 'LAND' },
    key: 'land',
  },
];

const MIN_PROPERTIES_FOR_OWN_ROW = 6;

function SectionRow({
  title,
  viewAllLink,
  properties,
  hideViewAll = false,
}: {
  title: string;
  viewAllLink: string;
  properties: any[];
  hideViewAll?: boolean;
}) {
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
          {title}
          <Link href={viewAllLink} className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors ml-1">
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--text-primary)]" />
          </Link>
        </h2>
        <div className="flex gap-2">
          <button onClick={scrollLeft} disabled={!canScrollLeft} className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:shadow-md transition-all bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none" aria-label="Scroll izquierda"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={scrollRight} disabled={!canScrollRight} className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:shadow-md transition-all bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none" aria-label="Scroll derecha"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex overflow-x-auto gap-3 hide-scrollbar snap-x snap-mandatory scroll-smooth pb-4">
        {properties.map((property: any) => (
          <div key={property.id} className="carousel-card flex-shrink-0 snap-start">
            <PropertyCard property={property} />
          </div>
        ))}
        {!hideViewAll && (
          <div className="carousel-card flex-shrink-0 snap-start">
            <Link href={viewAllLink} className="flex flex-col items-center justify-center h-full min-h-[160px] sm:min-h-[320px] w-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-[14px] sm:rounded-2xl border border-[var(--border-color)] transition-all hover:shadow-sm group">
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

function SkeletonRow() {
  return (
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
  );
}

export function IntelligentPropertySections() {
  const { data: aptRent = [], isLoading: loading1 } = useFilteredProperties({ type: 'APARTMENT', transactionType: 'RENT' });
  const { data: houseSale = [], isLoading: loading2 } = useFilteredProperties({ type: 'HOUSE', transactionType: 'SALE' });
  const { data: commercial = [], isLoading: loading3 } = useFilteredProperties({ type: 'COMMERCIAL' });
  const { data: land = [], isLoading: loading4 } = useFilteredProperties({ type: 'LAND' });

  const isLoading = loading1 || loading2 || loading3 || loading4;

  const sectionData: { config: SectionConfig; properties: any[] }[] = [
    { config: ALL_SECTIONS[0], properties: aptRent },
    { config: ALL_SECTIONS[1], properties: houseSale },
    { config: ALL_SECTIONS[2], properties: commercial },
    { config: ALL_SECTIONS[3], properties: land },
  ];

  if (isLoading) {
    return <SkeletonRow />;
  }

  const sectionsWithEnough = sectionData.filter(s => s.properties.length >= MIN_PROPERTIES_FOR_OWN_ROW);
  const sectionsWithoutEnough = sectionData.filter(s => s.properties.length > 0 && s.properties.length < MIN_PROPERTIES_FOR_OWN_ROW);

  const totalProperties = sectionData.reduce((sum, s) => sum + s.properties.length, 0);

  if (totalProperties === 0) {
    return null;
  }

  return (
    <>
      {sectionsWithEnough.map((section) => (
        <div key={section.config.key} className="mb-6">
          <SectionRow
            title={section.config.title}
            viewAllLink={section.config.viewAllLink}
            properties={section.properties}
          />
        </div>
      ))}

      {sectionsWithoutEnough.length > 0 && (
        <div className="mb-6">
          <SectionRow
            title={(() => {
              const names = sectionsWithoutEnough.map(s => {
                const title = s.config.title;
                if (title.includes('Departamentos')) return 'Departamentos';
                if (title.includes('Casas')) return 'Casas';
                if (title.includes('negocio')) return 'Locales Comerciales';
                if (title.includes('Terrenos')) return 'Terrenos y Lotes';
                return title;
              });
              return names.join(', ');
            })()}
            viewAllLink="/properties"
            properties={sectionsWithoutEnough.flatMap(s => s.properties)}
          />
        </div>
      )}
    </>
  );
}