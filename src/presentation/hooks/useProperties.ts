'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import { PropertyFilter } from '@/core/domain/entities/PropertyFilter';
import { CreatePropertyData, UpdatePropertyData } from '@/core/domain/repositories/IPropertyRepository';
import { toast } from 'sonner';

const propertyRepo = new PropertyRepository();

export function usePropertyBySlug(slug: string) {
  return useQuery({
    queryKey: ['property', 'slug', slug],
    queryFn: () => propertyRepo.getBySlug(slug),
    enabled: !!slug,
  });
}

export function usePropertyById(id: number) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyRepo.getById(id),
    enabled: !!id,
  });
}

export function useSearchProperties(filters: PropertyFilter) {
  return useQuery({
    queryKey: ['properties', 'search', filters],
    queryFn: () => propertyRepo.search(filters),
  });
}

export function useMyProperties(page = 0, size = 20) {
  return useQuery({
    queryKey: ['properties', 'my-properties', page, size],
    queryFn: () => propertyRepo.getMyProperties(page, size),
    staleTime: 0, // Always consider data as stale
    refetchOnMount: true, // Always refresh on mount
    refetchOnWindowFocus: true, // Refresh when window gains focus
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePropertyData) => propertyRepo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'my-properties'] });
      toast.success('Propiedad creada exitosamente');
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 402) {
        // Do not show toast for 402 error, component will handle modal
        return;
      }
      toast.error(error.response?.data?.message || 'Error al crear propiedad');
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePropertyData }) => 
      propertyRepo.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties', 'my-properties'], exact: false });
      toast.success('Propiedad actualizada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar');
    },
  });
}

export function usePublishProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => propertyRepo.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'my-properties'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['subscription', 'active'] });
      queryClient.refetchQueries({ queryKey: ['properties', 'my-properties'] });
      toast.success('¡Propiedad publicada!');
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 402) {
        // Do not show toast for 402 error, component will handle modal
        return;
      }
      // Only show error if there is actually an error, not if publication was successful
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    },
  });
}

export function useUnpublishProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => propertyRepo.unpublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'my-properties'], exact: false });
      queryClient.refetchQueries({ queryKey: ['properties', 'my-properties'] });
      toast.success('Propiedad pausada (pasó a borrador)');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al pausar la propiedad');
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => propertyRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'my-properties'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['properties', 'search'], exact: false });
      toast.success('Propiedad eliminada exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar';
      
      // Mensajes específicos para errores comunes
      if (errorMessage.includes('Solo se pueden eliminar propiedades en borrador')) {
        toast.error('Solo se pueden eliminar propiedades en estado BORRADOR. Las propiedades publicadas solo pueden pausarse o archivarse.');
      } else if (errorMessage.includes('No tienes permiso')) {
        toast.error('No tienes permiso para eliminar esta propiedad.');
      } else if (error.response?.status === 404) {
        toast.error('Propiedad no encontrada.');
      } else if (error.response?.status === 403) {
        toast.error('Acceso denegado. No puedes eliminar esta propiedad.');
      } else {
        toast.error(`Error al eliminar propiedad: ${errorMessage}`);
      }
    },
  });
}

export function useUploadPhotos() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ propertyId, files }: { propertyId: number; files: File[] }) =>
      propertyRepo.uploadPhotos(propertyId, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      toast.success('Fotos subidas correctamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al subir fotos');
    },
  });
}
