'use client';
import React from 'react';
import { useOnboarding } from '@/presentation/hooks';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentStep, totalSteps, progress } = useOnboarding();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Stepper header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}% completado
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Steps labels */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
          <div className={`text-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="text-xs sm:text-sm font-medium">Bienvenida</div>
          </div>
          <div className={`text-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="text-xs sm:text-sm font-medium">Verificación KYC</div>
          </div>
          <div className={`text-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="text-xs sm:text-sm font-medium">Configuración</div>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
