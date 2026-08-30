'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ContactRepository } from '@/infrastructure/repositories/ContactRepository';
import { SendContactData } from '@/core/domain/entities/Contact';
import { toast } from '@/presentation/store/toastStore';
import { axiosClient } from '@/infrastructure/api/axios-client';

const contactRepo = new ContactRepository();

import { env } from '@/config/env';

const API_BASE_URL = typeof window === 'undefined'
  ? env.apiUrl.replace(/\/api\/?$/, '')
  : '';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const apiEndpoint = cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;
  const url = `${baseUrl}${apiEndpoint}`;

  let token = null;
  if (typeof window !== 'undefined') {
    try {
      const { useAuthStore } = require('@/presentation/store/authStore');
      const authStore = useAuthStore.getState();
      token = authStore.token;
      if (!token) {
        token = localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token') || localStorage.getItem('auth-token');
      }
    } catch {
      token = localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token') || localStorage.getItem('auth-token');
    }
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response || !response.ok) {
    let errorText = 'Unknown error';
    let status = response?.status || 'NETWORK_ERROR';
    let statusText = response?.statusText || 'Network Error';
    try {
      if (response) {
        errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.code === 'INTERNAL_ERROR') {
            errorText = `Error del servidor: ${errorData.message || ''}`;
          }
        } catch {}
      }
    } catch {}
    if (response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tiyuy-auth-token');
        localStorage.removeItem('token');
        localStorage.removeItem('auth-token');
        try {
          const { useAuthStore } = require('@/presentation/store/authStore');
          useAuthStore.getState().logout();
        } catch {}
        window.location.href = '/login';
      }
    }
    throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

export function useSendContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendContactData) => contactRepo.sendContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', 'sent'] });
      toast.success('¡Mensaje enviado! El propietario te contactará pronto.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al enviar mensaje');
    },
  });
}

export function useSentContacts(page = 0, size = 20) {
  return useQuery({
    queryKey: ['contacts', 'sent', page, size],
    queryFn: () => contactRepo.getSentContacts(page, size),
  });
}

export function useReceivedContacts(page = 0, size = 20) {
  return useQuery({
    queryKey: ['contacts', 'received', page, size],
    queryFn: () => contactRepo.getReceivedContacts(page, size),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['contacts', 'unread-count'],
    queryFn: () => contactRepo.getUnreadCount(),
    refetchInterval: 30000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contactId: number) => contactRepo.markAsRead(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', 'received'] });
      queryClient.invalidateQueries({ queryKey: ['contacts', 'unread-count'] });
      toast.success('Mensaje marcado como leído');
    },
    onError: () => { toast.error('Error al marcar como leído'); },
  });
}

// Chats
export function useGetChats(filter: 'all' | 'unread' | 'favorites' = 'all') {
  return useQuery({
    queryKey: ['chats', filter],
    queryFn: async () => {
      const data = await apiCall(`/contacts/extended/chats?filter=${filter}&size=100`);
      return Array.isArray(data) ? data : (data?.content ?? []);
    },
    staleTime: 1000 * 60,
  });
}

async function apiCallWithFallback(url: string, options: RequestInit = {}, fallbackValue: any = null) {
  try { return await apiCall(url, options); }
  catch (error: any) { throw error; }
}

