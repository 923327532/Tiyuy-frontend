'use client';

import { Users, Wallet } from 'lucide-react';
import { formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { PLAN_COLORS } from './Config';

interface PlanDistributionProps {
  stats: {
    planDistribution: {
      labels: string[];
      values: number[];
      total?: number;
    };
  };
}

export function PlanDistribution({ stats }: PlanDistributionProps) {
  const plans = (stats.planDistribution.labels ?? []).map((label, index) => ({
    label,
    value: stats.planDistribution.values[index] ?? 0,
  }));

  const planTotal = stats.planDistribution.total || plans.reduce((sum, plan) => sum + plan.value, 0);

  return (
    <section className="border-t border-[#E2EAF0] px-6 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F0F3]">
            <Wallet className="h-4 w-4 text-[#164E63]" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Distribución por plan</h3>
            <p className="text-xs text-slate-500">Suscripciones registradas</p>
          </div>
        </div>
        <span className="rounded-full bg-[#E0F2FE] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#164E63]">
          {formatNumber(planTotal)} total
        </span>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D5E1E8] bg-[#F8FAFC] px-4 py-6 text-center">
          <Users className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-600">Sin suscripciones registradas</p>
          <p className="mt-1 text-xs text-slate-400">
            La distribución aparecerá cuando existan planes contratados.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {plans.map((plan, index) => {
            const pct = planTotal > 0 ? Math.round((plan.value / planTotal) * 100) : 0;
            const colors = PLAN_COLORS[index % PLAN_COLORS.length];

            return (
              <li key={`${plan.label}-${index}`} className="agents-plan-item" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.bar}`} aria-hidden="true" />
                    <span className="truncate text-sm font-medium text-slate-700">{plan.label}</span>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-slate-600">
                    <strong className="font-semibold text-slate-800">{formatNumber(plan.value)}</strong>
                    <span className="ml-1.5 text-xs text-slate-400">{pct}%</span>
                  </span>
                </div>
                <div className={`h-2 overflow-hidden rounded-full ${colors.background}`} role="progressbar" aria-label={`Distribución del plan ${plan.label}`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className={`agents-plan-bar h-full rounded-full ${colors.bar}`} style={{ width: `${pct}%`, animationDelay: `${index * 100}ms` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}