'use client';

import React, { useState } from 'react';
import { Modal } from '@/presentation/components/ui/Modal';
import { Button } from '@/presentation/components/ui/Button';
import { Plus, X } from 'lucide-react';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (plan: any) => void;
  isPending: boolean;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isPending
}) => {
  const [form, setForm] = useState({
    code: '',
    displayName: '',
    description: '',
    priceInPen: 0,
    priceInUsd: 0,
    currency: 'PEN',
    durationDays: 30,
    publicationsLimit: 1,
    projectsLimit: 0,
    photosLimit: 5,
    campaignsLimit: 0,
    bannersLimit: 0,
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
    billingCycle: 'MONTHLY',
    isPromotional: false,
    features: ['Publicación de propiedades'],
  });

  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const handleSubmit = () => {
    onCreate({
      ...form,
      priceInPen: Number(form.priceInPen),
      priceInUsd: Number(form.priceInUsd),
      durationDays: Number(form.durationDays),
      publicationsLimit: Number(form.publicationsLimit),
      projectsLimit: Number(form.projectsLimit),
      photosLimit: Number(form.photosLimit),
      displayOrder: Number(form.displayOrder),
      priceQuarterly: form.isPromotional ? 0 : null,
      priceYearly: form.isPromotional ? 0 : null,
      billingCycle: form.isPromotional ? 'MONTHLY' : form.billingCycle,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl p-0 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-[#00E676] px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-green-800" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Crear Nuevo Plan</h3>
                <p className="text-xs text-green-700">Complete los datos del nuevo plan de suscripción</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-green-300 rounded-lg transition-colors text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Código *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                placeholder="BASIC, PREMIUM..."
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Nombre para Mostrar *</label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({...form, displayName: e.target.value})}
                placeholder="Plan Básico"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={2}
              placeholder="Describe el plan..."
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Precio (S/) *</label>
              <input
                type="number"
                value={form.priceInPen || ''}
                onChange={(e) => setForm({...form, priceInPen: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Precio ($)</label>
              <input
                type="number"
                value={form.priceInUsd || ''}
                onChange={(e) => setForm({...form, priceInUsd: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 text-center block">Duración (días)</label>
              <input
                type="number"
                value={form.durationDays || ''}
                onChange={(e) => setForm({...form, durationDays: parseInt(e.target.value) || 30})}
                className="w-full px-2 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 text-center block">Publicaciones</label>
              <input
                type="number"
                value={form.publicationsLimit || ''}
                onChange={(e) => setForm({...form, publicationsLimit: parseInt(e.target.value) || 0})}
                className="w-full px-2 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 text-center block">Fotos</label>
              <input
                type="number"
                value={form.photosLimit || ''}
                onChange={(e) => setForm({...form, photosLimit: parseInt(e.target.value) || 0})}
                className="w-full px-2 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Proyectos</label>
              <input
                type="number"
                value={form.projectsLimit || ''}
                onChange={(e) => setForm({...form, projectsLimit: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Ciclo Facturación</label>
              <select
                value={form.billingCycle}
                onChange={(e) => setForm({...form, billingCycle: e.target.value})}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold"
              >
                <option value="MONTHLY">Mensual</option>
                <option value="QUARTERLY">Trimestral</option>
                <option value="YEARLY">Anual</option>
                <option value="LIFETIME">Vitalicio</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Características (features)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="Ej: Fotos ilimitadas"
                className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <button
                onClick={handleAddFeature}
                className="px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.features.map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                  {feature}
                  <button onClick={() => handleRemoveFeature(i)} className="text-gray-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({...form, isActive: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${form.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.isActive ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="text-xs font-semibold text-gray-700">Activo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${form.isFeatured ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.isFeatured ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="text-xs font-semibold text-gray-700">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isPromotional}
                  onChange={(e) => setForm({...form, isPromotional: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${form.isPromotional ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.isPromotional ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="text-xs font-semibold text-gray-700">Plan Promocional (solo mensual)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" className="flex-1 py-2.5 text-sm font-medium" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/30"
            onClick={handleSubmit}
            disabled={isPending || !form.code || !form.displayName}
          >
            {isPending ? 'Creando...' : 'Crear Plan'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};