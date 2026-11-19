'use client';

import { Button } from '@/presentation/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import type { DashboardErrorProps } from '@/presentation/components/admin/dashboard/components/DashboardError.types';

export function DashboardError({ error, onRetry, isRetrying }: DashboardErrorProps) {
  const message = error instanceof Error ? error.message : 'No se pudieron cargar los datos del resumen.';

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-2 rounded-lg bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-800">Error al cargar el dashboard</h2>
            <p className="mt-1 text-sm text-red-700">{message}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />}
            onClick={onRetry}
            disabled={isRetrying}
            aria-busy={isRetrying}
          >
            {isRetrying ? 'Reintentando…' : 'Reintentar'}
          </Button>
        </div>
      </div>
    </div>
  );
}