'use client';
import React from 'react';
import { OnboardingStepper } from '../OnboardingStepper';
import { Card } from '@/presentation/components/ui';
import { useProfileStore } from '@/presentation/store';
import { PROFILES_CONFIG } from '@/core/domain/entities';
import { Check, CheckCircle, CheckSquare, Folder, ShieldCheck, Zap } from 'lucide-react';

export const BienvenidaScreen: React.FC = () => {
  const { selectedProfile } = useProfileStore();

  const rawConfig = selectedProfile
    ? (PROFILES_CONFIG as Record<string, { id: string; name: string; description: string; icon: string; color: string } | undefined>)[selectedProfile] ?? null
    : null;
  const config = rawConfig
    ? { ...rawConfig, title: rawConfig.name, features: [] as string[], colorClass: `bg-${rawConfig.color}-500` }
    : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
          <Folder className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          ¡Bienvenido a TIYUY!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Tu cuenta como <strong>{config?.title}</strong> está casi lista.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card className="lg:col-span-1 text-center p-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${config?.colorClass} bg-opacity-10 flex items-center justify-center`}>
            <div className={`${config?.colorClass?.replace('bg-', 'text-')} p-3 rounded-xl`}>
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{config?.title}</h3>
          <p className="text-gray-600 mb-4">{config?.description}</p>
          <div className="space-y-2">
            {config?.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckSquare className="w-4 h-4 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Próximos pasos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">1. Verificar Identidad</h4>
                  <p className="text-sm text-gray-600">Confirma tu identidad con RENIEC</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">2. Configurar Preferencias</h4>
                  <p className="text-sm text-gray-600">Personaliza tu experiencia</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">3. ¡Listo!</h4>
                  <p className="text-sm text-gray-600">Accede a tu dashboard</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <OnboardingStepper />
    </div>
  );
};
