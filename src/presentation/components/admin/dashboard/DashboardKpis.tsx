'use client';

import Link from 'next/link';
import {
  Building2,
  CreditCard,
  FolderKanban,
  MessagesSquare,
  Target,
  Wallet,
} from 'lucide-react';
import type {
  DashboardStats,
  FinanceStats,
  MarketingStats,
} from '@/core/domain/entities/Admin';
import type { SystemStats } from '@/presentation/hooks/useSystemStats';
import type { DashboardKpi } from './dashboardTypes';
import { formatCurrency, formatNumber } from './dashboardUtils';

interface DashboardKpisProps {
  stats?: DashboardStats;
  finance?: FinanceStats;
  systemStats?: SystemStats;
  marketing?: MarketingStats;
  canViewMarketing: boolean;
  financeUnavailable: boolean;
  loading?: { finance?: boolean; system?: boolean; marketing?: boolean };
}

type KpiCard = DashboardKpi;


interface KpiGroup {
  id: string;
  title: string;
  cards: KpiCard[];
}

function percent(part?: number, total?: number): number | null {
  if (!total || total <= 0 || part === undefined) return null;
  return Math.min(100, Math.round((part / total) * 100));
}

export function DashboardKpis({
  stats,
  finance,
  systemStats,
  marketing,
  canViewMarketing,
  financeUnavailable,
  loading = {},
}: DashboardKpisProps) {
  const publishedPct = percent(stats?.publishedProperties, stats?.totalProperties);
  const activeSubsPct = percent(finance?.activeSubscriptions, finance?.totalSubscriptions);

  const groups: KpiGroup[] = [
    {
      id: 'inventory',
      title: 'Inventario',
      cards: [
        {
          id: 'properties',
          label: 'Propiedades',
          value: formatNumber(stats?.totalProperties),
          hint: `${formatNumber(stats?.publishedProperties)} publicadas`,
          href: '/admin/properties',
          icon: Building2,
          progress:
            publishedPct !== null
              ? { value: publishedPct, label: `${publishedPct}% publicadas` }
              : undefined,
        },
        {
          id: 'projects',
          label: 'Proyectos',
          value: formatNumber(stats?.totalProjects),
          hint: `${formatNumber(stats?.activeProjects)} activos`,
          href: '/admin/projects',
          icon: FolderKanban,
          progress: (() => {
            const pct = percent(stats?.activeProjects, stats?.totalProjects);
            return pct !== null ? { value: pct, label: `${pct}% activos` } : undefined;
          })(),
        },
      ],
    },
    {
      id: 'commercial',
      title: 'Comercial',
      cards: [
        {
          id: 'leads',
          label: 'Leads',
          value: canViewMarketing ? formatNumber(marketing?.totalLeads) : '—',
          hint: canViewMarketing
            ? 'Leads de campañas promocionales'
            : 'Requiere rol administrador',
          href: '/admin/campaigns',
          icon: Target,
          unavailable: !canViewMarketing,
          loading: canViewMarketing && loading.marketing,
        },
        {
          id: 'revenue',
          label: 'Ingresos del mes',
          value: financeUnavailable ? '—' : formatCurrency(finance?.revenueThisMonth),
          hint: financeUnavailable
            ? 'No disponible'
            : `${formatCurrency(finance?.revenueToday)} hoy`,
          href: '/admin/finance',
          icon: Wallet,
          unavailable: financeUnavailable,
          loading: loading.finance,
        },
        {
          id: 'subscriptions',
          label: 'Suscripciones activas',
          value: financeUnavailable ? '—' : formatNumber(finance?.activeSubscriptions),
          hint: financeUnavailable
            ? 'No disponible'
            : `${formatNumber(finance?.totalSubscriptions)} registradas`,
          href: '/admin/plans',
          icon: CreditCard,
          unavailable: financeUnavailable,
          loading: loading.finance,
          progress:
            !financeUnavailable && activeSubsPct !== null
              ? { value: activeSubsPct, label: `${activeSubsPct}% activas` }
              : undefined,
        },
      ],
    },
    {
      id: 'community',
      title: 'Comunidad',
      cards: [
        {
          id: 'contacts',
          label: 'Contactos y grupos',
          value: formatNumber(systemStats?.groups.total),
          hint: `${formatNumber(systemStats?.channels.total)} canales`,
          href: '/admin/groups',
          icon: MessagesSquare,
          loading: loading.system,
        },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`kpi-group-${group.id}`}>
          <h2
            id={`kpi-group-${group.id}`}
            className="mb-2 text-xs font-semibold text-slate-500"
          >
            {group.title}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.cards.map((card) => (
              <KpiTile key={card.id} card={card} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function KpiTile({ card }: { card: KpiCard }) {
  const Icon = card.icon;

  if (card.loading) {
    return (
      <div
        className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
        aria-busy="true"
      >
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="mt-3 h-7 w-20 rounded bg-slate-100" />
        <div className="mt-2 h-3 w-32 rounded bg-slate-50" />
      </div>
    );
  }

  return (
    <Link
      href={card.href}
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-500">{card.label}</p>
        <p
          className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${
            card.unavailable ? 'text-slate-300' : 'text-slate-900'
          }`}
        >
          {card.value}
        </p>
        <p className="mt-1 truncate text-xs text-slate-400">{card.hint}</p>

        {card.progress && (
          <div className="mt-3">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={card.progress.value}
              aria-label={card.progress.label}
              className="h-1.5 overflow-hidden rounded-full bg-slate-100"
            >
              <div
                className="h-full rounded-full bg-[#0f2e3a]"
                style={{ width: `${card.progress.value}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition group-hover:border-slate-300 group-hover:text-[#0f2e3a]">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
    </Link>
  );
}