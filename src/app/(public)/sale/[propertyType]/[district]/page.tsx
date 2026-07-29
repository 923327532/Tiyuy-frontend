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
  
  // Convertir a formato de título (ej: "san luis" → "San Luis")
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const PROPERTY_TYPE_MAP: Record<string, string> = {
  departamentos: 'APARTMENT',
  casas: 'HOUSE',
  terrenos: 'LAND',
  oficinas: 'OFFICE',
  locales: 'COMMERCIAL',
  habitaciones: 'ROOM',
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  departamentos: 'Departamentos',
  casas: 'Casas',
  terrenos: 'Terrenos',
  oficinas: 'Oficinas',
  locales: 'Locales Comerciales',
  habitaciones: 'Habitaciones',
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const propertyTypeLabel = PROPERTY_TYPE_LABELS[resolvedParams.propertyType] || resolvedParams.propertyType;
  const district = toDistrictName(resolvedParams.district);

  const isFiltered = resolvedSearchParams.filtered === '1';
  const hasPriceFilter = resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice;
  const hasBedroomFilter = resolvedSearchParams.bedrooms;
  const hasBathroomFilter = resolvedSearchParams.bathrooms;
  const hasAreaFilter = resolvedSearchParams.minArea || resolvedSearchParams.maxArea;
  const hasParkingFilter = resolvedSearchParams.parking;

  let title = `${propertyTypeLabel} en Venta en ${district} | TIYUY`;
  let description = `Encuentra ${propertyTypeLabel.toLowerCase()} en venta en ${district}. Las mejores propiedades con precios, fotos y detalles completos en TIYUY.`;

  if (isFiltered) {
    const filterParts = [];

    if (hasPriceFilter) {
      const minPrice = resolvedSearchParams.minPrice ? `desde S/.${resolvedSearchParams.minPrice}` : '';
      const maxPrice = resolvedSearchParams.maxPrice ? `hasta S/.${resolvedSearchParams.maxPrice}` : '';
      if (minPrice || maxPrice) filterParts.push(`${minPrice} ${maxPrice}`.trim());
    }
    if (hasBedroomFilter) filterParts.push(`${resolvedSearchParams.bedrooms}+ dormitorios`);
    if (hasBathroomFilter) filterParts.push(`${resolvedSearchParams.bathrooms}+ baños`);
    if (hasAreaFilter) {
      const minArea = resolvedSearchParams.minArea ? `desde ${resolvedSearchParams.minArea}m²` : '';
      const maxArea = resolvedSearchParams.maxArea ? `hasta ${resolvedSearchParams.maxArea}m²` : '';
      if (minArea || maxArea) filterParts.push(`${minArea} ${maxArea}`.trim());
    }
    if (hasParkingFilter) filterParts.push('con estacionamiento');

    if (filterParts.length > 0) {
      title = `${propertyTypeLabel} en Venta en ${district} - ${filterParts.join(', ')} | TIYUY`;
      description = `Busca ${propertyTypeLabel.toLowerCase()} en venta en ${district} con ${filterParts.join(' y ')}. Encuentra la propiedad perfecta con filtros avanzados en TIYUY.`;
    }
  }

  const siteUrl = env.siteUrl;
  const canonicalUrl = `${siteUrl}/sale/${resolvedParams.propertyType}/${resolvedParams.district}${
    isFiltered
      ? '?' +
        new URLSearchParams(
          Object.entries(resolvedSearchParams).filter(([_, value]) => value !== undefined) as [string, string][]
        ).toString()
      : ''
  }`;

  const keywords = [
    propertyTypeLabel.toLowerCase(),
    'venta',
    district.toLowerCase(),
    'lima',
    'perú',
    'inmobiliaria',
    'propiedades',
    'tiyuy',
  ];

  if (hasPriceFilter) keywords.push('precios', 'ofertas');
  if (hasBedroomFilter) keywords.push('dormitorios', 'habitaciones');
  if (hasBathroomFilter) keywords.push('baños', 'servicios');
  if (hasAreaFilter) keywords.push('metros', 'área', 'superficie');
  if (hasParkingFilter) keywords.push('estacionamiento', 'garaje');

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'TIYUY' }],
    creator: 'TIYUY',
    publisher: 'TIYUY',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'TIYUY',
      locale: 'es_PE',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${propertyTypeLabel} en venta en ${district} - TIYUY`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/twitter-image.jpg`],
      creator: '@tiyuy_peru',
      site: '@tiyuy_peru',
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
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

