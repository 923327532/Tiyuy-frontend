'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Copy, Heart, MessageCircle, Navigation, Reply, Send, Share2, ThumbsUp, X, Zap } from 'lucide-react';
import { formatDistanceToNow } from '@/utils/formatters';
import { useCommentStatusPost, useStatusComments, useLikeStatusPost, useUnlikeStatusPost, useShareStatusPost, useLikeComment, useUnlikeComment, useGetActiveStatusPosts } from '@/presentation/hooks/useContacts';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/presentation/store/toastStore';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import { StatusTemplateView } from './StatusTemplates';

interface StatusDetailPanelProps {
  status: any;
  user: any;
  onClose?: () => void;
  // Opcional: secuencia de estados del mismo usuario (estilo historias WhatsApp)
  statuses?: any[];
}

export default function StatusDetailPanel({ status, user, onClose, statuses = [] }: StatusDetailPanelProps) {
  // ═══ SECUENCIA TIPO HISTORIAS (WhatsApp) ═══
  // Si viene un grupo de estados del mismo usuario, se muestran uno a uno
  // con barra de progreso (~5s) y avance automático.
  const sequence = statuses && statuses.length > 0 ? statuses : [status];
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const activeStatus = sequence[currentStatusIndex] || status;
  const totalInSequence = sequence.length;
  const isSequenced = totalInSequence > 1;

  // Barra de progreso automática: 10s por estado, con pausa si el usuario
  // está comentando o dando like, y loop (regresa al primero al terminar).
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reanuda automáticamente la secuencia tras una interacción (like/comentario)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoResumeAfterInteraction = (ms = 2500) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
    setProgress(0);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, ms);
  };

  useEffect(() => {
    if (!isSequenced || isPaused) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / 100; // 10s = 100 ticks de 100ms
        if (next >= 100) {
          clearInterval(interval);
          // Loop: al terminar la secuencia, regresar al primer estado
          setCurrentStatusIndex((idx) => (idx + 1 < totalInSequence ? idx + 1 : 0));
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatusIndex, isSequenced, totalInSequence, isPaused]);

  //  Nombre real del usuario autenticado - usar firstName + lastName (campos válidos)
  const currentUserName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName
    || user?.lastName
    || `Usuario ${user?.id || ''}`;

  //  Función helper para detectar si un comentario es del usuario actual
  const isCurrentUserComment = (comment: any) => {
    return comment.userId === user?.id
      || comment.user?.id === user?.id;
  };


  // Registrar vista del estado al abrirlo (el backend incrementa viewCount)
  useEffect(() => {
    if (activeStatus?.id) {
      fetch(`/api/contacts/extended/status/${activeStatus.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token') || ''}`,
        },
      })
        .then(() => {
          // Refrescar la lista para que el contador de vistas se actualice
          queryClient.invalidateQueries({ queryKey: ['status-posts'], exact: false });
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus?.id]);

  const [commentText, setCommentText] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<any>(null);

  // Ref para evitar bucle infinito Y persistir isInitialized
  const localCommentsRef = useRef(localComments);
  const isInitializedRef = useRef(false);
  const hasLocalLikeRef = useRef(false);
  localCommentsRef.current = localComments;

  // ═══ FIX CRÍTICO: al cambiar de ESTADO ACTIVO (dentro de la secuencia), RESETEAR el estado local ═══
  // Así cada estado del grupo tiene su propio like/comentario — un like NO se aplica a los demás.
  const previousStatusIdRef = useRef<number>(activeStatus?.id);
  useEffect(() => {
    if (previousStatusIdRef.current !== activeStatus?.id) {
      previousStatusIdRef.current = activeStatus?.id;
      // Resetear todos los estados y refs al cambiar de estado activo
      setCommentText('');
      setLikeCount(0);
      setShareCount(0);
      setIsLiked(false);
      setLocalComments([]);
      setReplyingTo(null);
      setShowShareModal(false);
      localCommentsRef.current = [];
      hasLocalLikeRef.current = false;
    }
  }, [activeStatus?.id]);

  const queryClient = useQueryClient();

  // Hooks para interacciones con el estado
  const likeMutation = useLikeStatusPost();
  const unlikeMutation = useUnlikeStatusPost();
  const shareMutation = useShareStatusPost();

  // Hooks para interacciones con comentarios
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();

  //  El hook de comentarios usa el estado activo de la secuencia
  const commentMutation = useCommentStatusPost(activeStatus.id);

  //  Usar comentarios del ESTADO ACTIVO (no del primero del grupo)
  const { data: rawComments = [], isLoading, error } = useStatusComments(activeStatus.id);

  // Obtener datos actualizados del estado para sincronizar contadores
  const { data: statusPostsData } = useGetActiveStatusPosts();

  // Encontrar el estado actualizado en la lista
  const updatedStatus = statusPostsData?.pages?.flat()?.find(s => s.id === activeStatus.id) || activeStatus;


  //  Usar rawComments directamente sin useMemo para evitar bucles
  const comments = rawComments || [];

  //  Sincronización inteligente - preservar likes locales al invalidar cache
  useEffect(() => {
    if (comments && comments.length > 0) {
      if (localCommentsRef.current.length === 0) {
        // Primera carga - inicializar todo
        setLocalComments(comments);
      } else {
        // Sincronizar preservando likes locales
        const mergedComments = comments.map((comment: any) => {
          const localComment = localCommentsRef.current.find(c => c.id === comment.id);

          // Si existe localmente y tiene diferente estado de like, preservar el estado local
          if (localComment && localComment.hasUserLiked !== comment.hasUserLiked) {
            return {
              ...comment,
              hasUserLiked: localComment.hasUserLiked,
              likeCount: localComment.likeCount
            };
          }

          return comment;
        });

        setLocalComments(mergedComments);
      }
    }
  }, [comments]);

  // console.log('Render comments:', comments.length, comments[0]); //  Comentado para evitar payload errors

  const handleComment = () => {
    if (!commentText.trim()) return;

    commentMutation.mutate({
      content: commentText,
      ...(replyingTo && { replyToCommentId: replyingTo.id })
    }, {
      onSuccess: () => {
        setCommentText(''); //  Limpiar input
        setReplyingTo(null); //  Limpiar respuesta
        toast.success('Comentario enviado');
        // Refrescar los comentarios para mostrar el nuevo
        queryClient.invalidateQueries({ queryKey: ['status-comments', activeStatus.id] });
      },
      onError: (error) => {
        console.error('Error:', error);
        toast.error('Error al enviar comentario');
      }
    });
  };

  // Efecto para sincronizar contadores con el estado actual
  useEffect(() => {
    if (updatedStatus) {
      if (!hasLocalLikeRef.current) {
        setLikeCount(updatedStatus.likeCount || 0);
        setIsLiked(!!updatedStatus.hasUserLiked);
      }
      setShareCount(updatedStatus.shareCount || 0);
    } else {
      setLikeCount(0);
      setShareCount(0);
      setIsLiked(false);
      setLocalComments([]);
    }
  }, [updatedStatus]);

  // Efecto para ocultar estado después de 48 horas
  useEffect(() => {
    if (status) {
      const now = new Date();
      const createdAt = new Date(status.createdAt);
      const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      // Si han pasado más de 48 horas, ocultar el estado
      if (hoursSinceCreation > 48) {
        // No guardar más información de este estado
        console.log('Estado expirado, ocultando...');
        // El estado se dejará de mostrar en la lista principal
        // Esto evita saturar el backend con información antigua
      }
    }
  }, [status]);

  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = () => {
    shareMutation.mutate(activeStatus.id);
    setShowShareModal(true);
    setShareCount((prev: number) => prev + 1); // Incrementar contador de compartidos
  };

  const handleLike = () => {
    // Pausa breve para interactuar y se reanuda sola después de 2.5s
    autoResumeAfterInteraction();
    hasLocalLikeRef.current = true;
    if (isLiked) {
      unlikeMutation.mutate(activeStatus.id);
    } else {
      likeMutation.mutate(activeStatus.id);
    }
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleLikeComment = (commentId: number, isCommentLiked: boolean) => {
    // Pausa breve para interactuar y se reanuda sola después de 2.5s
    autoResumeAfterInteraction();
    //  Feedback visual inmediato
    setLocalComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          hasUserLiked: !isCommentLiked,
          likeCount: isCommentLiked
            ? Math.max((comment.likeCount || 0) - 1, 0)
            : (comment.likeCount || 0) + 1
        };
      }
      return comment;
    }));

    // Llamar a la mutación
    if (isCommentLiked) {
      unlikeCommentMutation.mutate(commentId);
    } else {
      likeCommentMutation.mutate(commentId);
    }
  };

  const handleReply = (comment: any) => {
    setReplyingTo(comment);
    // Focus en el input de comentario
    setTimeout(() => {
      const input = document.getElementById('comment-input');
      input?.focus();
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const siteUrl = window.location.origin;
  const shareId = activeStatus.shareLink || activeStatus.id || '';
  const shareUrl = `${siteUrl}/public/view/status/${shareId}`;
  const shareText = `Mira este estado de ${activeStatus.userName || activeStatus.user?.name || 'Usuario'} en Tiyuy: ${activeStatus.content?.substring(0, 120)}...`;
  const encoded = encodeURIComponent(`${shareText} ${shareUrl}`);

  // Limpiar timer de reanudación al desmontar
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const goNext = () => {
    // Avance manual: reanuda y va al siguiente; al final regresa al primero (loop)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(false);
    setCurrentStatusIndex((idx) => {
      setProgress(0);
      return idx + 1 < totalInSequence ? idx + 1 : 0;
    });
  };

  const goPrev = () => {
    // Retroceso manual: reanuda y va al anterior
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(false);
    setCurrentStatusIndex((idx) => {
      if (idx > 0) {
        setProgress(0);
        return idx - 1;
      }
      return idx;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Barra verde delgada solo para avatar + nombre */}
      <div className="bg-green-600 px-4 py-3 flex-shrink-0">
        {/* Barras de progreso de la secuencia (solo si hay varios estados) */}
        {isSequenced && (
          <div className="flex gap-1.5 mb-2">
            {sequence.map((s: any, i: number) => (
              <div key={s?.id || i} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                <div
                  className="h-full bg-white transition-none"
                  style={{
                    width: `${i < currentStatusIndex ? 100 : i === currentStatusIndex ? progress : 0}%`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar 
              user={activeStatus.user?.id === user?.id || activeStatus.userId === user?.id ? user : activeStatus.user} 
              size="sm" 
            />
            <div>
              <h3 className="text-white font-semibold text-sm">
                {activeStatus.user?.id === user?.id || activeStatus.userId === user?.id
                  ? currentUserName
                  : activeStatus.userName || activeStatus.user?.name || 'Usuario'
                }
              </h3>
              <p className="text-xs text-white/70">
                {formatDistanceToNow(new Date(activeStatus.createdAt), { addSuffix: true })}
                {isSequenced && ` · ${currentStatusIndex + 1}/${totalInSequence}`}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido del estado - con plantilla o texto simple */}
      <div 
        className="flex-1 flex flex-col items-center justify-center min-h-[300px] p-0 sm:p-0 text-center cursor-pointer relative overflow-hidden"
        onClick={goNext}
      >
        {activeStatus.templateKey ? (
          <div className="w-full h-full min-h-[300px]">
            <StatusTemplateView
              templateKey={activeStatus.templateKey}
              content={activeStatus.content || ''}
              textStyle={activeStatus.textStyle}
              location={activeStatus.location}
              propertyType={activeStatus.propertyType}
            />
          </div>
        ) : (
          <div
            className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 sm:p-10"
            style={{ backgroundColor: activeStatus.customColor || '#14b8a6' }}
          >
            <div className="max-w-md w-full mx-auto">
              {/* Texto del estado con auto-sizing y estilo de texto */}
              <div className={`
                text-white leading-relaxed
                ${activeStatus.textStyle === 'BOLD' ? 'font-bold' : ''}
                ${activeStatus.textStyle === 'ITALIC' ? 'italic' : ''}
                ${activeStatus.textStyle === 'COLORFUL' ? 'text-yellow-200' : ''}
                ${activeStatus.textStyle === 'CODE' ? 'font-mono' : ''}
                ${activeStatus.textStyle === 'HIGHLIGHT' ? 'bg-white/20 px-2 py-1 rounded-lg' : ''}
                ${(!activeStatus.textStyle || activeStatus.textStyle === 'NORMAL') ? 'font-medium' : 'font-medium'}
                ${activeStatus.content?.length < 30 ? 'text-3xl sm:text-4xl' : ''}
                ${activeStatus.content?.length >= 30 && activeStatus.content?.length < 80 ? 'text-2xl sm:text-3xl' : ''}
                ${activeStatus.content?.length >= 80 && activeStatus.content?.length < 150 ? 'text-xl sm:text-2xl' : ''}
                ${activeStatus.content?.length >= 150 ? 'text-base sm:text-lg' : ''}
              `}>
                {activeStatus.content}
              </div>
              
              {/* Metadatos del estado */}
              <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                {activeStatus.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                    📍 {activeStatus.location}
                  </span>
                )}
                {activeStatus.propertyType && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                    🏠 {activeStatus.propertyType}
                  </span>
                )}
              </div>

              {activeStatus.tags && activeStatus.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {activeStatus.tags.map((tag: string, tagIndex: number) => (
                    <span key={tagIndex} className="px-2.5 py-1 bg-white/15 text-white/90 text-[11px] rounded-full font-medium backdrop-blur-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Zona izquierda para retroceder (estilo Stories) */}
        {currentStatusIndex > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1/5 z-10"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          />
        )}
      </div>

      {/* Acciones */}
      <div className="border-b border-[var(--border-light)] p-4">

        <div className="flex items-center gap-6">
          <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-600' : 'text-[var(--text-secondary)] hover:text-red-600'}`}>
            <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            {likeCount > 0 && likeCount}
          </button>
          <button
            onClick={() => {
              const input = document.getElementById('comment-input');
              input?.focus();
            }}
            className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-brand transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> Comentar
          </button>
          <div className="relative">
            <button onClick={handleShare} className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-green-600 transition-colors">
              <Share2 className="w-5 h-5" /> Compartir
              {shareCount > 0 && <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">{shareCount}</span>}
            </button>
            {showShareModal && (
              <div className="absolute left-[calc(100%+24px)] top-0 z-50 w-[220px]">
                <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl overflow-hidden border-0">
                  <div className="p-3 flex items-center justify-between border-b border-[var(--border-light)]">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">Compartir</h3>
                    <button onClick={() => setShowShareModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => { navigator.clipboard.writeText(`${shareText} ${shareUrl}`); setShowShareModal(false); }}
                        className="flex flex-col items-center gap-2 py-3 px-2 bg-[var(--bg-tertiary)] rounded-xl hover:bg-[var(--border-color)] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shadow-sm">
                          <Copy className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--text-secondary)]">Copiar</span>
                      </button>
                      <a href={`https://wa.me/?text=${encoded}`} target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 py-3 px-2 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                          <Icon icon="fa6-brands:whatsapp" className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">WhatsApp</span>
                      </a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
                        target="_blank" rel="noopener noreferrer" onClick={() => setShowShareModal(false)}
                        className="flex flex-col items-center gap-2 py-3 px-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                          <Icon icon="fa6-brands:facebook" className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400">Facebook</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Input de comentario */}
        <div className="mb-4">
          {replyingTo && (
            <div className="flex items-center justify-between bg-[var(--bg-tertiary)] rounded-lg px-3 py-2 mb-2">
              <span className="text-xs text-[var(--text-secondary)]">
                Respondiendo a <strong>{replyingTo.userName || replyingTo.user?.name || 'Usuario'}</strong>
              </span>
              <button onClick={handleCancelReply} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              id="comment-input"
              type="text"
              value={commentText}
              onFocus={() => {
                // Pausar la secuencia mientras el usuario escribe un comentario
                if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
                setProgress(0);
                setIsPaused(true);
              }}
              onBlur={() => {
                // Al salir del input, reanudar la secuencia
                if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
                setIsPaused(false);
              }}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleComment();
                }
              }}
              placeholder="Escribe un comentario..."
              className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h4 className="font-semibold text-[var(--text-primary)] mb-4">Comentarios ({updatedStatus.commentCount || 0})</h4>

        {/* Lista de comentarios */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)] text-sm">Cargando comentarios...</p>
            </div>
          ) : localComments && Array.isArray(localComments) && localComments.length > 0 ? (
            // Mostrar comentarios locales (con estado de likes actualizado)
            localComments.map((comment: any, index: number) => (
              <div key={comment.id || index} className="space-y-3">
                {/* Comentario principal */}
                <div className="flex gap-3">
                  <UserAvatar 
                    user={isCurrentUserComment(comment) ? user : comment.user} 
                    size="sm" 
                  />
                  <div className="flex-1">
                    <div className="bg-[var(--bg-tertiary)] rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--text-primary)] text-sm">
                            {isCurrentUserComment(comment)
                              ? currentUserName
                              : comment.userName || comment.user?.name || 'Usuario'
                            }
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            {comment.timeAgo || formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-[var(--text-primary)] text-sm leading-relaxed">{comment.content}</p>
                    </div>

                    {/* Botones de interacción */}
                    <div className="flex items-center gap-4 mt-2 ml-2">
                      <button
                        onClick={() => handleLikeComment(comment.id, comment.hasUserLiked)}
                        className={`text-xs flex items-center gap-1 transition-colors ${comment.hasUserLiked ? 'text-brand' : 'text-[var(--text-muted)] hover:text-brand'
                          }`}
                      >
                        <ThumbsUp className="w-4 h-4" fill={comment.hasUserLiked ? 'currentColor' : 'none'} />
                        <span className="font-medium">{comment.likeCount || 0}</span>
                      </button>
                      <button
                        onClick={() => handleReply(comment)}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        Responder
                      </button>
                    </div>
                  </div>
                </div>

                {/* Respuestas anidadas (placeholder por ahora) */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-12 space-y-2">
                    {comment.replies.map((reply: any, replyIndex: number) => (
                      <div key={reply.id || replyIndex} className="flex gap-2">
                        <UserAvatar 
                          user={isCurrentUserComment(reply) ? user : reply.user} 
                          size="xs" 
                        />
                        <div className="flex-1">
                          <div className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-[var(--text-primary)] text-xs">
                                {isCurrentUserComment(reply)
                                  ? currentUserName
                                  : reply.userName || reply.user?.name || 'Usuario'
                                }
                              </span>
                              <span className="text-xs text-[var(--text-muted)]">
                                {reply.timeAgo || formatDistanceToNow(new Date(reply.createdAt), {
                                  addSuffix: true
                                })}
                              </span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-xs">{reply.content}</p>

                            {/* Botón de like para respuestas */}
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => handleLikeComment(reply.id, reply.hasUserLiked)}
                                className={`text-xs flex items-center gap-1 transition-colors ${reply.hasUserLiked ? 'text-brand' : 'text-[var(--text-muted)] hover:text-brand'
                                  }`}
                              >
                                <ThumbsUp className="w-3 h-3" fill={reply.hasUserLiked ? 'currentColor' : 'none'} />
                                <span className="font-medium">{reply.likeCount || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : status.recentComments && status.recentComments.length > 0 ? (
            // Fallback a comentarios recientes del status
            status.recentComments.map((comment: any, index: number) => (
              <div key={comment.id} className="flex gap-3">
                <UserAvatar 
                  user={isCurrentUserComment(comment) ? user : comment.user} 
                  size="xs" 
                />
                <div className="flex-1">
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-[var(--text-primary)]">
                        {isCurrentUserComment(comment)
                          ? currentUserName
                          : comment.userName || 'Usuario'
                        }
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {comment.timeAgo || formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)]">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 ml-3">
                    <button
                      onClick={() => handleLikeComment(comment.id, comment.hasUserLiked)}
                      className={`text-xs flex items-center gap-1 ${comment.hasUserLiked ? 'text-red-600' : 'text-[var(--text-muted)] hover:text-red-600'
                        }`}
                    >
                      <Heart className="w-3 h-3" />
                      {comment.likeCount > 0 && comment.likeCount}
                    </button>
                    <button
                      onClick={() => handleReply(comment)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : localComments && localComments.length > 0 ? (
            // Fallback a comentarios locales
            localComments.map((comment: any, index: number) => (
              <div key={index} className="flex gap-3">
                <UserAvatar 
                  user={comment.user} 
                  size="xs" 
                />
                <div className="flex-1">
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-[var(--text-primary)]">
                        {comment.userName || 'Usuario'}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {comment.timeAgo || formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)]">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 ml-3">
                    <button
                      onClick={() => handleLikeComment(comment.id, comment.hasUserLiked)}
                      className={`text-xs flex items-center gap-1 ${comment.hasUserLiked ? 'text-red-600' : 'text-[var(--text-muted)] hover:text-red-600'
                        }`}
                    >
                      <Heart className="w-3 h-3" />
                      {comment.likeCount > 0 && comment.likeCount}
                    </button>
                    <button
                      onClick={() => handleReply(comment)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)] text-sm">No hay comentarios aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