export function useGetChatMessages(chatId: number, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: async () => {
      const data = await apiCallWithFallback(`/contacts/extended/chats/${chatId}/messages?size=100`, {}, []);
      return Array.isArray(data) ? data : (data?.content ?? []);
    },
    enabled: !!chatId && (options.enabled !== false),
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useGetChatMessagesInfinite(chatId: number, options: { enabled?: boolean } = {}) {
  return useInfiniteQuery({
    queryKey: ['chat-messages-infinite', chatId],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await apiCallWithFallback(`/contacts/extended/chats/${chatId}/messages?page=${pageParam}&size=30&sort=createdAt,desc`, {}, { content: [], totalPages: 0, number: 0 });
      return { messages: Array.isArray(data) ? data : (data?.content ?? []), totalPages: data?.totalPages ?? 1, currentPage: data?.number ?? pageParam, hasMore: data && !data.last };
    },
    getNextPageParam: (lastPage) => { if (!lastPage.hasMore) return undefined; return lastPage.currentPage + 1; },
    initialPageParam: 0,
    enabled: !!chatId && (options.enabled !== false),
    staleTime: 1000 * 30, retry: false,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, content, type = 'TEXT', mediaUrl, replyToMessageId }: { chatId: number; content: string; type?: string; mediaUrl?: string; replyToMessageId?: string }) => {
      let token = null;
      if (typeof window !== 'undefined') {
        try {
          const { useAuthStore } = require('@/presentation/store/authStore');
          const authStore = useAuthStore.getState();
          token = authStore.token || localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token');
        } catch {
          token = localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token');
        }
      }
      return apiCall(`/contacts/extended/chats/${chatId}/messages?t=${Date.now()}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: JSON.stringify({ content, type, mediaUrl, replyToMessageId }),
      });
    },
    onMutate: async ({ chatId, content, type, replyToMessageId }) => {
      await queryClient.cancelQueries({ queryKey: ['chat-messages', chatId] });
      const previousMessages = queryClient.getQueryData(['chat-messages', chatId]);
      queryClient.setQueryData(['chat-messages', chatId], (old: any) => [
        ...(Array.isArray(old) ? old : []),
        { id: `temp-${Date.now()}`, chatId, content, type: type || 'TEXT', isOwn: true, createdAt: new Date().toISOString(), replyToMessageId: replyToMessageId || null, replyToContent: null, replyToSenderName: null, sending: true },
      ]);
      return { previousMessages, chatId };
    },
    onSuccess: (newMessage, { chatId }) => {
      queryClient.setQueryData(['chat-messages', chatId], (old: any) =>
        (Array.isArray(old) ? old : []).map((m: any) => String(m.id).startsWith('temp-') ? { ...newMessage, sending: false } : m));
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any, _vars, context) => {
      if (context?.previousMessages !== undefined) queryClient.setQueryData(['chat-messages', context.chatId], context.previousMessages);
      if (error.message.includes('suspendido')) { toast.error(error.message); }
      else if (error.message.includes('403')) { toast.error('Token inválido. Inicia sesión nuevamente.'); if (typeof window !== 'undefined') window.location.href = '/login'; }
      else { toast.error('Error al enviar mensaje'); }
    },
  });
}

export function useEditMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, messageId, content }: { chatId: number; messageId: number; content: string }) =>
      apiCall(`/contacts/extended/chats/${chatId}/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      }),
    onSuccess: (_data, { chatId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chat-messages-infinite', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast.success('Mensaje editado');
    },
    onError: () => { toast.error('Error al editar mensaje'); },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chatId, messageId }: { chatId: number; messageId: number }) => {
      let token = null;
      if (typeof window !== 'undefined') {
        try {
          const { useAuthStore } = require('@/presentation/store/authStore');
          const authStore = useAuthStore.getState();
          token = authStore.token || localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token');
        } catch {
          token = localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token');
        }
      }
      const res = await fetch(`/api/contacts/extended/chats/${chatId}/messages/${messageId}`, {
        method: 'DELETE',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
      });
      if (!res.ok) {
        let errorText = '';
        try { errorText = await res.text(); } catch {}
        throw new Error(`Error ${res.status}: ${res.statusText} - ${errorText}`);
      }
      return res;
    },
    onMutate: async ({ chatId, messageId }) => {
      await queryClient.cancelQueries({ queryKey: ['chat-messages', chatId] });
      const previousMessages = queryClient.getQueryData(['chat-messages', chatId]);
      queryClient.setQueryData(['chat-messages', chatId], (old: any) =>
        (Array.isArray(old) ? old : []).filter((m: any) => String(m.id) !== String(messageId)));
      return { previousMessages, chatId };
    },
    onSuccess: (_res, { chatId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chat-messages-infinite', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast.success('Mensaje eliminado');
    },
    onError: (error: any, _vars, context: any) => {
      if (context?.previousMessages !== undefined) queryClient.setQueryData(['chat-messages', context.chatId], context.previousMessages);
      toast.error('Error al eliminar mensaje');
    },
  });
}

export function useMarkChatAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: number) => apiCall(`/contacts/extended/chats/${chatId}/read`, { method: 'PATCH' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chats'] }); },
  });
}

export function useToggleFavoriteChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: number) => apiCall(`/contacts/extended/chats/${chatId}/favorite`, { method: 'PATCH' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chats'] }); toast.success('Chat actualizado'); },
  });
}

