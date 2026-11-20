'use client';

import { NewDiscountForm } from '../types';

interface CreateDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  developers: { id: number; name: string }[];
  newDiscount: NewDiscountForm;
  setNewDiscount: React.Dispatch<React.SetStateAction<NewDiscountForm>>;
  isCreatePending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateDiscountModal({
  isOpen,
  onClose,
  developers,
  newDiscount,
  setNewDiscount,
  isCreatePending,
  onSubmit,
}: CreateDiscountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Crear Código de Descuento</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Inmobiliaria *</label>
            <select
              value={newDiscount.developerId}
              onChange={(e) => setNewDiscount(prev => ({ ...prev, developerId: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccionar inmobiliaria</option>
              {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Código *</label>
            <input
              type="text"
              value={newDiscount.code}
              onChange={(e) => setNewDiscount(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              required
              placeholder="DESCUENTO20"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Descuento % *</label>
            <input
              type="number"
              value={newDiscount.discountPercentage}
              onChange={(e) => setNewDiscount(prev => ({ ...prev, discountPercentage: e.target.value }))}
              required
              min="1"
              max="100"
              placeholder="20"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Máx. Usos (opcional)</label>
            <input
              type="number"
              value={newDiscount.maxUses}
              onChange={(e) => setNewDiscount(prev => ({ ...prev, maxUses: e.target.value }))}
              min="1"
              placeholder="Ilimitado"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Válido Desde</label>
              <input
                type="datetime-local"
                value={newDiscount.validFrom}
                onChange={(e) => setNewDiscount(prev => ({ ...prev, validFrom: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Válido Hasta</label>
              <input
                type="datetime-local"
                value={newDiscount.validUntil}
                onChange={(e) => setNewDiscount(prev => ({ ...prev, validUntil: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newDiscount.applicableToAgents}
                onChange={(e) => setNewDiscount(prev => ({ ...prev, applicableToAgents: e.target.checked }))}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              Aplicable a agentes de la inmobiliaria
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreatePending}
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 disabled:opacity-50"
            >
              {isCreatePending ? 'Creando...' : 'Crear Descuento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
