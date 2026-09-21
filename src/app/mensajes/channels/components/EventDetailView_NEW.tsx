'use client';

import React from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Trash2, Check, X } from 'lucide-react';
import { 
  useGetChannelEventAttendees, 
  useRsvpChannelEvent, 
  useCancelRsvpChannelEvent 
} from '@/presentation/hooks/useContacts';

interface EventDetailViewProps {
  event: any;
  channelId: number;
  currentUserId: number;
  isOwner: boolean;
  onBack: () => void;
}

export default function EventDetailView({ 
  event, 
  channelId, 
  currentUserId, 
  isOwner, 
  onBack 
}: EventDetailViewProps) {
  const { data: attendees, isLoading: attendeesLoading } = useGetChannelEventAttendees(channelId, event.id);
  const rsvpMutation = useRsvpChannelEvent(channelId);
  const cancelRsvpMutation = useCancelRsvpChannelEvent(channelId);

  const isRsvped = event.userResponseStatus === 'ATTENDING';

  const handleRsvp = async () => {
    try {
      await rsvpMutation.mutateAsync(event.id);
    } catch (error) {
      console.error('Error RSVPing to event:', error);
    }
  };

  const handleCancelRsvp = async () => {
    try {
      await cancelRsvpMutation.mutateAsync(event.id);
    } catch (error) {
      console.error('Error canceling RSVP:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Detalle del evento</h2>
            <p className="text-sm text-gray-500">{event.channelName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Event Cover */}
        <div className="relative h-48 bg-brand rounded-xl mb-6 overflow-hidden">
          {event.coverImageUrl ? (
            <img 
              src={event.coverImageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        {/* Event Title and Date */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(event.startDateTime)}
            </div>
            {event.location?.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location.address}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Location Details */}
        {event.location && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubicación</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{event.location.name || 'Lugar del evento'}</p>
              <p className="text-gray-600">{event.location.address}</p>
              {event.location.city && (
                <p className="text-sm text-gray-500">{event.location.city}</p>
              )}
            </div>
          </div>
        )}

        {/* Capacity */}
        {event.maxAttendees && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Capacidad</h3>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">
                {event.attendeeCount || 0} / {event.maxAttendees} asistentes
              </span>
            </div>
          </div>
        )}

        {/* Attendees */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lista de asistentes ({attendees?.length || 0})
          </h3>
          {attendeesLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>
          ) : attendees && attendees.length > 0 ? (
            <div className="space-y-2">
              {attendees.map((attendee: any) => (
                <div key={attendee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold">
                    {attendee.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {attendee.firstName} {attendee.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{attendee.email}</p>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Confirmado
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay asistentes confirmados aún
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isOwner && (
            <button
              onClick={isRsvped ? handleCancelRsvp : handleRsvp}
              disabled={rsvpMutation.isPending || cancelRsvpMutation.isPending}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                isRsvped
                  ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  : 'bg-brand text-white hover:opacity-90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {rsvpMutation.isPending || cancelRsvpMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
              ) : isRsvped ? (
                <>
                  <X className="w-4 h-4" />
                  Cancelar asistencia
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirmar asistencia
                </>
              )}
            </button>
          )}

          {isOwner && (
            <button
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar evento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
