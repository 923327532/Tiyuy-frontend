import { axiosClient, publicApiClient } from '../api/axios-client';
import { ENDPOINTS } from '../api/endpoints';
import { IPropertyRepository, CreatePropertyData, UpdatePropertyData } from '@/core/domain/repositories/IPropertyRepository';
import { Property, PropertySummary, PropertyMedia, MapSearchResult, MapPropertySummary, PropertyType, TransactionType, Currency, MapCoverageType } from '@/core/domain/entities/Property';
import { PropertyFilter, PropertySearchResult } from '@/core/domain/entities/PropertyFilter';
import { PropertyMapper } from '@/core/application/mappers/PropertyMapper';

export class PropertyRepository implements IPropertyRepository {
  async searchForMap(filters: PropertyFilter): Promise<MapSearchResult> {
    const response = await axiosClient.get('/properties/map/search', {
      params: {
        type: filters.type,
        transactionType: filters.transactionType,
        district: filters.district,
        province: filters.province,
        region: filters.region,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minBedrooms: filters.minBedrooms,
        minBathrooms: filters.minBathrooms,
        minParkingSpots: filters.minParkingSpots,
        minArea: filters.minArea,
        maxArea: filters.maxArea,
        isFeatured: filters.isFeatured,
      },
    });

    const data = response.data;

    const properties: MapPropertySummary[] = (data.properties || []).map((p: any) => ({
      id: p.id,
      title: p.title || '',
      slug: p.slug || String(p.id),
      price: p.price ? Number(p.price) : 0,
      currency: (p.currency || 'PEN') as Currency,
      type: (p.type || 'APARTMENT') as PropertyType,
      transactionType: (p.transactionType || 'SALE') as TransactionType,
      mainPhotoUrl: p.coverPhotoUrl || undefined,
      district: p.district || '',
      province: p.province || '',
      region: p.region || '',
      latitude: p.latitude ? Number(p.latitude) : 0,
      longitude: p.longitude ? Number(p.longitude) : 0,
      bedrooms: p.bedrooms ?? undefined,
      bathrooms: p.bathrooms ?? undefined,
      area: p.totalArea ? Number(p.totalArea) : undefined,
      isFeatured: p.isFeatured ?? undefined,
    }));

    return {
      properties,
      requestedArea: data.requestedArea || '',
      effectiveCoverage: (data.effectiveCoverage || 'NO_RESULTS') as MapCoverageType,
      coverageMessage: data.coverageMessage || '',
      districtsIncluded: data.districtsIncluded || [],
      totalResults: data.totalResults || 0,
    };
  }

  async search(filters: PropertyFilter): Promise<PropertySearchResult> {
    JSON.stringify(filters, null, 2);
    axiosClient.defaults.baseURL;
    {axiosClient.defaults.baseURL} {ENDPOINTS.PROPERTIES.SEARCH};
    
    const response = await axiosClient.get(ENDPOINTS.PROPERTIES.SEARCH, {
      params: {
        type: filters.type,
        transactionType: filters.transactionType,
        district: filters.district,
        province: filters.province,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minBedrooms: filters.minBedrooms,
        minBathrooms: filters.minBathrooms,
        minParkingSpots: filters.minParkingSpots,
        minArea: filters.minArea,
        maxArea: filters.maxArea,
        page: filters.page || 0,
        size: filters.size || 20,
        sort: filters.sort || 'createdAt,desc',
      },
    });


    return {
      properties: response.data.content.map(PropertyMapper.toSummary),
      pagination: {
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        pageSize: response.data.size,
        hasNext: !response.data.last,
        hasPrevious: !response.data.first,
      },
    };
  }

  async getBySlug(slug: string): Promise<Property> {
    const maybeId = Number(slug);
    if (!Number.isNaN(maybeId) && maybeId > 0) {
      return this.getById(maybeId);
    }

    const response = await axiosClient.get(ENDPOINTS.PROPERTIES.BY_SLUG(slug));
    
    const dto = response.data?.property ? response.data.property : response.data;
    
    const mappedProperty = PropertyMapper.toDomain(dto);    
    return mappedProperty;
  }

// En PropertyRepository.ts, método getById
async getById(id: number): Promise<Property> {
  const response = await axiosClient.get(`${ENDPOINTS.PROPERTIES.BASE}/${id}`);  
  const dto = response.data?.property ? response.data.property : response.data;
  const mappedProperty = PropertyMapper.toDomain(dto);
  return mappedProperty;
}
  

  async create(data: CreatePropertyData): Promise<Property> {
    const response = await axiosClient.post(ENDPOINTS.PROPERTIES.BASE, data);
    return PropertyMapper.toDomain(response.data);
  }

  async update(id: number, data: UpdatePropertyData): Promise<Property> {
    const response = await axiosClient.patch(`${ENDPOINTS.PROPERTIES.BASE}/${id}`, data);
    const dto = response.data?.property ? response.data.property : response.data;
    return PropertyMapper.toDomain(dto);
  }

