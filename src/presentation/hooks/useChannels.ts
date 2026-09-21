// CHANNELS HOOKS - Hexagonal Architecture
// This file belongs to CHANNELS module (Presentation Layer - React Hooks)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../store/toastStore';
import { ChannelUseCases } from '../../core/domain/use-cases/ChannelUseCases';
import { ChannelRepositoryImpl } from '../../infrastructure/repositories/ChannelRepositoryImpl';
import { CreateChannelData, CreateChannelPostData, CreateChannelEventData } from '../../core/domain/repositories/ChannelRepository';
import { Channel, ChannelPost, ChannelEvent, ChannelStatistics, ChannelCollaborator } from '../../core/domain/entities/Channel';
import { axiosClient } from '../../infrastructure/api/axios-client';

// Spring Data Page interface
interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Main channel hook (Presentation Layer)
export function useChannels(userId?: number) {
  const queryClient = useQueryClient();
  
  // Create use case instance with its dependency
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  // Query to get channels
  const {
    data: channels = [],
    isLoading: channelsLoading,
    error: channelsError,
    refetch: refetchChannels
  } = useQuery({
    queryKey: ['channels', userId],
    queryFn: () => channelUseCases.getChannels(userId || 0),
    staleTime: 1000 * 30, // 30 seconds - para que se refresque rápido al suscribirse
  });

  // Mutation to create channel
  const createChannelMutation = useMutation({
    mutationFn: (data: CreateChannelData) => channelUseCases.createChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      toast.success('Canal creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating channel:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear canal');
    }
  });

  // Mutation to update channel
  const updateChannelMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateChannelData }) => 
      channelUseCases.updateChannel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      toast.success('Canal actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error updating channel:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar canal');
    }
  });

  // Mutation to update subscribersCanPost
  const updateSubscribersCanPostMutation = useMutation({
    mutationFn: ({ channelId, subscribersCanPost }: { channelId: number; subscribersCanPost: boolean }) =>
      channelUseCases.updateSubscribersCanPost(channelId, subscribersCanPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      toast.success('Configuración actualizada');
    },
    onError: (error) => {
      console.error('Error updating subscribersCanPost:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar configuración');
    }
  });

  // Mutation to delete channel
  const deleteChannelMutation = useMutation({
    mutationFn: (id: number) => channelUseCases.deleteChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      toast.success('Canal eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting channel:', error);
      toast.error('Error al eliminar canal');
    }
  });

  // Mutation to subscribe to channel
  const subscribeMutation = useMutation({
    mutationFn: (channelId: number) => channelUseCases.subscribeToChannel(channelId, userId || 0),
    onMutate: async (channelId: number) => {
      // Cancelar refetches en curso
      await queryClient.cancelQueries({ queryKey: ['channels', userId] });
      
      // Actualización optimista: marcar el canal como suscrito inmediatamente
      const previousChannels = queryClient.getQueryData(['channels', userId]);
      queryClient.setQueryData(['channels', userId], (old: any) => {
        if (!old) return old;
        return old.map((c: any) => 
          c.id === channelId 
            ? { ...c, isSubscribed: true, subscriberCount: (c.subscriberCount || 0) + 1 }
            : c
        );
      });
      
      return { previousChannels };
    },
    onSuccess: () => {
      // Invalidar con el userId correcto para que se refresque la lista
      queryClient.invalidateQueries({ queryKey: ['channels', userId] });
      toast.success('Te suscribiste al canal correctamente');
    },
    onError: (error: any, channelId: number, context: any) => {
      // Revertir cambio optimista si falla
      if (context?.previousChannels) {
        queryClient.setQueryData(['channels', userId], context.previousChannels);
      }
      console.error('Error subscribing to channel:', error);
      const errorMsg = error instanceof Error ? error.message : '';
      // Si el backend ya no devuelve error (ahora es idempotente), esto solo se ejecuta en errores reales
      if (errorMsg?.includes('Ya estás suscrito') || errorMsg?.includes('ALREADY_SUBSCRIBED') || error?.response?.status === 400) {
        // Si ocurre un 400, forzamos refetch para sincronizar estado real
        // Y además marcamos el canal como suscrito localmente para que desaparezca de "Descubrir"
        queryClient.setQueryData(['channels', userId], (old: any) => {
          if (!old) return old;
          return old.map((c: any) => 
            c.id === channelId 
              ? { ...c, isSubscribed: true }
              : c
          );
        });
        queryClient.invalidateQueries({ queryKey: ['channels', userId] });
        toast.info('Ya estás suscrito a este canal');
      } else {
        toast.error(errorMsg || 'Error al suscribirse al canal');
      }
    }
  });

  // Mutation to unsubscribe from channel
  const unsubscribeMutation = useMutation({
    mutationFn: (channelId: number) => channelUseCases.unsubscribeFromChannel(channelId, userId || 0),
    onMutate: async (channelId: number) => {
      // Cancelar refetches en curso
      await queryClient.cancelQueries({ queryKey: ['channels', userId] });
      
      // Actualización optimista: marcar el canal como no suscrito inmediatamente
      const previousChannels = queryClient.getQueryData(['channels', userId]);
      queryClient.setQueryData(['channels', userId], (old: any) => {
        if (!old) return old;
        return old.map((c: any) => 
          c.id === channelId 
            ? { ...c, isSubscribed: false, subscriberCount: Math.max((c.subscriberCount || 0) - 1, 0) }
            : c
        );
      });
      
      return { previousChannels };
    },
    onSuccess: () => {
      // Invalidar con el userId correcto para que se refresque la lista
      queryClient.invalidateQueries({ queryKey: ['channels', userId] });
      toast.success('Te desuscribiste del canal');
    },
    onError: (error: any, channelId: number, context: any) => {
      // Revertir cambio optimista si falla
      if (context?.previousChannels) {
        queryClient.setQueryData(['channels', userId], context.previousChannels);
      }
      console.error('Error unsubscribing from channel:', error);
      // Si el backend ya no devuelve error (ahora es idempotente), esto solo se ejecuta en errores reales
      const errorMsg = error instanceof Error ? error.message : '';
      if (error?.response?.status === 404 || errorMsg?.includes('No estas suscrito')) {
        // Forzar refetch para sincronizar estado real
        queryClient.invalidateQueries({ queryKey: ['channels', userId] });
        toast.info('No estabas suscrito a este canal');
      } else {
        toast.error(errorMsg || 'Error al desuscribirse del canal');
      }
    }
  });

  return {
    channels,
    channelsLoading,
    channelsError,
    refetchChannels,
    createChannel: createChannelMutation.mutate,
    updateChannel: updateChannelMutation.mutate,
    deleteChannel: deleteChannelMutation.mutate,
    subscribeToChannel: subscribeMutation.mutate,
    unsubscribeFromChannel: unsubscribeMutation.mutate,
    updateSubscribersCanPost: updateSubscribersCanPostMutation.mutate,
    isCreatingChannel: createChannelMutation.isPending,
    isUpdatingChannel: updateChannelMutation.isPending,
    isDeletingChannel: deleteChannelMutation.isPending,
    isSubscribing: subscribeMutation.isPending,
    isUnsubscribing: unsubscribeMutation.isPending,
    isUpdatingSubscribersCanPost: updateSubscribersCanPostMutation.isPending,
  };
}

