'use client';

import axios from 'axios';
import { Building2, RefreshCw, TriangleAlert } from 'lucide-react';

import { usePropertyAnalytics } from '@/presentation/hooks/useAdmin';
import { EmptyState } from '@/presentation/components/ui/EmptyState';

import { PropertyAnalyticsKpis } from './PropertyAnalyticsKpis';
import { PropertyAnalyticsSkeleton } from './PropertyAnalyticsSkeleton';
import { PropertyDistributionCard } from './PropertyDistributionCard';
import { PropertyStatusBars } from './PropertyStatusBars';

import {
  PROPERTY_STATUS_COLORS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_COLORS,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_LABELS,
  formatGeneratedAt,
} from './propertyAnalyticsConfig';

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string; error?: string } | undefined;

    if (typeof payload?.message === 'string') return payload.message;
    if (typeof payload?.error === 'string') return payload.error;

    if (error.response?.status === 401) return 'Tu sesión ha expirado. Inicia sesión nuevamente.';
    if (error.response?.status === 403) return 'No tienes permisos para consultar esta información.';
    if (!error.response) return 'No se pudo conectar con el servidor. Comprueba tu conexión.';

    return 'Ocurrió un problema al consultar la analítica.';
  }

  if (error instanceof Error) return error.message;

  return 'No se pudo cargar la analítica de propiedades.';
}

interface AnalyticsErrorProps {
  error: unknown;
  isFetching: boolean;
  onRetry: () => void;
}

function AnalyticsError({ error, isFetching, onRetry }: AnalyticsErrorProps) {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <TriangleAlert className="h-6 w-6 text-rose-600" aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No se pudo cargar la analítica
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          {getErrorMessage(error)}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={isFetching}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0f2e3a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#164453] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />
          {isFetching ? 'Reintentando...' : 'Reintentar'}
        </button>
      </div>
    </div>
  );
}

interface PropertyAnalyticsSectionProps {
  /**
   * Muestra el botón "Actualizar" y la hora de la última carga.
   * En el dashboard se pone en false porque el encabezado ya refresca todo.
   */
  showRefresh?: boolean;
}

export function PropertyAnalyticsSection({ showRefresh = true }: PropertyAnalyticsSectionProps) {
  const { data, isLoading, isFetching, isError, error, refetch } = usePropertyAnalytics();

  const handleRefresh = () => {
    void refetch();
  };

  const hasData = data !== undefined && data !== null;
  const isEmpty = hasData && data.totalProperties === 0;

  return (
    <section aria-labelledby="property-analytics-title" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="property-analytics-title"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Detalle del inventario
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Estado, verificación y destacados de tus propiedades.
          </p>
        </div>

        {showRefresh && (
          <div className="flex flex-wrap items-center gap-3">
            {data?.generatedAt && (
              <span className="text-xs text-slate-500">
                Actualizado: {formatGeneratedAt(data.generatedAt)}
              </span>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              aria-label="Actualizar analítica de propiedades"
              aria-busy={isFetching}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-[#0f2e3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              {isFetching ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <PropertyAnalyticsSkeleton />
      ) : isError && !hasData ? (
        <AnalyticsError error={error} isFetching={isFetching} onRetry={handleRefresh} />
      ) : isEmpty ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white">
          <EmptyState
            title="Aún no hay propiedades registradas"
            description="Cuando se registren propiedades, aquí verás su distribución por estado, tipo y operación, además de la verificación y los destacados."
            icon={
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Building2 className="h-7 w-7 text-slate-400" aria-hidden="true" />
              </div>
            }
          />
        </div>
      ) : data ? (
        <div className="space-y-4" aria-busy={isFetching}>
          {isError && (
            <div
              role="status"
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              No se pudieron actualizar los datos. Se conserva la última información disponible.
            </div>
          )}

          <PropertyAnalyticsKpis data={data} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <PropertyStatusBars
              data={data.propertiesByStatus}
              labels={PROPERTY_STATUS_LABELS}
              colors={PROPERTY_STATUS_COLORS}
            />

            <PropertyDistributionCard
              title="Distribución por tipo"
              description="Tipos de inmueble registrados"
              data={data.propertiesByType}
              labels={PROPERTY_TYPE_LABELS}
              colors={PROPERTY_TYPE_COLORS}
            />

            <PropertyDistributionCard
              title="Distribución por operación"
              description="Venta, alquiler y otras operaciones"
              data={data.propertiesByTransactionType}
              labels={TRANSACTION_TYPE_LABELS}
              colors={TRANSACTION_TYPE_COLORS}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}