'use client';

import React from 'react';
import { MapPin, Calendar, Users, Star, Share2, MoreHorizontal } from 'lucide-react';
import { useRespondToEvent } from '@/presentation/hooks/useContacts';

interface ChannelEventCardProps {
  event: any;
  currentUserId: number;
  isOwner: boolean;
  onDelete?: () => void;
  onRsvp?: () => void;
  onCancelRsvp?: () => void;
  onView?: () => void;
}

export default function ChannelEventCard({ 
  event, 
  currentUserId, 
  isOwner, 
  onDelete, 
  onRsvp, 
  onCancelRsvp, 
  onView 
}: ChannelEventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
  };

  const isRsvped = event.userResponseStatus === 'ATTENDING';

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onView}
    >
      {/* Cover Image */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        {(event.coverImageUrl || (event.imageUrls && event.imageUrls.length > 0)) ? (
          <img 
            src={event.coverImageUrl || event.imageUrls[0]} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-white">
                  {event.startDateTime ? new Date(event.startDateTime).getDate() : '--'}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {event.startDateTime ? new Date(event.startDateTime).toLocaleDateString('es-PE', { month: 'short' }).toUpperCase() : '---'}
              </span>
            </div>
          </div>
        )}
        
        {/* More options button */}
        {isOwner && (
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Date */}
        <div className="text-xs font-semibold text-brand mb-2">
          {event.startDateTime ? formatDate(event.startDateTime) : 'Fecha no disponible'}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-5">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Location */}
        <div className="text-xs text-gray-500 mb-3 line-clamp-1">
          {event.address || event.city || 'Ubicación por confirmar'}
        </div>

        {/* Attendees */}
        <div className="text-xs text-gray-400 mb-3">
          {event.attendeeCount || 0} asistentes confirmados
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isRsvped) {
                onCancelRsvp?.();
              } else {
                onRsvp?.();
              }
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
              isRsvped
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-3 h-3" />
            {isRsvped ? 'Cancelar asistencia' : 'Asistiré'}
          </button>
          
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
