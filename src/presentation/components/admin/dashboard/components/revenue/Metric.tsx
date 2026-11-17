'use client';

interface MetricProps {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  color: string;
  index?: number;
}

export function Metric({ label, value, hint, icon: Icon, color, index = 0 }: MetricProps) {
  return (
    <div
      className={`
        group min-w-0 py-4
        sm:px-5 sm:first:pl-0 sm:last:pr-0
        animate-revenue-fade
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>

        <dt className="truncate text-xs font-medium text-slate-500">
          {label}
        </dt>
      </div>

      <dd className="mt-3 text-2xl font-bold tracking-tight text-[#164E63] tabular-nums">
        {value}
      </dd>

      {hint && (
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}