  async publish(id: number): Promise<PropertySummary> {
    const response = await axiosClient.patch(ENDPOINTS.PROPERTIES.PUBLISH(id));
    return PropertyMapper.toSummary(response.data);
  }

  async unpublish(id: number): Promise<void> {
    await axiosClient.patch(ENDPOINTS.PROPERTIES.UNPUBLISH(id));
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`${ENDPOINTS.PROPERTIES.BASE}/${id}`);
  }

  async getMyProperties(page = 0, size = 20): Promise<PropertySearchResult> {
    const response = await axiosClient.get(ENDPOINTS.PROPERTIES.MY_PROPERTIES, {
      params: { page, size },
    });

    if (typeof window !== 'undefined') {
    }

    return {
      properties: response.data.content.map(PropertyMapper.toSummary),
      pagination: {
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        pageSize: response.data.size,
        hasNext: !response.data.last,
        hasPrevious: !response.data.first,
      },
    };
  }

  async uploadPhotos(propertyId: number, files: File[]): Promise<PropertyMedia[]> {
    const formData = new FormData();

    // Agregar cada archivo con la key 'files' para el endpoint batch
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Usar el nuevo endpoint batch (sin /api porque ya está en baseURL)
    const response = await axiosClient.post(
      `/media/${propertyId}/photos/batch`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async deletePhoto(mediaId: number): Promise<void> {
    await axiosClient.delete(ENDPOINTS.PROPERTIES.DELETE_PHOTO(mediaId));
  }

  async featureProperty(propertyId: number): Promise<any> {
    const response = await axiosClient.patch(ENDPOINTS.PROPERTIES.FEATURE(propertyId));
    return response.data;
  }

  async getFeaturedMix(): Promise<PropertySummary[]> {
    try {
      // El backend tiene el endpoint en /featured/properties que devuelve
      // propiedades destacadas organizadas en filas por categoría
      const response = await publicApiClient.get('/featured/properties', {
        timeout: 120000,
      });

      // La respuesta es un objeto con filas (rows), cada fila tiene items.
      // Cada item es un FeaturedPropertyItem plano (NO tiene `property` anidado).
      // Lo mapeamos directo a PropertySummary con PropertyMapper.toSummary
      // para propagar `publishedAt` y `createdAt`.
      if (response.data?.rows && Array.isArray(response.data.rows)) {
        const allProperties: PropertySummary[] = [];
        for (const row of response.data.rows) {
          if (row.items && Array.isArray(row.items)) {
            for (const item of row.items) {
              // Caso 1: item plano (FeaturedPropertyItem)
              if (item && item.id && !item.property) {
                allProperties.push(PropertyMapper.toSummary(item));
              }
              // Caso 2: item anidado (compatibilidad)
              else if (item && item.property) {
                allProperties.push(PropertyMapper.toSummary(item.property));
              }
            }
          }
        }
        return allProperties;
      }
      
      return [];
    } catch (error) {
      console.error('Error loading featured mix:', error);
      return [];
    }
  }

  async getFeaturedProperties(page = 0, size = 15): Promise<PropertySearchResult> {
    try {
      const response = await publicApiClient.get('/properties/featured', {
        params: { page, size },
        timeout: 120000,
      });

      // El endpoint devuelve Page<PropertySummaryDto>
      if (response.data) {
        const content = response.data.content || response.data;
        const properties = Array.isArray(content) ? content : [];
        return {
          properties: properties.map(PropertyMapper.toSummary),
          pagination: {
            currentPage: response.data.number || 0,
            totalPages: response.data.totalPages || 1,
            totalElements: response.data.totalElements || properties.length,
            pageSize: properties.length || size,
            hasNext: false,
            hasPrevious: false,
          },
        };
      }

      // Fallback: si el endpoint devuelve content directamente
      if (response.data && response.data.content) {
        return {
          properties: response.data.content.map(PropertyMapper.toSummary),
          pagination: {
            currentPage: response.data.number || 0,
            totalPages: response.data.totalPages || 1,
            totalElements: response.data.totalElements || 0,
            pageSize: response.data.size || size,
            hasNext: !response.data.last,
            hasPrevious: !response.data.first,
          },
        };
      }

      // Si no hay datos, devolver vacío
      return {
        properties: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          pageSize: size,
          hasNext: false,
          hasPrevious: false,
        },
      };
    } catch (error) {
      console.error('Error loading featured properties:', error);
      // Retornar datos vacíos en caso de error para que la app no se rompa
      return {
        properties: [],
        pagination: {
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          pageSize: size,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }
  }

  async setCoverPhoto(propertyId: number, mediaId: number): Promise<void> {
    await axiosClient.patch(`${ENDPOINTS.PROPERTIES.BASE}/${propertyId}/cover-photo/${mediaId}`);
  }
}