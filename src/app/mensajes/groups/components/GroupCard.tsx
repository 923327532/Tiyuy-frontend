// COMPONENTES DE GRUPOS - Arquitectura Hexagonal
// Este archivo pertenece al módulo de GRUPOS (Presentation Layer - Componentes UI)

'use client';

import { Group } from '@/core/domain/entities/Group';
import { useGroups } from '@/presentation/hooks/useGroups';
import { Users, MessageCircle, Calendar, UserPlus, UserMinus } from 'lucide-react';
import { EntityIcon } from '@/utils/entityIcons';

interface GrupoCardProps {
  grupo: Group;
  currentUserId?: number;
}

export function GrupoCard({ grupo, currentUserId }: GrupoCardProps) {
  const { joinGroup, leaveGroup, isJoining, isLeaving } = useGroups(currentUserId);

  const handleJoinLeave = () => {
    if (grupo.isUserMember) {
      leaveGroup(grupo.id);
    } else {
      joinGroup(grupo.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-gray-600';
      case 'INACTIVE': return 'text-gray-500';
      case 'ARCHIVED': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'INACTIVE': return 'Inactivo';
      case 'ARCHIVED': return 'Archivado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brand/30 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header del grupo */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icono del grupo */}
        <div className="w-14 h-14 rounded-xl bg-brand flex items-center justify-center flex-shrink-0 shadow-sm">
          <EntityIcon name={grupo.name} className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {grupo.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {grupo.description}
          </p>
        </div>
        
        {/* Badge de estado */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(grupo.status)} bg-opacity-10 ${getStatusColor(grupo.status).replace('text', 'bg')}`}>
          {getStatusText(grupo.status)}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center text-blue-600 mb-1">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-lg font-semibold text-gray-900">{grupo.memberCount}</div>
          <div className="text-xs text-gray-500">Miembros</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-600 mb-1">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-lg font-semibold text-gray-900">{grupo.postCount}</div>
          <div className="text-xs text-gray-500">Publicaciones</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-purple-600 mb-1">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date(grupo.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
          </div>
          <div className="text-xs text-gray-500">Creado</div>
        </div>
      </div>

      {/* Rol del usuario */}
      {grupo.isUserMember && grupo.userRole && (
        <div className="mb-4">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            {grupo.userRole === 'ADMIN' && 'Administrador'}
            {grupo.userRole === 'MODERATOR' && 'Moderador'}
            {grupo.userRole === 'MEMBER' && 'Miembro'}
          </div>
        </div>
      )}

      {/* Botón de acción */}
      <button
        onClick={handleJoinLeave}
        disabled={isJoining || isLeaving}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
          grupo.isUserMember
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
            : 'bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50'
        }`}
      >
        {isJoining || isLeaving ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent animate-spin" />
        ) : grupo.isUserMember ? (
          <>
            <UserMinus className="w-4 h-4" />
            Abandonar grupo
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Unirse al grupo
          </>
        )}
      </button>

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: #{grupo.id}</span>
          <span>Actualizado: {new Date(grupo.updatedAt).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
    </div>
  );
}
