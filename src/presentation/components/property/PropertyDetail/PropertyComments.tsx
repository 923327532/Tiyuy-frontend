'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { Lock, Star, MessageCircle, Loader2, ChevronDown, X, LogIn, UserPlus } from 'lucide-react';
import { StarRating } from './StarRating';

interface PropertyComment {
  id: number;
  content: string;
  userName: string;
  userEmail?: string;
  createdAt: string;
  rating?: number;
}

interface PropertyCommentsProps {
  propertyId: number;
  location: { latitude?: number; longitude?: number };
}

const COMMENTS_PER_PAGE = 5;

export function PropertyComments({ propertyId, location }: PropertyCommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<PropertyComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = authStorage.getToken();
    setIsAuthenticated(!!token);
  }, []);

  // Cargar comentarios desde el backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}/comments`);
        if (response.ok) {
          const data = await response.json();
          const commentsArray = Array.isArray(data) ? data : [];
          setComments(commentsArray);
          setTotalComments(commentsArray.length);
        }
      } catch (error) {
        console.error('Error cargando comentarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [propertyId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Verificar autenticación antes de enviar
    const token = authStorage.getToken();
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment.trim(),
          rating: newRating > 0 ? newRating : null
        })
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => [newCommentData, ...prev]);
        setTotalComments(prev => prev + 1);
        setNewComment('');
        setNewRating(0);
        setShowForm(false);
        toast.success('Comentario agregado exitosamente');
      } else if (response.status === 401 || response.status === 403) {
        toast.error('Tu sesión ha expirado. Inicia sesión nuevamente.');
        authStorage.removeToken();
        setIsAuthenticated(false);
        setShowForm(false);
        setShowAuthModal(true);
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Error ${response.status}: No se pudo agregar el comentario`;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error agregando comentario:', error);
      toast.error('Error de conexión al agregar comentario');
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 1);
  const hiddenCount = comments.length - 1;

  if (loading) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[var(--brand-primary)] animate-spin" />
          <span className="text-[var(--text-primary)]">Cargando comentarios...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Formulario para agregar comentario */}
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[var(--text-primary)]">
              Comentarios de la zona
              {totalComments > 0 && (
                <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">
                  ({totalComments} {totalComments === 1 ? 'comentario' : 'comentarios'})
                </span>
              )}
            </h4>
            {isAuthenticated ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-sm bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors"
              >
                {showForm ? 'Cancelar' : 'Agregar Comentario'}
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Inicia sesión para comentar
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Solo los usuarios registrados pueden dejar comentarios.
              </p>
            </div>
          )}

          {showForm && isAuthenticated && (
            <form onSubmit={handleSubmitComment} className="space-y-3">
              {/* Selector de estrellas con StarRating */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">Califica esta propiedad:</span>
                <StarRating
                  initialRating={newRating}
                  onRate={setNewRating}
                  size="md"
                  showValue
                />
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comparte tu experiencia sobre esta zona..."
                className="w-full p-3 border border-[var(--border-color)] rounded-lg resize-none bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-tertiary)]">{newComment.length}/500 caracteres</span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Publicar Comentario
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Lista de comentarios */}
        {comments.length > 0 ? (
          <div className="space-y-2">
            {visibleComments.map((comment, index) => (
              <div key={comment.id || `comment-${index}-${comment.createdAt}`} className="bg-[var(--bg-secondary)] rounded-lg px-3 py-2 border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-medium text-[var(--text-primary)] truncate">{comment.userName}</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] shrink-0">
                      {comment.createdAt ? (() => {
                        try { return new Date(comment.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }); }
                        catch { return ''; }
                      })() : ''}
                    </span>
                  </div>
                  {comment.rating && <StarRating initialRating={comment.rating} readonly size="sm" />}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-snug">{comment.content}</p>
              </div>
            ))}
            
            {/* Botón "Ver más" compacto */}
            {!showAll && hiddenCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full text-center text-xs text-teal-600 hover:text-teal-700 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] py-2 rounded-lg transition-colors font-medium"
              >
                Ver {hiddenCount} comentario{hiddenCount !== 1 ? 's' : ''} más
              </button>
            )}
            {showAll && comments.length > 1 && (
              <button
                onClick={() => setShowAll(false)}
                className="w-full text-center text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1.5 transition-colors"
              >
                Mostrar menos
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <p className="text-[var(--text-secondary)] flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Sé el primero en comentar sobre esta zona
            </p>
          </div>
        )}
      </div>

      {/* Modal de autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
          <div 
            className="bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] text-center mb-2">
              Comentar en esta propiedad
            </h3>
            <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
              Para dejar un comentario, necesitas una cuenta en Tiyuy.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  router.push('/profile-selector');
                }}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-teal-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  router.push('/profile-selector');
                }}
                className="w-full flex items-center justify-center gap-2 bg-[var(--bg-card)] text-teal-600 font-semibold py-3 px-4 rounded-xl border-2 border-teal-600 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Crear cuenta gratis
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] py-2 transition-colors"
              >
                Ahora no
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