// Channel posts hook
export function useChannelPosts(channelId: number, userId?: number) {
  const queryClient = useQueryClient();
  
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['channelPosts', channelId],
    queryFn: () => channelUseCases.getChannelPosts(channelId),
    enabled: !!channelId,
  });

  const createPostMutation = useMutation({
    mutationFn: (data: CreateChannelPostData) => channelUseCases.createChannelPost(channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelPosts', channelId] });
      toast.success('Post creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear post');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: number) => channelUseCases.likeChannelPost(channelId, postId),
    onSuccess: (data, postId) => {
      // Actualización optimista del contador en la caché
      queryClient.setQueryData(['channelPosts', channelId], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((post: any) => {
          if (post.id === postId) {
            return {
              ...post,
              likeCount: data.likeCount,
              isLiked: data.isCurrentlyActive,
              hasUserLiked: data.isCurrentlyActive
            };
          }
          return post;
        });
      });
      // Invalidar para sincronizar con el backend eventualmente
      queryClient.invalidateQueries({ queryKey: ['channelPosts', channelId] });
    },
    onError: (error) => {
      console.error('Error liking post:', error);
      toast.error('Error al dar like');
    }
  });

  const sharePostMutation = useMutation({
    mutationFn: ({ postId, message }: { postId: number; message?: string }) => 
      channelUseCases.shareChannelPost(channelId, postId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelPosts', channelId] });
      toast.success('Post compartido exitosamente');
    },
    onError: (error) => {
      console.error('Error sharing post:', error);
      toast.error('Error al compartir post');
    }
  });

  return {
    posts,
    postsLoading,
    postsError,
    refetchPosts,
    createPost: createPostMutation.mutate,
    likePost: likePostMutation.mutate,
    sharePost: sharePostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
    isLikingPost: likePostMutation.isPending,
    isSharingPost: sharePostMutation.isPending,
  };
}

