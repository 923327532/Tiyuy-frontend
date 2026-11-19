'use client';

import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AlertTriangle, Loader2, Building, Home, Building2, Store, Warehouse } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import { PropertyCard } from '@/presentation/components/property/PropertyCard/PropertyCard';
import { FeaturedProperties } from '@/presentation/components/property/FeaturedProperties/FeaturedProperties';
import { PropertySummary } from '@/core/domain/entities/Property';
import { useInfiniteScroll } from '@/presentation/hooks/useInfiniteScroll';
import { usePropertyMap } from '@/presentation/hooks/usePropertyMap';
import { PropertyMapModal } from '@/presentation/components/properties/PropertyMapModal';
import Link from 'next/link';
import PaginationNav from '@/presentation/components/shared/PaginationNav';

const MiniPropertyMap = dynamic(
  () => import('@/presentation/components/properties/PropertyMapView').then((mod) => mod.PropertyMapView),
  { ssr: false }
);

export default function PropertiesContent() {
  const [showMapModal, setShowMapModal] = useState(false);
  const [miniLoading, setMiniLoading] = useState(true);

  const propertyRepo = new PropertyRepository();
  const { searchResult: mapResult, search: searchMap, selectProperty: selectMapProperty, selectedPropertyId: selectedMapPropertyId, reset: resetPropertyMap } = usePropertyMap();

  // Resetear el store al montar para evitar datos zombies de navegación SPA
  useEffect(() => {
    resetPropertyMap();
    setMiniLoading(true);
    searchMap({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resetear el store al desmontar para que al volver no haya datos zombies
  useEffect(() => {
    return () => {
      resetPropertyMap();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapResult) {
      setMiniLoading(false);
    }
  }, [mapResult]);

  const miniProperties = (mapResult?.properties || []).slice(0, 60);

  const fetchSaleProperties = useCallback(async (page: number, size: number) => {
    const result = await propertyRepo.search({ page, size, sort: 'createdAt,desc', transactionType: 'SALE' });
    return { content: result.properties, totalElements: result.pagination.totalElements, totalPages: result.pagination.totalPages, page: result.pagination.currentPage, size: result.pagination.pageSize, last: !result.pagination.hasNext };
  }, [propertyRepo]);

  const fetchRentProperties = useCallback(async (page: number, size: number) => {
    const result = await propertyRepo.search({ page, size, sort: 'createdAt,desc', transactionType: 'RENT' });
    return { content: result.properties, totalElements: result.pagination.totalElements, totalPages: result.pagination.totalPages, page: result.pagination.currentPage, size: result.pagination.pageSize, last: !result.pagination.hasNext };
  }, [propertyRepo]);

  const saleScroll = useInfiniteScroll<PropertySummary>({
    fetchFn: fetchSaleProperties,
    pageSize: 18,
    threshold: 400,
    deps: [],
    maxInfinitePages: 4,
  });

  const rentScroll = useInfiniteScroll<PropertySummary>({
    fetchFn: fetchRentProperties,
    pageSize: 18,
    threshold: 400,
    deps: [],
    maxInfinitePages: 4,
  });

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)]">
      <style>{`
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          50% { transform: scale(1.02); box-shadow: 0 10px 40px rgba(0,0,0,0.35); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 4s ease-in-out infinite;
        }
      `}</style>

      {/* Hero con imagen de fondo */}
      <section className="relative w-full overflow-hidden border-b-2 border-brand/20">
        <div className="absolute inset-0">
          <img 
            src="https://img4.idealista.com/blur/WEB_DETAIL_TOP/0/id.pro.es.image.master/78/b0/ef/1435510371.jpg"
            alt="Propiedades inmobiliarias"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand/60" />
        </div>
        
        <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12 sm:py-20 lg:py-24">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-brand/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 border border-white/20">
                <Icon icon="mdi:home" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand" />
                <span>PROPIEDADES DESTACADAS</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Encuentra tu <span className="text-brand">hogar ideal</span>
              </h1>
              
              <p className="text-white/80 text-sm sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
                Descubre los mejores departamentos, casas y terrenos en las principales zonas del Perú
              </p>
            </div>

            {/* Mini mapa - visible también en mobile como botón */}
            <div className="flex-shrink-0">
              <div
                onClick={() => setShowMapModal(true)}
                className="block relative group cursor-pointer"
              >
                <div className="w-24 h-24 lg:w-[300px] xl:w-[360px] lg:h-[220px] xl:h-[250px] rounded-xl lg:rounded-[18px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.3)] lg:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-2 border-white/20 transition-all duration-500 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] group-hover:border-brand/40">
                  {!miniLoading && miniProperties.length > 0 && (
                    <MiniPropertyMap
                      properties={miniProperties}
                      selectedPropertyId={selectedMapPropertyId}
                      onSelectProperty={selectMapProperty}
                      zoom={11}
                    />
                  )}
                  {miniLoading && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-xl lg:rounded-[18px] bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] lg:text-xs font-semibold px-2 py-1 lg:px-3 lg:py-1.5 rounded-full shadow-sm flex items-center gap-1">
                  <Building className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                  <span className="hidden lg:inline">Explorar mapa</span>
                  <span className="lg:hidden">Mapa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de mapa */}
      {showMapModal && (
        <PropertyMapModal
          onClose={() => setShowMapModal(false)}
        />
      )}

      {/* Chips de tipo de propiedad */}
      <section className="relative z-20 bg-[var(--bg-primary)] w-full">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 pt-4 sm:pt-6 pb-8 sm:pb-16">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-10">
            {[
              { label: 'Departamentos', icon: <Building2 className="w-3.5 h-3.5" />, href: '/rent/departamentos/lima' },
              { label: 'Casas', icon: <Home className="w-3.5 h-3.5" />, href: '/rent/casas/lima' },
              { label: 'Terrenos', icon: <Warehouse className="w-3.5 h-3.5" />, href: '/rent/terrenos/lima' },
              { label: 'Oficinas', icon: <Building className="w-3.5 h-3.5" />, href: '/rent/oficinas/lima' },
              { label: 'Locales', icon: <Store className="w-3.5 h-3.5" />, href: '/rent/locales/lima' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--bg-card)] rounded-lg border border-brand/20 hover:border-brand/60 shadow-sm hover:shadow text-[var(--text-secondary)] hover:text-brand-dark text-xs sm:text-sm font-medium transition-all duration-200"
              >
                <span className="text-brand">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <FeaturedProperties hideViewAll />
        </div>
      </section>

      {/* Propiedades en Venta */}
      <section className="bg-[var(--bg-primary)]">
        <div className="w-full px-4 sm:px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto pb-10 sm:pb-20">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Explorar todas las propiedades en venta
              </h2>
            </div>
            <PropertyGridSection scroll={saleScroll} />
          </div>
        </div>
      </section>

      {/* Propiedades en Alquiler */}
      <section className="bg-[var(--bg-primary)]">
        <div className="w-full px-4 sm:px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto pb-10 sm:pb-20">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Explorar todas las propiedades en alquiler
              </h2>
            </div>
            <PropertyGridSection scroll={rentScroll} />
          </div>
        </div>
      </section>
    </main>
  );
}

function PropertyGridSection({ scroll }: { scroll: any }) {
  const { items, isLoading, isLoadingMore, error, hasMore, totalElements, totalPages, page, showPagination, lastItemRef, reload, goToPage, getPageNumbers } = scroll;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full aspect-square bg-[var(--bg-tertiary)] rounded-[14px] mb-2" />
            <div className="space-y-1.5">
              <div className="h-3.5 bg-[var(--bg-tertiary)] rounded w-3/4" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 sm:py-20 bg-red-50 dark:bg-red-950/30 rounded-2xl mx-4 sm:mx-0">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 sm:w-16 h-16 text-red-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-4">Error al cargar propiedades</h3>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-6 px-4">{error}</p>
        <button onClick={reload} className="bg-red-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base">Reintentar</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20 bg-[var(--bg-tertiary)] rounded-2xl mx-4 sm:mx-0">
        <div className="flex justify-center mb-4">
          <Icon icon="mdi:home-outline" className="w-12 h-12 sm:w-16 h-16 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-4">No hay propiedades disponibles</h3>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-6 px-4">Pronto tendremos nuevas propiedades para ti</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">
        {items.map((property: any, index: number) => {
          const isLastItem = index === items.length - 1;
          return (
            <div key={property.id} ref={isLastItem ? lastItemRef : undefined}>
              <PropertyCard property={property} />
            </div>
          );
        })}
      </div>

      {isLoadingMore && (
        <div className="flex items-center justify-center gap-2 mt-8 py-4">
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-spin" />
          <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Cargando más propiedades...</span>
        </div>
      )}

      {showPagination && (
        <PaginationNav
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={18}
          onPageChange={goToPage}
          getPageNumbers={getPageNumbers}
        />
      )}
    </>
  );
}