// Status Posts
export function useGetActiveStatusPosts(params: { location?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['status-posts', params],
    queryFn: ({ pageParam = 0 }) => apiCall(`/contacts/extended/status?sortBy=popularity&page=${pageParam}&size=20${params.location ? `&location=${params.location}` : ''}`),
    getNextPageParam: (lastPage: any) => { if (lastPage?.last) return undefined; return (lastPage?.number || 0) + 1; },
    initialPageParam: 0, staleTime: 1000 * 60,
  });
}

export function useCreateStatusPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return apiCall('/contacts/extended/status', { method: 'POST', body: JSON.stringify(data) });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['status-posts'] }); toast.success('Estado publicado correctamente'); },
    onError: (error: any) => { toast.error(error.message || 'Error al publicar estado'); },
  });
}

export function useShareStatusPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => apiCall(`/contacts/extended/status/${postId}/share`, { method: 'POST' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['status-posts'] }); },
  });
}

// El backend usa un toggle en POST /status/{id}/like, así que ambos hooks
// llaman al mismo endpoint. La diferencia es solo el onSuccess (estado correcto).
export function useLikeStatusPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => apiCall(`/contacts/extended/status/${postId}/like`, { method: 'POST' }),
    onSuccess: (data: any, postId) => {
      // El backend responde isCurrentlyActive: true/false — usar su valor real
      const isActive = data?.isCurrentlyActive ?? true;
      queryClient.setQueriesData({ queryKey: ['status-posts'], exact: false }, (old: any) => {
        if (!old?.pages || !Array.isArray(old.pages)) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) =>
            Array.isArray(page)
              ? page.map((post: any) =>
                  post.id === postId
                    ? { ...post, hasUserLiked: isActive, likeCount: Math.max((isActive ? (post.likeCount || 0) + 1 : (post.likeCount || 0) - 1), 0) }
                    : post
                )
              : page
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['status-posts'], exact: false });
    },
  });
}

export function useUnlikeStatusPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => apiCall(`/contacts/extended/status/${postId}/like`, { method: 'POST' }),
    onSuccess: (data: any, postId) => {
      const isActive = data?.isCurrentlyActive ?? false;
      queryClient.setQueriesData({ queryKey: ['status-posts'], exact: false }, (old: any) => {
        if (!old?.pages || !Array.isArray(old.pages)) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) =>
            Array.isArray(page)
              ? page.map((post: any) =>
                  post.id === postId
                    ? { ...post, hasUserLiked: isActive, likeCount: Math.max((isActive ? (post.likeCount || 0) + 1 : (post.likeCount || 0) - 1), 0) }
                    : post
                )
              : page
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['status-posts'], exact: false });
    },
  });
}

export function useCommentStatusPost(statusPostId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, replyToCommentId }: { content: string; replyToCommentId?: number }) => apiCall(`/contacts/extended/status/${statusPostId}/comments`, { method: 'POST', body: JSON.stringify({ content, ...(replyToCommentId && { replyToCommentId }) }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['status-comments', statusPostId] }); queryClient.invalidateQueries({ queryKey: ['status-posts'] }); },
    onError: () => toast.error('Error al publicar comentario'),
  });
}

export function useStatusComments(statusId: number) {
  return useQuery({
    queryKey: ['status-comments', statusId],
    queryFn: async () => {
      const data = await apiCall(`/contacts/extended/status/${statusId}/comments/with-replies`);
      return Array.isArray(data) ? data : (data?.content ?? data?.data ?? []);
    },
    enabled: !!statusId, staleTime: 1000 * 30,
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => apiCall(`/contacts/extended/status/comments/${commentId}/like`, { method: 'POST' }),
    onSuccess: (data, commentId) => {
      queryClient.setQueryData(['status-comments'], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((comment: any) => comment.id === commentId ? { ...comment, hasUserLiked: data.isCurrentlyActive, likeCount: data.isCurrentlyActive ? (comment.likeCount || 0) + 1 : Math.max((comment.likeCount || 0) - 1, 0) } : comment);
      });
      queryClient.invalidateQueries({ queryKey: ['status-comments'] });
    },
    onError: () => toast.error('Error al dar like'),
  });
}

