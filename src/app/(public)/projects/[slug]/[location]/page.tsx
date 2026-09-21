import { Metadata } from 'next';
import { ProjectRepository } from '@/infrastructure/repositories/ProjectRepository';
import { Suspense } from 'react';
import { ProjectSearchBar } from './ProjectSearchBar';
import { ProjectFiltersClient } from './ProjectFiltersClient';
import { ProjectGrid } from './ProjectGrid';
import { Pagination } from './Pagination';
import { projectMapResultToGeneric } from '@/core/domain/adapters/MapItemAdapters';
import { MapFilters } from '@/core/domain/entities/MapTypes';
import PropertyMapWrapper from './DynamicMapWrapper';

interface Props {
  params: Promise<{
    slug: string;
    location: string;
  }>;
  searchParams: Promise<{
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    minArea?: string;
    maxArea?: string;
    phase?: string;
    isFeatured?: string;
    isVerified?: string;
    filtered?: string;
  }>;
}

const toLocationName = (slug: string) => {
  const cleaned = decodeURIComponent(slug).replace(/-/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const PROJECT_TYPE_MAP: Record<string, string> = {
  'departamentos': 'RESIDENTIAL',
  'residencial': 'RESIDENTIAL',
  'casas': 'RESIDENTIAL',
  'locales': 'COMMERCIAL',
  'comercial': 'COMMERCIAL',
  'mixto': 'MIXED_USE',
  'industrial': 'INDUSTRIAL',
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'departamentos': 'Proyectos Residenciales',
  'residencial': 'Proyectos Residenciales',
  'casas': 'Proyectos Residenciales',
  'locales': 'Proyectos Comerciales',
  'comercial': 'Proyectos Comerciales',
  'mixto': 'Proyectos Mixtos',
  'industrial': 'Proyectos Industriales',
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const projectTypeLabel = PROJECT_TYPE_LABELS[resolvedParams.slug] || 'Proyectos';
  const location = toLocationName(resolvedParams.location);

  const isFiltered = resolvedSearchParams.filtered === '1';

  let title = `${projectTypeLabel} en ${location} | TIYUY`;
  let description = `Descubre los mejores ${projectTypeLabel.toLowerCase()} en ${location}. Proyectos de vivienda e inversión con precios, fotos y detalles completos en TIYUY.`;

  if (isFiltered) {
    const filterParts = [];
    if (resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice) {
      const minPrice = resolvedSearchParams.minPrice ? `desde S/.${resolvedSearchParams.minPrice}` : '';
      const maxPrice = resolvedSearchParams.maxPrice ? `hasta S/.${resolvedSearchParams.maxPrice}` : '';
      if (minPrice || maxPrice) filterParts.push(`${minPrice} ${maxPrice}`.trim());
    }
    if (resolvedSearchParams.phase) filterParts.push(`etapa ${resolvedSearchParams.phase}`);
    if (resolvedSearchParams.minArea || resolvedSearchParams.maxArea) {
      const minArea = resolvedSearchParams.minArea ? `desde ${resolvedSearchParams.minArea}m²` : '';
      const maxArea = resolvedSearchParams.maxArea ? `hasta ${resolvedSearchParams.maxArea}m²` : '';
      if (minArea || maxArea) filterParts.push(`${minArea} ${maxArea}`.trim());
    }

    if (filterParts.length > 0) {
      title = `${projectTypeLabel} en ${location} - ${filterParts.join(', ')} | TIYUY`;
      description = `Busca ${projectTypeLabel.toLowerCase()} en ${location} con ${filterParts.join(' y ')}. Encuentra el proyecto perfecto con filtros avanzados en TIYUY.`;
    }
  }

  const canonicalUrl = `https://tiyuy.com/projects/${resolvedParams.slug}/${resolvedParams.location}${
    isFiltered
      ? '?' +
        new URLSearchParams(
          Object.entries(resolvedSearchParams).filter(([_, value]) => value !== undefined) as [string, string][]
        ).toString()
      : ''
  }`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'TIYUY',
      locale: 'es_PE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ProjectsCategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const projectRepo = new ProjectRepository();

  const projectType = PROJECT_TYPE_MAP[resolvedParams.slug];
  const location = toLocationName(resolvedParams.location);

  const isFiltered = resolvedSearchParams.filtered === '1';

  const MAIN_PROVINCES = ['Lima', 'Arequipa', 'Trujillo', 'Callao'];
  const isMainProvince = MAIN_PROVINCES.includes(location);
  const isAllPeru = location.toLowerCase() === 'peru';

  const filters: any = {
    sort: 'createdAt,desc',
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 0,
    size: 15,
    ...(projectType ? { type: projectType } : {}),
    ...(isAllPeru ? {} : isMainProvince ? { province: location } : { district: location }),
    ...(isFiltered
      ? {
          minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
          maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
          minArea: resolvedSearchParams.minArea ? Number(resolvedSearchParams.minArea) : undefined,
          maxArea: resolvedSearchParams.maxArea ? Number(resolvedSearchParams.maxArea) : undefined,
          phase: resolvedSearchParams.phase || undefined,
          isFeatured: resolvedSearchParams.isFeatured !== undefined ? resolvedSearchParams.isFeatured === 'true' : undefined,
          isVerified: resolvedSearchParams.isVerified !== undefined ? resolvedSearchParams.isVerified === 'true' : undefined,
        }
      : {}),
  };

  const result = await projectRepo.searchProjects(filters);
  const projectTypeLabel = PROJECT_TYPE_LABELS[resolvedParams.slug] || 'Proyectos';

  // Crear searchFn para el mapa de proyectos
  const projectSearchFn = async (mapFilters: MapFilters) => {
    const mapResult = await projectRepo.searchForMap({
      type: projectType,
      district: mapFilters.district || location,
      province: mapFilters.province,
      region: mapFilters.region,
      minPrice: mapFilters.minPrice,
      maxPrice: mapFilters.maxPrice,
      minArea: mapFilters.minArea,
      maxArea: mapFilters.maxArea,
      isFeatured: mapFilters.isFeatured,
    });
    return projectMapResultToGeneric(mapResult);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="px-8 pt-6 pb-8">
        {/* ── BARRA DE BÚSQUEDA SUPERIOR ── */}
        <div className="mb-6">
          <ProjectSearchBar projectType={resolvedParams.slug} location={location} />
        </div>

        {/* ── GRID: FILTROS SIDEBAR + RESULTADOS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filtros */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <Suspense fallback={
                <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse h-96" />
              }>
                <ProjectFiltersClient
                  initialFilters={filters}
                  projectType={resolvedParams.slug}
                />
              </Suspense>
            </div>
          </aside>

          {/* Resultados */}
          <div className="lg:col-span-3">
            {/* Título de resultados + Botón mapa */}
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">
                {projectTypeLabel} en {location}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({result.totalElements} proyectos)
                </span>
              </h1>
                <PropertyMapWrapper
                  entityType="project"
                  entitySubType={projectType}
                  filters={{
                    ...(isAllPeru ? {} : isMainProvince ? { province: location } : { district: location }),
                    ...(isFiltered
                      ? {
                          minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
                          maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
                          minArea: resolvedSearchParams.minArea ? Number(resolvedSearchParams.minArea) : undefined,
                          maxArea: resolvedSearchParams.maxArea ? Number(resolvedSearchParams.maxArea) : undefined,
                        }
                      : {}),
                  }}
                  totalItems={result.totalElements}
                  itemLabel="proyecto"
                  itemLabelPlural="proyectos"
                  detailBaseUrl="/projects/detail/"
                />
            </div>

            <ProjectGrid projects={result.content} />

            {result.totalPages > 1 && (
              <Pagination
                pagination={{
                  currentPage: result.page,
                  totalPages: result.totalPages,
                  hasNext: result.page < result.totalPages - 1,
                  hasPrevious: result.page > 0,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
