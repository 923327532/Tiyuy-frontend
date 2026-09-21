import { apiClient, publicApiClient } from '../api/axios-client';
import { IProjectRepository } from '@/core/domain/repositories/IProjectRepository';
import { 
  Project, 
  ProjectSummary,
  ProjectFull, 
  ProjectUnit,
} from '@/core/domain/entities/Project';
import {
  ProjectMapSearchResult,
  PropertyMapCoverageInfo,
  MapCoverageLevel
} from '@/core/domain/entities/PropertyMapResult';

//  INLINE type (no necesita SearchFilters import)
type SearchFilters = Parameters<IProjectRepository['searchProjects']>[0];

export class ProjectRepository implements IProjectRepository {
  /**
   * Get project by ID (basic - for cards/lists) - Public
   */
  async getById(projectId: number): Promise<Project> {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data;
    } catch {
      const publicResponse = await publicApiClient.get(`/projects/${projectId}`);
      return publicResponse.data;
    }
  }

  /**
   * Obtener proyecto completo con todos los detalles
   */
  async getProjectFull(projectId: number): Promise<ProjectFull> {
    const response = await publicApiClient.get(`/projects/${projectId}/full`);
    const data = response.data;
    
    //  Separar media por tipo
    const media: Array<{ id: number; url: string; mediaType: string; title: string; displayOrder: number }> = data.media || [];
    
    const images = media
      .filter(m => m.mediaType === 'PHOTO')
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(m => m.url);
    
    const renders = media
      .filter(m => m.mediaType === 'VIDEO' || m.mediaType === 'RENDER')
      .map(m => m.url);
    
    const blueprints = media
      .filter(m => m.mediaType === 'BLUEPRINT' || m.mediaType === 'PDF')
      .map(m => m.url);

    return {
      ...data,
      images,
      renders,
      blueprints,
    } as ProjectFull;
  }

  /**
   * Obtener proyecto por slug (SEO público) - Público
   */
  async getBySlug(slug: string): Promise<Project | null> {
    try {
      const response = await publicApiClient.get(`/projects/slug/${slug}`);
      const data = response.data;
      
      const media: Array<{ url: string; mediaType: string; displayOrder: number }> = data.media || [];
      
      return {
        ...data,
        images: media
          .filter(m => m.mediaType === 'PHOTO')
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(m => m.url),
        renders: media
          .filter(m => m.mediaType === 'VIDEO' || m.mediaType === 'RENDER')
          .map(m => m.url),
        blueprints: media
          .filter(m => m.mediaType === 'BLUEPRINT' || m.mediaType === 'PDF')
          .map(m => m.url),
      } as Project;
    } catch {
      return null;
    }
  }

  /**
   * Obtener multimedia de un proyecto - Autenticado
   */
  async getProjectMedia(projectId: number): Promise<{
    images: string[];
    blueprints: string[];
    renders: string[];
  }> {
    try {
      // Primero intentar con endpoint autenticado
      const response = await apiClient.get(`/projects/${projectId}/media`);
      return response.data;
    } catch (error) {
      console.error('getProjectMedia failed with auth, trying public:', error);
      // Fallback a público si falla
      const publicResponse = await publicApiClient.get(`/projects/${projectId}/media`);
      return publicResponse.data;
    }
  }

  /**
   * Búsqueda pública de proyectos (SEO + filtros) - Público
   */
  async searchProjects(filters: SearchFilters): Promise<{
    content: ProjectSummary[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters.district) params.append('district', filters.district);
    if (filters.province) params.append('province', filters.province);
    if (filters.type) params.append('type', filters.type);
    if (filters.phase) params.append('phase', filters.phase);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.sort) params.append('sort', filters.sort);

    const response = await publicApiClient.get(`/projects/search?${params}`);
    
    // Mapear media a images y coverImageUrl solo si el backend devuelve media como array de objetos
    const content = (response.data.content || []).map((project: any) => {
      // Si ya viene coverImageUrl, usarlo directamente
      if (project.coverImageUrl) {
        return project;
      }
      // Si ya viene images como array de strings, usarlo directamente
      if (project.images && Array.isArray(project.images) && project.images.length > 0 && typeof project.images[0] === 'string') {
        return project;
      }
      // Si viene media como array de objetos, mapearlo
      const media: Array<{ url: string; mediaType: string; displayOrder: number }> = project.media || [];
      if (media.length > 0) {
        const photos = media
          .filter((m: any) => m.mediaType === 'PHOTO')
          .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
          .map((m: any) => m.url);
        return {
          ...project,
          coverImageUrl: photos[0] || null,
          images: photos,
          renders: media
            .filter((m: any) => m.mediaType === 'VIDEO' || m.mediaType === 'RENDER')
            .map((m: any) => m.url),
          blueprints: media
            .filter((m: any) => m.mediaType === 'BLUEPRINT' || m.mediaType === 'PDF')
            .map((m: any) => m.url),
        };
      }
      return project;
    });


    
    return {
      content,
      totalElements: response.data.totalElements || 0,
      totalPages: response.data.totalPages || 0,
      page: response.data.number || 0,
      size: response.data.size || 20,
    };

  }

  /**
   * Mis proyectos (dashboard propietario)
   */
  async getMyProjects(page = 0, size = 20): Promise<{
    content: Project[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/projects/my-projects', {
      params: { 
        page, 
        size, 
        sort: 'createdAt,desc' 
      },
    });
    
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
      totalPages: response.data.totalPages || 0,
    };
  }

  /**
   * Crear nuevo proyecto (draft)
   */
  async createProject(projectData: Parameters<IProjectRepository['createProject']>[0]): Promise<Project> {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response.data;
    } catch (error: any) {
      // Error de validacion
      if (error.response?.status === 400) {
        const validationError = error.response?.data;
        let errorMessage = 'Error en los datos del formulario';
        
        if (validationError?.details) {
          const details = validationError?.details;
          if (typeof details === 'object') {
            const errors = Object.values(details).flat();
            errorMessage = errors.join('. ');
          }
        }
        
        const validationErrorObj = new Error(errorMessage);
        (validationErrorObj as any).isValidationError = true;
        throw validationErrorObj;
      }
      
      // Error de suscripcion
      if (error.response?.status === 402) {
        const errorMessage = error.response?.data?.message || 'Para crear proyectos necesitas una suscripcion ENTERPRISE.';
        const subscriptionError = new Error(errorMessage);
        (subscriptionError as any).isSubscriptionError = true;
        (subscriptionError as any).requiresEnterprise = true;
        throw subscriptionError;
      }
      
      throw error;
    }
  }

  /**
   * Actualizar proyecto existente
   */
  async updateProject(
    projectId: number, 
    projectData: Parameters<IProjectRepository['updateProject']>[1]
  ): Promise<Project> {
    const response = await apiClient.put(`/projects/${projectId}`, projectData);
    return response.data;
  }

  /**
   * Publicar proyecto (DRAFT → PUBLISHED)
   */
  async publishProject(projectId: number): Promise<Project> {
    const response = await apiClient.patch(`/projects/${projectId}/publish`);
    return response.data;
  }

  /**
   * Obtener unidades de proyecto
   */
  async getProjectUnits(projectId: number, page = 0, size = 20): Promise<{
    content: ProjectUnit[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await apiClient.get(`/projects/${projectId}/units`, {
      params: { page, size },
    });
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
      totalPages: response.data.totalPages || 0,
    };
  }

  /**
   * Crear nueva unidad
   */
  async createUnit(
    projectId: number, 
    unitData: Parameters<IProjectRepository['createUnit']>[1]
  ): Promise<ProjectUnit> {
    const response = await apiClient.post(`/projects/${projectId}/units`, unitData);
    return response.data;
  }

  /**
   * Actualizar unidad existente
   */
  async updateUnit(unitId: number, unitData: Partial<ProjectUnit>): Promise<ProjectUnit> {
    const response = await apiClient.put(`/projects/units/${unitId}`, unitData);
    return response.data;
  }

  /**
   * Marcar unidad como vendida
   */
  async sellUnit(unitId: number): Promise<ProjectUnit> {
    const response = await apiClient.post(`/projects/units/${unitId}/sell`);
    return response.data;
  }

  /**
   * Eliminar unidad
   */
  async deleteUnit(unitId: number): Promise<void> {
    await apiClient.delete(`/projects/units/${unitId}`);
  }

  /**
   * Stats del proyecto (vistas, contactos, etc.)
   */
  async getProjectStats(projectId: number): Promise<{
    viewsCount: number;
    contactsCount: number;
    favoritesCount: number;
    unitsAvailable: number;
    unitsSold: number;
    conversionRate: number;
  }> {
    const response = await apiClient.get(`/projects/${projectId}/stats`);
    return response.data;
  }

  /**
   * Subir media (fotos, videos) al proyecto
   */
  async uploadProjectMedia(projectId: number, files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await apiClient.post(`/projects/${projectId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Eliminar media del proyecto
   */
  async deleteProjectMedia(projectId: number, mediaId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/media/${mediaId}`);
  }

  /**
   * Destacar proyecto
   * PATCH /projects/{id}/feature
   */
  async featureProject(projectId: number, featured: boolean): Promise<any> {
    const response = await apiClient.patch(`/projects/${projectId}/feature`);
    return response.data;
  }

  /**
   * Eliminar proyecto
   */
  async deleteProject(projectId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}`);
  }

  /**
   * Obtener proyectos destacados - Público
   */
  async getFeaturedProjects(district?: string): Promise<{
    content: ProjectSummary[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (district) params.append('district', district);
      params.append('size', '15');

      const response = await publicApiClient.get(`/projects/featured?${params.toString()}`);
      
      // El endpoint devuelve Page<ProjectSummaryResponse>
      if (response.data && response.data.content) {
        const content = (response.data.content || []).map((project: any) => {
          if (project.coverImageUrl) return project;
          const media: Array<{ url: string; mediaType: string; displayOrder: number }> = project.media || [];
          if (media.length > 0) {
            const photos = media
              .filter((m: any) => m.mediaType === 'PHOTO')
              .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
              .map((m: any) => m.url);
            return {
              ...project,
              coverImageUrl: photos[0] || null,
              images: photos,
              renders: media.filter((m: any) => m.mediaType === 'VIDEO' || m.mediaType === 'RENDER').map((m: any) => m.url),
              blueprints: media.filter((m: any) => m.mediaType === 'BLUEPRINT' || m.mediaType === 'PDF').map((m: any) => m.url),
            };
          }
          return project;
        });
        
        return {
          content,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
          page: response.data.number || 0,
          size: response.data.size || 5,
        };
      }
      
      // Si no hay rows ni content, devolver vacío
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        page: 0,
        size: 5,
      };

    } catch (error) {
      console.error('Error loading featured projects:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          console.error(' Network Error - Backend might be down');
        } else if (error.message.includes('404')) {
          console.error('Endpoint not found: /featured/projects');
        } else {
          console.error(' Unknown error:', error.message);
        }
      }
      
      // Retornar datos vacíos en caso de error para que la app no se rompa
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        page: 0,
        size: 5,
      };
    }
  }

  /**
   * Obtener items destacados (alias para getFeaturedProjects)
   */
  async getFeaturedItems(district?: string): Promise<{
    content: ProjectSummary[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
    last: boolean;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  }> {
    const result = await this.getFeaturedProjects(district);
    
    return {
      ...result,
      last: result.page >= result.totalPages - 1,
      numberOfElements: result.content.length,
      first: result.page === 0,
      empty: result.content.length === 0,
    };
  }

  /**
   * Búsqueda de proyectos para mapa
   */
  async searchForMap(filters: {
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
  }): Promise<ProjectMapSearchResult> {
    const params = new URLSearchParams();
    
    if (filters.district) params.append('district', filters.district);
    if (filters.province) params.append('province', filters.province);
    if (filters.region) params.append('region', filters.region);
    if (filters.type) params.append('type', filters.type);
    if (filters.phase) params.append('phase', filters.phase);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.minArea) params.append('minArea', filters.minArea.toString());
    if (filters.maxArea) params.append('maxArea', filters.maxArea.toString());
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());

    const response = await publicApiClient.get(`/projects/map/search?${params}`);
    const data = response.data;

    return {
      projects: (data.projects || []).map((p: any) => ({
        ...p,
        coverImageUrl: p.coverImageUrl || null,
      })),
      requestedArea: data.requestedArea || '',
      effectiveCoverage: data.effectiveCoverage || 'NO_RESULTS',
      coverageMessage: data.coverageMessage || '',
      districtsIncluded: data.districtsIncluded || [],
      totalResults: data.totalResults || 0,
    };
  }
}
