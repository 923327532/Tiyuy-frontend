'use client';

import type {
  AttentionSeverity,
  DashboardAttentionProps,
} from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { AttentionCard } from '@/presentation/components/ui/Card';

const SEVERITY_ORDER: AttentionSeverity[] = [
  'critical',
  'warning',
  'info',
];

const SEVERITY_CONFIG: Record<
  AttentionSeverity,
  {
    label: string;
    pluralLabel: string;
    className: string;
  }
> = {
  critical: {
    label: 'Urgente',
    pluralLabel: 'Urgentes',
    className: 'attention-severity--critical',
  },
  warning: {
    label: 'Pendiente',
    pluralLabel: 'Pendientes',
    className: 'attention-severity--warning',
  },
  info: {
    label: 'Aviso',
    pluralLabel: 'Avisos',
    className: 'attention-severity--info',
  },
};

export function DashboardAttention({
  items,
  overflow = 0,
  isLoading,
}: DashboardAttentionProps) {
  const summary = SEVERITY_ORDER
    .map((severity) => ({
      severity,
      count: items.filter((item) => item.severity === severity).length,
    }))
    .filter((entry) => entry.count > 0);

  return (
    <AttentionCard
      title="Requiere atención"
      description="Moderación, campañas, descuentos y avisos, del más urgente al menos."
      items={items}
      overflow={overflow}
      onViewAll={() => {}}
    >
      {!isLoading && summary.length > 0 && (
        <ul
          className="attention-severity-list"
          slot="header-action"
          aria-label="Resumen de alertas por prioridad"
        >
          {summary.map(({ severity, count }, index) => {
            const config = SEVERITY_CONFIG[severity];

            return (
              <li
                key={severity}
                className={`attention-severity ${config.className}`}
                style={{ animationDelay: `${index * 70}ms` }}
                aria-label={`${count} ${count === 1 ? config.label : config.pluralLabel}`}
              >
                <span className="attention-severity-count">{count}</span>
                <span className="attention-severity-label">
                  {count === 1 ? config.label : config.pluralLabel}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </AttentionCard>
  );
}