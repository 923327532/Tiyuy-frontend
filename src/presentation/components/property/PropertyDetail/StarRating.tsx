'use client';

import { useState, useEffect } from 'react';
import { Star, X, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { useAuthStore } from '@/presentation/store/authStore';
import { useRouter } from 'next/navigation';

interface StarRatingProps {
  initialRating?: number;      // Promedio general de la propiedad/proyecto
  averageRating?: number;      // Promedio general (se sobrepone a initialRating si no ha calificado)
  totalRatings?: number;       // Total de calificaciones
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  propertyId?: number;
  projectId?: number;
  onRatingSaved?: () => void;
}

export function StarRating({ 
  initialRating = 0, 
  averageRating,
  totalRatings,
  onRate, 
  readonly = false, 
  size = 'md',
  showValue = false,
  propertyId,
  projectId,
  onRatingSaved
}: StarRatingProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  // Mostrar promedio general si existe, sino el initialRating
  const [rating, setRating] = useState(averageRating || initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(totalRatings || 0);

  // Sincronizar el promedio cuando cambie desde afuera (solo si el usuario no ha calificado)
  useEffect(() => {
    if (averageRating !== undefined && userRating === null && hoverRating === 0) {
      setRating(averageRating);
    }
  }, [averageRating, userRating, hoverRating]);

  // Cargar la calificación del usuario si existe
  useEffect(() => {
    if (readonly) return;
    const loadUserRating = async () => {
      try {
        const token = authStorage.getToken();
        if (!token) return;
        
        const entityType = propertyId ? 'properties' : 'projects';
        const entityId = propertyId || projectId;
        if (!entityId) return;

        const res = await fetch(`/api/${entityType}/${entityId}/my-rating`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.rating) {
            setUserRating(data.rating);
            setRating(data.rating);
          } else {
            // Usuario no ha calificado, mostrar promedio
            if (averageRating !== undefined) {
              setRating(averageRating);
            }
          }
        }
      } catch {
        // Silently fail
      }
    };
    loadUserRating();
  }, [propertyId, projectId, readonly]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = async (value: number) => {
    if (readonly) return;
    
    // Verificar autenticación usando el store y el token
    const token = authStorage.getToken();
    const isAuth = isAuthenticated && token && token !== 'undefined' && token !== 'null' && token.length > 10;
    
    if (!isAuth) {
      setPendingRating(value);
      setShowAuthModal(true);
      return;
    }

    await saveRating(value);
  };

  const saveRating = async (value: number) => {
    setRating(value);
    if (onRate) onRate(value);

    // Guardar en backend si tenemos propertyId o projectId
    if (propertyId || projectId) {
      setSaving(true);
      try {
        const entityType = propertyId ? 'properties' : 'projects';
        const entityId = propertyId || projectId;
        const token = authStorage.getToken();

        const res = await fetch(`/api/${entityType}/${entityId}/ratings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ score: value })
        });

        if (res.ok) {
          setUserRating(value);
          toast.success(`Calificaste con ${value} estrella${value !== 1 ? 's' : ''}`);
          if (onRatingSaved) onRatingSaved();
        } else if (res.status === 409) {
          // Ya calificó, actualizar
          const updateRes = await fetch(`/api/${entityType}/${entityId}/ratings`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ score: value })
          });
          if (updateRes.ok) {
            setUserRating(value);
            toast.success(`Actualizaste tu calificación a ${value} estrella${value !== 1 ? 's' : ''}`);
            if (onRatingSaved) onRatingSaved();
          }
        } else {
          const errorData = await res.json().catch(() => null);
          toast.error(errorData?.message || 'Error al guardar calificación');
        }
      } catch {
        toast.error('Error de conexión al guardar calificación');
      } finally {
        setSaving(false);
      }
    }
  };

  const entityName = propertyId ? 'propiedad' : 'proyecto';

  return (
    <>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= (hoverRating || rating);
          
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => !readonly && !saving && setHoverRating(starValue)}
              onMouseLeave={() => !readonly && !saving && setHoverRating(0)}
              disabled={readonly || saving}
              className={`${readonly ? 'cursor-default' : saving ? 'cursor-wait' : 'cursor-pointer'} p-0.5 transition-transform ${!readonly && !saving && 'hover:scale-110'}`}
              aria-label={`${starValue} estrella${starValue !== 1 ? 's' : ''}`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-[var(--text-tertiary)]'
                } transition-colors`}
              />
            </button>
          );
        })}
        {showValue && (hoverRating || rating) > 0 && (
          <span className="text-sm text-[var(--text-secondary)] ml-1">
            {hoverRating || rating}/5
          </span>
        )}
        {saving && (
          <span className="text-xs text-[var(--text-tertiary)] ml-1 animate-pulse">Guardando...</span>
        )}
      </div>

      {/* Modal de autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
          <div 
            className="bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icono */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            {/* Título */}
            <h3 className="text-lg font-bold text-[var(--text-primary)] text-center mb-2">
              Calificar {entityName}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
              {pendingRating && (
                <>Quieres darle <span className="font-semibold text-amber-500">{pendingRating} estrella{pendingRating !== 1 ? 's' : ''}</span> a este {entityName}.</>
              )}
              {' '}Para calificar, necesitas una cuenta en Tiyuy.
            </p>

            {/* Botones */}
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
