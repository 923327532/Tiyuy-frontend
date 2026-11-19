'use client';

import { Button } from '@/presentation/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import type { DashboardPartialNoticeProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

export function DashboardPartialNotice({
  sections,
  onRetry,
  isRetrying,
}: DashboardPartialNoticeProps) {
  if (sections.length === 0) return null;

  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 p-4"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-1.5 rounded-lg bg-amber-100">
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.525-1.516 2.525H3.72c-1.347 0-2.189-1.358-1.515-2.525L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">
              Algunas secciones no están disponibles
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              {sections.map((s) => s.label).join(', ')} no se pudieron cargar.
            </p>
          </div>
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
  );
}