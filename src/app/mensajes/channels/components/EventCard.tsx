'use client';

import React from 'react';
import { Star, Share2, MoreHorizontal } from 'lucide-react';

interface EventCardProps {
  event: any;
  onEventSelect: (event: any) => void;
  onResponse: (eventId: number, responseStatus: string) => void;
}

export default function EventCard({ event, onEventSelect, onResponse }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const isInterested = event.userResponseStatus === 'INTERESTED';
  const isAttending = event.userResponseStatus === 'ATTENDING';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
      {/* Cover Image */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        {event.coverImageUrl ? (
          <img 
            src={event.coverImageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
            onClick={() => onEventSelect(event)}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            onClick={() => onEventSelect(event)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-white">
                  {new Date(event.startDateTime).getDate()}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {new Date(event.startDateTime).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        
        {/* More options button */}
        <button 
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Show more options menu
          }}
        >
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Date */}
        <div className="text-xs font-semibold text-brand mb-2">
          {formatDate(event.startDateTime)}
        </div>

        {/* Title */}
        <h3 
          className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-5 cursor-pointer hover:text-brand transition-colors"
          onClick={() => onEventSelect(event)}
        >
          {event.title}
        </h3>

        {/* Location */}
        <div className="text-xs text-gray-500 mb-3 line-clamp-1">
          {event.location?.address || 'Ubicación por confirmar'}
        </div>

        {/* Attendees */}
        <div className="text-xs text-gray-400 mb-3">
          {event.interestedCount} interesados · {event.attendeeCount} asistirán
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResponse(event.id, isInterested ? 'NOT_INTERESTED' : 'INTERESTED');
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
              isInterested
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Star className="w-3 h-3" />
            {isInterested ? 'Interesado' : 'Me interesa'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement share functionality
            }}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-3 h-3" />
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
}