// Channel events hook
export function useChannelEvents(channelId: number, userId?: number) {
  const queryClient = useQueryClient();
  
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const {
    data: events = [],
    isLoading,
    error: eventsError,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['channelEvents', channelId],
    queryFn: () => channelUseCases.getChannelEvents(channelId),
    enabled: !!channelId,
  });

  const createEventMutation = useMutation({
    mutationFn: (data: CreateChannelEventData) => channelUseCases.createChannelEvent(channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelEvents', channelId] });
      toast.success('Evento creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear evento');
    }
  });

  const respondToEventMutation = useMutation({
    mutationFn: ({ eventId, response }: { eventId: number; response: string }) => 
      channelUseCases.respondToChannelEvent(eventId, response, userId || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelEvents', channelId] });
      toast.success('Respuesta enviada');
    },
    onError: (error) => {
      console.error('Error responding to event:', error);
      toast.error(error instanceof Error ? error.message : 'Error al responder al evento');
    }
  });

  return {
    data: events,
    isLoading,
    eventsError,
    refetchEvents,
    createEvent: createEventMutation.mutate,
    respondToEvent: respondToEventMutation.mutate,
    isCreatingEvent: createEventMutation.isPending,
    isRespondingToEvent: respondToEventMutation.isPending,
  };
}

