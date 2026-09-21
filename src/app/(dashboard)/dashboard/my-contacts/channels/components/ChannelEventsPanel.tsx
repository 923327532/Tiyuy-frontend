'use client';

import React, { useState, useCallback } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/presentation/store/toastStore';
import { Search, User, Bell, Plus, MapPin, Calendar, Users, Star, Share2, ChevronDown, Pin, MoreHorizontal, Filter, Edit, Trash2, Clock, Check, CheckCheck, MailOpen, Menu, X } from 'lucide-react';
import { useChannelEvents, useChannelUpcomingEvents, useCreateChannelEvent, useChannelSubscribers, useChannelEventsWithFilters, useUserEvents, useDeleteChannelEvent, useUpdateChannelEvent } from '@/presentation/hooks/useChannels';
import { apiClient } from '@/infrastructure/api/axios-client';
import ChannelEventCard from './ChannelEventCard';
import EventDetailView from './EventDetailView';

// ============================================
// TIPOS DE NOTIFICACIONES (100% DINÁMICO)
// ============================================
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

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'featured' | 'date' | 'location'>('all');
  // Estado para controlar si se están mostrando eventos del usuario
  const [showUserEvents, setShowUserEvents] = useState(false);
  // Estado para mostrar el panel de notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('');
  
  // Estados para notificaciones
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // ============================================
  // LÓGICA DE NOTIFICACIONES - 100% DINÁMICA CON FALLBACK
  // ============================================
  
  // Estado para notificaciones del backend
  const [backendNotifications, setBackendNotifications] = useState<Notification[]>([]);
  const [useBackendNotifications, setUseBackendNotifications] = useState(false);
  
  // Estado local para notificaciones generadas dinámicamente (fallback)
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  
  // Query para obtener eventos del canal (para generar notificaciones dinámicas)
  const { data: channelEventsForNotifications } = useChannelEvents(channelId);

  // Generar notificaciones dinámicas desde eventos del canal (FALLBACK)
  const generateNotificationsFromEvents = useCallback((): Notification[] => {
    // Obtener eventos del canal
    let eventsData: any[] = [];
    if (channelEventsForNotifications && typeof channelEventsForNotifications === 'object') {
      if ('content' in channelEventsForNotifications) {
        eventsData = (channelEventsForNotifications as any).content || [];
      } else if (Array.isArray(channelEventsForNotifications)) {
        eventsData = channelEventsForNotifications;
      }
    }

    if (!eventsData || eventsData.length === 0) return [];

    // Generar notificaciones solo para eventos creados recientemente (últimas 7 días)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const generatedNotifications: Notification[] = eventsData
      .filter((event: any) => {
        // Solo eventos creados en los últimos 7 días
        const createdAt = new Date(event.createdAt || event.startDateTime || Date.now());
        return createdAt > sevenDaysAgo;
      })
      .map((event: any, index: number) => {
        const creatorName = event.creator?.name || event.creator?.email || 'Alguien';
        const isCurrentUser = event.creatorId === currentUserId || event.creator?.id === currentUserId;
        const notificationId = `event-notification-${event.id}-${index}`;
        
        return {
          id: notificationId,
          title: isCurrentUser 
            ? '📅 Creaste un nuevo evento'
            : `📅 ${creatorName} creó un evento`,
          message: `"${event.title}" - ${event.description || 'Sin descripción'}`,
          type: 'EVENT_CREATED' as const,
          read: readNotifications.has(notificationId),
          createdAt: event.createdAt || event.startDateTime || new Date().toISOString(),
          eventId: event.id,
          channelId: channelId,
          eventTitle: event.title,
          channelName: channelName,
          userId: event.creatorId || event.creator?.id,
          userName: creatorName,
        };
      })
      .sort((a: Notification, b: Notification) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return generatedNotifications;
  }, [channelEventsForNotifications, currentUserId, channelName, readNotifications]);

  // Efecto para generar notificaciones locales cuando cambian los eventos
  React.useEffect(() => {
    if (!useBackendNotifications && showNotifications) {
      const notifications = generateNotificationsFromEvents();
      setLocalNotifications(notifications);
    }
  }, [channelEventsForNotifications, readNotifications, showNotifications, useBackendNotifications, generateNotificationsFromEvents]);

  // Query para obtener notificaciones del backend (solo si está disponible)
  const { 
    isLoading: notificationsLoading, 
    error: notificationsError,
    refetch: refetchNotifications
  } = useQuery({
    queryKey: ['notifications', 'events', currentUserId],
    queryFn: async (): Promise<NotificationResponse> => {
      try {
        const { data } = await apiClient.get<NotificationResponse>(`/notifications/events`, {
          params: { page: 0, size: 50 }
        });
        setUseBackendNotifications(true);
        setBackendNotifications(data.content || []);
        return data;
      } catch (error: any) {
        // Backend no disponible, usar fallback local
        console.log('Backend notifications not available, using fallback');
        setUseBackendNotifications(false);
        throw error; // Para que React Query maneje el error
      }
    },
    enabled: !!currentUserId && showNotifications,
    staleTime: 30000,
    retry: 1,
  });

  // Combinar notificaciones del backend y locales (fallback)
  const notifications = useBackendNotifications 
    ? backendNotifications 
    : localNotifications;
  
  // Filtrar notificaciones según el filtro seleccionado
  const filteredNotifications = notificationFilter === 'unread'
    ? notifications.filter((n: Notification) => !n.read)
    : notifications;
  
  const totalNotifications = notifications.length;
  const filteredCount = filteredNotifications.length;
  
  // Calcular contador de no leídas (DINÁMICO)
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  // Mutation para marcar una notificación como leída (DINÁMICO - API real)
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // NUNCA enviar IDs locales al backend
      if (notificationId.startsWith('event-notification-')) {
        console.log('Notificación local, no se envía al backend:', notificationId);
        return; // Solo actualizar estado local
      }
      
      try {
        // Backend de eventos espera PUT
        await apiClient.put(`/notifications/events/${notificationId}/read`);
      } catch (error: any) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'events', currentUserId] });
    },
  });

  // Mutation para marcar todas como leídas (DINÁMICO - API real)
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // Solo ejecutar si estamos usando notificaciones del backend
      if (!useBackendNotifications) {
        console.log('Usando notificaciones locales, no se envía al backend');
        return;
      }
      
      try {
        // Backend de eventos espera PUT
        await apiClient.put(`/notifications/events/mark-all-read`);
      } catch (error: any) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'events', currentUserId] });
    },
  });

  // Mutation para eliminar una notificación (DINÁMICO - API real)
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // NUNCA enviar IDs locales al backend
      if (notificationId.startsWith('event-notification-')) {
        console.log('Notificación local, no se envía al backend:', notificationId);
        return; // Solo actualizar estado local
      }
      
      try {
        await apiClient.delete(`/notifications/events/${notificationId}`);
      } catch (error: any) {
        console.error('Error deleting notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'events', currentUserId] });
    },
  });

  // Handlers de notificaciones (funcionan con backend o fallback local)
  const handleMarkAsRead = (notificationId: string | number) => {
    // Convertir a string si es número
    const id = String(notificationId);
    
    // Si es una notificación local (fallback), marcar en estado local
    if (id.startsWith('event-notification-')) {
      setReadNotifications(prev => new Set([...prev, id]));
      setSelectedNotification(id);
      return;
    }
    
    // Para notificaciones reales del backend, llamar a la mutación
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    // Marcar todas las notificaciones locales como leídas
    const allIds = notifications.map((n: Notification) => n.id);
    setReadNotifications(prev => new Set([...prev, ...allIds]));
    
    // Solo intentar marcar en backend si estamos usando notificaciones del backend
    if (useBackendNotifications) {
      markAllAsReadMutation.mutate();
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (confirm('¿Estás seguro de eliminar esta notificación?')) {
      // Para notificaciones locales, solo eliminar del estado
      if (notificationId.startsWith('event-notification-')) {
        setLocalNotifications(prev => prev.filter(n => n.id !== notificationId));
        return;
      }
      
      deleteNotificationMutation.mutate(notificationId);
    }
  };

  // Helper para obtener el eventId de la notificación (soporta eventId o entityId)
  const getNotificationEventId = (notification: Notification): number | string | null => {
    return notification.eventId || (notification as any).entityId || null;
  };

  const handleNotificationClick = (notification: Notification) => {
    const eventId = getNotificationEventId(notification);
    
    // PRIMERO: Abrir el evento inmediatamente para mejor UX
    if (eventId) {
      console.log('🔔 Clic en notificación - eventId:', eventId);
      
      // Buscar el evento en TODAS las fuentes disponibles
      let eventData = null;
      
      // Fuente 1: channelEventsForNotifications
      const allEvents1 = channelEventsForNotifications && typeof channelEventsForNotifications === 'object' 
        ? ('content' in channelEventsForNotifications 
            ? (channelEventsForNotifications as any).content 
            : channelEventsForNotifications)
        : [];
      
      if (Array.isArray(allEvents1)) {
        eventData = allEvents1.find((e: any) => e.id === eventId || e.id === Number(eventId));
        if (eventData) console.log('✅ Evento encontrado en channelEventsForNotifications');
      }
      
      // Fuente 2: events (del query principal)
      if (!eventData && events && Array.isArray(events)) {
        eventData = events.find((e: any) => e.id === eventId || e.id === Number(eventId));
        if (eventData) console.log('✅ Evento encontrado en events');
      }
      
      // Fuente 3: upcomingEvents
      if (!eventData && upcomingEvents && Array.isArray(upcomingEvents)) {
        eventData = upcomingEvents.find((e: any) => e.id === eventId || e.id === Number(eventId));
        if (eventData) console.log('✅ Evento encontrado en upcomingEvents');
      }
      
      if (eventData) {
        console.log('📂 Abriendo detalle del evento:', eventData.title || eventData.id);
        // Abrir el detalle del evento INMEDIATAMENTE
        setSelectedEvent(eventData);
        setShowNotifications(false);
        
        // DESPUÉS: Marcar como leída en segundo plano (sin esperar)
        if (!notification.read) {
          const id = String(notification.id);
          if (!id.startsWith('event-notification-')) {
            markAsReadMutation.mutate(notification.id);
          }
        }
      } else {
        console.warn('⚠️ Evento no encontrado localmente:', eventId);
        console.log('Recargando eventos del canal...');
        // Forzar recarga de eventos y luego intentar abrir
        queryClient.invalidateQueries({ queryKey: ['channelEvents', channelId] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
        
        // Mostrar mensaje temporal
        toast.error('Cargando evento... Por favor espera un momento y vuelve a intentar.');
      }
    } else {
      // Si no tiene eventId, solo marcar como leída
      console.log('Notificación sin eventId, marcando como leída');
      if (!notification.read) {
        handleMarkAsRead(notification.id);
      } else {
        setSelectedNotification(notification.id);
      }
    }
  };

  // Obtener icono según tipo de notificación (DINÁMICO)
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EVENT_CREATED':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'EVENT_UPDATED':
        return <Edit className="w-5 h-5 text-orange-600" />;
      case 'EVENT_REMINDER':
        return <Clock className="w-5 h-5 text-purple-600" />;
      case 'EVENT_JOINED':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'EVENT_CANCELLED':
        return <Trash2 className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  // Obtener color de fondo según tipo (DINÁMICO)
  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white border-gray-200';
    
    switch (type) {
      case 'EVENT_CREATED':
        return 'bg-blue-50 border-blue-200';
      case 'EVENT_UPDATED':
        return 'bg-orange-50 border-orange-200';
      case 'EVENT_REMINDER':
        return 'bg-purple-50 border-purple-200';
      case 'EVENT_JOINED':
        return 'bg-green-50 border-green-200';
      case 'EVENT_CANCELLED':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Formatear fecha relativa (DINÁMICO)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get user's location dynamically
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Reverse geocoding to get city name
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=es`);
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.municipality || 'Ubicación actual';
            setUserLocation(city);
          } catch (error) {
            console.error('Error getting location name:', error);
            setUserLocation('Ubicación actual');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation('Ubicación actual');
        }
      );
    } else {
      setUserLocation('Ubicación actual');
    }
  };

  // Dynamic filters state - INICIA VACÍO PARA MOSTRAR TODOS
  const [dynamicFilters, setDynamicFilters] = useState({
    eventType: '',
    city: '',
    featured: undefined as boolean | undefined,
    dateFilter: '',
    location: ''
  });

  // Queries with dynamic filters
  const { data: events, isLoading: eventsLoading, error: eventsError } = useChannelEventsWithFilters(channelId, dynamicFilters);
  const { data: upcomingEvents, isLoading: upcomingLoading } = useChannelUpcomingEvents(channelId);
  const { data: recommendedEvents } = useChannelUpcomingEvents(channelId);
  const { data: subscribers } = useChannelSubscribers(channelId);
  const createEventMutation = useCreateChannelEvent();

  // Query para obtener todos los eventos creados por el usuario (para Agentes/Developers/Admins)
  const { data: userCreatedEvents, isLoading: userCreatedLoading } = useUserEvents(currentUserId, 0, 50);
  
  // Hook para eliminar eventos
  const deleteEventMutation = useDeleteChannelEvent();
  
  // Hook para actualizar eventos
  const updateEventMutation = useUpdateChannelEvent();

  const canCreateEvent = currentUser?.role === 'AGENT' || currentUser?.role === 'DEVELOPER' || currentUser?.role === 'ADMIN';
  
  // Función para cerrar "Mis eventos" y limpiar caché
  const handleCloseUserEvents = () => {
    setShowUserEvents(false);
    // Limpiar caché de user events para evitar duplicados
    queryClient.removeQueries({ queryKey: ['userEvents', currentUserId] });
  };
  
  // DEBUG: Log para depurar eventos del usuario
  React.useEffect(() => {
    if (userCreatedEvents) {
      console.log('Total elements:', userCreatedEvents.totalElements);
      console.log('Content length:', userCreatedEvents.content?.length);
      
      if (userCreatedEvents.content && userCreatedEvents.content.length > 0) {
        console.log('Eventos del usuario:');
        userCreatedEvents.content.forEach((event: any, index: number) => {
          console.log(`  ${index + 1}. ID: ${event.id}, Title: ${event.title}, Channel: ${event.channelId || event.channel?.id}`);
          console.log(`      - Creator ID: ${event.creatorId || event.creator?.id}`);
          console.log(`      - Start Date: ${event.startDateTime}`);
          console.log(`      - Is Active: ${event.isActive}`);
        });
        
        // Verificar si los datos parecen reales
        const hasValidIds = userCreatedEvents.content.every((e: any) => e.id && e.id > 0);
        const hasValidTitles = userCreatedEvents.content.every((e: any) => e.title && e.title.trim() !== '');
        const hasValidDates = userCreatedEvents.content.every((e: any) => e.startDateTime);
        
        console.log('=== VERIFICACIÓN DE DATOS ===');
        console.log('Todos tienen IDs válidos:', hasValidIds);
        console.log('Todos tienen títulos válidos:', hasValidTitles);
        console.log('Todos tienen fechas válidas:', hasValidDates);
        console.log('¿Los datos parecen reales?', hasValidIds && hasValidTitles && hasValidDates);
      } else {
        console.log('NO HAY CONTENIDO EN userCreatedEvents.content');
      }
    } else {
      console.log('userCreatedEvents es null o undefined');
    }
    console.log('=== END USER CREATED EVENTS DEBUG ===');
  }, [currentUserId, currentUser, userCreatedEvents, userCreatedLoading, canCreateEvent]);
  
  // Handle filter changes - makes API calls with dynamic filters
  const handleFilterChange = (filterType: string, value: any) => {
    let newFilters = { ...dynamicFilters };
    
    switch (filterType) {
      case 'all':
        newFilters = {
          eventType: '',
          city: '',
          featured: undefined,
          dateFilter: '',
          location: ''
        };
        setActiveFilter('all');
        break;
      case 'upcoming':
        newFilters = {
          eventType: '',
          city: '',
          featured: undefined,
          dateFilter: 'upcoming',
          location: ''
        };
        setActiveFilter('upcoming');
        break;
      case 'featured':
        newFilters = {
          eventType: '',
          city: '',
          featured: true,
          dateFilter: '',
          location: ''
        };
        setActiveFilter('featured');
        break;
      case 'location':
        newFilters = {
          eventType: '',
          city: '',
          featured: undefined,
          dateFilter: '',
          location: value === 'mi-ubicacion' ? userLocation : value
        };
        setActiveFilter('location');
        break;
      case 'date':
        newFilters = {
          eventType: '',
          city: '',
          featured: undefined,
          dateFilter: selectedDate || '',
          location: ''
        };
        setActiveFilter('date');
        break;
      case 'category':
        newFilters = {
          eventType: value,
          city: '',
          featured: undefined,
          dateFilter: '',
          location: ''
        };
        setSelectedCategory(value);
        break;
      default:
        newFilters = {
          eventType: '',
          city: '',
          featured: undefined,
          dateFilter: '',
          location: ''
        };
        setActiveFilter('all');
    }
    
    setDynamicFilters(newFilters);
    
    // Al aplicar filtros, salir de "Mis eventos creados" y volver a eventos del canal
    if (showUserEvents) {
      setShowUserEvents(false);
    }
  };

  // Legacy filter function for compatibility (now just returns events from API)
  const getFilteredEvents = () => {
    // Spring Data Page: los datos están en .content
    let eventsData: any[] = [];
    if (events && typeof events === 'object' && 'content' in events) {
      eventsData = (events as any).content || [];
    } else if (Array.isArray(events)) {
      eventsData = events;
    }
    
    if (!eventsData || !Array.isArray(eventsData)) {
      return [];
    }
    
    let filtered = eventsData;
    
    // Apply client-side search if needed
    if (searchTerm) {
      filtered = filtered.filter((event: any) => 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const categories = [
    { id: 'FERIA_INMOBILIARIA', name: 'Ferias inmobiliarias', icon: '🏢' },
    { id: 'OPEN_HOUSE', name: 'Open House', icon: '🏠' },
    { id: 'WEBINAR', name: 'Webinars', icon: '💻' },
    { id: 'REMATE', name: 'Remates', icon: '🔨' },
    { id: 'OTRO', name: 'Otros', icon: '📋' },
  ];

  const filteredEvents = getFilteredEvents();

  return (
    <div className="flex h-full bg-gray-50 relative">
      {isMobile && showMobileSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileSidebar(false)} />
      )}
      {isMobile && (
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}
      {/* SIDEBAR IZQUIERDO */}
      <div
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}`
            : 'w-[280px]'
        } bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Eventos</h1>
            {isMobile && (
              <button onClick={() => setShowMobileSidebar(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              placeholder="Buscar eventos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 flex-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Menu */}
        <div className="p-3 space-y-1">
          {/* Tus eventos - solo para Agentes, Developers, Admins */}
          {canCreateEvent && (
            <button
              onClick={() => {
                setShowUserEvents(!showUserEvents);
                setShowNotifications(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showUserEvents
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              Tus eventos
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showUserEvents ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Botón de Notificaciones con contador dinámico */}
          <button 
            onClick={() => {
              setShowNotifications(true);
              setShowUserEvents(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showNotifications
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="relative">
              <Bell className="w-4 h-4" />
              {/* Badge de notificaciones no leídas - DINÁMICO */}
              {unreadCount > 0 && !showNotifications && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="flex-1 text-left">Notificaciones</span>
            {unreadCount > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                showNotifications ? 'bg-blue-200 text-blue-800' : 'bg-red-100 text-red-700'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Crear evento button */}
        {canCreateEvent && (
          <div className="p-3">
            <button
              onClick={onCreateEvent}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear nuevo evento
            </button>
          </div>
        )}

        {/* Eventos recomendados */}
        {recommendedEvents && recommendedEvents.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Eventos recomendados</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700">Ver todos</button>
            </div>
            <div className="space-y-2">
              {recommendedEvents.slice(0, 3).map((event: any) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full flex items-start gap-2 p-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-600 mb-1">
                      {new Date(event.startDateTime).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      }).toUpperCase()}
                    </p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{event.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categorías */}
        <div className="p-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Categorías</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange('category', category.id === selectedCategory ? null : category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 overflow-hidden">
        {selectedEvent ? (
          <EventDetailView
            event={selectedEvent}
            channelId={channelId}
            currentUserId={currentUserId}
            isOwner={isOwner}
            onBack={() => setSelectedEvent(null)}
            isEditMode={selectedEvent.isEditMode || false}
          />
        ) : showNotifications ? (
          <div className="h-full overflow-y-auto">
            {/* Header de Notificaciones */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Volver a eventos"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
                    <p className="text-sm text-gray-500">
                      {totalNotifications > 0 ? `${totalNotifications} total` : 'Sin notificaciones'}
                      {unreadCount > 0 && ` • ${unreadCount} sin leer`}
                    </p>
                  </div>
                </div>
                
                {/* Acciones masivas */}
                {filteredCount > 0 && unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={markAllAsReadMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCheck className="w-4 h-4" />
                    {markAllAsReadMutation.isPending ? 'Marcando...' : 'Marcar todas como leídas'}
                  </button>
                )}
              </div>

              {/* Filtros de notificaciones */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setNotificationFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    notificationFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas ({totalNotifications})
                </button>
                <button
                  onClick={() => setNotificationFilter('unread')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    notificationFilter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sin leer ({unreadCount})
                </button>
              </div>
            </div>

            {/* Panel de Notificaciones - 100% DINÁMICO */}
            <div className="p-6 max-w-3xl">
              {/* Loading State */}
              {notificationsLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {!notificationsLoading && notificationsError && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar notificaciones</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    No se pudieron cargar las notificaciones. Intenta nuevamente.
                  </p>
                  <button
                    onClick={() => refetchNotifications()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <MailOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {notificationFilter === 'unread' ? 'No hay notificaciones sin leer' : 'No tienes notificaciones'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {notificationFilter === 'unread' 
                      ? 'Todas tus notificaciones han sido leídas' 
                      : 'Las notificaciones de eventos aparecerán aquí cuando haya actividad'}
                  </p>
                </div>
              )}

              {/* Notifications List - DINÁMICO */}
              {!notificationsLoading && !notificationsError && filteredNotifications.length > 0 && (
                <div className="space-y-3">
                  {filteredNotifications.map((notification: Notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`relative rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                        getNotificationBgColor(notification.type, notification.read)
                      } ${selectedNotification === notification.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icono */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.read ? 'bg-gray-100' : 'bg-white'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>

                          {/* Detalles del evento */}
                          {(notification.eventTitle || notification.channelName) && (
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                              {notification.eventTitle && (
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                  <Calendar className="w-3 h-3" />
                                  {notification.eventTitle}
                                </span>
                              )}
                              {notification.channelName && (
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                  <Users className="w-3 h-3" />
                                  {notification.channelName}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Botones de acción */}
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                            {notification.eventId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Buscar y abrir el evento
                                  let eventData = null;
                                  const allEvents = channelEventsForNotifications && typeof channelEventsForNotifications === 'object' 
                                    ? ('content' in channelEventsForNotifications 
                                        ? (channelEventsForNotifications as any).content 
                                        : channelEventsForNotifications)
                                    : [];
                                  
                                  if (Array.isArray(allEvents)) {
                                    eventData = allEvents.find((ev: any) => ev.id === notification.eventId);
                                  }
                                  
                                  if (eventData) {
                                    setSelectedEvent(eventData);
                                    setShowNotifications(false);
                                  } else {
                                    console.warn('Evento no encontrado:', notification.eventId);
                                    queryClient.invalidateQueries({ queryKey: ['channelEvents', channelId] });
                                  }
                                }}
                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                              >
                                Ver Evento
                              </button>
                            )}
                            
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                disabled={markAsReadMutation.isPending}
                                className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                              >
                                <Check className="w-3 h-3" />
                                Marcar leída
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                              }}
                              disabled={deleteNotificationMutation.isPending}
                              className="ml-auto text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
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
            {/* Header para eventos del usuario */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCloseUserEvents}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Volver a eventos del canal"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">Mis eventos creados</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {userCreatedEvents?.content?.length || 0} eventos creados
                </div>
              </div>
            </div>

            {/* Events Grid para eventos del usuario */}
            <div className="p-6">
              {userCreatedLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                      <div className="h-32 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-200 rounded flex-1"></div>
                          <div className="h-8 bg-gray-200 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !userCreatedEvents || !userCreatedEvents.content || userCreatedEvents.content.length === 0 ? (
                // Empty state
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No has creado eventos</h3>
                  <p className="text-gray-600 text-sm">
                    Crea tu primer evento para empezar
                  </p>
                </div>
              ) : (
                // Events grid con botones de acción - CON VALIDACIÓN DE IDs ÚNICOS
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    // WORKAROUND: Normalizar IDs - usar eventId si no hay id
                    const normalizedEvents = userCreatedEvents.content.map((event: any) => ({
                      ...event,
                      id: event.id || event.eventId // Fallback a eventId si no hay id
                    }));
                    
                    // Validar IDs únicos para evitar duplicados
                    const seenIds = new Set();
                    const uniqueEvents = normalizedEvents.filter((event: any) => {
                      if (!event.id || seenIds.has(event.id)) {
                        console.warn('Evento duplicado o sin ID:', event);
                        return false;
                      }
                      seenIds.add(event.id);
                      return true;
                    });
                    console.log('Eventos únicos a mostrar:', uniqueEvents.length);
                    return uniqueEvents;
                  })().map((event: any) => (
                    <div key={event.id} className="group relative">
                      <ChannelEventCard
                        event={event}
                        currentUserId={currentUserId}
                        isOwner={true}
                        onView={() => setSelectedEvent(event)}
                      />
                      
                      {/* Botones de acción - solo visibles en hover */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedEvent({
                              ...event,
                              isEditMode: true
                            });
                          }}
                          className="p-2 bg-white rounded-lg shadow-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Editar evento"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                              deleteEventMutation.mutate(
                                { channelId, eventId: event.id },
                                {
                                  onSuccess: () => {
                                    console.log('Evento eliminado exitosamente');
                                  },
                                  onError: (error) => {
                                    console.error('Error al eliminar evento:', error);
                                    toast.error('Error al eliminar el evento');
                                  }
                                }
                              );
                            }
                          }}
                          className="p-2 bg-white rounded-lg shadow-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Eliminar evento"
                          disabled={deleteEventMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {/* Header con filtros mejorados */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Eventos del canal</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {filteredEvents?.length || 0} eventos encontrados
                </div>
              </div>
              
              {/* Filtros mejorados con mejor visibilidad */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filtros:</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={() => handleFilterChange('all', null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              
              <button 
                onClick={() => handleFilterChange('featured', null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'featured'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Destacados
              </button>
              
              <button 
                onClick={() => handleFilterChange('upcoming', null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'upcoming'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Próximos
              </button>
              
              {/* Filtro de fecha con calendario */}
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'date'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Fecha
              </button>
              
              {/* Filtro de ubicación */}
              <button 
                onClick={() => {
                  getUserLocation();
                  handleFilterChange('location', 'mi-ubicacion');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'location'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Mi ubicación
              </button>
              
              {/* Calendario emergente */}
              {showDatePicker && (
                <div className="absolute top-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar fecha
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (selectedDate) {
                          handleFilterChange('date', selectedDate);
                          setShowDatePicker(false);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Filtrar
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
                </div>
              </div>
            </div>

          {/* Events Grid */}
          <div className="p-6">
            {(eventsLoading || upcomingLoading) ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-32 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded flex-1"></div>
                        <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !filteredEvents || filteredEvents.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay eventos próximos</h3>
                <p className="text-gray-600 text-sm">
                  {canCreateEvent ? 'Crea tu primer evento para empezar' : 'Este canal aún no tiene eventos programados'}
                </p>
              </div>
            ) : (
              // Events grid - 3 cards per row filling entire width
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event: any) => (
                  <ChannelEventCard
                    key={event.id}
                    event={event}
                    currentUserId={currentUserId}
                    isOwner={isOwner}
                    onView={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}