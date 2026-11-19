'use client';

import { useProjects } from '@/presentation/hooks/useProjects';
import { PropertyForm } from '@/presentation/components/property/PropertyForm/PropertyForm';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { useAuthStore } from '@/presentation/store/authStore';
import { TrialGuard } from '@/presentation/components/guards/TrialGuard/TrialGuard';
import { TrialWarningBanner } from '@/presentation/components/guards/TrialGuard/TrialWarningBanner';
import Link from 'next/link';

export default function EditProjectClient({ id }: { id: number }) {
  const { isAuthenticated } = useAuthStore();
  const { projectFull } = useProjects();
  const { data: project, isLoading, error } = projectFull(id);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg max-w-md w-full mx-4 p-8 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Plan Empresa requerido</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Este proyecto solo está disponible con el plan <strong>Empresa</strong>. Para editarlo, necesitas contratar o renovar tu suscripción.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/plans"
              className="w-full py-3 bg-[#00a63e] text-white font-semibold rounded-xl hover:bg-[#009135] transition-colors"
            >
              Ver Planes
            </Link>
            <Link
              href="/my-projects"
              className="w-full py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Ir a Mis Proyectos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Proyecto no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <TrialGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrialWarningBanner />

            <div className="mb-8">
              <div className="px-4 py-6 sm:px-6 lg:px-8 pb-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Editar Proyecto</h1>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  Modifica la información de tu proyecto
                </p>
              </div>
              {/* Barra verde decorativa */}
              <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />
            </div>

            <PropertyForm mode="edit" property={project} formType="project" />
          </div>
        </div>
      </TrialGuard>
    </ProtectedRoute>
  );
}