// User events hook - compatible with 3-arg signature, returns raw Spring Page from backend
export function useUserEvents(userId?: number, page = 0, size = 10) {
  const queryClient = useQueryClient();
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const {
    data,
    isLoading,
    error: userEventsError,
    refetch: refetchUserEvents
  } = useQuery({
    queryKey: ['userEvents', userId, page, size],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/contacts/extended/users/events?page=${page}&size=${size}`);
        return response.data;
      } catch {
        return { content: [], totalElements: 0, totalPages: 0, number: page };
      }
    },
    enabled: false,
    retry: false,
  });

  const {
    data: upcomingEvents = [],
    isLoading: upcomingEventsLoading,
    refetch: refetchUpcomingEvents
  } = useQuery({
    queryKey: ['upcomingEvents', userId],
    queryFn: async () => {
      try { return await channelUseCases.getUserUpcomingEvents(userId || 0); }
      catch { return []; }
    },
    enabled: false,
    retry: false,
  });

  const {
    data: pastEvents = [],
    isLoading: pastEventsLoading,
    refetch: refetchPastEvents
  } = useQuery({
    queryKey: ['pastEvents', userId],
    queryFn: async () => {
      try { return await channelUseCases.getUserPastEvents(userId || 0); }
      catch { return []; }
    },
    enabled: false,
    retry: false,
  });

  const {
    data: savedEvents = [],
    isLoading: savedEventsLoading,
    refetch: refetchSavedEvents
  } = useQuery({
    queryKey: ['savedEvents', userId],
    queryFn: async () => {
      try { return await channelUseCases.getUserSavedEvents(userId || 0); }
      catch { return []; }
    },
    enabled: false,
    retry: false,
  });

  const saveEventMutation = useMutation({
    mutationFn: (eventId: number) => channelUseCases.saveEvent(eventId, userId || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedEvents', userId] });
      toast.success('Evento guardado');
    },
    onError: (error) => {
      console.error('Error saving event:', error);
      toast.error('Error al guardar evento');
    }
  });

  const unsaveEventMutation = useMutation({
    mutationFn: (eventId: number) => channelUseCases.unsaveEvent(eventId, userId || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedEvents', userId] });
      toast.success('Evento eliminado de guardados');
    },
    onError: (error) => {
      console.error('Error unsaving event:', error);
      toast.error('Error al eliminar evento guardado');
    }
  });

  return {
    data,
    isLoading,
    userEventsError,
    refetchUserEvents,
    upcomingEvents,
    upcomingEventsLoading,
    refetchUpcomingEvents,
    pastEvents,
    pastEventsLoading,
    refetchPastEvents,
    savedEvents,
    savedEventsLoading,
    refetchSavedEvents,
    saveEvent: saveEventMutation.mutate,
    unsaveEvent: unsaveEventMutation.mutate,
    isSavingEvent: saveEventMutation.isPending,
    isUnsavingEvent: unsaveEventMutation.isPending,
  };
}

// Channel collaborators hook
export function useChannelCollaborators(channelId: number, adminId?: number) {
  const queryClient = useQueryClient();
  
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const {
    data: collaborators = [],
    isLoading: collaboratorsLoading,
    error: collaboratorsError,
    refetch: refetchCollaborators
  } = useQuery({
    queryKey: ['channelCollaborators', channelId],
    queryFn: () => channelUseCases.getChannelCollaborators(channelId, adminId || 0),
    enabled: !!channelId && !!adminId,
  });

  const grantPermissionMutation = useMutation({
    mutationFn: (userId: number) => channelUseCases.grantPublishingPermission(channelId, userId, adminId || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelCollaborators', channelId] });
      toast.success('Permiso concedido exitosamente');
    },
    onError: (error) => {
      console.error('Error granting permission:', error);
      toast.error(error instanceof Error ? error.message : 'Error al conceder permiso');
    }
  });

  const revokePermissionMutation = useMutation({
    mutationFn: (userId: number) => channelUseCases.revokePublishingPermission(channelId, userId, adminId || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelCollaborators', channelId] });
      toast.success('Permiso revocado exitosamente');
    },
    onError: (error) => {
      console.error('Error revoking permission:', error);
      toast.error(error instanceof Error ? error.message : 'Error al revocar permiso');
    }
  });

  return {
    collaborators,
    collaboratorsLoading,
    collaboratorsError,
    refetchCollaborators,
    grantPermission: grantPermissionMutation.mutate,
    revokePermission: revokePermissionMutation.mutate,
    isGrantingPermission: grantPermissionMutation.isPending,
    isRevokingPermission: revokePermissionMutation.isPending,
  };
}

// Channel statistics hook
export function useChannelStatistics(channelId: number, userId?: number) {
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const {
    data: statistics = null,
    isLoading: statisticsLoading,
    error: statisticsError,
    refetch: refetchStatistics
  } = useQuery({
    queryKey: ['channelStatistics', channelId],
    queryFn: () => channelUseCases.getChannelStatistics(channelId, userId || 0),
    enabled: !!channelId && !!userId,
  });

  return {
    statistics,
    statisticsLoading,
    statisticsError,
    refetchStatistics,
  };
}

// Search users hook
export function useSearchUsersForChannelDelegation(excludeUserId?: number) {
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const searchMutation = useMutation({
    mutationFn: (query: string) => channelUseCases.searchUsersForChannelDelegation(query, excludeUserId || 0),
    onError: (error) => {
      console.error('Error searching users:', error);
      toast.error(error instanceof Error ? error.message : 'Error al buscar usuarios');
    }
  });

  return {
    searchUsers: searchMutation.mutate,
    isSearching: searchMutation.isPending,
    searchError: searchMutation.error,
  };
}

// Check if user can publish in channel
export function useCanUserPublish(channelId: number) {
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const {
    data: canPublish = false,
    isLoading: canPublishLoading,
    error: canPublishError,
    refetch: refetchCanPublish
  } = useQuery({
    queryKey: ['canUserPublish', channelId],
    queryFn: () => channelUseCases.canUserPublishInChannel(channelId),
    enabled: !!channelId,
  });

  return {
    data: canPublish,
    isLoading: canPublishLoading,
    error: canPublishError,
    refetch: refetchCanPublish,
  };
}

// Get channel comments hook
export function useGetChannelComments(channelId: number, postId: number) {
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['channelComments', channelId, postId],
    queryFn: () => channelUseCases.getChannelComments(channelId, postId),
    enabled: !!channelId && !!postId,
  });

  return {
    comments,
    commentsLoading,
    commentsError,
    refetchComments
  };
}

// Create channel comment hook
export function useCreateChannelComment() {
  const queryClient = useQueryClient();
  const channelUseCases = new ChannelUseCases(new ChannelRepositoryImpl());

  const createCommentMutation = useMutation({
    mutationFn: ({ channelId, postId, content, userId, replyToCommentId }: { channelId: number; postId: number; content: string; userId: number; replyToCommentId?: number }) =>
      channelUseCases.createChannelComment(channelId, postId, content, userId, replyToCommentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['channelComments', variables.channelId, variables.postId] });
      toast.success('Comentario agregado');
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear comentario');
    }
  });

  return {
    mutate: createCommentMutation.mutate,
    isPending: createCommentMutation.isPending,
    error: createCommentMutation.error,
  };
}

// Channel events with filters hook - uses real backend endpoint
export function useChannelEventsWithFilters(
  channelId: number,
  filters: {
    eventType?: string;
    city?: string;
    featured?: boolean;
    dateFilter?: string;
    location?: string;
  }
) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['channelEventsWithFilters', channelId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.city) params.append('city', filters.city);
      if (filters.featured !== undefined) params.append('featured', String(filters.featured));
      if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);
      if (filters.location) params.append('location', filters.location);
      
      const queryString = params.toString();
      const url = `/contacts/extended/channels/${channelId}/events${queryString ? `?${queryString}` : ''}`;
      
      const response = await axiosClient.get(url);
      return response.data; // Real Spring Page from backend
    },
    enabled: !!channelId,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// Channel upcoming events hook - uses real backend endpoint
export function useChannelUpcomingEvents(channelId: number) {
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['channelUpcomingEvents', channelId],
    queryFn: async () => {
      const response = await axiosClient.get(`/contacts/extended/channels/${channelId}/events/upcoming`);
      return response.data; // Real upcoming events from backend
    },
    enabled: !!channelId,
  });

  return {
    data,
    isLoading,
  };
}

// Create channel event hook - uses real backend endpoint
export function useCreateChannelEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: number; data: CreateChannelEventData }) => 
      axiosClient.post(`/contacts/extended/channels/${channelId}/events`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelEvents'] });
      queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents'] });
      toast.success('Evento creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear evento');
    },
  });
}

// Channel subscribers hook - uses real backend endpoint
export function useChannelSubscribers(channelId: number) {
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['channelSubscribers', channelId],
    queryFn: async () => {
      const response = await axiosClient.get(`/contacts/extended/channels/${channelId}/subscribers`);
      return response.data; // Real subscribers from backend
    },
    enabled: !!channelId,
  });

  return {
    data,
    isLoading,
  };
}

// Delete channel event hook - uses real backend endpoint
export function useDeleteChannelEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, eventId }: { channelId: number; eventId: number }) => 
      axiosClient.delete(`/contacts/extended/channels/${channelId}/events/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelEvents'] });
      queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents'] });
      toast.success('Evento eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Error al eliminar evento');
    },
  });
}

// Update channel event hook - uses real backend endpoint
export function useUpdateChannelEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, eventId, data }: { channelId: number; eventId: number; data: Partial<CreateChannelEventData> }) => 
      axiosClient.put(`/contacts/extended/channels/${channelId}/events/${eventId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelEvents'] });
      queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents'] });
      toast.success('Evento actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error('Error al actualizar evento');
    },
  });
}
