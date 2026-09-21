'use client';

import React from 'react';
import { Heart, MessageCircle, Share2, Clock, Eye, MoreVertical } from 'lucide-react';

interface ChannelPostCardProps {
  post: any;
  currentUserId?: number;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  isLiking?: boolean;
  isSharing?: boolean;
}

export function ChannelPostCard({ 
  post, 
  currentUserId, 
  onLike, 
  onComment, 
  onShare, 
  isLiking = false, 
  isSharing = false 
}: ChannelPostCardProps) {
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'ahora';
    if (diffInHours < 24) return `hace ${diffInHours}h`;
    if (diffInHours < 48) return 'ayer';
    return date.toLocaleDateString('es-ES');
  };

  const getExpirationText = (createdAt: string) => {
    const created = new Date(createdAt);
    const expiresAt = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffInDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) return 'Expirado';
    if (diffInDays === 1) return 'Expira mañana';
    if (diffInDays <= 7) return `Expira en ${diffInDays} dias`;
    return `Expira en ${diffInDays} dias`;
  };

  const getPostTypeColor = (postType: string) => {
    switch (postType) {
      case 'NOTICIA': return 'text-brand bg-brand/10';
      case 'ANUNCIO': return 'text-green-600 bg-green-50';
      case 'OFERTA': return 'text-orange-600 bg-orange-50';
      case 'EVENTO': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPostTypeText = (postType: string) => {
    switch (postType) {
      case 'NOTICIA': return 'Noticia';
      case 'ANUNCIO': return 'Anuncio';
      case 'OFERTA': return 'Oferta';
      case 'EVENTO': return 'Evento';
      default: return 'General';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">
              {post.userFirstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">
                  {post.userFirstName} {post.userLastName}
                </p>
                {/* Post Type Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.postType)}`}>
                  {getPostTypeText(post.postType)}
                </span>
              </div>
              <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Expiration Indicator */}
            <span className="text-xs text-orange-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getExpirationText(post.createdAt)}
            </span>
            
            {/* More Options */}
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* Styled Content */}
        <div 
          className="p-4 rounded-lg"
          style={{
            backgroundColor: post.backgroundColor || '#ffffff',
            color: post.textColor || '#000000',
            fontStyle: post.fontStyle || 'normal',
            border: post.borderStyle === 'none' ? 'none' : `2px ${post.borderStyle} #e5e7eb`,
          }}
        >
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Post Images */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mt-4 grid gap-2">
            {post.imageUrls.length === 1 && (
              <img
                src={post.imageUrls[0]}
                alt="Post image"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            {post.imageUrls.length === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {post.imageUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            {post.imageUrls.length === 3 && (
              <div className="grid grid-cols-3 gap-2">
                {post.imageUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Interaction Buttons */}
          <div className="flex items-center gap-6">
            {/* Like Button */}
            <button
              onClick={() => onLike?.(post.id)}
              disabled={isLiking}
              className={`flex items-center gap-2 text-sm transition-colors ${
                post.hasUserLiked 
                  ? 'text-red-600 hover:text-red-700' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.hasUserLiked ? 'fill-current' : ''}`} />
              <span>{post.likeCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onComment?.(post.id)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentCount}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => onShare?.(post.id)}
              disabled={isSharing}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>{post.shareCount}</span>
            </button>
          </div>

          {/* View Count */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{post.viewCount}</span>
          </div>
        </div>

        {/* Channel Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-brand flex items-center justify-center text-white text-xs font-bold">
                {post.channelName?.charAt(0).toUpperCase() || 'C'}
              </div>
              <span className="text-xs text-gray-600">{post.channelName}</span>
            </div>
            
            {post.isPinned && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Fijado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
