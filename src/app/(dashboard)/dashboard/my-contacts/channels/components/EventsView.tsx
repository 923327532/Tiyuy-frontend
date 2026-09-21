'use client';

import React, { useState } from 'react';
import { Search, Home, User, Bell, Plus, MapPin, Calendar, Users, Star, Share2, ChevronDown, Pin, Check, Mail, MoreHorizontal, Menu, X } from 'lucide-react';
import { useChannelEvents, useChannelUpcomingEvents, useRespondToEvent, useChannelSubscribers } from '@/presentation/hooks/useContacts';
import EventCard from './EventCard';

interface EventsViewProps {
  channelId: number;
  channelName: string;
  currentUser: any;
  onEventSelect: (event: any) => void;
  onCreateEvent: () => void;
}

export default function EventsView({ 
  channelId, 
  channelName, 
  currentUser,
  onEventSelect,
  onCreateEvent 
}: EventsViewProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'following' | 'featured'>('upcoming');
  const [showUserEventsDropdown, setShowUserEventsDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Queries
  const { data: events, isLoading: eventsLoading } = useChannelEvents(channelId);
  const { data: upcomingEvents, isLoading: upcomingLoading } = useChannelUpcomingEvents(channelId);
  const { data: recommendedEvents } = useChannelUpcomingEvents(channelId);
  const { data: subscribers } = useChannelSubscribers(channelId);
  const respondToEvent = useRespondToEvent(channelId);

  const canCreateEvent = currentUser?.role === 'AGENT' || currentUser?.role === 'INMOBILIARIA';
  
  // Filter events based on active filter
  const getFilteredEvents = () => {
    const baseEvents = activeFilter === 'upcoming' ? upcomingEvents : events;
    if (!baseEvents) return [];
    
    let filtered = baseEvents;
    
    if (selectedCategory) {
      filtered = filtered.filter((event: any) => event.eventType === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter((event: any) => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleEventResponse = (eventId: number, responseStatus: string) => {
    respondToEvent.mutate({ eventId, responseStatus });
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
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Home className="w-4 h-4" />
            Inicio
          </button>

          {/* Tus eventos dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserEventsDropdown(!showUserEventsDropdown)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <User className="w-4 h-4" />
              Tus eventos
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showUserEventsDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showUserEventsDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                  Próximos
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                  Guardados
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                  Pasados
                </button>
              </div>
            )}
          </div>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Bell className="w-4 h-4" />
            Notificaciones
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
                  onClick={() => onEventSelect(event)}
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
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
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
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Descubrir eventos</h2>
            
            {/* Filtros */}
            <div className="flex items-center gap-3 flex-wrap">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200">
                <Pin className="w-4 h-4" />
                Mi ubicación
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200">
                <Calendar className="w-4 h-4" />
                Cualquier fecha
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {['Destacados', 'Próximos', 'Siguiendo'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter.toLowerCase() as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.toLowerCase()
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="p-6">
            {(eventsLoading || upcomingLoading) ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
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
              // Events grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                {filteredEvents.map((event: any) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEventSelect={onEventSelect}
                    onResponse={handleEventResponse}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
