'use client';

import {
  BadgeCheck,
  Building2,
  Clock,
  ShieldAlert,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react';
import type { PropertyAnalyticsResponse } from '@/core/domain/entities/Admin';
import { formatCount, formatPercentage } from './propertyAnalyticsConfig';

interface PropertyAnalyticsKpisProps {
  data: PropertyAnalyticsResponse;
}

interface KpiCard {
  key: string;
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  iconClassName: string;
  iconWrapperClassName: string;
  progress?: {
    value: number;
    max: number;
    barClassName: string;
    label: string;
  };
}

export function PropertyAnalyticsKpis({ data }: PropertyAnalyticsKpisProps) {
  const total = data.totalProperties;
  const featuredCapacity = data.featured + data.expiredFeatured + data.availableFeaturedSlots;
  const occupiedFeatured = data.featured + data.expiredFeatured;
  const availabilityRate =
    featuredCapacity > 0 ? (data.availableFeaturedSlots / featuredCapacity) * 100 : 0;

  const availabilityBarClassName =
    availabilityRate > 25 ? 'bg-cyan-500' : availabilityRate > 10 ? 'bg-amber-500' : 'bg-rose-600';

  const cards: KpiCard[] = [
    {
      key: 'total',
      label: 'Total propiedades',
      value: total,
      hint: 'Inventario global registrado',
      icon: Building2,
      iconClassName: 'text-slate-700',
      iconWrapperClassName: 'bg-slate-100 ring-slate-200',
    },
    {
      key: 'verified',
      label: 'Verificadas',
      value: data.verified,
      hint: `${formatPercentage(data.verified, total)} del total`,
      icon: BadgeCheck,
      iconClassName: 'text-cyan-700',
      iconWrapperClassName: 'bg-cyan-50 ring-cyan-100',
    },
    {
      key: 'unverified',
      label: 'Sin verificar',
      value: data.unverified,
      hint: `${formatPercentage(data.unverified, total)} del total`,
      icon: ShieldAlert,
      iconClassName: 'text-orange-700',
      iconWrapperClassName: 'bg-orange-50 ring-orange-100',
    },
    {
      key: 'featured',
      label: 'Destacadas vigentes',
      value: data.featured,
      hint: 'Activas y dentro de vigencia',
      icon: Star,
      iconClassName: 'text-blue-700',
      iconWrapperClassName: 'bg-blue-50 ring-blue-100',
    },
    {
      key: 'expired',
      label: 'Destacadas vencidas',
      value: data.expiredFeatured,
      hint: 'Aún ocupan un cupo activo',
      icon: Clock,
      iconClassName: 'text-rose-700',
      iconWrapperClassName: 'bg-rose-50 ring-rose-100',
    },
    {
      key: 'slots',
      label: 'Cupos disponibles',
      value: data.availableFeaturedSlots,
      hint: `${formatCount(occupiedFeatured)} de ${formatCount(featuredCapacity)} cupos ocupados`,
      icon: Sparkles,
      iconClassName: 'text-[#0f2e3a]',
      iconWrapperClassName: 'bg-slate-100 ring-slate-200',
      progress: {
        value: data.availableFeaturedSlots,
        max: featuredCapacity,
        barClassName: availabilityBarClassName,
        label: `${Math.round(availabilityRate)}% de cupos de destacados disponibles`,
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,46,58,0.04)]"
          >
            {/* h-[18px]: "h-4.5" no existe en Tailwind v3 y el ícono salía a 24px. */}
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 ${card.iconWrapperClassName}`}
            >
              <Icon className={`h-[18px] w-[18px] ${card.iconClassName}`} aria-hidden="true" />
            </span>

            <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
              {formatCount(card.value)}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-700">{card.label}</p>
            <p className="mt-1 text-[11px] leading-tight text-slate-500">{card.hint}</p>

            {card.progress && card.progress.max > 0 && (
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={card.progress.max}
                aria-valuenow={card.progress.value}
                aria-label={card.progress.label}
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.progress.barClassName}`}
                  style={{ width: `${(card.progress.value / card.progress.max) * 100}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}