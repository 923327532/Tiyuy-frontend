'use client';

import React from 'react';
import { useChannels } from '@/presentation/hooks/useChannels';
import { Users, MessageCircle, Calendar, UserPlus, UserMinus, Bell, BellOff } from 'lucide-react';
import { EntityIcon } from '@/utils/entityIcons';

interface ChannelCardProps {
  channel: any;
  currentUserId?: number;
}

export function ChannelCard({ channel, currentUserId }: ChannelCardProps) {
  const { subscribeToChannel, unsubscribeFromChannel, isSubscribing, isUnsubscribing } = useChannels(currentUserId);

  const handleSubscribeUnsubscribe = () => {
    if (channel.isSubscribed) {
      unsubscribeFromChannel(channel.id);
    } else {
      subscribeToChannel(channel.id);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-gray-500';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Activo' : 'Inactivo';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PUBLIC': return 'text-blue-600';
      case 'PRIVATE': return 'text-purple-600';
      default: return 'text-gray-500';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PUBLIC': return 'Publico';
      case 'PRIVATE': return 'Privado';
      default: return 'Desconocido';
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header del canal */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {channel.name}
            </h3>
            {/* Badge de tipo de canal */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              channel.isPublic 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
            }`}>
              {channel.isPublic ? '🌐 Público' : '🔒 Privado'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{channel.city}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center flex-shrink-0 shadow-sm">
          <EntityIcon name={channel.name} className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Estadisticas */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{channel.subscriberCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Suscriptores</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-green-600 dark:text-green-400 mb-1">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{channel.postsPerDay || 0}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Posts/dia</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {new Date(channel.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Creado</div>
        </div>
      </div>

      {/* Rol del usuario */}
      {channel.isSubscribed && (
        <div className="mb-4">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
            {channel.isAdmin ? 'Administrador' : 'Suscriptor'}
          </div>
        </div>
      )}

      {/* Boton de accion */}
      <button
        onClick={handleSubscribeUnsubscribe}
        disabled={isSubscribing || isUnsubscribing}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
          channel.isSubscribed
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50'
            : 'bg-blue-600 text-white hover:opacity-90 disabled:opacity-50'
        }`}
      >
        {isSubscribing || isUnsubscribing ? (
          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-500 border-t-transparent animate-spin" />
        ) : channel.isSubscribed ? (
          <>
            <UserMinus className="w-4 h-4" />
            Cancelar suscripcion
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Suscribirse
          </>
        )}
      </button>

      {/* Informacion adicional */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>ID: #{channel.id}</span>
          <span>Actualizado: {new Date(channel.updatedAt).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
    </div>
  );
}