export function useUnlikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => apiCall(`/contacts/extended/status/comments/${commentId}/like`, { method: 'POST' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['status-comments'] }); },
    onError: () => toast.error('Error al quitar like'),
  });
}

export function useUserSubscribedEvents(userId: number) {
  return useQuery({
    queryKey: ['userSubscribedEvents', userId],
    queryFn: async () => {
      const response = await axiosClient.get(`/contacts/extended/users/events/subscribed?page=0&size=50`);
      if (response.data && typeof response.data === 'object' && 'content' in response.data) return response.data.content;
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!userId, staleTime: 1000 * 30,
  });
}

export function useUserEvents(userId?: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ['userEvents', userId, page, size],
    queryFn: async () => {
      const response = await axiosClient.get(`/contacts/extended/users/events?page=${page}&size=${size}`);
      return response.data;
    },
    enabled: !!userId, staleTime: 1000 * 30, refetchOnWindowFocus: false, refetchOnMount: false,
  });
}

export function useUserUpcomingEvents(userId?: number) {
  return useQuery({
    queryKey: ['userUpcomingEvents', userId],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/users/events/upcoming`); return response.data; },
    enabled: !!userId, staleTime: 1000 * 30,
  });
}

export function useUserPastEvents(userId?: number) {
  return useQuery({
    queryKey: ['userPastEvents', userId],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/users/events/past`); return response.data; },
    enabled: !!userId, staleTime: 1000 * 30,
  });
}

export function useUserSavedEvents(userId?: number) {
  return useQuery({
    queryKey: ['userSavedEvents', userId],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/users/events/saved`); return response.data; },
    enabled: !!userId, staleTime: 1000 * 30,
  });
}

export function useChannelEvents(channelId: number, page = 0, size = 9) {
  return useQuery({
    queryKey: ['channelEvents', channelId, page, size],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/channels/${channelId}/events?page=${page}&size=${size}`); return response.data?.content || []; },
    enabled: !!channelId,
  });
}

export function useChannelUpcomingEvents(channelId: number) {
  return useQuery({
    queryKey: ['channelUpcomingEvents', channelId],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/channels/${channelId}/events/upcoming`); return response.data || []; },
    enabled: !!channelId,
  });
}

export function useGetChannelEvent(channelId: number, eventId: number) {
  return useQuery({
    queryKey: ['channel-event', channelId, eventId],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/channels/${channelId}/events/${eventId}`); return response.data; },
    enabled: !!channelId && !!eventId,
  });
}

export function useCreateChannelEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => { const response = await axiosClient.post(`/contacts/extended/channels/${data.channelId}/events`, data); return response.data; },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channelEvents', variables.channelId] }); queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents', variables.channelId] }); toast.success('Evento creado'); },
    onError: (error: any) => { toast.error(error.message || 'Error al crear evento'); },
  });
}

export function useRespondToEvent(channelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, responseStatus, responseMessage, numberOfGuests }: { eventId: number; responseStatus: string; responseMessage?: string; numberOfGuests?: number }) => {
      const response = await axiosClient.post(`/contacts/extended/channels/${channelId}/events/${eventId}/respond`, { responseStatus, responseMessage, numberOfGuests }); return response.data;
    },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channelEvents', channelId] }); queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents', channelId] }); queryClient.invalidateQueries({ queryKey: ['channel-event-attendees', channelId, variables.eventId] }); queryClient.invalidateQueries({ queryKey: ['channel-event', channelId, variables.eventId] }); toast.success('Respuesta registrada'); },
    onError: (error: any) => { if (!error.message?.includes('must be subscribed')) { toast.error(error.message || 'Error al responder'); }},
  });
}

export function useDeleteChannelEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, eventId }: { channelId: number; eventId: number }) => { await axiosClient.delete(`/contacts/extended/channels/${channelId}/events/${eventId}`); },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channelEvents', variables.channelId] }); queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents', variables.channelId] }); toast.success('Evento eliminado'); },
    onError: (error: any) => { toast.error(error.message || 'Error al eliminar evento'); },
  });
}

export function useUpdateChannelEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, eventId, eventData }: { channelId: number; eventId: number; eventData: any }) => { const response = await axiosClient.put(`/contacts/extended/channels/${channelId}/events/${eventId}`, eventData); return response.data; },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channelEvents', variables.channelId] }); queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents', variables.channelId] }); queryClient.invalidateQueries({ queryKey: ['userEvents', variables.eventId] }); toast.success('Evento actualizado'); },
    onError: (error: any) => { toast.error(error.message || 'Error al actualizar evento'); },
  });
}

