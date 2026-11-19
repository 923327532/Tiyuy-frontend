'use client';

import React, { useEffect, useState } from 'react';
import { useProjectMap } from '@/presentation/hooks/useProjectMap';
import { ProjectMapView } from './ProjectMapView';
import { ProjectMapSidebar } from './ProjectMapSidebar';

interface ProjectMapModalProps {
  filters?: {
    district?: string;
    province?: string;
    region?: string;
    type?: string;
    phase?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    isFeatured?: boolean;
  };
  onClose: () => void;
}

export function ProjectMapModal({ filters, onClose }: ProjectMapModalProps) {
  const {
    searchResult,
    isLoading,
    selectedProjectId,
    search,
    selectProject,
    reset,
  } = useProjectMap();

  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // Si hay filtros, buscar con filtros. Si no, cargar todos los proyectos
    search(filters || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Al cerrar el modal NO reseteamos el store porque comparte el estado
  // con el mini mapa del padre. Si reseteamos, el mini mapa se queda sin datos.
  // En su lugar, el padre se encarga de refrescar cuando sea necesario.

  // Resetear página cuando cambian los resultados
  useEffect(() => {
    setPage(0);
  }, [searchResult?.projects?.length]);

  const allProjects = searchResult?.projects || [];
  const totalPages = Math.max(1, Math.ceil(allProjects.length / ITEMS_PER_PAGE));
  const paginatedProjects = allProjects.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full h-full flex flex-col md:flex-row">
        <div className="md:w-72 lg:w-80 bg-white md:rounded-l-2xl overflow-hidden z-10
          order-2 md:order-1 h-1/3 md:h-full flex flex-col">
          <ProjectMapSidebar
            projects={paginatedProjects}
            selectedProjectId={selectedProjectId}
            isLoading={isLoading}
            totalResults={searchResult?.totalResults || 0}
            coverageMessage={searchResult?.coverageMessage || null}
            onSelectProject={selectProject}
            onClose={onClose}
          />
          
          {/* Paginación en el sidebar */}
          {!isLoading && allProjects.length > ITEMS_PER_PAGE && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
              <button
                onClick={() => setPage((p: number) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-light text-brand-dark hover:bg-brand-light-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="text-xs text-brand-dark font-semibold">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p: number) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-light text-brand-dark hover:bg-brand-light-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 order-1 md:order-2 h-2/3 md:h-full">
          <ProjectMapView
            projects={allProjects}
            selectedProjectId={selectedProjectId}
            onSelectProject={selectProject}
          />
        </div>
      </div>
    </div>
  );
}
