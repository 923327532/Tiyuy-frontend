import { Metadata } from 'next';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import { PropertyGrid } from '@/presentation/components/property/PropertyGrid';
import { Suspense } from 'react';
import { PropertyFiltersClient } from './PropertyFiltersClient';
import { Pagination } from './Pagination';
import { SearchBar } from './SearchBar';
import { SEOContent } from '@/presentation/components/property/SEOContent/SEOContent';
import { SearchTrackingProvider } from '@/presentation/components/searchTracking/SearchTrackingProvider';
import { PropertyMapWrapper } from '@/presentation/features/property-map/components/PropertyMapWrapper';
import { propertyMapResultToGeneric } from '@/core/domain/adapters/MapItemAdapters';
import { MapFilters } from '@/core/domain/entities/MapTypes';
import { env } from '@/config/env';

interface Props {
  params: Promise<{
    propertyType: string;
    district: string;
  }>;
  searchParams: Promise<{
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    minArea?: string;
    maxArea?: string;
    parking?: string;
    filtered?: string;
  }>;
}

const toDistrictName = (slug: string) => {
  const cleaned = decodeURIComponent(slug).replace(/-/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const PROPERTY_TYPE_MAP: Record<string, string> = {
  'departamentos': 'APARTMENT',
  'casas': 'HOUSE',
  'terrenos': 'LAND',
  'oficinas': 'OFFICE',
  'locales': 'COMMERCIAL',
  'habitaciones': 'ROOM',
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'departamentos': 'Departamentos',
  'casas': 'Casas',
  'terrenos': 'Terrenos',
  'oficinas': 'Oficinas',
  'locales': 'Locales Comerciales',
  'habitaciones': 'Habitaciones',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const propertyTypeLabel = PROPERTY_TYPE_LABELS[resolvedParams.propertyType] || resolvedParams.propertyType;
  const district = toDistrictName(resolvedParams.district);

  const title = `${propertyTypeLabel} en Alquiler en ${district} | TIYUY`;
  const description = `Encuentra ${propertyTypeLabel.toLowerCase()} en alquiler en ${district}. Las mejores opciones con precios, fotos y detalles completos en TIYUY.`;
  const siteUrl = env.siteUrl;
  const canonicalUrl = `${siteUrl}/rent/${resolvedParams.propertyType}/${resolvedParams.district}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'TIYUY',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PropertyCategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const propertyRepo = new PropertyRepository();

  const propertyType = PROPERTY_TYPE_MAP[resolvedParams.propertyType];
  const district = toDistrictName(resolvedParams.district);

  const isFiltered = resolvedSearchParams.filtered === '1';

  const MAIN_PROVINCES = ['Lima', 'Arequipa', 'Trujillo', 'Callao'];
  const isMainProvince = MAIN_PROVINCES.includes(district);
  const isAllPeru = district.toLowerCase() === 'peru';

  const filters = {
    transactionType: 'RENT' as const,
    sort: 'createdAt,desc',
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 0,
    size: 15, // 5 columnas x 3 filas = 15 propiedades por página
    type: propertyType as any,
    ...(isAllPeru ? {} : isMainProvince ? { province: district } : { district }),
    ...(isFiltered
      ? {
          minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
          maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
          minBedrooms: resolvedSearchParams.bedrooms ? Number(resolvedSearchParams.bedrooms) : undefined,
          minBathrooms: resolvedSearchParams.bathrooms ? Number(resolvedSearchParams.bathrooms) : undefined,
          minArea: resolvedSearchParams.minArea ? Number(resolvedSearchParams.minArea) : undefined,
          maxArea: resolvedSearchParams.maxArea ? Number(resolvedSearchParams.maxArea) : undefined,
          minParkingSpots: resolvedSearchParams.parking ? Number(resolvedSearchParams.parking) : undefined,
        }
      : {}),
  };

  const result = await propertyRepo.search(filters);
  const propertyTypeLabel = PROPERTY_TYPE_LABELS[resolvedParams.propertyType];

  // Crear searchFn para el mapa (usa el repositorio de propiedades)
  const propertySearchFn = async (mapFilters: MapFilters) => {
    const mapResult = await propertyRepo.searchForMap({
      transactionType: 'RENT',
      type: propertyType as any,
      district: mapFilters.district || district,
      province: mapFilters.province,
      region: mapFilters.region,
      minPrice: mapFilters.minPrice,
      maxPrice: mapFilters.maxPrice,
      minArea: mapFilters.minArea,
      maxArea: mapFilters.maxArea,
      minBedrooms: mapFilters.bedrooms,
      minBathrooms: mapFilters.bathrooms,
      isFeatured: mapFilters.isFeatured,
    });
    return propertyMapResultToGeneric(mapResult);
  };

  return (
    <>
      <SearchTrackingProvider
        searchData={{
          propertyType: resolvedParams.propertyType,
          transactionType: 'rent',
          district: district,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.minBedrooms,
          bathrooms: filters.minBathrooms,
        }}
      >
      <main>
        <div className="px-8 pt-6 pb-8">
          <div className="mb-6">
            <SearchBar propertyType={resolvedParams.propertyType} district={district} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <Suspense fallback={<div>Cargando filtros...</div>}>
                  <PropertyFiltersClient initialFilters={filters} propertyType={resolvedParams.propertyType} />
                </Suspense>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                  {propertyTypeLabel} en {district}
                  <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">
                    ({result.pagination.totalElements} propiedades)
                  </span>
                </h1>
                <PropertyMapWrapper
                  transactionType="RENT"
                  entitySubType={propertyType}
                  filters={{
                    ...(isAllPeru ? {} : isMainProvince ? { province: district } : { district }),
                    ...(isFiltered
                      ? {
                          minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
                          maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
                          bedrooms: resolvedSearchParams.bedrooms ? Number(resolvedSearchParams.bedrooms) : undefined,
                          bathrooms: resolvedSearchParams.bathrooms ? Number(resolvedSearchParams.bathrooms) : undefined,
                          minArea: resolvedSearchParams.minArea ? Number(resolvedSearchParams.minArea) : undefined,
                          maxArea: resolvedSearchParams.maxArea ? Number(resolvedSearchParams.maxArea) : undefined,
                        }
                      : {}),
                  }}
                  totalItems={result.pagination.totalElements}
                  itemLabel="propiedad"
                  itemLabelPlural="propiedades"
                  detailBaseUrl="/property/"
                />
              </div>
              <PropertyGrid properties={result.properties} />

              {result.pagination.totalPages > 1 && (
                <Pagination pagination={result.pagination} />
              )}
            </div>
          </div>

          {/* ── SECCIONES DEBAJO DEL PAGINADO ── */}
          <SEOContent 
            propertyType={resolvedParams.propertyType}
            propertyTypeLabel={propertyTypeLabel}
            district={district}
            transactionType="rent"
            properties={result.properties}
          />
        </div>
      </main>
      </SearchTrackingProvider>
    </>
  );
}
