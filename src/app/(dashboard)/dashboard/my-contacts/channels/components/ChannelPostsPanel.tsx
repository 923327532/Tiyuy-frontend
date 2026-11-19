'use client';

import React, { useState, useRef } from 'react';
import { toast } from '@/presentation/store/toastStore';
import { useMemo } from 'react';
import { useChannelPosts, useCanUserPublish, useCreateChannelComment, useGetChannelComments} from '@/presentation/hooks/useChannels';
import { useLikeChannelComment } from '@/presentation/hooks/useContacts';
import { Plus, MessageSquare, Heart, Share2, Image,ThumbsUp, CornerDownRight, X, Send, MoreVertical, Edit, Trash2, Calendar, Shield, BarChart3, FileText, Paperclip } from 'lucide-react';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import ChannelEventsPanel from './ChannelEventsPanel';
import CreateEventModal from './CreateEventModal';
import { ChannelAccessManager } from './ChannelAccessManager';
import { ChannelStatisticsModal } from './ChannelStatisticsModal';
import { useQueryClient } from '@tanstack/react-query';

interface ChannelPostsPanelProps {
  channelId: number;
  channelName: string;
  currentUserId: number;
  currentUser: any;
  isChannelAdmin?: boolean;
  onCreatePost: () => void;
  onCreateEvent: () => void;
}

