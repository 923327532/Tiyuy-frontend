'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyForm } from '@/presentation/components/property/PropertyForm/PropertyForm';
import { useAuthStore } from '@/presentation/store/authStore';
import { useMyProperties } from '@/presentation/hooks/useProperties';
import { useActiveSubscription, usePublicationStats } from '@/presentation/hooks/useFinance';
import { ChevronLeft, Check, ChevronRight } from 'lucide-react';
import { AdminRestrictionGuard } from '@/presentation/components/guards/AdminRestrictionGuard';

const STEPS = [
  { number: 1, title: 'Información básica', description: 'Tipo y precio' },
  { number: 2, title: 'Ubicación', description: 'Dirección exacta' },
  { number: 3, title: 'Características', description: 'Detalles del inmueble' },
  { number: 4, title: 'Fotos', description: 'Imágenes del inmueble' },
];

export default function NuevaPropiedadPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data: subscription } = useActiveSubscription();
  const { data: publicationStats } = usePublicationStats();

  const [currentStep, setCurrentStep] = useState(1);

  // Usar las estadísticas del backend (calcula canPublish correctamente,
  // incluido el plan FREE para quien nunca publicó). Fallback a la suscripción.
  const hasActiveSubscription = !!subscription;
  const maxPublications = publicationStats?.publicationsLimit ?? subscription?.plan?.maxPublications ?? 0;
  const remainingPublications = publicationStats?.publicationsRemaining ?? subscription?.remainingPublications ?? maxPublications;
  const canPublish = publicationStats?.canPublish ?? (hasActiveSubscription ? remainingPublications > 0 : true);
  const planStatus = publicationStats?.planStatus ?? (hasActiveSubscription ? 'ACTIVE' : 'FREE_AVAILABLE');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  // Limpiar cualquier estado residual que pueda afectar el formulario
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.margin = '';
    document.body.style.padding = '';
    
    document.body.classList.remove('overflow-hidden', 'modal-open');
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent mx-auto mb-3"
            style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm text-[var(--text-muted)]">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminRestrictionGuard feature="publish">
    <div className="min-h-screen bg-[var(--bg-secondary)] transition-colors duration-200">

      {/* ── TOP NAV ── */}
      <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] sticky top-0 z-20">
        <div className="max-w-9xl mx-auto px-8 xl:px-16 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <span className="text-[var(--border-color)] select-none hidden sm:block">|</span>
            <button
              onClick={() => router.push('/my-properties')}
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors hidden sm:block cursor-pointer"
            >
              Ir a historial
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-full ${
                canPublish 
                  ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light' 
                  : planStatus === 'RENEW_REQUIRED'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
              }`}
            >
              <span className="hidden sm:inline">{canPublish
                ? `${remainingPublications}/${maxPublications} publicaciones disponibles`
                : planStatus === 'RENEW_REQUIRED'
                ? 'Renovar plan'
                : 'Límite alcanzado'}</span>
              <span className="sm:hidden">{canPublish ? `${remainingPublications}` : '0'}</span>
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-brand"
            >
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE STEPPER ── */}
      <div className="lg:hidden bg-[var(--bg-card)] border-b border-[var(--border-color)]">
        <div className="max-w-9xl mx-auto px-8 xl:px-16 py-3">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isDone = currentStep > step.number;
              const isActive = currentStep === step.number;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={
                        isDone || isActive
                          ? { backgroundColor: 'var(--brand-primary)', color: '#fff' }
                          : { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }
                      }
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : step.number}
                    </div>
                    <p className={`text-[10px] font-medium mt-1 text-center ${
                      isActive ? 'text-[var(--text-primary)]' : isDone ? 'text-brand dark:text-brand-light' : 'text-[var(--text-muted)]'
                    }`}>
                      {step.title.split(' ')[0]}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className="w-8 sm:w-12 h-0.5 mx-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: isDone ? 'var(--brand-primary)' : 'var(--border-color)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-9xl mx-auto px-4 sm:px-8 xl:px-16 py-6 sm:py-8 flex gap-8 items-start">

        {/* ── SIDEBAR: STEPPER ── */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden sticky top-20 shadow-sm">
            <div className="px-5 py-4 border-b border-[var(--border-light)]">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Publicar propiedad
              </p>
            </div>
            <div className="px-5 py-5">
              {STEPS.map((step, index) => {
                const isDone = currentStep > step.number;
                const isActive = currentStep === step.number;
                return (
                  <div key={step.number} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300"
                        style={
                          isDone || isActive
                            ? { backgroundColor: 'var(--brand-primary)', color: '#fff',
                                boxShadow: isActive ? '0 0 0 4px var(--brand-primary-light)' : 'none' }
                            : { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }
                        }
                      >
                        {isDone ? (
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        ) : step.number}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div
                          className="w-0.5 h-10 mt-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: isDone ? 'var(--brand-primary)' : 'var(--border-color)' }}
                        />
                      )}
                    </div>
                    <div className="pb-10">
                      <p className={`text-sm font-semibold leading-none mt-1.5 ${
                        isActive ? 'text-[var(--text-primary)]' : isDone ? 'text-brand dark:text-brand-light' : 'text-[var(--text-muted)]'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] mt-4 overflow-hidden sticky top-[380px] shadow-sm">
            <div className="px-5 py-4 border-b border-[var(--border-light)]">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                ¿Necesitas ayuda?
              </p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Centro de ayuda', href: '#' },
                { label: 'Contactar soporte', href: '#' },
                { label: 'Guía de publicación', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 text-brand dark:text-brand-light"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN: FORM ── */}
        <main className="flex-1 min-w-0">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6 lg:p-8 min-h-[600px] shadow-sm">
            <PropertyForm
              mode="create"
              onStepChange={setCurrentStep}
            />
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--bg-card)] border-t border-[var(--border-color)] mt-6">
        <div className="max-w-9xl mx-auto px-8 xl:px-16 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">¿Por qué publicar con nosotros?</h4>
            <ul className="space-y-2">
              {[
                'Alcance nacional a miles de compradores',
                'Publicación gratuita sin comisiones',
                'Soporte personalizado 24/7',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand dark:text-brand-light" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Consejos para una buena publicación</h4>
            <ul className="space-y-1.5 text-sm text-[var(--text-muted)]">
              {[
                'Toma fotos de alta calidad y buena iluminación',
                'Describe detalladamente las características',
                'Incluye información sobre los alrededores',
                'Establece un precio competitivo',
                'Responde rápidamente a las consultas',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="font-bold mt-0.5 text-brand dark:text-brand-light">·</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
    </AdminRestrictionGuard>
  );
}