export default async function PropertyCategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const propertyRepo = new PropertyRepository();

  const propertyType = PROPERTY_TYPE_MAP[resolvedParams.propertyType] || resolvedParams.propertyType;
  const district = toDistrictName(resolvedParams.district);
  

  const isFiltered = resolvedSearchParams.filtered === '1';

  const MAIN_PROVINCES = ['Lima', 'Arequipa', 'Trujillo', 'Callao'];
  const isMainProvince = MAIN_PROVINCES.includes(district);
  const isAllPeru = district.toLowerCase() === 'peru';

  const filters = {
    transactionType: 'SALE' as const,
    sort: 'createdAt,desc',
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 0,
    size: 15,
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

  const siteUrl = env.siteUrl;
  const result = await propertyRepo.search(filters);
  const propertyTypeLabel = PROPERTY_TYPE_LABELS[resolvedParams.propertyType] || resolvedParams.propertyType;

  // Crear searchFn para el mapa (usa el repositorio de propiedades)
  const propertySearchFn = async (mapFilters: MapFilters) => {
    const mapResult = await propertyRepo.searchForMap({
      transactionType: 'SALE',
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

  let title = `${propertyTypeLabel} en Venta en ${district} | TIYUY`;
  let description = `Encuentra ${propertyTypeLabel.toLowerCase()} en venta en ${district}. Las mejores propiedades con precios, fotos y detalles completos en TIYUY.`;

  if (isFiltered) {
    const filterParts = [];
    if (resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice) {
      const minPrice = resolvedSearchParams.minPrice ? `desde S/.${resolvedSearchParams.minPrice}` : '';
      const maxPrice = resolvedSearchParams.maxPrice ? `hasta S/.${resolvedSearchParams.maxPrice}` : '';
      if (minPrice || maxPrice) filterParts.push(`${minPrice} ${maxPrice}`.trim());
    }
    if (resolvedSearchParams.bedrooms) filterParts.push(`${resolvedSearchParams.bedrooms}+ dormitorios`);
    if (resolvedSearchParams.bathrooms) filterParts.push(`${resolvedSearchParams.bathrooms}+ baños`);
    if (resolvedSearchParams.minArea || resolvedSearchParams.maxArea) {
      const minArea = resolvedSearchParams.minArea ? `desde ${resolvedSearchParams.minArea}m²` : '';
      const maxArea = resolvedSearchParams.maxArea ? `hasta ${resolvedSearchParams.maxArea}m²` : '';
      if (minArea || maxArea) filterParts.push(`${minArea} ${maxArea}`.trim());
    }
    if (resolvedSearchParams.parking) filterParts.push('con estacionamiento');
    if (filterParts.length > 0) {
      title = `${propertyTypeLabel} en Venta en ${district} (${filterParts.join(', ')}) | TIYUY`;
      description = `Encuentra ${propertyTypeLabel.toLowerCase()} en venta en ${district} con ${filterParts.join(' y ')}. Las mejores propiedades filtradas para ti en TIYUY.`;
    }
  }

  const canonicalUrl = `${siteUrl}/sale/${resolvedParams.propertyType}/${resolvedParams.district}${
    isFiltered
      ? '?' +
        new URLSearchParams(
          Object.entries(resolvedSearchParams).filter(([_, value]) => value !== undefined) as [string, string][]
        ).toString()
      : ''
  }`;

  return (
    <>
      <SearchTrackingProvider
        searchData={{
          propertyType: resolvedParams.propertyType,
          transactionType: 'sale',
          district: district,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.minBedrooms,
          bathrooms: filters.minBathrooms,
        }}
      >
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: title,
            description,
            url: canonicalUrl,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: result.pagination.totalElements,
              itemListElement: result.properties.map((property, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Product',
                  name: property.title,
                  description: `${propertyTypeLabel} en venta en ${district} - ${property.bedrooms} dormitorios, ${property.bathrooms} baños, ${property.totalArea}m²`,
                  image: property.coverPhotoUrl,
                  offers: {
                    '@type': 'Offer',
                    price: property.price,
                    priceCurrency: property.currency,
                    availability: 'https://schema.org/InStock',
                  },
                  url: `${siteUrl}/property/${property.id}`,
                },
              })),
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Venta', item: `${siteUrl}/sale` },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: propertyTypeLabel,
                  item: `${siteUrl}/sale/${resolvedParams.propertyType}`,
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: district,
                  item: `${siteUrl}/sale/${resolvedParams.propertyType}/${resolvedParams.district}`,
                },
              ],
            },
          }),
        }}
      />

      <main className="min-h-screen bg-[var(--bg-secondary)]">
        <div className="px-8 pt-6 pb-8">

          {/* ── BARRA DE BÚSQUEDA SUPERIOR ── */}
          <div className="mb-6">
            <SearchBar propertyType={resolvedParams.propertyType} district={district} />
          </div>

          {/* ── GRID: FILTROS SIDEBAR + RESULTADOS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar filtros */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <Suspense fallback={
                  <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4 animate-pulse h-96" />
                }>
                  <PropertyFiltersClient
                    initialFilters={filters}
                    propertyType={resolvedParams.propertyType}
                  />
                </Suspense>
              </div>
            </aside>

            {/* Resultados */}
            <div className="lg:col-span-3">
              {/* Título de resultados */}
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                  {propertyTypeLabel} en {district}
                  <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">
                    ({result.pagination.totalElements} propiedades)
                  </span>
                </h1>
                <PropertyMapWrapper
                  transactionType="SALE"
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
        </div>

        {/* ── SECCIONES DEBAJO DEL PAGINADO ── */}
        <SEOContent 
          propertyType={resolvedParams.propertyType}
          propertyTypeLabel={propertyTypeLabel}
          district={district}
          transactionType="sale"
          properties={result.properties}
        />
      </main>
      </SearchTrackingProvider>
    </>
  );
}