// CHANNEL SUBSCRIBERS
export function useChannelSubscribers(channelId: number) {
  return useQuery({
    queryKey: ['channelSubscribers', channelId],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/channels/${channelId}/subscribers?size=5`); return response.data || []; },
    enabled: !!channelId,
  });
}

export function useGetChannelEventAttendees(channelId: number, eventId: number) {
  return useQuery({
    queryKey: ['channel-event-attendees', channelId, eventId],
    queryFn: () => apiCall(`/contacts/extended/channels/${channelId}/events/${eventId}/attendees`),
    enabled: !!channelId && !!eventId,
  });
}

export function useGetChannelEventResponses(channelId: number, eventId: number) {
  return useQuery({
    queryKey: ['channel-event-responses', channelId, eventId],
    queryFn: () => apiCall(`/contacts/extended/channels/${channelId}/events/${eventId}/responses`),
    enabled: !!channelId && !!eventId,
  });
}

export function useRsvpChannelEvent(channelId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => apiCall(`/contacts/extended/channels/${channelId}/events/${eventId}/respond`, { method: 'POST', body: JSON.stringify({ responseStatus: 'ATTENDING' }) }),
    onSuccess: (_, eventId) => { qc.invalidateQueries({ queryKey: ['channelEvents', channelId] }); qc.invalidateQueries({ queryKey: ['channel-event-attendees', channelId, eventId] }); qc.invalidateQueries({ queryKey: ['channel-event', channelId, eventId] }); toast.success('Asistencia confirmada'); },
    onError: (error: any) => { if (!error.message?.includes('403')) { toast.error(error.message || 'Error'); }},
  });
}

export function useCancelRsvpChannelEvent(channelId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => apiCall(`/contacts/extended/channels/${channelId}/events/${eventId}/responses`, { method: 'DELETE' }),
    onSuccess: (_, eventId) => { qc.invalidateQueries({ queryKey: ['channelEvents', channelId] }); qc.invalidateQueries({ queryKey: ['channel-event-attendees', channelId, eventId] }); qc.invalidateQueries({ queryKey: ['channel-event', channelId, eventId] }); toast.success('Asistencia cancelada'); },
    onError: (error: any) => { toast.error(error.message || 'Error'); },
  });
}

export function useInterestedChannelEvent(channelId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => apiCall(`/contacts/extended/channels/${channelId}/events/${eventId}/respond`, { method: 'POST', body: JSON.stringify({ responseStatus: 'INTERESTED' }) }),
    onSuccess: (_, eventId) => { qc.invalidateQueries({ queryKey: ['channelEvents', channelId] }); qc.invalidateQueries({ queryKey: ['channel-event-attendees', channelId, eventId] }); qc.invalidateQueries({ queryKey: ['channel-event', channelId, eventId] }); toast.success('Interés registrado'); },
    onError: (error: any) => { toast.error(error.message || 'Error'); },
  });
}

// USER CREATED EVENTS
export function useGetMyCreatedEvents(userId?: number, page = 0, size = 20) {
  return useQuery({
    queryKey: ['my-created-events', userId, page, size],
    queryFn: async () => {
      if (!userId) return [];
      const response = await axiosClient.get(`/contacts/extended/users/${userId}/events?page=${page}&size=${size}`);
      return Array.isArray(response.data) ? response.data : (response.data?.content ?? []);
    },
    enabled: !!userId, staleTime: 1000 * 30,
  });
}

// CHANNEL EVENT IMAGES
export function useUploadChannelEventImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, eventId, files }: { channelId: number; eventId: number; files: File[] }) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      const response = await fetch(`/api/contacts/extended/channels/${channelId}/events/${eventId}/upload-images`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token')}` }, body: formData,
      });
      if (!response.ok) throw new Error('Error uploading images');
      return response.json();
    },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channelEvents', variables.channelId], exact: false }); queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents', variables.channelId] }); queryClient.invalidateQueries({ queryKey: ['channel-event', variables.channelId, variables.eventId] }); },
    onError: () => { toast.error('Error al subir imagenes'); },
  });
}

