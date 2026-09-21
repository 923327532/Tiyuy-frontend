'use client';
import React, { useState } from 'react';
import { OnboardingStepper } from '../OnboardingStepper';
import { Button, Input } from '@/presentation/components/ui';

export const ConfigScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    districts: ['Miraflores', 'San Isidro'],
    propertyTypes: ['Departamentos', 'Casas'],
    notifications: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar preferencias
    console.log('Preferencias guardadas:', formData);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Configuración Inicial
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Personaliza tu experiencia en 2 minutos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Distritos de interés</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {['Miraflores', 'San Isidro', 'Surco', 'Barranco', 'La Molina', 'San Borja'].map((district) => (
              <label key={district} className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={formData.districts.includes(district)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      districts: checked
                        ? [...prev.districts, district]
                        : prev.districts.filter(d => d !== district),
                    }));
                  }}
                />
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {district}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Tipos de propiedad</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {['Departamentos', 'Casas', 'Departamentos en preventa', 'Oficinas'].map((type) => (
              <label key={type} className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={formData.propertyTypes.includes(type)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      propertyTypes: checked
                        ? [...prev.propertyTypes, type]
                        : prev.propertyTypes.filter(t => t !== type),
                    }));
                  }}
                />
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
              />
              <div>
                <div className="font-medium text-gray-900">Notificaciones de nuevas propiedades</div>
                <div className="text-sm text-gray-600">Recibe alertas cuando encuentren propiedades que coincidan con tus preferencias</div>
              </div>
            </label>
          </div>
        </div>

        <OnboardingStepper />
      </form>
    </div>
  );
};
