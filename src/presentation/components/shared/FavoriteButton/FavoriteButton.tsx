'use client';

import { useState } from 'react';
import { useAuthStore } from '@/presentation/store/authStore';
import { useFavoriteStatus, useToggleFavorite } from '@/presentation/hooks/useFavorites';
import { useRouter } from 'next/navigation';
import { Heart, Loader, LogIn, UserPlus, AlertTriangle } from 'lucide-react';
import { getToken, isTokenExpired } from '@/infrastructure/api/token-utils';

interface FavoriteButtonProps {
  propertyId: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'topbar' | 'icon';
}

function AuthenticatedFavoriteButton({ propertyId, size, variant }: FavoriteButtonProps) {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isFavorite, isLoading } = useFavoriteStatus(propertyId);
  const toggleMutation = useToggleFavorite(propertyId);

  const handleClick = () => {
    // Verificar nuevamente si el token sigue siendo válido antes de hacer la petición
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setShowLoginModal(true);
      return;
    }
    toggleMutation.mutate(undefined);
  };

  const isPending = isLoading || toggleMutation.isPending;

  /* ── Variante topbar ── */
  if (variant === 'topbar') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-sm font-medium transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isFavorite
              ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
              : 'text-gray-600 hover:text-rose-500 hover:bg-rose-50'
            }
          `}
        >
          <Heart className="" />
          {isPending ? (
            <span className="flex items-center gap-1">
              <Loader className="animate-spin w-3 h-3" />
              ...
            </span>
          ) : isFavorite ? 'Guardado' : 'Favorito'}
        </button>

        {/* Modal de inicio de sesión */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Guardar en Favoritos</h3>
                <p className="text-rose-100 text-sm mt-1">Inicia sesión para guardar esta propiedad</p>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Debes iniciar sesión o crear una cuenta para agregar propiedades a tus favoritos.
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/login')} className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" /> Iniciar Sesión
                </button>
                <button onClick={() => router.push('/register')} className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" /> Crear una Cuenta
                </button>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-center">
                <button onClick={() => setShowLoginModal(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Ahora no, gracias
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /* ── Variante icon ── */
  const sizes: Record<string, string> = { sm: 'w-8 h-8', md: 'w-9 h-9', lg: 'w-11 h-11' };
  const currentSize = size || 'md';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        className={`
          ${sizes[currentSize]}
          rounded-full flex items-center justify-center
          bg-[var(--bg-card)] shadow
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isFavorite ? 'text-rose-500' : 'text-[var(--text-secondary)] hover:text-rose-500'}
        `}
      >
        {isPending ? (
          <Loader className="animate-spin w-4 h-4 text-gray-400" />
        ) : (
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        )}
      </button>

      {/* Modal de inicio de sesión */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-6 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Guardar en Favoritos</h3>
              <p className="text-rose-100 text-sm mt-1">Inicia sesión para guardar esta propiedad</p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Debes iniciar sesión o crear una cuenta para agregar propiedades a tus favoritos.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push('/login')}
                className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push('/register')}
                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Crear una Cuenta
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-center">
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Ahora no, gracias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UnauthenticatedFavoriteButton({ size, variant }: { size?: 'sm' | 'md' | 'lg'; variant?: 'topbar' | 'icon' }) {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = () => {
    setShowLoginModal(true);
  };

  if (variant === 'topbar') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          aria-label="Agregar a favoritos"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-rose-500 hover:bg-rose-50"
        >
          <Heart className="" />
          Favorito
        </button>
        {showLoginModal && <LoginModal router={router} onClose={() => setShowLoginModal(false)} />}
      </>
    );
  }

  const sizes: Record<string, string> = { sm: 'w-8 h-8', md: 'w-9 h-9', lg: 'w-11 h-11' };
  const currentSize = size || 'md';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Agregar a favoritos"
        className={`${sizes[currentSize]} rounded-full flex items-center justify-center bg-[var(--bg-card)] shadow text-[var(--text-secondary)] hover:text-rose-500 transition-all duration-200`}
      >
        <Heart className="w-4 h-4" />
      </button>
      {showLoginModal && <LoginModal router={router} onClose={() => setShowLoginModal(false)} />}
    </>
  );
}

function LoginModal({ router, onClose }: { router: ReturnType<typeof useRouter>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Icono */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          Guardar en Favoritos
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Para guardar propiedades en favoritos, necesitas una cuenta en Tiyuy.
        </p>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              router.push('/profile-selector');
            }}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-teal-700 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>
          <button
            onClick={() => {
              onClose();
              router.push('/profile-selector');
            }}
            className="w-full flex items-center justify-center gap-2 bg-white text-teal-600 font-semibold py-3 px-4 rounded-xl border-2 border-teal-600 hover:bg-teal-50 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Crear cuenta gratis
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}

export function FavoriteButton({ propertyId, size = 'md', variant = 'icon' }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthStore();
  // Verificar si hay un token real, no expirado en localStorage
  let hasValidToken = false;
  if (typeof window !== 'undefined') {
    const token = getToken();
    hasValidToken = !!token && !isTokenExpired(token);
  }
  // Solo considerar autenticado si el store dice que sí Y hay un token válido
  const reallyAuthenticated = isAuthenticated && hasValidToken;
  
  if (!reallyAuthenticated) {
    return <UnauthenticatedFavoriteButton size={size} variant={variant} />;
  }
  return <AuthenticatedFavoriteButton propertyId={propertyId} size={size} variant={variant} />;
}
