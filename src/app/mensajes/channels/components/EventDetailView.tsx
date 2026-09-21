'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Calendar, Check, ChevronRight, Clock, Globe, Heart, MapPin, MessageCircle, MessageSquare, Search, Share2, Ticket, Users, X } from 'lucide-react';;
import { axiosClient } from '@/infrastructure/api/axios-client';
import { useGetChannelEventAttendees, useRsvpChannelEvent, useCancelRsvpChannelEvent,useInterestedChannelEvent,useChannelSubscribers,useGetChannelEvent,useSubscribeToChannel} from '@/presentation/hooks/useContacts';

interface EventDetailViewProps {
  event: any;
  channelId: number;
  currentUserId: number;
  isOwner: boolean;
  onBack: () => void;
  isEditMode?: boolean;
}

export default function EventDetailView({ 
  event: initialEvent, 
  channelId, 
  currentUserId, 
  isOwner, 
  onBack,
  isEditMode = false 
}: EventDetailViewProps) {
  const router = useRouter();
  const { data: freshEvent } = useGetChannelEvent(channelId, initialEvent.id);
  const event = freshEvent || initialEvent;
  const { data: attendees, isLoading: attendeesLoading } = useGetChannelEventAttendees(channelId, event.id);
  const rsvpMutation = useRsvpChannelEvent(channelId);
  const cancelRsvpMutation = useCancelRsvpChannelEvent(channelId);
  const interestedMutation = useInterestedChannelEvent(channelId);
  const subscribeMutation = useSubscribeToChannel();
  const { data: subscribers } = useChannelSubscribers(channelId);
  const [invitedUsers, setInvitedUsers] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'info' | 'conversation'>('info');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isRsvped = event.userResponseStatus === 'ATTENDING';
  const isInterested = event.userResponseStatus === 'INTERESTED';
  
  // Check if user is already a subscriber
  const isSubscribed = subscribers?.some((sub: any) => sub.userId === currentUserId) ?? false;
  console.log(' Debug - isSubscribed:', isSubscribed, 'subscribers:', subscribers, 'currentUserId:', currentUserId);

  const handleInvite = (userId: number, userName: string) => {
    setInvitedUsers(prev => new Set(prev).add(userId));
    toast.success(`Invitación enviada a ${userName}`);
  };

  // Search state for invitees
  const [inviteeSearchQuery, setInviteeSearchQuery] = useState('');

  // Get all potential invitees (not filtered by invited status to keep section visible)
  const allPotentialInvitees = subscribers?.filter((sub: any) => 
    sub.userId !== currentUserId && 
    !attendees?.some((a: any) => a.userId === sub.userId)
  ) || [];

  // Filter by search query and limit to show more
  const potentialInvitees = allPotentialInvitees
    .filter((user: any) => 
      user.userName?.toLowerCase().includes(inviteeSearchQuery.toLowerCase())
    )
    .slice(0, 3); // Show at least 3

  const handleMessageOrganizer = () => {
    // Get organizer info from event - backend now returns creatorPhone
    const organizerPhone = event.creatorPhone;
    const organizerName = event.creatorName || event.channelName || 'Organizador';
    const organizerId = event.creatorId;
    
    console.log(' Redirigiendo a mensajes:', { organizerPhone, organizerName, organizerId });
    
    if (organizerPhone && organizerId) {
      // Store data in localStorage for reliable passing
      localStorage.setItem('chat_with_organizer', JSON.stringify({
        userId: organizerId,
        name: organizerName,
        phone: organizerPhone,
        timestamp: Date.now()
      }));
      
      // Force navigation using window.location (more reliable than router.push)
      window.location.href = '/dashboard/my-contacts';
    } else {
      toast.info('Información del organizador no disponible');
    }
  };

  const handleRsvp = async () => {
    const doRsvp = async () => {
      console.log(' Intentando RSVP...', event.id);
      await rsvpMutation.mutateAsync(event.id);
      console.log(' RSVP exitoso');
    };

    const doSubscribe = async () => {
      console.log(' Suscribiendo al canal...', channelId);
      try {
        await axiosClient.post(`/contacts/extended/channels/${channelId}/subscribe`);
        console.log(' Suscripción exitosa');
      } catch (subError: any) {
        // If already subscribed, that's fine
        console.log('️ Subscribe result:', subError.response?.data?.message || 'Unknown');
      }
    };

    try {
      // Try RSVP first - might work if already subscribed
      await doRsvp();
    } catch (rsvpError: any) {
      console.log('️ RSVP failed:', rsvpError.response?.data?.message || rsvpError.message);
      
      // If not subscribed error, subscribe and retry
      if (rsvpError.response?.data?.message?.includes('must be subscribed') || 
          rsvpError.response?.status === 403) {
        console.log(' Suscripción necesaria, intentando...');
        
        try {
          await doSubscribe();
          // Wait for backend to process
          await new Promise(resolve => setTimeout(resolve, 1500));
          // Retry RSVP
          await doRsvp();
        } catch (retryError: any) {
          console.error(' Error en retry:', retryError);
          toast.error(retryError.response?.data?.message || 'Error al confirmar asistencia');
        }
      } else {
        // Other error, show it
        toast.error(rsvpError.response?.data?.message || 'Error al confirmar asistencia');
      }
    }
  };

  const handleCancelRsvp = async () => {
    try {
      await cancelRsvpMutation.mutateAsync(event.id);
    } catch (error) {
      console.error('Error canceling RSVP:', error);
    }
  };

  const handleInterested = async () => {
    const doInterested = async () => {
      console.log(' Intentando registrar interés...', event.id);
      await interestedMutation.mutateAsync(event.id);
      console.log(' Interés registrado');
    };

    const doSubscribe = async () => {
      console.log(' Suscribiendo al canal...', channelId);
      try {
        await axiosClient.post(`/contacts/extended/channels/${channelId}/subscribe`);
        console.log(' Suscripción exitosa');
      } catch (subError: any) {
        console.log('️ Subscribe result:', subError.response?.data?.message || 'Unknown');
      }
    };

    try {
      // Try interested first - might work if already subscribed
      await doInterested();
    } catch (interestedError: any) {
      console.log('️ Interested failed:', interestedError.response?.data?.message || interestedError.message);
      
      // If not subscribed error, subscribe and retry
      if (interestedError.response?.data?.message?.includes('must be subscribed') || 
          interestedError.response?.status === 403) {
        console.log(' Suscripción necesaria, intentando...');
        
        try {
          await doSubscribe();
          // Wait for backend to process
          await new Promise(resolve => setTimeout(resolve, 1500));
          // Retry interested
          await doInterested();
        } catch (retryError: any) {
          console.error(' Error en retry:', retryError);
          toast.error(retryError.response?.data?.message || 'Error al registrar interés');
        }
      } else {
        // Other error, show it
        toast.error(interestedError.response?.data?.message || 'Error al registrar interés');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      weekday: date.toLocaleDateString('es-PE', { weekday: 'long' }),
      day: date.getDate(),
      month: date.toLocaleDateString('es-PE', { month: 'short' }).toUpperCase(),
      fullMonth: date.toLocaleDateString('es-PE', { month: 'long' }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('es-PE', { 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
      })
    };
  };

  const startDate = formatDate(event.startDateTime);
  const endDate = event.endDateTime ? formatDate(event.endDateTime) : null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/public/view/event/${channelId}/${event.id}`
    : '';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ 
        title: event.title, 
        text: `Mira este evento: ${event.title}`, 
        url: shareUrl 
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado al portapapeles');
    }
  };

  const maxDescriptionLength = 300;
  const shouldTruncate = event.description && event.description.length > maxDescriptionLength;
  const displayDescription = shouldTruncate && !showFullDescription 
    ? event.description.substring(0, maxDescriptionLength) + '...'
    : event.description;

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 z-20 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-900">
            {isEditMode ? 'Editando Evento' : 'Evento'}
          </h2>
          {isEditMode && (
            <p className="text-xs text-gray-500">Modo edición activado</p>
          )}
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-gray-200">
        {event.coverImageUrl || (event.imageUrls && event.imageUrls.length > 0) ? (
          <img 
            src={event.coverImageUrl || event.imageUrls[0]} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand flex items-center justify-center">
            <Calendar className="w-24 h-24 text-white/50" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* LEFT COLUMN */}
          <div className="flex-1">
            {/* Title Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-red-500 rounded-lg flex flex-col items-center justify-center text-white">
                  <span className="text-xs font-semibold">{startDate.month}</span>
                  <span className="text-2xl font-bold leading-none">{startDate.day}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-1">
                    {event.title}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {startDate.weekday.charAt(0).toUpperCase() + startDate.weekday.slice(1)}, {startDate.day} de {startDate.fullMonth} de {startDate.year} a las {startDate.time}
                    {endDate && ` - Termina: ${endDate.weekday} ${endDate.time}`}
                  </p>
                  {event.location?.address && (
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {event.location.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {!isOwner && (
                  <>
                    <button
                      onClick={isRsvped ? handleCancelRsvp : handleRsvp}
                      disabled={rsvpMutation.isPending}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        isRsvped
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-brand text-white hover:opacity-90'
                      }`}
                    >
                      {isRsvped ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      {isRsvped ? 'Asistiendo' : 'Asistiré'}
                    </button>
                    
                    <button
                      onClick={handleInterested}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        isInterested
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInterested ? 'fill-yellow-600' : ''}`} />
                      {isInterested ? 'Interesado' : 'Me interesa'}
                    </button>
                  </>
                )}
                
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'text-brand border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Información
                </button>
                <button
                  onClick={() => setActiveTab('conversation')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'conversation'
                      ? 'text-brand border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Conversación
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'info' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">{event.attendeeCount || 0}</span>
                      <span>personas respondieron</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{event.interestedCount || 0} interesados</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Ticket className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Evento de {event.eventType?.replace(/_/g, ' ') || 'Tiyuy'}</p>
                        <p className="text-sm text-gray-500">Tipo de evento</p>
                      </div>
                    </div>

                    {event.location?.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.location.address}</p>
                          <p className="text-sm text-gray-500">
                            {event.location.city}{event.location.country && `, ${event.location.country}`}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.visibility === 'PUBLIC' ? 'Público' : 'Privado'}</p>
                        <p className="text-sm text-gray-500">{event.visibility === 'PUBLIC' ? 'Cualquiera puede ver y asistir' : 'Solo invitados pueden ver'}</p>
                      </div>
                    </div>

                    {event.description && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed">
                          {displayDescription}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-brand font-medium text-sm mt-2 hover:underline"
                          >
                            {showFullDescription ? 'Ver menos' : 'Ver más'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Conversación del evento</p>
                    <p className="text-sm text-gray-400 mt-1">Próximamente...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Conoce al organizador</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {event.channelName?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-lg">{event.channelName}</p>
                  <p className="text-sm text-gray-500">Organización de eventos</p>
                </div>
                <button 
                  onClick={handleMessageOrganizer}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Mensaje
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[380px] space-y-4">
            {/* Google Maps - Show if location exists */}
            {(event.location?.latitude && event.location?.longitude) || event.location?.address ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-[200px] bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={event.location?.latitude && event.location?.longitude 
                      ? `https://maps.google.com/maps?q=${event.location.latitude},${event.location.longitude}&z=15&output=embed`
                      : `https://maps.google.com/maps?q=${encodeURIComponent(event.location?.address || '')}&z=15&output=embed`
                    }
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900">{event.location?.address}</p>
                  <p className="text-sm text-gray-500">
                    {event.location?.city}{event.location?.country && `, ${event.location?.country}`}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Invitados</h3>
                <button className="text-brand text-sm hover:underline">Ver todo</button>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Asistirán</span>
                </div>
                <span className="font-semibold text-gray-900">{event.attendeeCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-gray-700">Interesados</span>
                </div>
                <span className="font-semibold text-gray-900">{event.interestedCount || 0}</span>
              </div>
            </div>

            {/* Invite Friends Section - Dynamic */}
            {allPotentialInvitees.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Invita a tus amigos</h3>
                
                {/* Search input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={inviteeSearchQuery}
                    onChange={(e) => setInviteeSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pl-9 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                
                <div className="space-y-3">
                  {potentialInvitees.length > 0 ? (
                    potentialInvitees.map((user: any, index: number) => (
                      <div key={`invitee-${user.userId || index}-${index}`} className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold">
                            {user.userName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{user.userName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.contactType || 'Contacto'}</p>
                        </div>
                        <button 
                          onClick={() => handleInvite(user.userId, user.userName)}
                          disabled={invitedUsers.has(user.userId)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            invitedUsers.has(user.userId)
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-brand/20 text-brand-dark hover:bg-blue-200'
                          }`}
                        >
                          {invitedUsers.has(user.userId) ? 'Invitado' : 'Invitar'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">No se encontraron contactos</p>
                  )}
                </div>
                {subscribers && subscribers.length > 3 && (
                  <button className="w-full text-center text-brand text-sm py-2 mt-3 hover:underline">
                    Ver más contactos
                  </button>
                )}
              </div>
            )}

            {attendees && attendees.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Asistentes confirmados</h3>
                <div className="space-y-3">
                  {attendees.slice(0, 5).map((attendee: any) => (
                    <div key={attendee.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold">
                        {attendee.userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{attendee.userName}</p>
                      </div>
                      <button 
                        onClick={() => handleInvite(attendee.userId, attendee.userName)}
                        disabled={invitedUsers.has(attendee.userId)}
                        className={`text-sm hover:underline ${
                          invitedUsers.has(attendee.userId) ? 'text-gray-400' : 'text-brand'
                        }`}
                      >
                        {invitedUsers.has(attendee.userId) ? 'Invitado' : 'Invitar'}
                      </button>
                    </div>
                  ))}
                  {attendees.length > 5 && (
                    <button className="w-full text-center text-brand text-sm py-2 hover:underline">
                      Ver {attendees.length - 5} más
                    </button>
                  )}
                </div>
              </div>
            )}

            {event.imageUrls && event.imageUrls.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Galería</h3>
                <div className="grid grid-cols-2 gap-2">
                  {event.imageUrls.slice(1, 5).map((url: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Imagen ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                  {event.imageUrls.length > 5 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">+{event.imageUrls.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
