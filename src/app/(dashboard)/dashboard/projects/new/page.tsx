"use client";

import React, { useState } from 'react';
import { Info, MapPin, Layers, Calendar, Image as ImageIcon } from 'lucide-react';
import { tiyuyColors } from '@/styles/tiyuy-colors';
import { useRouter } from 'next/navigation';
import { PropertyForm } from '@/presentation/components/property/PropertyForm/PropertyForm';
import { useAuthStore } from '@/presentation/store/authStore';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { TrialGuard } from '@/presentation/components/guards/TrialGuard/TrialGuard';
import { TrialWarningBanner } from '@/presentation/components/guards/TrialGuard/TrialWarningBanner';

const PROJECT_STEPS = [
  { number: 1, title: 'Información del Proyecto', description: 'Tipo y fase' },
  { number: 2, title: 'Ubicación', description: 'Dirección exacta' },
  { number: 3, title: 'Unidades', description: 'Departamentos disponibles' },
  { number: 4, title: 'Timeline', description: 'Fechas de entrega' },
  { number: 5, title: 'Multimedia', description: 'Planos y renders' },
];

export default function NuevoProyectoPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <ProtectedRoute>
      <TrialGuard>
        <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
          <div className="max-w-[1400px] mx-auto px-8 xl:px-20">
            <TrialWarningBanner />

            {/* Hero (simple) */}
            <div className="mb-2">
              <div className="py-2">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Nuevo Proyecto</h1>
                <p className="mt-2 text-base text-[var(--text-secondary)]">Completa la información del proyecto en pasos sencillos. Puedes guardar borrador y completar más tarde.</p>
              </div>
            </div>

            {/* Progress Steps - Diseño moderno */}
            <div className="mb-8">
              <div className="bg-[var(--bg-card)] rounded-xl p-6 shadow-sm border border-[var(--border-color)]">
                <div className="flex items-center justify-between relative">
                  {/* Línea de progreso de fondo */}
                  <div className="absolute left-8 right-8 top-6 hidden md:block">
                    <div className="h-0.5 bg-[var(--bg-tertiary)] rounded-full relative">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${((currentStep - 1) / (PROJECT_STEPS.length - 1)) * 100}%`,
                          backgroundColor: 'var(--brand-primary)',
                        }}
                      />
                    </div>
                  </div>

                  {PROJECT_STEPS.map((step, index) => {
                    const Icon = [Info, MapPin, Layers, Calendar, ImageIcon][step.number - 1];
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;
                    
                    return (
                      <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                        {/* Círculo con icono */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? 'scale-110 shadow-lg'
                              : isCompleted
                              ? 'shadow-md'
                              : ''
                          }`}
                          style={{
                            backgroundColor: isActive || isCompleted ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                            color: isActive || isCompleted ? 'white' : 'var(--text-secondary)',
                          }}
                        >
                          <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                        </div>

                        {/* Texto */}
                        <div className="mt-3 text-center">
                          <p
                            className={`text-sm font-semibold hidden md:block transition-colors duration-300`}
                            style={{
                              color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--brand-primary)' : 'var(--text-secondary)',
                            }}
                          >
                            {step.title}
                          </p>
                          <p
                            className="text-xs mt-1 hidden md:block transition-colors duration-300"
                            style={{
                              color: isActive ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                            }}
                          >
                            {step.description}
                          </p>
                        </div>

                        {/* Indicador de paso activo */}
                        {isActive && (
                          <div
                            className="absolute -bottom-2 w-12 h-1 rounded-full hidden md:block"
                            style={{ backgroundColor: 'var(--brand-primary)' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[var(--bg-card)] rounded-lg shadow-lg p-3 sm:p-6">
              <PropertyForm mode="create" formType="project" onStepChange={setCurrentStep} />
            </div>
          </div>
        </div>

      </TrialGuard>
    </ProtectedRoute>
  );
}
