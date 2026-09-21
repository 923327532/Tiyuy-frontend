'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/presentation/store/toastStore';
import { Search, User, Bell, Plus, MapPin, Calendar, Users, Star, Share2, ChevronDown, Pin, MoreHorizontal, Filter, Edit, Trash2, Clock, Check, CheckCheck, MailOpen } from 'lucide-react';
import { useChannelEvents, useChannelUpcomingEvents, useCreateChannelEvent, useChannelSubscribers, useChannelEventsWithFilters, useUserEvents, useDeleteChannelEvent, useUpdateChannelEvent } from '@/presentation/hooks/useChannels';
import { useChannelEventsInfinite } from '@/presentation/hooks/useChannelsInfinite';
import { apiClient } from '@/infrastructure/api/axios-client';
import ChannelEventCard from './ChannelEventCard';
import EventDetailView from './EventDetailView';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'EVENT_CREATED' | 'EVENT_UPDATED' | 'EVENT_REMINDER' | 'EVENT_JOINED' | 'EVENT_CANCELLED' | 'GENERAL' | 'CHANNEL_EVENT_CREATED' | 'CHANNEL_POST_CREATED' | 'CHANNEL_SUBSCRIPTION' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  eventId?: number;
  channelId?: number;
  eventTitle?: string;
  channelName?: string;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  metadata?: any;
}

interface NotificationResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ChannelEventsPanelProps {
  channelId: number;
  channelName: string;
  currentUserId: number;
  currentUser: any;
  onCreateEvent?: () => void;
  isOwner?: boolean;
}