// CHANNEL POSTS IMAGES
export function useUploadChannelDocuments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, postId, files }: { channelId: number; postId: number; files: File[] }) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      const response = await fetch(`/api/contacts/extended/channels/${channelId}/posts/${postId}/documents`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token')}` }, body: formData,
      });
      if (!response.ok) throw new Error('Error uploading documents');
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['channel-posts'] }); },
    onError: () => { toast.error('Error al subir documentos'); },
  });
}

export function useGetChannelPostDocuments(channelId: number, postId: number) {
  return useQuery({
    queryKey: ['channel-post-documents', channelId, postId],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/channels/${channelId}/posts/${postId}/documents`); return response.data; },
    enabled: !!channelId && !!postId,
  });
}

export function useUploadChannelPostImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, files }: { postId: number; files: File[] }) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      const response = await fetch(`/api/contacts/extended/channels/posts/${postId}/upload-images`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token')}` }, body: formData,
      });
      if (!response.ok) throw new Error('Error uploading images');
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['channel-posts'] }); toast.success('Imágenes subidas'); },
    onError: () => { toast.error('Error al subir imágenes'); },
  });
}

// CHANNEL COMMENTS
export function useChannelComments(channelId: number, postId: number) {
  return useQuery({
    queryKey: ['channel-comments', channelId, postId],
    queryFn: async () => {
      const data = await apiCall(`/contacts/extended/channels/${channelId}/posts/${postId}/comments`);
      const comments = Array.isArray(data) ? data : (data?.content ?? []);
      return comments;
    },
    staleTime: 30 * 1000, enabled: !!postId,
  });
}

export function useCreateChannelComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, postId, content, replyToCommentId }: { channelId: number; postId: number; content: string; replyToCommentId?: number }) => {
      const body: any = { content };
      if (replyToCommentId) body.replyToCommentId = replyToCommentId;
      return await apiCall(`/contacts/extended/channels/${channelId}/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(body) });
    },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channel-comments', variables.channelId, variables.postId] }); queryClient.invalidateQueries({ queryKey: ['channel-posts'] }); },
    onError: () => { toast.error('Error al agregar comentario'); },
  });
}

export function useLikeChannelComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => { return await apiCall(`/contacts/extended/channels/comments/${commentId}/like`, { method: 'POST' }); },
    onSuccess: (data, commentId) => {
      queryClient.setQueryData(['channel-comments'], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((comment: any) => comment.id === commentId ? { ...comment, likeCount: data.likeCount, hasUserLiked: data.isCurrentlyActive, isLiked: data.isCurrentlyActive } : comment);
      });
      queryClient.invalidateQueries({ queryKey: ['channel-comments'] });
    },
    onError: () => { toast.error('Error al dar like'); }
  });
}

export function useDeleteChannelPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, postId }: { channelId: number; postId: number }) => { return await apiCall(`/contacts/extended/channels/${channelId}/posts/${postId}`, { method: 'DELETE' }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['channel-posts'] }); toast.success('Post eliminado'); },
    onError: () => { toast.error('Error al eliminar post'); },
  });
}

// CHANNEL COLLABORATORS & DELEGATION
export interface ChannelCollaborator { id: number; userId: number; firstName: string; lastName: string; email: string; dni?: string; userAvatar?: string; role?: string; grantedAt: string; grantedBy?: { id: number; firstName: string; lastName: string; }; }
export interface ChannelStatistics { subscriberCount: number; collaboratorCount: number; totalPosts: number; postsLast30Days: number; postsLast7Days: number; totalComments: number; commentsLast30Days: number; commentsLast7Days: number; activeUsersLast7Days: number; dailyActivity: Array<{ date: string; posts: number; comments: number; interactions: number; }>; }

export function useSearchUsersForDelegation() {
  return useMutation({
    mutationFn: async (query: string) => {
      const data = await apiCall(`/contacts/extended/search/users?keyword=${encodeURIComponent(query)}`);
      return data as Array<{ id: number; email: string; firstName: string; lastName: string; dni?: string; avatar?: string; role?: string; }>;
    },
  });
}

export function useChannelCollaborators(channelId: number) {
  return useQuery({
    queryKey: ['channel-collaborators', channelId],
    queryFn: async () => { const data = await apiCall(`/contacts/extended/channels/${channelId}/publishers`); return (Array.isArray(data) ? data : []) as ChannelCollaborator[]; },
    staleTime: 30 * 1000, enabled: !!channelId,
  });
}

export function useGrantPublishingPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, userId }: { channelId: number; userId: number }) => { return await apiCall(`/contacts/extended/channels/${channelId}/publishers/${userId}/grant`, { method: 'POST' }); },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channel-collaborators', variables.channelId] }); toast.success('Permiso otorgado'); },
    onError: (error: any) => { toast.error(error?.message || 'Error'); },
  });
}

export function useRevokePublishingPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, userId }: { channelId: number; userId: number }) => { return await apiCall(`/contacts/extended/channels/${channelId}/publishers/${userId}/revoke`, { method: 'POST' }); },
    onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['channel-collaborators', variables.channelId] }); toast.success('Permiso revocado'); },
    onError: (error: any) => { toast.error(error?.message || 'Error'); },
  });
}

export function useCanUserPublish(channelId: number) {
  return useQuery({
    queryKey: ['can-publish', channelId],
    queryFn: async () => { const data = await apiCall(`/contacts/extended/channels/${channelId}/can-publish`); return data?.canPublish as boolean; },
    staleTime: 60 * 1000, enabled: !!channelId,
  });
}

export function useChannelStatistics(channelId: number) {
  return useQuery({
    queryKey: ['channel-statistics', channelId],
    queryFn: async () => { const data = await apiCall(`/contacts/extended/channels/${channelId}/statistics`); return data as ChannelStatistics; },
    staleTime: 60 * 1000, enabled: !!channelId,
  });
}

// CANALES
export function useGetChannels(userId?: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ['channels', userId, page, size],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/channels?page=${page}&size=${size}`); return response.data?.content || []; },
    staleTime: 1000 * 30,
  });
}

