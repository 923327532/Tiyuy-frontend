'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { toast } from '@/presentation/store/toastStore';

// Interfaces
export interface Lead {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertySlug?: string;
  propertyCoverPhoto?: string;
  interestedUserId?: number;
  interestedUserName?: string;
  interestedUserEmail?: string;
  contactEmail: string;
  contactPhone?: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'SCHEDULED' | 'NEGOTIATING' | 'CLOSED_WON' | 'CLOSED_LOST';
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LeadsResponse {
  content: Lead[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// Hook para leads recibidos con polling cada 15 segundos
export function useReceivedLeads(page = 0, size = 20) {
  return useQuery<LeadsResponse>({
    queryKey: ['leads', 'received', page, size],
    queryFn: async () => {
      const response = await axiosClient.get(`/interactions/leads/received?page=${page}&size=${size}`);
      return response.data;
    },
    refetchInterval: 15000, // Polling cada 15 segundos para actualización en tiempo real
    refetchOnWindowFocus: true, // Refrescar cuando el usuario vuelva a la pestaña
    staleTime: 10000, // Datos frescos por 10 segundos
  });
}

// Hook para contador de leads no leídos (más frecuente)
export function useUnreadLeadsCount() {
  return useQuery<{ unreadCount: number }>({
    queryKey: ['leads', 'unread-count'],
    queryFn: async () => {
      const response = await axiosClient.get('/interactions/leads/unread-count');
      return response.data;
    },
    refetchInterval: 10000, // Cada 10 segundos
    refetchOnWindowFocus: true,
  });
}

// Hook para marcar lead como leído
export function useMarkLeadAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadId: number) => {
      const response = await axiosClient.patch(`/interactions/leads/${leadId}/read`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['leads', 'received'] });
      queryClient.invalidateQueries({ queryKey: ['leads', 'unread-count'] });
    },
    onError: () => {
      toast.error('Error al marcar lead como leído');
    },
  });
}

// Hook para actualizar estado del lead
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, status }: { leadId: number; status: string }) => {
      const response = await axiosClient.patch(`/interactions/leads/${leadId}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', 'received'] });
      toast.success(`Estado actualizado a: ${getStatusLabel(variables.status)}`);
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });
}

// Helper para etiquetas de estado
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'NEW': 'Nuevo',
    'CONTACTED': 'Contactado',
    'SCHEDULED': 'Visita Agendada',
    'NEGOTIATING': 'En Negociación',
    'CLOSED_WON': 'Cerrado - Ganado',
    'CLOSED_LOST': 'Cerrado - Perdido',
  };
  return labels[status] || status;
}

// Helper para colores de estado
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'NEW': 'bg-blue-100 text-blue-800 border-blue-200',
    'CONTACTED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'SCHEDULED': 'bg-purple-100 text-purple-800 border-purple-200',
    'NEGOTIATING': 'bg-orange-100 text-orange-800 border-orange-200',
    'CLOSED_WON': 'bg-green-100 text-green-800 border-green-200',
    'CLOSED_LOST': 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// Helper para íconos de estado
export function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    'NEW': '🔥',
    'CONTACTED': '📞',
    'SCHEDULED': '📅',
    'NEGOTIATING': '🤝',
    'CLOSED_WON': '✅',
    'CLOSED_LOST': '❌',
  };
  return icons[status] || '📋';
}
