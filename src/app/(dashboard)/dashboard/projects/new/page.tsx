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
          <div className="max-w-7xl mx-auto px-8 xl:px-16">
            <TrialWarningBanner />

            {/* Hero (simple) */}
            <div className="mb-8">
              <div className="py-6">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Nuevo Proyecto</h1>
                <p className="mt-2 text-base text-[var(--text-secondary)]">Completa la información del proyecto en pasos sencillos. Puedes guardar borrador y completar más tarde.</p>
              </div>
            </div>

            {/* Progress Steps (icons, styled with brand colors + progress bar) */}
            <div className="mb-8">
              <div className="relative">
                {/* Background track */}
                <div className="absolute left-0 right-0 top-6 hidden md:block">
                  <div style={{ height: 6, backgroundColor: 'var(--bg-tertiary)', borderRadius: 9999 }} />
                </div>

                {/* Filled progress */}
                <div className="absolute left-0 top-6 hidden md:block">
                  <div
                    style={{
                      height: 6,
                      backgroundColor: 'var(--brand-primary)',
                      borderRadius: 9999,
                      width: `${((currentStep - 1) / (PROJECT_STEPS.length - 1)) * 100}%`,
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>

                {/* Circles and segments */}
                <div className="flex items-center w-full">
                  {PROJECT_STEPS.map((step, index) => {
                    const Icon = [Info, MapPin, Layers, Calendar, ImageIcon][step.number - 1];
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;
                    const circleStyle: React.CSSProperties = isActive || isCompleted 
                      ? { backgroundColor: 'var(--brand-primary)', color: 'white', boxShadow: '0 6px 18px rgba(74,154,62,0.12)' } 
                      : { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };

                    return (
                      <React.Fragment key={step.number}>
                        <div className="flex items-center justify-center z-10" style={{ width: 48 }}>
                          <div style={circleStyle} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>

                        {index < PROJECT_STEPS.length - 1 && (
                          <div className="flex-1 px-3">
                            <div className="hidden md:block" style={{ height: 6, borderRadius: 9999, backgroundColor: currentStep > step.number ? 'var(--brand-primary)' : 'var(--bg-tertiary)', transition: 'background-color 200ms' }} />
                            <div className="md:hidden" style={{ height: 2, borderRadius: 9999, backgroundColor: currentStep > step.number ? 'var(--brand-primary)' : 'var(--bg-tertiary)', transition: 'background-color 200ms' }} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Labels under circles */}
                <div className="flex items-start mt-3 w-full">
                  {PROJECT_STEPS.map((step, index) => (
                    <React.Fragment key={`label-${step.number}`}>
                      <div style={{ width: 48 }} className="text-center">
                        <p className={`text-sm ${currentStep === step.number ? 'font-semibold' : 'font-medium'} hidden md:block`} style={{ color: currentStep === step.number ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{step.title}</p>
                        <p className={`text-xs mt-0.5 hidden md:block`} style={{ color: 'var(--text-tertiary)' }}>{step.description}</p>
                      </div>

                      {index < PROJECT_STEPS.length - 1 && (
                        <div className="flex-1" />
                      )}
                    </React.Fragment>
                  ))}
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
