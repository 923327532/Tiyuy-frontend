'use client';

import { formatCount, formatPercentage } from './propertyAnalyticsConfig';

interface PropertyStatusBarsProps {
  data: Record<string, number>;
  labels: Record<string, string>;
  colors: Record<string, string>;
}

export function PropertyStatusBars({ data, labels, colors }: PropertyStatusBarsProps) {
  const entries = Object.entries(data)
    .map(([key, value]) => ({
      key,
      label: labels[key] ?? key,
      value: value ?? 0,
      color: colors[key] ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,46,58,0.04)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Distribución por estado</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Ciclo de vida de todas las propiedades registradas
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-slate-600">
          {formatCount(total)} en total
        </span>
      </div>

      {total === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-slate-500">
          No hay propiedades registradas
        </div>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => {
            const percentage = total > 0 ? (entry.value / total) * 100 : 0;

            return (
              <li key={entry.key} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-slate-600">{entry.label}</span>
                  </span>
                  <span className="shrink-0">
                    <span className="font-semibold tabular-nums text-slate-900">
                      {formatCount(entry.value)}
                    </span>
                    <span className="ml-1 text-slate-500">
                      ({formatPercentage(entry.value, total)})
                    </span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: entry.color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}