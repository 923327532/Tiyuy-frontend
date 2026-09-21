// COMPONENTES DE GRUPOS - Arquitectura Hexagonal
// Este archivo pertenece al módulo de GRUPOS (Presentation Layer - Componentes UI)

'use client';

import React, { useState } from 'react';
import { GroupPost } from '@/core/domain/entities/GroupPost';
import { Heart, MessageCircle, Share2, Eye, Pin, MoreVertical } from 'lucide-react';

interface GrupoPostCardProps {
  post: GroupPost;
  currentUserId?: number;
  onComment?: (post: GroupPost) => void;
  onShare?: (post: GroupPost) => void;
  onEdit?: (post: GroupPost) => void;
  onDelete?: (postId: number) => void;
}

export function GrupoPostCard({ 
  post, 
  currentUserId, 
  onComment, 
  onShare, 
  onEdit, 
  onDelete 
}: GrupoPostCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleComment = () => {
    onComment?.(post);
  };

  const handleShare = () => {
    onShare?.(post);
  };

  const handleEdit = () => {
    onEdit?.(post);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    onDelete?.(post.id);
    setShowDropdown(false);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
      style={{ 
        backgroundColor: post.backgroundColor || '#ffffff',
        borderColor: post.borderStyle === 'none' ? undefined : post.textColor || '#000000',
        borderStyle: post.borderStyle === 'dashed' ? 'dashed' : 'solid',
        borderWidth: post.borderStyle === 'none' ? undefined : '2px'
      }}
    >
      {/* Header del post */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-semibold">
            {post.userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{post.userName || 'Usuario'}</span>
              {post.isPinned && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  Fijado
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {post.timeAgo}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {post.isPinned && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
              <Pin className="w-3 h-3" />
              Fijado
            </div>
          )}
          
          {/* Dropdown de acciones */}
          {post.canEdit && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {post.canEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Editar
                    </button>
                  )}
                  {post.canDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenido del post */}
      <div className="mb-3">
        <p 
          className={`text-gray-900 whitespace-pre-wrap break-words ${
            post.fontStyle === 'bold' ? 'font-bold' : 
            post.fontStyle === 'italic' ? 'italic' : ''
          }`}
          style={{ color: post.textColor || '#000000' }}
        >
          {post.content}
        </p>
      </div>

      {/* Imágenes */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mb-3">
          <div className={`
            grid gap-2
            ${post.imageUrls.length === 1 ? 'grid-cols-1' : ''}
            ${post.imageUrls.length === 2 ? 'grid-cols-2' : ''}
            ${post.imageUrls.length >= 3 ? 'grid-cols-3' : ''}
          `}>
            {post.imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                {post.imageUrls.length > 3 && index === 2 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{post.imageUrls.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estilo del post */}
      {post.postStyle !== 'default' && (
        <div className="mb-3">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
            Estilo: {post.postStyle}
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span>{post.likeCount}</span>
        <span>{post.commentCount}</span>
        <span>{post.shareCount}</span>
        <span>{post.viewCount}</span>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => {/* TODO: Implementar like */}}
          className={`flex-1 py-2 px-3 rounded-lg transition-colors font-medium ${
            post.hasUserLiked 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-4 h-4 inline mr-1 ${post.hasUserLiked ? 'fill-current' : ''}`} />
          Like
        </button>
        <button
          onClick={handleComment}
          className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          <MessageCircle className="w-4 h-4 inline mr-1" />
          Comentar
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          <Share2 className="w-4 h-4 inline mr-1" />
          Compartir
        </button>
      </div>

      {/* Expiración */}
      {post.expiresAt && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            Este post expira el {new Date(post.expiresAt).toLocaleDateString('es-ES')}
          </div>
        </div>
      )}
    </div>
  );
}
