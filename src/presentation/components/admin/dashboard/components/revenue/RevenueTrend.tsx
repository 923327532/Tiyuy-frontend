'use client';

import { useId } from 'react';
import { TrendingUp } from 'lucide-react';
import type { RevenueSeriesPoint } from '@/presentation/components/admin/dashboard/types/dashboard.types';
import { formatCompactCurrency } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';

function smoothPath(points: [number, number][]): string {
  return points.reduce((path, [x, y], index, all) => {
    if (index === 0) {
      return `M ${x},${y}`;
    }

    const [prevX, prevY] = all[index - 1];
    const midX = (prevX + x) / 2;

    return `${path} C ${midX},${prevY} ${midX},${y} ${x},${y}`;
  }, '');
}

interface RevenueTrendProps {
  series?: RevenueSeriesPoint[];
}

export function RevenueTrend({ series }: RevenueTrendProps) {
  const gradientId = `revenue-${useId().replace(/:/g, '')}`;

  const total = series?.reduce((sum, point) => sum + point.value, 0) ?? 0;

  if (!series || series.length < 2 || total <= 0) {
    return (
      <div className="
        flex h-36 items-center justify-center
        rounded-xl border border-dashed
        border-[#DCE5EB] bg-[#F8FAFC]
        px-4 text-center
      ">
        <div className="max-w-[230px]">
          <div className="
            mx-auto mb-2 flex h-9 w-9
            items-center justify-center
            rounded-xl bg-[#E0F2FE]
          ">
            <TrendingUp className="h-4 w-4 text-[#164E63]" />
          </div>

          <p className="text-xs text-slate-500">
            Aún no hay cobros registrados en el último mes.
          </p>
        </div>
      </div>
    );
  }

  const width = 400;
  const height = 120;
  const top = 10;

  const max = Math.max(...series.map((point) => point.value), 1);
  const min = Math.min(...series.map((point) => point.value), 0);
  const range = Math.max(max - min, 1);
  const step = width / (series.length - 1);

  const points: [number, number][] = series.map((point, index) => [
    index * step,
    top + (1 - (point.value - min) / range) * (height - top - 12),
  ]);

  const line = smoothPath(points);
  const area = `${line} L ${width},${height} L 0,${height} Z`;
  const middle = series[Math.floor(series.length / 2)];

  return (
    <figure className="
      relative min-w-0 overflow-hidden
      rounded-2xl border border-[#E2EAF0]
      bg-gradient-to-br
      from-[#F8FAFC] to-[#F0F7FA]
      p-4
    ">
      {/* Chart header */}
      <figcaption className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#164E63]">
            Evolución de cobros
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            Últimos 30 días
          </p>
        </div>

        <div className="rounded-lg border border-[#DCEAE9] bg-[#F8FAFC] px-2.5 py-1.5">
          <span className="text-xs font-bold tabular-nums text-[#164E63]">
            {formatCompactCurrency(total)}
          </span>
        </div>
      </figcaption>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-28 w-full overflow-visible"
        role="img"
        aria-label={`Cobros del último mes: ${formatCompactCurrency(total)} en total. Máximo diario ${formatCompactCurrency(max)}.`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#164E63" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#DCEAE9" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[25, 55, 85].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="#DCE5EB"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
        ))}

        {/* Area */}
        <path d={area} fill={`url(#${gradientId})`} className="revenue-area" />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke="#164E63"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="revenue-line"
        />

        {/* Last point */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1][0]}
            cy={points[points.length - 1][1]}
            r="4"
            fill="#164E63"
            stroke="#F8FAFC"
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Labels */}
      <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
        <span>{series[0].label}</span>
        <span>{middle.label}</span>
        <span>{series[series.length - 1].label}</span>
      </div>
    </figure>
  );
}