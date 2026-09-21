'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

interface PlanCardProps {
  plan: any;
  onEdit: () => void;
  onManageDiscounts: () => void;
  onToggle: () => void;
  onDelete?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onManageDiscounts, onToggle, onDelete }) => {
  const cycleMap = {
    'MONTHLY': 'Mensual',
    'QUARTERLY': 'Trimestral', 
    'YEARLY': 'Anual',
    'LIFETIME': 'Vitalicio'
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Header - Admin Style */}
      <div className="p-3 border-b border-gray-50 bg-gray-50/50">
        <div className="flex justify-between items-center mb-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
            plan.isActive 
              ? 'bg-green-50 text-green-700 border-green-100' 
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {plan.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-0.5 truncate">
          {plan.displayName}
        </h3>
        <p className="text-[8px] text-gray-400 font-mono uppercase tracking-tighter truncate">CODE: {plan.name}</p>
      </div>

      {/* Body - Settings Grid */}
      <div className="p-3 space-y-2 bg-white">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-gray-900">
            S/ {plan.priceInPen?.toLocaleString()}
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            /{cycleMap[plan.billingCycle as keyof typeof cycleMap]?.toLowerCase() || 'mes'}
          </span>
        </div>

        {/* Configuration Limits */}
        <div className="space-y-1.5 pt-1.5 border-t border-gray-50">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Límites</p>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-gray-50/50">
              <span className="text-gray-500 font-medium">Publicaciones</span>
              <span className="font-bold text-gray-900">{plan.publicationsLimit || 0}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-gray-50/50">
              <span className="text-gray-500 font-medium">Proyectos</span>
              <span className="font-bold text-gray-900">{plan.projectsLimit || 0}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-gray-50/50">
              <span className="text-gray-500 font-medium">Fotos</span>
              <span className="font-bold text-gray-900">{plan.photosLimit || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="p-3 bg-white border-t border-gray-50 grid grid-cols-1 gap-1.5">
        <button
          onClick={onEdit}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-[11px] font-bold shadow-sm shadow-blue-100 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>Configurar</span>
        </button>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={onManageDiscounts}
            className="py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-[9px] font-bold active:scale-[0.98]"
          >
            Descuentos
          </button>
          <button
            onClick={onToggle}
            className={`py-2 rounded-lg transition-all text-[9px] font-bold border active:scale-[0.98] ${
              plan.isActive 
                ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' 
                : 'bg-white border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {plan.isActive ? 'Desactivar' : 'Activar'}
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all text-[9px] font-bold active:scale-[0.98]"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
