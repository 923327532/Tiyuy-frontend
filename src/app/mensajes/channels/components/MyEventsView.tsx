'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, ChevronDown, X, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useGetChannels, useGetMyCreatedEvents } from '@/presentation/hooks/useContacts';
import CreateEventModal from './CreateEventModal';
import { useQueryClient } from '@tanstack/react-query';

interface MisEventosViewProps {
  user: any;
  onEventSelect?: (event: any, channel: any) => void;
  onCreateEvent?: () => void; // For Agents and Inmobiliarias
}

export default function MisEventosView({ user, onEventSelect, onCreateEvent }: MisEventosViewProps) {
  const { data: myCreatedEvents, isLoading: eventsLoading } = useGetMyCreatedEvents(user?.id);
  const { data: userChannels } = useGetChannels(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'todos' | 'proximos' | 'pasados' | 'suscritos'>('todos');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const queryClient = useQueryClient();

  // Check if user can create events (Agents and Inmobiliarias)
  const canCreateEvent = user?.role === 'AGENT' || user?.role === 'INMOBILIARIA';
  
  // Get first channel ID for creating events
  const firstChannelId = userChannels?.[0]?.id || 1;
  // Filter events
  const getFilteredEvents = () => {
    let filtered = myCreatedEvents || [];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((event: any) => 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.channelName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    const now = new Date();
    switch (activeFilter) {
      case 'proximos':
        filtered = filtered.filter((event: any) => new Date(event.startDateTime) > now);
        break;
      case 'pasados':
        filtered = filtered.filter((event: any) => new Date(event.startDateTime) <= now);
        break;
      // 'todos' no filter
    }
    
    // Sort by date (upcoming first)
    return filtered.sort((a: any, b: any) => 
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );
  };

  const filteredEvents = getFilteredEvents();
  
  const getEventStatusColor = (event: any) => {
    const now = new Date();
    const eventDate = new Date(event.startDateTime);
    
    if (eventDate > now) {
      return 'bg-brand/20 text-brand-dark';
    } else {
      return 'bg-gray-100 text-gray-700';
    }
  };

  const getEventStatusText = (event: any) => {
    const now = new Date();
    const eventDate = new Date(event.startDateTime);
    
    if (eventDate > now) {
      return 'Próximo';
    } else {
      return 'Finalizado';
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  const getEventEmoji = (eventType: string) => {
    const emojis: Record<string, string> = {
      'MEETING': '',
      'CONFERENCE': '',
      'WORKSHOP': '️',
      'SOCIAL': '',
      'WEBINAR': '',
    };
    return emojis[eventType] || '';
  };

  if (eventsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Cargando tus eventos...</p>
        </div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No has creado eventos</h3>
          <p className="text-gray-500 text-sm mb-6">
            {canCreateEvent 
              ? "Comienza creando tu primer evento para compartir con tus seguidores."
              : "No tienes eventos creados. Los agentes e inmobiliarias pueden crear eventos."
            }
          </p>
          {canCreateEvent && onCreateEvent && (
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand-dark transition-colors mx-auto"
            >
              <Calendar className="w-5 h-5" />
              Crear evento
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Mis Eventos Creados</h2>
          {/* Botón de prueba */}
          <button
            onClick={() => console.log('Botón de prueba clicked')}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
          >
            BOTÓN PRUEBA
          </button>
          {canCreateEvent && (
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Crear Evento
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm">
          Eventos que has creado en tus canales. Gestiona tus eventos y ve quién participa.
          {canCreateEvent && " Como profesional, puedes crear nuevos eventos para tu audiencia."}
        </p>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        channelId={firstChannelId}
        onSuccess={() => {
          setShowCreateEventModal(false);
          // Refrescar eventos del usuario
          queryClient.invalidateQueries({ queryKey: ['my-created-events', user?.id] });
        }}
      />

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar mis eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 flex-1 focus:outline-none"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              {activeFilter === 'todos' && 'Todos'}
              {activeFilter === 'proximos' && 'Próximos'}
              {activeFilter === 'pasados' && 'Pasados'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => { setActiveFilter('todos'); setShowFilterDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  activeFilter === 'todos' ? 'bg-brand/10 text-brand-dark' : 'text-gray-700'
                }`}
              >
                Todos los eventos
              </button>
              <button
                onClick={() => { setActiveFilter('proximos'); setShowFilterDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  activeFilter === 'proximos' ? 'bg-brand/10 text-brand-dark' : 'text-gray-700'
                }`}
              >
                Eventos próximos
              </button>
              <button
                onClick={() => { setActiveFilter('pasados'); setShowFilterDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  activeFilter === 'pasados' ? 'bg-brand/10 text-brand-dark' : 'text-gray-700'
                }`}
              >
                Eventos pasados
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event: any) => (
          <div
            key={`${event.channelId}-${event.id}`}
            onClick={() => onEventSelect?.(event, { id: event.channelId, name: event.channelName })}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Event Header */}
            <div className="flex items-start gap-4">
              {/* Event Type Icon */}
              <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{getEventEmoji(event.eventType)}</span>
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                {/* Event Title and Status */}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event)}`}>
                    {getEventStatusText(event)}
                  </span>
                    {event.userResponseStatus && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {event.userResponseStatus === 'ATTENDING' ? 'Asistiré' : 'Interesado'}
                      </span>
                    )}
                </div>

                {/* Channel Name */}
                <p className="text-sm text-gray-600 mb-2">
                   {event.channelName} {event.channelCity && ` ${event.channelCity}`}
                </p>

                {/* Description */}
                {event.description && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>
                )}

                {/* Event Details */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatEventDate(event.startDateTime)}
                  </div>
                  {event.location?.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location.address.length > 30 
                        ? `${event.location.address.substring(0, 30)}...`
                        : event.location.address
                      }
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.attendeeCount || 0} asistentes
                  </div>
                </div>

                {activeFilter === 'pasados' && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">️ Eventos pasados</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Eventos que ya finalizaron. ¡Gracias por participar!
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Finalizados:</strong> {getFilteredEvents().length} eventos
                      </p>
                    </div>
                  </div>
                )}
                
                {activeFilter === 'suscritos' && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      ⭐ Eventos suscritos
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {getFilteredEvents().length} activos
                      </span>
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Eventos donde estás suscrito y participando activamente.
                    </p>
                    <div className="space-y-3">
                      {getFilteredEvents().slice(0, 3).map((event: any, index: number) => (
                        <div key={`${event.channelId}-${event.id}-${index}`} className="bg-white rounded-lg border border-gray-200 p-4">
                          <h5 className="font-medium text-gray-900 mb-1">{event.title}</h5>
                          <p className="text-sm text-gray-600">
                            {formatEventDate(event.startDateTime)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para dar like al evento
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="w-3 h-3" />
                    {event.likeCount || 0}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para comentar
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {event.commentCount || 0}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para compartir
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
