'use client';

import { useState } from 'react';
import { useAuthStore } from '@/presentation/store/authStore';
import { useActiveSubscription } from '@/presentation/hooks/useFinance';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import { toast } from 'sonner';
import { UpgradePlanModal } from '@/presentation/components/modals/UpgradePlanModal';
import { Crown, Star, Lock } from 'lucide-react';

interface FeaturePropertyButtonProps {
  propertyId: number;
  ownerId: number;
  isFeatured?: boolean;
  status?: string;
}

export function FeaturePropertyButton({ 
  propertyId, 
  ownerId, 
  isFeatured = false, 
  status = '' 
}: FeaturePropertyButtonProps) {
  const { user } = useAuthStore();
  const { data: activeSubscription } = useActiveSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Obtener el plan actual del usuario
  const currentPlan = activeSubscription?.plan?.id || 'FREE';
  const canFeatureProperty = currentPlan === 'PREMIUM';

  // Solo mostrar si el usuario es el dueño y la propiedad está publicada
  if (!user || user.id !== ownerId) {
    return null;
  }

  // Solo mostrar si está publicada y no está destacada
  if (status !== 'PUBLISHED' || isFeatured) {
    return null;
  }

  const handleFeatureProperty = async () => {
    if (isLoading) return;

    // Verificar si tiene plan PRO
    if (!canFeatureProperty) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const propertyRepo = new PropertyRepository();
      await propertyRepo.featureProperty(propertyId);
      
      toast.success(' ¡Propiedad destacada correctamente!');
      
      // Recargar la página para mostrar el cambio
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error destacando propiedad:', error);
      
      if (error.response?.status === 403) {
        toast.error('❌ No tienes permiso para destacar esta propiedad');
      } else if (error.response?.status === 409) {
        toast.error('❌ La propiedad ya está destacada');
      } else if (error.response?.status === 400) {
        toast.error('❌ Solo se pueden destacar propiedades publicadas');
      } else {
        toast.error('❌ Error al destacar propiedad: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanInfo = () => {
    switch (currentPlan) {
      case 'PREMIUM':
        return {
          name: 'PREMIUM',
          icon: <Crown className="w-4 h-4" />,
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          description: 'Acceso completo a todas las funciones'
        };
      case 'BASIC':
        return {
          name: 'BASIC',
          icon: <Star className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          description: 'Funciones limitadas'
        };
      case 'FREE':
        return {
          name: 'FREE',
          icon: <Lock className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          description: 'Funciones básicas'
        };
      default:
        // Si no hay suscripción, mostrar FREE por defecto
        return {
          name: 'FREE',
          icon: <Lock className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          description: 'Funciones básicas'
        };
    }
  };

  const planInfo = getPlanInfo();

  return (
    <>
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-5">
        {/* Badge del plan actual */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${planInfo.color}`}>
              {planInfo.icon}
              Plan {planInfo.name}
            </span>
            {!canFeatureProperty && (
              <span className="text-xs text-[var(--text-secondary)]">
                {planInfo.description}
              </span>
            )}
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl mb-3">
            {canFeatureProperty ? '⭐' : '🔒'}
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
            {canFeatureProperty ? 'Destaca tu propiedad' : 'Mejora tu plan para destacar'}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {canFeatureProperty 
              ? 'Haz que tu propiedad aparezca en la página principal y reciba más visitas'
              : 'El destacado de propiedades está disponible solo para usuarios con plan PRO'
            }
          </p>
          <button
            onClick={handleFeatureProperty}
            disabled={isLoading || !canFeatureProperty}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              canFeatureProperty
                ? 'bg-yellow-500 text-white hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </>
            ) : canFeatureProperty ? (
              <>
                ⭐ Destacar propiedad
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Actualizar a PRO
              </>
            )}
          </button>
          {!canFeatureProperty && (
            <p className="text-xs text-[var(--text-tertiary)] mt-3">
              <span className="font-semibold">Plan PRO:</span> Destaca tus propiedades y recibe más visitas
            </p>
          )}
        </div>
      </div>

      {/* Modal de upgrade */}
      {showUpgradeModal && (
        <UpgradePlanModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
}
