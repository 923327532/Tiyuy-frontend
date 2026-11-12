'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { formatRelativeTime } from './dashboardUtils';

interface DashboardHeaderProps {
  generatedAt?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  /** Nombre de quien inicia sesión. Si no llega, se usa un saludo simple. */
  userName?: string;
}

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function DashboardHeader({
  generatedAt,
  isRefreshing,
  onRefresh,
  userName,
}: DashboardHeaderProps) {
  // La hora se resuelve en el cliente para evitar errores de hidratación.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const firstName = userName?.trim().split(/\s+/)[0];
  const greeting = now ? greetingFor(now) : 'Hola';
  const today = now?.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
          {greeting}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Así van el inventario, las ventas y las finanzas de TIYUY
          {today ? <span className="hidden sm:inline"> · {today}</span> : null}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs text-slate-400" aria-live="polite">
          {generatedAt ? `Actualizado ${formatRelativeTime(generatedAt).toLowerCase()}` : ''}
        </p>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-[#0f2e3a] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          {isRefreshing ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>
    </header>
  );
}