'use client';

import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AlertTriangle, Loader2, Building, Building2, MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ProjectRepository } from '@/infrastructure/repositories/ProjectRepository';
import { ProjectCard } from '@/presentation/components/project/ProjectCard/ProjectCard';
import { ProjectMapModal } from '@/presentation/components/projects/ProjectMapModal';
import Link from 'next/link';
import { useProjectMap } from '@/presentation/hooks/useProjectMap';

const MiniProjectMap = dynamic(
  () => import('@/presentation/components/projects/ProjectMapView').then((mod) => mod.ProjectMapView),
  { ssr: false }
);
import { FeaturedProjects } from '@/presentation/components/project/FeaturedProjects/FeaturedProjects';
import { ProjectSummary } from '@/core/domain/entities/Project';
import { useInfiniteScroll } from '@/presentation/hooks/useInfiniteScroll';
import PaginationNav from '@/presentation/components/shared/PaginationNav';

interface ProjectFilters {
  district?: string;
  province?: string;
  region?: string;
  type?: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED';
  phase?: 'PRE_SALE' | 'SALE' | 'DELIVERY';
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isVerified?: boolean;
  sort?: string;
}

export default function ProjectsContent() {
  const [showMapModal, setShowMapModal] = useState(false);
  const [miniLoading, setMiniLoading] = useState(true);

  const [filters] = useState<ProjectFilters>({
    sort: 'createdAt,desc'
  });

  const projectRepo = new ProjectRepository();
  const { searchResult: mapResult, search: searchMap, selectProject: selectMapProject, selectedProjectId: selectedMapId, reset: resetProjectMap } = useProjectMap();

  // Resetear el store al montar para evitar datos zombies de navegación SPA
  // y forzar que el mini mapa siempre cargue desde cero
  useEffect(() => {
    resetProjectMap();
    setMiniLoading(true);
    searchMap({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resetear el store al desmontar para que al volver no haya datos zombies
  useEffect(() => {
    return () => {
      resetProjectMap();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapResult) {
      setMiniLoading(false);
    }
  }, [mapResult]);

  // Limitar a 60 proyectos para el mini mapa preview (suficiente para mostrar distribución)
  const miniProjects = (mapResult?.projects || []).slice(0, 60);

  const fetchProjects = useCallback(async (page: number, size: number) => {
    const result = await projectRepo.searchProjects({
      ...filters,
      page,
      size,
    });
    return result;
  }, [filters, projectRepo]);

  const {
    items: allProjects,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalElements,
    totalPages,
    page,
    showPagination,
    lastItemRef,
    reload,
    goToPage,
    getPageNumbers,
  } = useInfiniteScroll<ProjectSummary>({
    fetchFn: fetchProjects,
    pageSize: 18,
    threshold: 400,
    deps: [filters],
    maxInfinitePages: 4, 
  });

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Estilos globales inyectados para forzar la reducción estética y simetría en móviles */}
      <style>{`
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          50% { transform: scale(1.02); box-shadow: 0 10px 40px rgba(0,0,0,0.35); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 4s ease-in-out infinite;
        }

        @media (max-width: 639px) {
          /* Reset de tarjetas inferiores para imitar tamaño mini de Airbnb */
          .compact-mobile-card > div {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .compact-mobile-card img,
          .compact-mobile-card .relative {
            border-radius: 14px !important;
            aspect-ratio: 1 / 1 !important;
            margin-bottom: 6px !important;
          }
          .compact-mobile-card h3 {
            font-size: 13px !important;
            font-weight: 600 !important;
            line-height: 1.2 !important;
          }
          .compact-mobile-card p, 
          .compact-mobile-card span {
            font-size: 11px !important;
          }
          .compact-mobile-card svg {
            width: 12px !important;
            height: 12px !important;
          }
          .compact-mobile-card .hide-on-compact {
            display: none !important;
          }
        }
      `}</style>

      {/* Sección Hero con imagen de fondo */}
      <section className="relative w-full overflow-hidden border-b-2 border-brand/20">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img 
            src="https://img4.idealista.com/blur/WEB_DETAIL_TOP/0/id.pro.es.image.master/78/b0/ef/1435510371.jpg"
            alt="Proyectos inmobiliarios"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
          {/* Borde fino verde corporativo en el borde inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand/60" />
        </div>
        
        {/* Contenido del hero */}
        <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12 sm:py-20 lg:py-24">
          <div className="flex items-center gap-8 lg:gap-16">
            <div className="flex-1 max-w-2xl">
              {/* Cinta delgada - mismo estilo que header de inmobiliarias */}
              <div className="inline-flex items-center gap-2 bg-brand/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 border border-white/20">
                <Icon icon="mdi:star" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand" />
                <span>PROYECTOS DESTACADOS</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Proyectos destacados <br className="hidden sm:block" />
                <span className="text-brand">cerca de ti</span>
              </h1>
              
              <p className="text-white/80 text-sm sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
                Descubre los mejores proyectos de vivienda e inversión de las principales inmobiliarias del Perú
              </p>
            </div>

            {/* Mini Mapa interactivo - desktop */}
            <div className="hidden lg:block flex-shrink-0 ml-auto lg:mr-8 xl:mr-16">
              <div
                onClick={() => setShowMapModal(true)}
                className="block relative group animate-pulse-soft cursor-pointer"
              >
                <div className="w-[300px] xl:w-[360px] h-[220px] xl:h-[250px] rounded-[18px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-2 border-white/20 transition-all duration-500 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] group-hover:border-brand/40">
                  {!miniLoading && miniProjects.length > 0 && (
                    <MiniProjectMap
                      projects={miniProjects}
                      selectedProjectId={selectedMapId}
                      onSelectProject={selectMapProject}
                      zoom={11}
                      compact={true}
                    />
                  )}
                  {miniLoading && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-[18px] bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-sm flex items-center gap-1.5">
                  <Building className="w-3 h-3" />
                  Explorar mapa
                </div>
              </div>
            </div>

            {/* Botón mapa en mobile - pequeño */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMapModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-xs font-medium hover:bg-white/30 transition-all"
              >
                <MapIcon className="w-3 h-3" />
                Mapa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de mapa completo */}
      {showMapModal && (
        <ProjectMapModal
          onClose={() => setShowMapModal(false)}
        />
      )}

      {/* Sección Tipo de Proyecto + Carrusel */}
      <section className="relative z-20 bg-[var(--bg-primary)] w-full">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 pt-4 sm:pt-6 pb-8 sm:pb-16">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-10">
            {[
              { label: 'Residencial', icon: <Building2 className="w-3.5 h-3.5" />, href: '/projects/departamentos/lima' },
              { label: 'Comercial', icon: <Building className="w-3.5 h-3.5" />, href: '/projects/locales/lima' },
              { label: 'Mixto', icon: <Building className="w-3.5 h-3.5" />, href: '/projects/mixto/lima' },
              { label: 'Industrial', icon: <Building className="w-3.5 h-3.5" />, href: '/projects/industrial/lima' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-lg border border-brand/20 hover:border-brand/60 shadow-sm hover:shadow text-gray-600 hover:text-brand-dark text-xs sm:text-sm font-medium transition-all duration-200"
              >
                <span className="text-brand">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <FeaturedProjects />
        </div>
      </section>

      {/* Todos los Proyectos (Grid) */}
      <section className="bg-[var(--bg-primary)]">
        <div className="w-full px-4 sm:px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto pb-10 sm:pb-20">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Explorar todos los proyectos
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-square bg-gray-200 rounded-[14px] mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 sm:py-20 bg-red-50 dark:bg-red-950/30 rounded-2xl mx-4 sm:mx-0">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="w-12 h-12 sm:w-16 h-16 text-red-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-4">
                  Error al cargar proyectos
                </h3>
                <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-6 px-4">{error}</p>
                <button 
                  onClick={reload}
                  className="bg-red-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Reintentar
                </button>
              </div>
            ) : allProjects.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-[var(--bg-tertiary)] rounded-2xl mx-4 sm:mx-0">
                <div className="flex justify-center mb-4">
                  <Icon icon="mdi:building-outline" className="w-12 h-12 sm:w-16 h-16 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-4">
                  No hay proyectos disponibles
                </h3>
                <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-6 px-4">
                  Pronto tendremos nuevos proyectos inmobiliarios para ti
                </p>
              </div>
            ) : (
              <>
                {/* Grid con gap-3 en móvil de 2 columnas perfecto para las mini cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">
                  {allProjects.map((project, index) => {
                    const isLastItem = index === allProjects.length - 1;
                    return (
                      <div
                        key={project.id}
                        ref={isLastItem ? lastItemRef : undefined}
                        className="w-full min-w-0 compact-mobile-card"
                      >
                        <ProjectCard project={project} />
                      </div>
                    );
                  })}
                </div>

                {isLoadingMore && (
                  <div className="flex items-center justify-center gap-2 mt-8 py-4">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-spin" />
                    <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Cargando más proyectos...</span>
                  </div>
                )}

                {showPagination && (
                  <div className="mt-6 sm:mt-0">
                    <PaginationNav
                      currentPage={page}
                      totalPages={totalPages}
                      totalElements={totalElements}
                      pageSize={18}
                      onPageChange={goToPage}
                      getPageNumbers={getPageNumbers}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}