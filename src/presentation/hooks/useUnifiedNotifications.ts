'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../../infrastructure/api/axios-client';

// Tipos unificados de notificaciones
type NotificationType = 
  | 'CONTACT' 
  | 'FAVORITE' 
  | 'PROPERTY_PUBLISHED' 
  | 'SUBSCRIPTION_EXPIRING' 
  | 'MARKETING'
  | 'ADMIN_NOTIFICATION'
  | 'EVENT_CREATED' 
  | 'EVENT_UPDATED' 
  | 'EVENT_REMINDER' 
  | 'EVENT_JOINED';

interface BaseNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

interface GeneralNotification extends BaseNotification {
  type: 'CONTACT' | 'FAVORITE' | 'PROPERTY_PUBLISHED' | 'SUBSCRIPTION_EXPIRING' | 'MARKETING' | 'ADMIN_NOTIFICATION';
}

interface EventNotification extends BaseNotification {
  type: 'EVENT_CREATED' | 'EVENT_UPDATED' | 'EVENT_REMINDER' | 'EVENT_JOINED';
  eventId?: number;
  channelId?: number;
  eventTitle?: string;
  channelName?: string;
}

type UnifiedNotification = GeneralNotification | EventNotification;

interface PageResponse<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
}

// Hook unificado para todas las notificaciones
export const useUnifiedNotifications = (type?: 'all' | 'general' | 'events') => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  // Query para notificaciones generales - devuelve el objeto completo con content[]
  const generalNotificationsQuery = useQuery({
    queryKey: ['notifications', 'general'],
    queryFn: async (): Promise<PageResponse<GeneralNotification>> => {
      if (!isAuthenticated || !user) return { content: [] };
      
      try {
        const { data } = await apiClient.get<any>('/notifications/in-app');
        // Mapear la respuesta del backend (isRead -> read, id numérico -> string)
        const content: GeneralNotification[] = (data?.content || []).map((n: any) => ({
          id: String(n.id),
          title: n.title || '',
          message: n.message || '',
          type: n.type || 'ADMIN_NOTIFICATION',
          read: n.isRead === true || n.read === true,
          createdAt: n.createdAt || new Date().toISOString(),
        }));
        return { ...data, content };
      } catch (error) {
        console.error('Error fetching general notifications:', error);
        return { content: [] };
      }
    },
    enabled: isAuthenticated && !!user && (type === 'all' || type === 'general' || !type),
    staleTime: 1000 * 60, // 1 minuto
  });

  // Query para notificaciones de eventos
  const eventNotificationsQuery = useQuery({
    queryKey: ['notifications', 'events'],
    queryFn: async (): Promise<PageResponse<EventNotification>> => {
      if (!isAuthenticated || !user) return { content: [] };
      
      try {
        const { data } = await apiClient.get<PageResponse<EventNotification>>('/channel-events');
        return data || { content: [] };
      } catch (error) {
        console.error('Error fetching event notifications:', error);
        return { content: [] };
      }
    },
    enabled: isAuthenticated && !!user && (type === 'all' || type === 'events' || !type),
    staleTime: 1000 * 60,
  });

  // El contador del backend incluye todas las notificaciones no leídas, no solo la página cargada.
  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async (): Promise<number | null> => {
      if (!isAuthenticated || !user) return null;

      try {
        const { data } = await apiClient.get<
          number | { count?: number; unreadCount?: number }
        >('/notifications/unread/count');
        const raw =
          typeof data === 'number' ? data : (data?.count ?? data?.unreadCount);

        if (raw === undefined || raw === null) return null;

        const value = Number(raw);
        return Number.isFinite(value) ? value : null;
      } catch (error) {
        console.error('Error fetching unread notification count:', error);
        return null;
      }
    },
    enabled: isAuthenticated && !!user,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Extraer arrays de forma segura
  const generalNotifications: GeneralNotification[] = generalNotificationsQuery.data?.content ?? [];
  const eventNotifications: EventNotification[] = eventNotificationsQuery.data?.content ?? [];

  // Combinar notificaciones según el tipo solicitado
  const allNotifications: UnifiedNotification[] = [...generalNotifications, ...eventNotifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const notifications: UnifiedNotification[] = type === 'general' 
    ? generalNotifications
    : type === 'events'
    ? eventNotifications
    : allNotifications;

  const isLoading = type === 'general' 
    ? generalNotificationsQuery.isPending
    : type === 'events'
    ? eventNotificationsQuery.isPending
    : generalNotificationsQuery.isPending || eventNotificationsQuery.isPending;

  // Mutación para marcar como leído - CON optimistic update
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await apiClient.post(`/notifications/${notificationId}/read`);
      return data;
    },
    onMutate: async (notificationId: string) => {
      // Cancelar queries en curso para evitar race conditions
      await queryClient.cancelQueries({ queryKey: ['notifications', 'general'] });
      await queryClient.cancelQueries({ queryKey: ['notifications', 'events'] });

      // Snapshot del estado anterior
      const previousGeneral = queryClient.getQueryData(['notifications', 'general']);
      const previousEvents = queryClient.getQueryData(['notifications', 'events']);

      // Optimistic update: marcar como leída inmediatamente
      queryClient.setQueryData(['notifications', 'general'], (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((n: any) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        };
      });

      queryClient.setQueryData(['notifications', 'events'], (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((n: any) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        };
      });

      return { previousGeneral, previousEvents };
    },
    onError: (err, notificationId, context) => {
      // Revertir al estado anterior si falla
      if (context?.previousGeneral) {
        queryClient.setQueryData(['notifications', 'general'], context.previousGeneral);
      }
      if (context?.previousEvents) {
        queryClient.setQueryData(['notifications', 'events'], context.previousEvents);
      }
    },
    onSettled: () => {
      // Recargar datos reales del backend para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: ['notifications', 'general'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  // Mutación para marcar todas como leídas - CON optimistic update
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/notifications/read-all');
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications', 'general'] });
      await queryClient.cancelQueries({ queryKey: ['notifications', 'events'] });

      const previousGeneral = queryClient.getQueryData(['notifications', 'general']);
      const previousEvents = queryClient.getQueryData(['notifications', 'events']);

      // Optimistic update: marcar todas como leídas
      queryClient.setQueryData(['notifications', 'general'], (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((n: any) => ({ ...n, read: true })),
        };
      });

      queryClient.setQueryData(['notifications', 'events'], (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((n: any) => ({ ...n, read: true })),
        };
      });

      return { previousGeneral, previousEvents };
    },
    onError: (err, variables, context) => {
      if (context?.previousGeneral) {
        queryClient.setQueryData(['notifications', 'general'], context.previousGeneral);
      }
      if (context?.previousEvents) {
        queryClient.setQueryData(['notifications', 'events'], context.previousEvents);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'general'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  // Contador de no leídas
  const unreadCount = unreadCountQuery.data ?? notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    error: generalNotificationsQuery.error || eventNotificationsQuery.error,
    unreadCount,
    
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};
