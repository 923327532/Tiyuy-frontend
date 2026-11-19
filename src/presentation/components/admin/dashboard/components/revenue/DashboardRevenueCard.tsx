'use client';

import Link from 'next/link';
import { ChevronRight, Wallet, CreditCard, Receipt, Users } from 'lucide-react';

import type { DashboardRevenueCardProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';

import { ChartCard, GrowthChip } from '@/presentation/components/ui/Card';

import { formatCurrency, formatNumber } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { RevenueTrend } from './RevenueTrend';
import { Metric } from './Metric';

export function DashboardRevenueCard({
  finance,
  marketing,
  canViewMarketing,
  financeUnavailable,
  financeLoading,
  series,
  growthPct,
}: DashboardRevenueCardProps) {
  return (
    <ChartCard
      title="Facturación de la plataforma"
      description="Suscripciones, planes y destacados · mes en curso"
      action={
        <Link
          href="/admin/finance"
          className="
            inline-flex shrink-0 items-center
            gap-1 rounded-lg px-2 py-1.5
            text-xs font-semibold text-[#164E63]
            transition-colors duration-200
            hover:bg-[#E0F2FE]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#164E63]/40
          "
        >
          Ver facturación
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      }
      loading={financeLoading}
      error={financeUnavailable ? 'No se pudo cargar la información financiera' : undefined}
    >
      <div className="mt-5 space-y-6 animate-revenue-fade">

        {/* REVENUE SUMMARY */}
        <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center">

          {/* Main amount */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E0F2FE]">
                <Wallet className="h-4 w-4 text-[#164E63]" />
              </div>

              <p className="text-xs font-semibold text-slate-500">
                Ingresos cobrados
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className={`
                break-words text-3xl font-bold tracking-tight tabular-nums sm:text-4xl
                ${financeUnavailable ? 'text-slate-300' : 'text-[#164E63]'}
              `}>
                {financeUnavailable ? '—' : formatCurrency(finance?.revenueThisMonth)}
              </p>

              {!financeUnavailable && growthPct !== undefined && (
                <GrowthChip value={growthPct} />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-[#DCEAE9] px-2 py-1 text-[11px] font-semibold text-[#477A72]">
                {financeUnavailable ? 'Información no disponible' : `${formatCurrency(finance?.revenueToday)} hoy`}
              </span>

              {!financeUnavailable && (
                <span className="text-[11px] text-slate-400">
                  {formatNumber(finance?.paymentsToday)} pago(s)
                </span>
              )}
            </div>
          </div>

          {/* Trend */}
          <RevenueTrend series={series} />
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-[#E2EAF0]" />

        {/* SECONDARY METRICS */}
        <dl className="grid min-w-0 divide-y divide-[#E8EEF3] sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-[#E8EEF3]">
          <Metric
            index={0}
            icon={CreditCard}
            color="bg-[#E0F2FE] text-[#164E63]"
            label="Suscripciones activas"
            value={financeUnavailable ? '—' : formatNumber(finance?.activeSubscriptions)}
            hint={financeUnavailable ? undefined : `De ${formatNumber(finance?.totalSubscriptions)} · ${formatNumber(finance?.newSubscriptionsToday)} nuevas hoy`}
          />

          <Metric
            index={1}
            icon={Receipt}
            color="bg-[#E8EAF6] text-[#5965A8]"
            label="Ticket promedio"
            value={financeUnavailable ? '—' : formatCurrency(finance?.averageTransactionValue)}
            hint={financeUnavailable ? undefined : `${formatNumber(finance?.refundsCount)} devolución(es) en total`}
          />

          <Metric
            index={2}
            icon={Users}
            color="bg-[#DCEAE9] text-[#477A72]"
            label="Leads de campañas"
            value={canViewMarketing ? formatNumber(marketing?.totalLeads) : '—'}
            hint={canViewMarketing ? 'Contactos generados' : 'Requiere rol administrador'}
          />
        </dl>
      </div>
    </ChartCard>
  );
}