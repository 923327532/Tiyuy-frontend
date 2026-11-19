'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';

interface PlanExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function PlanExpiredModal({ isOpen, onClose, message }: PlanExpiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoToPlans = () => {
    onClose();
    router.push('/plans');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center mx-auto mb-4">
            <span className="text-[var(--brand-primary)] text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Límite de publicaciones</h2>
          <p className="text-gray-500 text-sm mb-1">
            {message || 'Has alcanzado el límite de publicaciones de tu plan actual.'}
          </p>
          <p className="text-gray-400 text-xs mb-6">
            El proyecto no se modificará. Puedes revisar los planes disponibles para continuar.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleGoToPlans}
              className="w-full py-3 bg-[var(--brand-primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Ver Planes Disponibles
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Entendido, lo haré después
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
