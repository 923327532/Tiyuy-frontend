'use client';

import {
  ArcElement,
  Chart as ChartJS,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCount, formatPercentage } from './propertyAnalyticsConfig';

ChartJS.register(ArcElement, Tooltip);

interface PropertyDistributionCardProps {
  title: string;
  description?: string;
  data: Record<string, number>;
  labels: Record<string, string>;
  colors: Record<string, string>;
}

export function PropertyDistributionCard({
  title,
  description,
  data,
  labels,
  colors,
}: PropertyDistributionCardProps) {
  const entries = Object.entries(data).map(([key, value]) => ({
    key,
    label: labels[key] ?? key,
    value: value ?? 0,
    color: colors[key] ?? '#94a3b8',
  }));

  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  const visibleEntries = entries.filter((entry) => entry.value > 0);

  const chartData = {
    labels: visibleEntries.map((entry) => entry.label),
    datasets: [
      {
        data: visibleEntries.map((entry) => entry.value),
        backgroundColor: visibleEntries.map((entry) => entry.color),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = Number(context.parsed) || 0;
            return ` ${formatCount(value)} (${formatPercentage(value, total)})`;
          },
        },
      },
    },
  };

  const summary = visibleEntries
    .map((entry) => `${entry.label}: ${formatCount(entry.value)}`)
    .join(', ');

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,46,58,0.04)] sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>

      <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div
          className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40"
          role="img"
          aria-label={
            visibleEntries.length > 0
              ? `${title}. Total ${formatCount(total)}. ${summary}`
              : `${title}. Sin datos`
          }
        >
          {visibleEntries.length > 0 ? (
            <>
              <Doughnut data={chartData} options={options} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tabular-nums text-slate-900">
                  {formatCount(total)}
                </span>
                <span className="text-xs text-slate-500">En total</span>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-8 border-slate-100 text-center text-xs text-slate-500">
              Sin datos
            </div>
          )}
        </div>

        <ul className="grid w-full grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {entries.map((entry) => (
            <li key={entry.key} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex min-w-0 items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="truncate text-slate-600">{entry.label}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="font-semibold tabular-nums text-slate-900">
                  {formatCount(entry.value)}
                </span>
                <span className="ml-1 text-slate-500">
                  ({formatPercentage(entry.value, total)})
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}