export function useSubscribeToChannel(userId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (channelId: number) => { const response = await axiosClient.post(`/contacts/extended/channels/${channelId}/subscribe`); return response.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['channels', userId] }); toast.success('Suscrito al canal'); },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || error?.message || '';
      if (errorMsg.includes('ALREADY_SUBSCRIBED') || errorMsg.includes('Ya estás suscrito')) {
        queryClient.invalidateQueries({ queryKey: ['channels', userId] }); toast.info('Ya estás suscrito a este canal');
      } else { toast.error(errorMsg || 'Error'); }
    },
  });
}

export function useUnsubscribeFromChannel(userId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (channelId: number) => { const response = await axiosClient.delete(`/contacts/extended/channels/${channelId}/subscribe`); return response.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['channels', userId] }); toast.success('Desuscrito del canal'); },
    onError: () => { toast.error('Error'); },
  });
}

// GROUPOS
export function useGetGroups(page = 0, size = 20) {
  return useQuery({
    queryKey: ['groups', page, size],
    queryFn: async () => { const response = await axiosClient.get(`/contacts/extended/groups?page=${page}&size=${size}`); return response.data?.content || []; },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetGroupsInfinite(pageSize = 15) {
  return useInfiniteQuery({
    queryKey: ['groups-infinite', pageSize],
    queryFn: async ({ pageParam = 0 }) => { const response = await axiosClient.get(`/contacts/extended/groups?page=${pageParam}&size=${pageSize}`); return { groups: response.data?.content || [], totalPages: response.data?.totalPages || 1, currentPage: response.data?.number || pageParam, hasMore: response.data && !response.data.last }; },
    getNextPageParam: (lastPage) => { if (!lastPage.hasMore) return undefined; return lastPage.currentPage + 1; },
    initialPageParam: 0, staleTime: 5 * 60 * 1000,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description: string; type?: string; isRestrictedByEmail?: boolean; }) => { const response = await axiosClient.post('/contacts/extended/groups', data); return response.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['groups'] }); toast.success('Grupo creado correctamente'); },
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: number) => { const response = await axiosClient.post(`/contacts/extended/groups/${groupId}/join`); return response.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['groups'] }); toast.success('Te has unido al grupo'); },
    onError: () => { toast.error('Error al unirse al grupo'); },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: number) => { const response = await axiosClient.post(`/contacts/extended/groups/${groupId}/leave`); return response.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['groups'] }); toast.success('Has salido del grupo'); },
    onError: () => { toast.error('Error al salir del grupo'); },
  });
}