export function ChannelPostsPanel({ 
  channelId, 
  channelName, 
  currentUserId, 
  currentUser,
  isChannelAdmin = false,
  onCreatePost,
  onCreateEvent
}: ChannelPostsPanelProps) {
  
  const [activeTab, setActiveTab] = useState<'posts' | 'events'>('posts');
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const queryClient = useQueryClient();
  
  const currentUserName = currentUser?.firstName && currentUser?.lastName 
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : currentUser?.firstName 
    || currentUser?.lastName
    || currentUser?.name
    || currentUser?.username
    || `Usuario ${currentUserId}`;
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontStyle, setFontStyle] = useState<'normal' | 'bold' | 'italic'>('normal');
  const [borderStyle, setBorderStyle] = useState<'none' | 'solid' | 'dashed' | 'rounded'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  const { posts, postsLoading, createPost, likePost, sharePost, isCreatingPost, isLikingPost, isSharingPost } = useChannelPosts(channelId, currentUserId);

  const [showWelcome, setShowWelcome] = useState(true);
  
  // Comment states
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const createCommentMutation = useCreateChannelComment();

  // States for menu options and editing
  const [showPostMenu, setShowPostMenu] = useState<{[key: number]: boolean}>({});
  const [editingPost, setEditingPost] = useState<{[key: number]: boolean}>({});
  const [editContent, setEditContent] = useState<{[key: number]: string}>({});

  // Share modal state
  const [showShareModal, setShowShareModal] = useState<{[key: number]: boolean}>({});

  // Access delegation and statistics state
  const [showAccessManager, setShowAccessManager] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);

  // Check if user can view statistics (admin or publisher)
  const { data: canPublish } = useCanUserPublish(channelId);
  const canViewStatistics = isChannelAdmin || canPublish;

  const handleCreatePost = async () => {
    if (!newPost.trim() && selectedImages.length === 0 && selectedDocuments.length === 0) return;

    const postData = {
      content: newPost.trim(),
      postType: 'NOTICIA',
      backgroundColor,
      textColor,
      fontStyle,
      borderStyle,
      postStyle: 'default',
      userId: currentUserId
    };

    try {
      const createdPost = await createPost(postData);
      
      // TODO: Implement image and document upload in the new architecture
      // For now, we'll skip the upload functionality
      console.log('Images and documents upload to be implemented in new architecture');
      
      // Reset form
      setNewPost('');
      setSelectedImages([]);
      setSelectedDocuments([]);
      setBackgroundColor('#ffffff');
      setTextColor('#000000');
      setFontStyle('normal');
      setBorderStyle('none');
      setShowCreateForm(false);
      setShowWelcome(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    // Manejar fechas nulas, vacías o inválidas (timestamp 0 = 31/12/1969)
    if (!dateString || dateString === '1969-12-31' || dateString === '1970-01-01' || new Date(dateString).getTime() === 0) {
      return 'Reciente';
    }
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Fecha inválida (futura o muy antigua)
    if (diffInSeconds < 0 || isNaN(diffInSeconds)) {
      return 'Reciente';
    }
    
    // Menos de 1 minuto
    if (diffInSeconds < 60) {
      return 'ahora mismo';
    }
    
    // Menos de 1 hora
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`;
    }
    
    // Menos de 24 horas
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `hace ${diffInHours} h`;
    }
    
    // Ayer
    if (diffInHours < 48) {
      return 'ayer';
    }
    
    // Menos de 7 días
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `hace ${diffInDays} días`;
    }
    
    // Menos de 1 mes
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `hace ${diffInWeeks} sem`;
    }
    
    // Formato de fecha completo para fechas antiguas
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Predefined colors for backgrounds
  const backgroundColors = [
    { name: 'Blanco', value: '#ffffff' },
    { name: 'Azul claro', value: '#eff6ff' },
    { name: 'Verde claro', value: '#f0fdf4' },
    { name: 'Amarillo claro', value: '#fef3c7' },
    { name: 'Rosado claro', value: '#fdf2f8' },
    { name: 'Morado claro', value: '#faf5ff' },
    { name: 'Azul oscuro', value: '#1e3a8a' },
    { name: 'Verde oscuro', value: '#14532d' },
    { name: 'Morado oscuro', value: '#581c87' },
    { name: 'Rojo oscuro', value: '#7f1d1d' },
    { name: 'Gris oscuro', value: '#1f2937' },
    { name: 'Negro', value: '#000000' },
  ];

  // Function to calculate optimal text color based on background
  const getOptimalTextColor = (backgroundColor: string): string => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5 ? '#ffffff' : '#000000';
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    setTextColor(getOptimalTextColor(color));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingSlots = 3 - selectedImages.length;
      const filesToAdd = files.slice(0, remainingSlots);
      setSelectedImages([...selectedImages, ...filesToAdd]);
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Validate file types (PDF, Word, Excel)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const validFiles = files.filter(file => {
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} no es un documento válido (solo PDF, Word, Excel)`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast.error(`${file.name} excede el límite de 10MB`);
          return false;
        }
        return true;
      });
      
      const remainingSlots = 3 - selectedDocuments.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      setSelectedDocuments([...selectedDocuments, ...filesToAdd]);
    }
  };

  const removeDocument = (index: number) => {
    setSelectedDocuments(selectedDocuments.filter((_, i) => i !== index));
  };

  const getDocumentIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    if (ext === 'xls' || ext === 'xlsx') return 'XLS';
    return 'FILE';
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleDeletePost = async (postId: number) => {
    // TODO: Implement delete functionality in new architecture
    console.log('Delete post functionality to be implemented in new architecture');
    setShowPostMenu(prev => ({ ...prev, [postId]: false }));
  };

  // Functions for editing posts
  const handleEditPost = (post: any) => {
    setEditContent(prev => ({ ...prev, [post.id]: post.content }));
    setEditingPost(prev => ({ ...prev, [post.id]: true }));
    setShowPostMenu(prev => ({ ...prev, [post.id]: false }));
  };

  const handleSaveEdit = async (post: any) => {
    try {
      // TODO: Implement update channel post API
      console.log('Edit post:', post.id, 'new content:', editContent[post.id]);
      setEditingPost(prev => ({ ...prev, [post.id]: false }));
    } catch (error) {
      console.error('Error editing post:', error);
      toast.error('Error al editar el post. Inténtalo de nuevo.');
    }
  };

  const handleCancelEdit = (postId: number) => {
    setEditingPost(prev => ({ ...prev, [postId]: false }));
    setEditContent(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCommentToggle = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: number) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;
    
    createCommentMutation.mutate({
      channelId,
      postId,
      content: content.trim(),
      userId: currentUserId
    }, {
      onSuccess: () => {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      },
      onError: (error) => {
        console.error('Error creating comment:', error);
      }
    });
  };

  const handleShare = (post: any) => {
    if (currentUserId) {
      sharePost({ postId: post.id });
      setShowShareModal(prev => ({ ...prev, [post.id]: true }));
    }
  };

  const getTextStyleClass = () => {
    switch (fontStyle) {
      case 'bold': return 'font-bold';
      case 'italic': return 'italic';
      default: return '';
    }
  };

  const getBorderStyleClass = () => {
    switch (borderStyle) {
      case 'solid': return 'border-2';
      case 'dashed': return 'border-2 border-dashed';
      case 'rounded': return 'border-2 rounded-2xl';
      default: return 'border';
    }
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

  if (postsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar los posts</p>
      </div>
    );
  }

  const hasPosts = posts && posts.length > 0;
  const currentUserInitial = currentUserName.charAt(0).toUpperCase();

  return (
    <div className="h-full flex flex-col relative bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{channelName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Posts del canal</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'events'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Eventos
            </button>
            {/* Access Management Button - Only for channel admin */}
            {isChannelAdmin && (
              <button
                onClick={() => setShowAccessManager(!showAccessManager)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  showAccessManager
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Shield className="w-4 h-4" />
                Acceso
              </button>
            )}
            {/* Statistics Button - Only for admin and publishers */}
            {canViewStatistics && (
              <button
                onClick={() => setShowStatisticsModal(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'posts' ? (
        <div className="flex-1 overflow-y-auto">
          {/* Create Post Area - Estilo Facebook/Grupos */}
          {canPublish && (
            <>
              {!hasPosts && showWelcome ? (
                // Initial state: "write first post" and "skip" buttons
                <div className="bg-white dark:bg-gray-800 m-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4">
                      <UserAvatar size="lg" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      ¡Bienvenido a {channelName}!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                      Este es el inicio del canal. Sé el primero en compartir algo.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Escribir mi primera publicación
                      </button>
                      <button
                        onClick={() => setShowWelcome(false)}
                        className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        Omitir
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Facebook-style chat line
                <div className="bg-white dark:bg-gray-800 m-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <UserAvatar size="sm" />
                      <div className="flex-1">
                        <div
                          onClick={() => setShowCreateForm(true)}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-text hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <span className="text-gray-500 dark:text-gray-400">¿Qué estás pensando?</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Posts Content */}
          <div className="p-4 space-y-4">
            {/* Welcome Message */}
            {showWelcome && posts && posts.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300">Bienvenido a {channelName}</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Este es el feed de posts del canal. Aquí verás todas las publicaciones.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Entendido
                </button>
              </div>
            )}

            {/* Create Post Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Crear publicación</h2>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <UserAvatar size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{currentUserName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Creando post en {channelName}</p>
                      </div>
                    </div>

                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="¿Qué estás pensando?"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={6}
                      autoFocus
                    />

                    {/* Style Options */}
                    <div className="space-y-4 mb-4 mt-4">
                      {/* Font Style */}
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de letra:</label>
                        <select
                          value={fontStyle}
                          onChange={(e) => setFontStyle(e.target.value as any)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Negrita</option>
                          <option value="italic">Cursiva</option>
                        </select>

                        <select
                          value={borderStyle}
                          onChange={(e) => setBorderStyle(e.target.value as any)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="none">Sin borde</option>
                          <option value="solid">Borde sólido</option>
                          <option value="dashed">Borde discontinuo</option>
                          <option value="rounded">Borde redondeado</option>
                        </select>
                      </div>

                      {/* Background Color */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color de fondo:</label>
                        <div className="flex gap-2 flex-wrap">
                          {backgroundColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => handleBackgroundColorChange(color.value)}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                backgroundColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Emojis */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Emojis:</label>
                        <div className="flex gap-2 flex-wrap">
                          {['😀', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '👏', '🙏', '💪', '🌟'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => setNewPost(newPost + emoji)}
                              className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Images */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={selectedImages.length >= 3}
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Image className="w-4 h-4" />
                            <span>Agregar imagen ({selectedImages.length}/3)</span>
                          </button>

                          {/* Documents */}
                          <input
                            ref={documentInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleDocumentSelect}
                            className="hidden"
                          />
                          <button
                            onClick={() => documentInputRef.current?.click()}
                            disabled={selectedDocuments.length >= 3}
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Paperclip className="w-4 h-4" />
                            <span>Adjuntar documento ({selectedDocuments.length}/3)</span>
                          </button>
                        </div>

                        {selectedImages.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Selected Documents Preview */}
                        {selectedDocuments.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {selectedDocuments.map((doc, index) => (
                              <div key={index} className="relative flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">{doc.name}</span>
                                  <span className="text-[10px] text-gray-500">{getDocumentIcon(doc.name)} • {(doc.size / 1024).toFixed(0)} KB</span>
                                </div>
                                <button
                                  onClick={() => removeDocument(index)}
                                  className="ml-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewPost('');
                          setSelectedImages([]);
                          setSelectedDocuments([]);
                          setBackgroundColor('#ffffff');
                          setTextColor('#000000');
                          setFontStyle('normal');
                          setBorderStyle('none');
                        }}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={(!newPost.trim() && selectedImages.length === 0 && selectedDocuments.length === 0) || isCreatingPost}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isCreatingPost ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                            <span>Publicando...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Publicar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List - Facebook Style */}
            <div className="space-y-4">
              {posts?.map((post: any) => (
                <div 
                  key={post.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Post Header - Facebook Style */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <UserAvatar 
                        user={{ firstName: post.userFirstName, lastName: post.userLastName }} 
                        size="sm" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {post.userFirstName} {post.userLastName}
                            </span>
                            {post.isPinned && (
                              <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                                Fijado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(post.createdAt)}
                            </span>
                            {/* Menu for post creator or channel admin */}
                            {(post.userId === currentUserId || isChannelAdmin) && (
                              <div className="relative">
                                <button
                                  onClick={() => setShowPostMenu(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                                
                                {showPostMenu[post.id] && (
                                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-32">
                                    {post.userId === currentUserId && (
                                      <button
                                        onClick={() => handleEditPost(post)}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                      >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeletePost(post.id)}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center gap-2 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Eliminar
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {channelName}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div 
                      className="mb-3 p-3 rounded-lg"
                      style={{ 
                        backgroundColor: post.backgroundColor || '#ffffff',
                        border: post.borderStyle === 'solid' ? '2px solid #e5e7eb' : 
                                post.borderStyle === 'dashed' ? '2px dashed #e5e7eb' :
                                post.borderStyle === 'rounded' ? '2px solid #e5e7eb' : 'none'
                      }}
                    >
                      {editingPost[post.id] ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent[post.id] || ''}
                            onChange={(e) => setEditContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleCancelEdit(post.id)}
                              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveEdit(post)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p 
                          className={`whitespace-pre-wrap break-words ${
                            post.fontStyle === 'bold' ? 'font-bold' : 
                            post.fontStyle === 'italic' ? 'italic' : ''
                          }`}
                          style={{ color: post.textColor || '#000000' }}
                        >
                          {post.content}
                        </p>
                      )}
                    </div>

                    {/* Post Images - Facebook Grid Style */}
                    {post.imageUrls && post.imageUrls.length > 0 && (
                      <div className="mb-3">
                        <div className={`
                          grid gap-2
                          ${post.imageUrls.length === 1 ? 'grid-cols-1' : ''}
                          ${post.imageUrls.length === 2 ? 'grid-cols-2' : ''}
                          ${post.imageUrls.length >= 3 ? 'grid-cols-3' : ''}
                        `}>
                          {post.imageUrls.map((url: string, idx: number) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden">
                              <img
                                src={url}
                                alt={`Imagen ${idx + 1}`}
                                className="w-full h-48 object-cover"
                              />
                              {post.imageUrls.length > 3 && idx === 2 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <span className="text-white font-semibold text-lg">
                                    +{post.imageUrls.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Documents */}
                    {post.documents && post.documents.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {post.documents.map((doc: any, idx: number) => (
                            <a
                              key={idx}
                              href={doc.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            >
                              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{doc.fileName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.documentType} • {doc.formattedFileSize}</p>
                              </div>
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Descargar</span>
                            </a>
                        ))}
                      </div>
                    )}

                    {/* Interaction Counters - Above Buttons */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>{post.likeCount || 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span>{post.commentCount || 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-4 h-4 text-green-500" />
                          <span>{post.shareCount || 0}</span>
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {post.viewCount || 0} vistas
                      </span>
                    </div>

                    {/* Facebook-style Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => likePost(post.id)}
                        disabled={isLikingPost}
                        className={`flex-1 py-2 px-3 rounded-lg transition-colors font-medium disabled:opacity-50 ${
                          post.hasUserLiked 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isLikingPost ? (
                          <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent animate-spin inline mr-1" />
                        ) : (
                          <Heart className={`w-4 h-4 inline mr-1 ${post.hasUserLiked ? 'fill-current' : ''}`} />
                        )}
                        Me gusta
                      </button>
                      <button
                        onClick={() => handleCommentToggle(post.id)}
                        className={`flex-1 py-2 px-3 rounded-lg transition-colors font-medium ${
                          showComments[post.id] 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Comentar
                      </button>
                      <button
                        onClick={() => handleShare(post)}
                        disabled={isSharingPost}
                        className={`flex-1 py-2 px-3 rounded-lg transition-colors font-medium disabled:opacity-50 ${
                          isSharingPost 
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isSharingPost ? (
                          <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent animate-spin inline mr-1" />
                        ) : (
                          <Share2 className="w-4 h-4 inline mr-1" />
                        )}
                        Compartir
                      </button>
                    </div>
                  </div>

                  {/* Comments Section - Facebook Style */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-700">
                    {/* Comment Input */}
                    <div className="flex items-start gap-2 mb-3">
                      <UserAvatar size="xs" />
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                          placeholder={`Escribe un comentario como ${currentUserName}...`}
                          className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>

                    {/* Toggle Comments */}
                    <div>
                      <button
                        onClick={() => handleCommentToggle(post.id)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-2"
                      >
                        {(showComments[post.id] || false) 
                          ? '▲ Ver menos' 
                          : `▼ Ver comentarios (${post.commentCount || 0})` 
                        }
                      </button>

                      {/* Comments List */}
                      {(showComments[post.id] || false) && (
                        <PostComments 
                          channelId={channelId}
                          postId={post.id}
                          currentUserId={currentUserId}
                          currentUserName={currentUserName}
                          currentUser={currentUser}
                          createCommentMutation={createCommentMutation}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!hasPosts && !showWelcome && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No hay posts aún</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Sé el primero en publicar en este canal
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Events Tab */
        <ChannelEventsPanel
          channelId={channelId}
          channelName={channelName}
          currentUserId={currentUserId}
          currentUser={currentUser}
          onCreateEvent={() => setShowCreateEventModal(true)}
        />
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        channelId={channelId}
        onSuccess={() => {
          setShowCreateEventModal(false);
          // Refrescar eventos de forma eficiente
          queryClient.invalidateQueries({ queryKey: ['channelEvents', channelId] });
          queryClient.invalidateQueries({ queryKey: ['channelUpcomingEvents', channelId] });
        }}
      />

      {/* Share Modals */}
      {posts?.map((post: any) => (
        showShareModal[post.id] && (
          <div key={`share-${post.id}`} className="fixed right-8 bottom-20 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-96 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Compartir publicación</h3>
                <button 
                  onClick={() => setShowShareModal(prev => ({ ...prev, [post.id]: false }))} 
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{post.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">por {post.userFirstName} {post.userLastName} en {channelName}</p>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {/* Copy link */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/dashboard/my-contacts/channels/${channelId}`;
                    const shareText = `Mira esta publicación de ${post.userFirstName} en "${channelName}": ${post.content?.substring(0, 100)}...`;
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                    setShowShareModal(prev => ({ ...prev, [post.id]: false }));
                    toast.success('Link copiado al portapapeles');
                  }}
                  className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="text-lg">🔗</span>
                  <span className="text-xs font-medium">Copiar link</span>
                </button>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Mira esta publicación de ${post.userFirstName} en "${channelName}": ${post.content?.substring(0, 100)}... ${window.location.origin}/dashboard/my-contacts/channels/${channelId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareModal(prev => ({ ...prev, [post.id]: false }))}
                  className="flex flex-col items-center p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                >
                  <span className="text-lg">💬</span>
                  <span className="text-xs text-green-700 font-medium">WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/dashboard/my-contacts/channels/${channelId}`)}&quote=${encodeURIComponent(`Mira esta publicación de ${post.userFirstName} en "${channelName}": ${post.content?.substring(0, 100)}...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareModal(prev => ({ ...prev, [post.id]: false }))}
                  className="flex flex-col items-center p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                >
                  <span className="text-lg">📘</span>
                  <span className="text-xs text-blue-700 font-medium">Facebook</span>
                </a>

                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mira esta publicación de ${post.userFirstName} en "${channelName}": ${post.content?.substring(0, 100)}...`)}&url=${encodeURIComponent(`${window.location.origin}/dashboard/my-contacts/channels/${channelId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareModal(prev => ({ ...prev, [post.id]: false }))}
                  className="flex flex-col items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <span className="text-lg">𝕏</span>
                  <span className="text-xs text-gray-700 font-medium">X/Twitter</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/dashboard/my-contacts/channels/${channelId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareModal(prev => ({ ...prev, [post.id]: false }))}
                  className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <span className="text-lg">💼</span>
                  <span className="text-xs text-blue-800 font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        )
      ))}

      {/* Access Management Sidebar - Rendered inline to avoid DOM errors */}
      {showAccessManager && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <ChannelAccessManager
                  channelId={channelId}
                  channelName={channelName}
                  isChannelAdmin={isChannelAdmin || false}
                  adminUser={currentUser?.id ? {
                    id: currentUser.id,
                    firstName: currentUser.firstName || currentUser.name?.split(' ')[0] || 'Admin',
                    lastName: currentUser.lastName || currentUser.name?.split(' ').slice(1).join(' ') || '',
                    email: currentUser.email || '',
                    avatar: currentUser.avatar,
                  } : null}
                  onClose={() => setShowAccessManager(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Sidebar - Slide from right */}
      {showStatisticsModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowStatisticsModal(false)}
          />
          {/* Sidebar - Wider than access manager */}
          <div className="fixed right-0 top-[64px] bottom-0 w-full sm:w-[420px] lg:w-[600px] bg-white border-l border-gray-200 flex flex-col z-50 shadow-2xl">
            <ChannelStatisticsModal
              channelId={channelId}
              channelName={channelName}
              isOpen={showStatisticsModal}
              onClose={() => setShowStatisticsModal(false)}
              isChannelAdmin={isChannelAdmin || false}
            />
          </div>
        </>
      )}
    </div>
  );
}

function PostComments({ channelId, postId, currentUserId, currentUserName, currentUser, createCommentMutation }: { 
  channelId: number;
  postId: number; 
  currentUserId: number; 
  currentUserName: string;
  currentUser: any;
  createCommentMutation: any;
}) {
  const { comments, commentsLoading: isLoading } = useGetChannelComments(channelId, postId);
  const likeCommentMutation = useLikeChannelComment();
  const queryClient = useQueryClient();
  
  // Estados para respuestas
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyInputs, setReplyInputs] = useState<{[key: number]: string}>({});
  const [commentLikes, setCommentLikes] = useState<{[key: number]: boolean}>({});

  const formatTimeAgo = (dateString: string) => {
    if (!dateString || dateString === '1969-12-31' || dateString === '1970-01-01' || new Date(dateString).getTime() === 0) {
      return 'Reciente';
    }
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 0 || isNaN(diffInSeconds)) return 'Reciente';
    if (diffInSeconds < 60) return 'ahora mismo';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours} h`;
    if (diffInHours < 48) return 'ayer';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `hace ${diffInDays} días`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const handleCommentLike = async (commentId: number, hasUserLiked: boolean) => {
    try {
      await likeCommentMutation.mutateAsync(commentId);
      setCommentLikes(prev => ({ ...prev, [commentId]: !hasUserLiked }));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReplyToComment = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
  };

  // Render nested replies recursively (legacy - kept for backward compatibility)
  const renderNestedRepliesLegacy = (nestedReplies: any[]) => {
    if (!nestedReplies || nestedReplies.length === 0) return null;
    return nestedReplies.map((nestedReply: any) => (
      <div key={nestedReply.id} className="flex gap-2">
        <UserAvatar 
          user={{ firstName: nestedReply.userFirstName, lastName: nestedReply.userLastName }} 
          size="xs" 
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg px-2 py-1.5 border border-gray-200">
            <span className="font-semibold text-xs text-gray-900">
              {nestedReply.userFirstName} {nestedReply.userLastName}
            </span>
            <p className="text-sm text-gray-800 mt-0.5">{nestedReply.content}</p>
            <span className="text-xs text-gray-400">{formatTimeAgo(nestedReply.createdAt)}</span>
          </div>
          
          {/* Like and Reply buttons */}
          <div className="flex gap-3 px-2 py-0.5">
            <button
              onClick={() => handleCommentLike(nestedReply.id, nestedReply.hasUserLiked)}
              className={`text-[10px] flex items-center gap-1 transition-colors ${
                nestedReply.hasUserLiked
                  ? 'text-blue-500 hover:text-blue-600 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>👍</span>
              Me gusta
            </button>
            
            <button
              onClick={() => handleReplyToComment(nestedReply.id)}
              className="text-[10px] text-gray-500 hover:text-gray-700 transition-colors"
            >
              Responder
            </button>
          </div>
          
          {/* Reply input */}
          {replyingTo === nestedReply.id && (
            <div className="mt-1.5 px-2">
              <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                <div className="flex items-center gap-1 mb-1 text-[10px] text-gray-600">
                  <span>Respondiendo a {nestedReply.userFirstName}</span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <UserAvatar size="xs" />
                  <input
                    type="text"
                    value={replyInputs[nestedReply.id] || ''}
                    onChange={(e) => setReplyInputs(prev => ({ ...prev, [nestedReply.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(nestedReply.id)}
                    placeholder="Escribe una respuesta..."
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleReplySubmit(nestedReply.id)}
                    disabled={!replyInputs[nestedReply.id]?.trim()}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* More nested replies */}
          {nestedReply.replies && nestedReply.replies.length > 0 && (
            <div className="mt-1.5 space-y-1 pl-3 border-l-2 border-gray-200">
              {renderNestedRepliesLegacy(nestedReply.replies)}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const handleReplySubmit = (parentCommentId: number) => {
    const reply = replyInputs[parentCommentId];
    if (!reply?.trim()) return;
    
    createCommentMutation.mutate({
      channelId,
      postId,
      content: reply.trim(),
      userId: currentUserId,
      replyToCommentId: parentCommentId
    }, {
      onSuccess: () => {
        setReplyInputs(prev => ({ ...prev, [parentCommentId]: '' }));
        setReplyingTo(null);
      },
      onError: (error: any) => {
        console.error('Error sending reply:', error);
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500 text-sm">Cargando comentarios...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-center py-4 text-gray-500 text-sm">No hay comentarios aún</div>;
  }

  console.log('Comments data structure:', comments.map((c: any) => ({ 
    id: c.id, 
    content: c.content?.substring(0, 20), 
    replyToCommentId: c.replyToCommentId,
    repliesCount: c.replies?.length,
    replies: c.replies?.map((r: any) => ({ id: r.id, content: r.content?.substring(0, 15), replyToCommentId: r.replyToCommentId, repliesCount: r.replies?.length }))
  })));
  console.log(' FULL comments data:', JSON.stringify(comments, null, 2));
// Normalización para optimizar el rendimiento y evitar cuellos de botella
  const { rootComments, replyMap } = useMemo(() => {
    const roots: any[] = [];
    const replies: Record<string, any[]> = {};

    comments.forEach((comment: any) => {
      if (!comment.replyToCommentId) {
        roots.push(comment);
      } else {
        if (!replies[comment.replyToCommentId]) {
          replies[comment.replyToCommentId] = [];
        }
        replies[comment.replyToCommentId].push(comment);
      }
    });

    return { rootComments: roots, replyMap: replies };
  }, [comments]);

  // Función recursiva optimizada para renderizar las respuestas
  const renderNestedReplies = (commentId: string) => {
    const currentReplies = replyMap[commentId];
    if (!currentReplies || currentReplies.length === 0) return null;

    return (
      <div className="mt-2 space-y-2 pl-4 border-l border-gray-100">
        {currentReplies.map((reply: any) => (
          <div key={reply.id} className="flex gap-2">
            <UserAvatar 
              user={{ firstName: reply.userFirstName, lastName: reply.userLastName }} 
              size="xs" 
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <span className="font-semibold text-xs text-gray-900">
                  {reply.userFirstName} {reply.userLastName}
                </span>
                <p className="text-sm text-gray-800 mt-0.5">{reply.content}</p>
                <span className="text-xs text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
              </div>
              
              <div className="flex gap-4 px-3 py-1">
                <button
                  onClick={() => handleCommentLike(reply.id, reply.hasUserLiked)}
                  className={`text-xs flex items-center gap-1 transition-colors ${
                    commentLikes[reply.id] || reply.hasUserLiked
                      ? 'text-blue-500 font-medium' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  Me gusta
                </button>
                <button
                  onClick={() => handleReplyToComment(reply.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Responder
                </button>
              </div>

              {replyingTo === reply.id && renderReplyInput(reply)}
              {renderNestedReplies(reply.id)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReplyInput = (comment: any) => (
    <div className="mt-2 px-3">
      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <CornerDownRight className="w-3 h-3 text-gray-400" />
            <span>Respondiendo a {comment.userFirstName}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-2">
          <UserAvatar size="xs" />
          <input
            type="text"
            value={replyInputs[comment.id] || ''}
            onChange={(e) => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(comment.id)}
            placeholder="Escribe una respuesta..."
            className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={() => handleReplySubmit(comment.id)}
            disabled={!replyInputs[comment.id]?.trim()}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-2 mt-2">
      {rootComments.map((comment: any) => (
        <div key={comment.id} className="flex gap-2">
          <UserAvatar 
            user={{ firstName: comment.userFirstName, lastName: comment.userLastName }} 
            size="xs" 
          />
          <div className="flex-1">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <span className="font-semibold text-xs text-gray-900">
                {comment.userFirstName} {comment.userLastName}
              </span>
              <p className="text-sm text-gray-800 mt-0.5">{comment.content}</p>
              <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
            </div>
            
            <div className="flex gap-4 px-3 py-1">
              <button
                onClick={() => handleCommentLike(comment.id, comment.hasUserLiked)}
                className={`text-xs flex items-center gap-1 transition-colors ${
                  commentLikes[comment.id] || comment.hasUserLiked
                    ? 'text-blue-500 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                Me gusta
              </button>
              
              <button
                onClick={() => handleReplyToComment(comment.id)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Responder
              </button>
            </div>
            
            {replyingTo === comment.id && renderReplyInput(comment)}
            {renderNestedReplies(comment.id)}
          </div>
        </div>
      ))}
    </div>
  );
}
