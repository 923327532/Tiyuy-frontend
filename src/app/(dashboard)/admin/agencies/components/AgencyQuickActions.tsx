'use client';

import { CheckCircle, XCircle, Ban, Tag, DollarSign, Send } from 'lucide-react';

interface AgencyQuickActionsProps {
  onActivate: () => void;
  onSuspend: () => void;
  onBlock: () => void;
  onCreateDiscount: () => void;
  onApplyDirectDiscount: () => void;
  onNotify: () => void;
  isChangingStatus?: boolean;
  currentStatus?: string;
  isEnabled?: boolean;
}

export default function AgencyQuickActions({
  onActivate,
  onSuspend,
  onBlock,
  onCreateDiscount,
  onApplyDirectDiscount,
  onNotify,
  isChangingStatus = false,
  currentStatus,
  isEnabled = true,
}: AgencyQuickActionsProps) {
  const statusActions = [
    {
      id: 'ACTIVE',
      icon: CheckCircle,
      label: 'Activar inmobiliaria',
      onClick: onActivate,
      activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg ring-2 ring-emerald-300 ring-offset-2',
      inactiveColor: 'text-gray-600 hover:bg-gray-50 hover:shadow-sm border border-gray-200',
      // Este botón está resaltado cuando el estado actual es ACTIVE
      isCurrentState: currentStatus === 'ACTIVE',
      // Este botón está deshabilitado solo cuando el estado ya es ACTIVE
      isDisabled: currentStatus === 'ACTIVE' || isChangingStatus,
    },
    {
      id: 'SUSPENDED',
      icon: XCircle,
      label: 'Suspender inmobiliaria',
      onClick: onSuspend,
      activeColor: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg ring-2 ring-orange-300 ring-offset-2',
      inactiveColor: 'text-gray-600 hover:bg-gray-50 hover:shadow-sm border border-gray-200',
      // Este botón está resaltado cuando el estado actual es SUSPENDED
      isCurrentState: currentStatus === 'SUSPENDED',
      // Este botón está deshabilitado cuando el estado ya es SUSPENDED
      isDisabled: currentStatus === 'SUSPENDED' || isChangingStatus,
    },
    {
      id: 'BLOCKED',
      icon: Ban,
      label: 'Bloquear inmobiliaria',
      onClick: onBlock,
      activeColor: 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg ring-2 ring-red-300 ring-offset-2',
      inactiveColor: 'text-gray-600 hover:bg-gray-50 hover:shadow-sm border border-gray-200',
      // Este botón está resaltado cuando el estado actual es BLOCKED
      isCurrentState: currentStatus === 'BLOCKED',
      // Este botón está deshabilitado cuando el estado ya es BLOCKED
      isDisabled: currentStatus === 'BLOCKED' || isChangingStatus,
    },
  ];

  const otherActions = [
    {
      icon: Tag,
      label: 'Crear código de descuento',
      onClick: onCreateDiscount,
      color: 'text-blue-600 hover:bg-blue-50 hover:shadow-sm',
      disabled: false,
    },
    {
      icon: DollarSign,
      label: 'Aplicar descuento directo',
      onClick: onApplyDirectDiscount,
      color: 'text-teal-600 hover:bg-teal-50 hover:shadow-sm',
      disabled: false,
    },
    {
      icon: Send,
      label: 'Notificar inmobiliaria',
      onClick: onNotify,
      color: 'text-cyan-600 hover:bg-cyan-50 hover:shadow-sm',
      disabled: false,
    },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Estado de la inmobiliaria</h4>
      <div className="space-y-2 mb-6">
        {statusActions.map((action) => {
          const Icon = action.icon;
          const isCurrentState = action.isCurrentState;
          const isDisabled = action.isDisabled;
          
          // DEBUG: Logs para depurar el estado de los botones
          console.log(`🔍 DEBUG Botón ${action.id}:`, {
            currentStatus,
            isCurrentState,
            isDisabled,
            shouldClick: !isDisabled
          });
          
          return (
            <button
              key={action.id}
              onClick={() => {
                console.log(` DEBUG: Clic en botón ${action.id}`);
                if (!isDisabled) {
                  action.onClick();
                } else {
                  console.log(` DEBUG: Botón ${action.id} está deshabilitado`);
                }
              }}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCurrentState
                  ? action.activeColor // Estado actual: resaltado con el color correspondiente
                  : isDisabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                  : action.inactiveColor // Otros estados: color normal
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{action.label}</span>
              {isCurrentState && (
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded">
                  ACTUAL
                </span>
              )}
            </button>
          );
        })}
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-3">Acciones rápidas</h4>
      <div className="space-y-2">
        {otherActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : action.color
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