export default function ChannelEventsPanel({ 
  channelId, 
  channelName, 
  currentUserId, 
  currentUser,
  onCreateEvent,
  isOwner = false
}: ChannelEventsPanelProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'featured' | 'date' | 'location'>('all');
  const [showUserEvents, setShowUserEvents] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('');
  
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // NOTIFICACIONES
  const [backendNotifications, setBackendNotifications] = useState<Notification[]>([]);
  const [useBackendNotifications, setUseBackendNotifications] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const { data: channelEventsForNotifications } = useChannelEvents(channelId);

  const generateNotificationsFromEvents = useCallback((): Notification[] => {
    let eventsData: any[] = [];
    if (channelEventsForNotifications && typeof channelEventsForNotifications === 'object') {
      if ('content' in channelEventsForNotifications) {
        eventsData = (channelEventsForNotifications as any).content || [];
      } else if (Array.isArray(channelEventsForNotifications)) {
        eventsData = channelEventsForNotifications;
      }
    }
    if (!eventsData || eventsData.length === 0) return [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return eventsData
      .filter((event: any) => new Date(event.createdAt || event.startDateTime || Date.now()) > sevenDaysAgo)
      .map((event: any, index: number) => {
        const creatorName = event.creator?.name || event.creator?.email || 'Alguien';
        const isCurrentUser = event.creatorId === currentUserId || event.creator?.id === currentUserId;
        const notificationId = `event-notification-${event.id}-${index}`;
        return {
          id: notificationId, title: isCurrentUser ? '📌 Creaste un nuevo evento' : `📌 ${creatorName} creó un evento`,
          message: `"${event.title}" - ${event.description || 'Sin descripción'}`, type: 'EVENT_CREATED' as const,
          read: readNotifications.has(notificationId), createdAt: event.createdAt || event.startDateTime || new Date().toISOString(),
          eventId: event.id, channelId, eventTitle: event.title, channelName, userId: event.creatorId || event.creator?.id, userName: creatorName,
        };
      })
      .sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [channelEventsForNotifications, currentUserId, channelName, readNotifications]);

  React.useEffect(() => {
    if (!useBackendNotifications && showNotifications) {
      setLocalNotifications(generateNotificationsFromEvents());
    }
  }, [channelEventsForNotifications, readNotifications, showNotifications, useBackendNotifications, generateNotificationsFromEvents]);

  const { isLoading: notificationsLoading, error: notificationsError, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications', 'events', currentUserId],
    queryFn: async (): Promise<NotificationResponse> => {
      try {
        const { data } = await apiClient.get<NotificationResponse>(`/notifications/events`, { params: { page: 0, size: 50 } });
        setUseBackendNotifications(true); setBackendNotifications(data.content || []); return data;
      } catch { setUseBackendNotifications(false); throw new Error('Backend unavailable'); }
    },
    enabled: !!currentUserId && showNotifications, staleTime: 30000, retry: 1,
  });

  const notifications = useBackendNotifications ? backendNotifications : localNotifications;
  const filteredNotifications = notificationFilter === 'unread' ? notifications.filter((n: Notification) => !n.read) : notifications;
  const totalNotifications = notifications.length;
  const filteredCount = filteredNotifications.length;
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => { if (!notificationId.startsWith('event-notification-')) { await apiClient.put(`/notifications/events/${notificationId}/read`); }},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'events', currentUserId] }),
  });
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => { if (useBackendNotifications) { await apiClient.put('/notifications/events/mark-all-read'); }},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'events', currentUserId] }),
  });
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => { if (!notificationId.startsWith('event-notification-')) { await apiClient.delete(`/notifications/events/${notificationId}`); }},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'events', currentUserId] }),
  });

  const handleMarkAsRead = (notificationId: string | number) => {
    const id = String(notificationId);
    if (id.startsWith('event-notification-')) { setReadNotifications(prev => new Set([...prev, id])); setSelectedNotification(id); return; }
    markAsReadMutation.mutate(id);
  };
  const handleMarkAllAsRead = () => {
    setReadNotifications(prev => new Set([...prev, ...notifications.map(n => n.id)]));
    if (useBackendNotifications) markAllAsReadMutation.mutate();
  };
  const handleDeleteNotification = (notificationId: string) => {
    if (confirm('¿Estás seguro de eliminar esta notificación?')) {
      if (notificationId.startsWith('event-notification-')) { setLocalNotifications(prev => prev.filter(n => n.id !== notificationId)); return; }
      deleteNotificationMutation.mutate(notificationId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EVENT_CREATED': return <Calendar className="w-5 h-5 text-brand" />;
      case 'EVENT_UPDATED': return <Edit className="w-5 h-5 text-orange-600" />;
      case 'EVENT_REMINDER': return <Clock className="w-5 h-5 text-purple-600" />;
      case 'EVENT_JOINED': return <Users className="w-5 h-5 text-green-600" />;
      case 'EVENT_CANCELLED': return <Trash2 className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };
  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white border-gray-200';
    switch (type) {
      case 'EVENT_CREATED': return 'bg-brand/10 border-blue-200';
      case 'EVENT_UPDATED': return 'bg-orange-50 border-orange-200';
      case 'EVENT_REMINDER': return 'bg-purple-50 border-purple-200';
      case 'EVENT_JOINED': return 'bg-green-50 border-green-200';
      case 'EVENT_CANCELLED': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString); const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    const diffHours = Math.floor(diffMins / 60); const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Ahora mismo'; if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`; if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=es`);
          const data = await response.json();
          setUserLocation(data.address?.city || data.address?.town || data.address?.municipality || 'Ubicación actual');
        } catch { setUserLocation('Ubicación actual'); }
      }, () => setUserLocation('Ubicación actual'));
    } else setUserLocation('Ubicación actual');
  };

  const [dynamicFilters, setDynamicFilters] = useState({ eventType: '', city: '', featured: undefined as boolean | undefined, dateFilter: '', location: '' });

  const { data: upcomingEvents, isLoading: upcomingLoading } = useChannelUpcomingEvents(channelId);
  const { data: recommendedEvents } = useChannelUpcomingEvents(channelId);
  const { data: subscribers } = useChannelSubscribers(channelId);
  const createEventMutation = useCreateChannelEvent();
  const { data: userCreatedEvents, isLoading: userCreatedLoading } = useUserEvents(currentUserId, 0, 50);
  const deleteEventMutation = useDeleteChannelEvent();
  const updateEventMutation = useUpdateChannelEvent();
  const canCreateEvent = currentUser?.role === 'AGENT' || currentUser?.role === 'DEVELOPER' || currentUser?.role === 'ADMIN';

  // === PAGINACIÓN INFINITA DE EVENTOS (9 por bloque = 3 filas) ===
  const { data: eventsInfiniteData, isLoading: eventsInfiniteLoading, fetchNextPage: fetchNextEventsPage, hasNextPage: hasMoreEvents, isFetchingNextPage: isFetchingMoreEvents } = useChannelEventsInfinite(channelId, dynamicFilters);
  const allEventsPaginated = eventsInfiniteData?.pages?.flatMap((p: any) => p.events) ?? [];
  const filteredEvents = searchTerm
    ? allEventsPaginated.filter((event: any) => event.title?.toLowerCase().includes(searchTerm.toLowerCase()) || event.city?.toLowerCase().includes(searchTerm.toLowerCase()))
    : allEventsPaginated;
  const totalEventCount = eventsInfiniteData?.pages?.[0]?.totalElements ?? 0;

  // Scroll infinito automático
  useEffect(() => {
    if (!hasMoreEvents || isFetchingMoreEvents) return;
    const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) fetchNextEventsPage(); }, { threshold: 0.1 });
    const s = sentinelRef.current;
    if (s) observer.observe(s);
    return () => { if (s) observer.unobserve(s); };
  }, [hasMoreEvents, isFetchingMoreEvents, fetchNextEventsPage]);

  const handleCloseUserEvents = () => { setShowUserEvents(false); queryClient.removeQueries({ queryKey: ['userEvents', currentUserId] }); };

  const handleFilterChange = (filterType: string, value: any) => {
    let newFilters = { ...dynamicFilters };
    switch (filterType) {
      case 'all': newFilters = { eventType: '', city: '', featured: undefined, dateFilter: '', location: '' }; setActiveFilter('all'); break;
      case 'upcoming': newFilters = { ...newFilters, dateFilter: 'upcoming' }; setActiveFilter('upcoming'); break;
      case 'featured': newFilters = { ...newFilters, featured: true, dateFilter: '' }; setActiveFilter('featured'); break;
      case 'location': newFilters = { ...newFilters, location: value === 'mi-ubicacion' ? userLocation : value }; setActiveFilter('location'); break;
      case 'date': newFilters = { ...newFilters, dateFilter: selectedDate || '' }; setActiveFilter('date'); break;
      case 'category': newFilters = { ...newFilters, eventType: value }; setSelectedCategory(value); break;
      default: newFilters = { eventType: '', city: '', featured: undefined, dateFilter: '', location: '' }; setActiveFilter('all');
    }
    setDynamicFilters(newFilters);
    if (showUserEvents) setShowUserEvents(false);
  };

  const categories = [
    { id: 'FERIA_INMOBILIARIA', name: 'Ferias inmobiliarias' },
    { id: 'OPEN_HOUSE', name: 'Open House' },
    { id: 'WEBINAR', name: 'Webinars' },
    { id: 'REMATE', name: 'Remates' },
    { id: 'OTRO', name: 'Otros' },
  ];

  const renderEventsGrid = () => (
    <div className="p-6">
      {eventsInfiniteLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 space-y-3"><div className="h-4 bg-gray-200 rounded"></div><div className="h-3 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div>
            </div>
          ))}
        </div>
      ) : !filteredEvents || filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-gray-400" /></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay eventos próximos</h3>
          <p className="text-gray-600 text-sm">{canCreateEvent ? 'Crea tu primer evento para empezar' : 'Este canal aún no tiene eventos programados'}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any) => (
              <ChannelEventCard key={event.id} event={event} currentUserId={currentUserId} isOwner={isOwner} onView={() => setSelectedEvent(event)} />
            ))}
          </div>
          {hasMoreEvents && (
            <div ref={sentinelRef} className="flex justify-center mt-8">
              <button onClick={() => fetchNextEventsPage()} disabled={isFetchingMoreEvents}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {isFetchingMoreEvents ? <><div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" /> Cargando...</> : <><Calendar className="w-4 h-4" /> Cargar más eventos</>}
              </button>
            </div>
          )}
          <div className="text-center mt-4"><span className="text-xs text-gray-400">Mostrando {filteredEvents.length} de {totalEventCount} eventos</span></div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-full bg-gray-50">
      {isMobile && showMobileSidebar && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileSidebar(false)} />}
      {isMobile && (
        <button onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="fixed bottom-20 left-4 z-50 w-12 h-12 bg-brand text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      )}
      <div className={`${isMobile ? `fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}` : 'w-[280px]'} bg-white border-r border-gray-200 flex flex-col`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Eventos</h1>
            {isMobile && <button onClick={() => setShowMobileSidebar(false)} className="p-1 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input placeholder="Buscar eventos" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent text-sm text-gray-700 placeholder-gray-400 flex-1 focus:outline-none" />
          </div>
        </div>
        <div className="p-3 space-y-1">
          {canCreateEvent && (
            <button onClick={() => { setShowUserEvents(!showUserEvents); setShowNotifications(false); if (isMobile) setShowMobileSidebar(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showUserEvents ? 'bg-brand/20 text-brand-dark' : 'text-gray-700 hover:bg-gray-100'}`}>
              <User className="w-4 h-4" /> Tus eventos <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showUserEvents ? 'rotate-180' : ''}`} />
            </button>
          )}
          <button onClick={() => { setShowNotifications(true); setShowUserEvents(false); if (isMobile) setShowMobileSidebar(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showNotifications ? 'bg-brand/20 text-brand-dark' : 'text-gray-700 hover:bg-gray-100'}`}>
            <div className="relative"><Bell className="w-4 h-4" />{unreadCount > 0 && !showNotifications && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>}</div>
            <span className="flex-1 text-left">Notificaciones</span>
            {unreadCount > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${showNotifications ? 'bg-blue-200 text-blue-800' : 'bg-red-100 text-red-700'}`}>{unreadCount}</span>}
          </button>
        </div>
        {canCreateEvent && (
          <div className="p-3">
            <button onClick={() => { if (onCreateEvent) onCreateEvent(); if (isMobile) setShowMobileSidebar(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors">
              <Plus className="w-4 h-4" /> Crear nuevo evento
            </button>
          </div>
        )}
        {recommendedEvents && recommendedEvents.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-gray-900">Eventos recomendados</h3><button className="text-xs text-brand hover:text-brand-dark">Ver todos</button></div>
            <div className="space-y-2">
              {recommendedEvents.slice(0, 3).map((event: any) => (
                <button key={event.id} onClick={() => { setSelectedEvent(event); if (isMobile) setShowMobileSidebar(false); }}
                  className="w-full flex items-start gap-2 p-2 hover:bg-gray-50 rounded-lg text-left">
                  <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center flex-shrink-0"><Calendar className="w-5 h-5 text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brand mb-1">{new Date(event.startDateTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase()}</p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{event.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="p-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Categorías</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button key={category.id} onClick={() => { handleFilterChange('category', category.id === selectedCategory ? null : category.id); if (isMobile) setShowMobileSidebar(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id ? 'bg-brand/20 text-brand-dark' : 'text-gray-700 hover:bg-gray-100'}`}>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto md:overflow-hidden">
        {selectedEvent ? (
          <EventDetailView event={selectedEvent} channelId={channelId} currentUserId={currentUserId} isOwner={isOwner} onBack={() => setSelectedEvent(null)} isEditMode={selectedEvent.isEditMode || false} />
        ) : showNotifications ? (
          <div className="h-full overflow-y-auto">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronDown className="w-5 h-5 text-gray-600 rotate-90" /></button>
                  <div><h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2><p className="text-sm text-gray-500">{totalNotifications > 0 ? `${totalNotifications} total` : 'Sin notificaciones'}{unreadCount > 0 && ` 📬 ${unreadCount} sin leer`}</p></div>
                </div>
                {filteredCount > 0 && unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} disabled={markAllAsReadMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/10 rounded-lg disabled:opacity-50">
                    <CheckCheck className="w-4 h-4" />{markAllAsReadMutation.isPending ? 'Marcando...' : 'Marcar todas como leídas'}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => setNotificationFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${notificationFilter === 'all' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Todas ({totalNotifications})</button>
                <button onClick={() => setNotificationFilter('unread')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${notificationFilter === 'unread' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Sin leer ({unreadCount})</button>
              </div>
            </div>
            <div className="p-6 max-w-3xl">
              {notificationsLoading && <div className="space-y-4">{[1, 2, 3].map(i => <div key={`notif-sk-${i}`} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full"></div><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-200 rounded w-full"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></div></div>)}</div>}
              {!notificationsLoading && notificationsError && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Bell className="w-8 h-8 text-red-500" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar notificaciones</h3>
                  <button onClick={() => refetchNotifications()} className="px-4 py-2 bg-brand text-white rounded-lg hover:opacity-90">Reintentar</button>
                </div>
              )}
              {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><MailOpen className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{notificationFilter === 'unread' ? 'No hay notificaciones sin leer' : 'No tienes notificaciones'}</h3>
                </div>
              )}
              {!notificationsLoading && !notificationsError && filteredNotifications.length > 0 && (
                <div className="space-y-3">
                  {filteredNotifications.map((notification: Notification) => (
                    <div key={notification.id} onClick={() => {
                      if (notification.eventId) { setSelectedEvent({ id: notification.eventId }); setShowNotifications(false); } else handleMarkAsRead(notification.id);
                    }} className={`relative rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${getNotificationBgColor(notification.type, notification.read)} ${selectedNotification === notification.id ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.read ? 'bg-gray-100' : 'bg-white'}`}>{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>{notification.title}</h4>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{formatRelativeTime(notification.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                            {!notification.read && <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200"><Check className="w-3 h-3 inline mr-1" />Leída</button>}
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification.id); }} className="ml-auto text-xs text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : showUserEvents ? (
          <div className="h-full overflow-y-auto">
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={handleCloseUserEvents} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronDown className="w-5 h-5 text-gray-600 rotate-90" /></button>
                  <h2 className="text-2xl font-bold text-gray-900">Mis eventos creados</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4" />{userCreatedEvents?.content?.length || 0} eventos</div>
              </div>
            </div>
            <div className="p-6">
              {userCreatedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`user-ev-sk-${i}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                      <div className="h-32 bg-gray-200"></div><div className="p-4 space-y-3"><div className="h-4 bg-gray-200 rounded"></div><div className="h-3 bg-gray-200 rounded w-3/4"></div></div>
                    </div>
                  ))}
                </div>
              ) : !userCreatedEvents?.content?.length ? (
                <div className="text-center py-12"><div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-gray-400" /></div><h3 className="text-lg font-semibold text-gray-900 mb-2">No has creado eventos</h3><p className="text-gray-600 text-sm">Crea tu primer evento para empezar</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCreatedEvents.content.map((event: any) => (
                    <div key={`my-ev-${event.id || event.eventId || Math.random()}`} className="group relative">
                      <ChannelEventCard event={event} currentUserId={currentUserId} isOwner={true} onView={() => setSelectedEvent(event)} />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedEvent({ ...event, isEditMode: true })} className="p-2 bg-white rounded-lg shadow-md text-gray-400 hover:text-brand hover:bg-brand/10"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm('¿Eliminar evento?')) deleteEventMutation.mutate({ channelId, eventId: event.id }); }} className="p-2 bg-white rounded-lg shadow-md text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Eventos del canal</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4" />{totalEventCount || 0} eventos</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3"><Filter className="w-4 h-4 text-gray-600" /><span className="text-sm font-medium text-gray-700">Filtros:</span></div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => handleFilterChange('all', null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Todos</button>
                  <button onClick={() => handleFilterChange('featured', null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'featured' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Destacados</button>
                  <button onClick={() => handleFilterChange('upcoming', null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'upcoming' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Próximos</button>
                  <button onClick={() => setShowDatePicker(!showDatePicker)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'date' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><Calendar className="w-4 h-4" />Fecha</button>
                  <button onClick={() => { getUserLocation(); handleFilterChange('location', 'mi-ubicacion'); }} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'location' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><MapPin className="w-4 h-4" />Mi ubicación</button>
                  {showDatePicker && (
                    <div className="absolute top-[340px] right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar fecha</label>
                      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { if (selectedDate) { handleFilterChange('date', selectedDate); setShowDatePicker(false); } }} className="px-4 py-2 bg-brand text-white rounded-md hover:opacity-90">Filtrar</button>
                        <button onClick={() => setShowDatePicker(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {renderEventsGrid()}
          </div>
        )}
      </div>
    </div>
  );
}