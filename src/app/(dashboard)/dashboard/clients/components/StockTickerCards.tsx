'use client';

import { useMemo } from 'react';
import { CRMMetrics } from '@/core/domain/entities/CRM';
import { TrendingUp, TrendingDown, Users, Activity, Target, MessageSquare } from 'lucide-react';

interface StockTickerCardsProps {
  metrics: CRMMetrics;
}

interface TickerMetric {
  label: string;
  value: number;
  subtitle: string;
  change: number;
  changeLabel: string;
  icon: typeof Users;
  color: string;
  bgColor: string;
  accentColor: string;
  format?: 'number' | 'percent';
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function StockTickerCards({ metrics }: StockTickerCardsProps) {
  const cards: TickerMetric[] = useMemo(() => [
    {
      label: 'TIYUY CLIENTES',
      value: metrics.totalClients,
      subtitle: 'Base total de clientes',
      change: metrics.newClientsThisWeek > 0 
        ? (metrics.newClientsThisWeek / Math.max(metrics.totalClients, 1)) * 100 
        : 0,
      changeLabel: `+${metrics.newClientsThisWeek} esta semana`,
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      accentColor: 'border-l-teal-500',
    },
    {
      label: 'TASA ACTIVOS',
      value: metrics.activeClients,
      subtitle: 'Clientes con actividad ≤30 días',
      change: metrics.totalClients > 0 
        ? (metrics.activeClients / metrics.totalClients) * 100 
        : 0,
      changeLabel: 'del total',
      icon: Activity,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      accentColor: 'border-l-emerald-500',
      format: 'percent'
    },
    {
      label: 'ALTO INTERÉS',
      value: metrics.highInterestClients,
      subtitle: 'Leads calificados para seguimiento',
      change: metrics.mediumInterestClients > 0
        ? ((metrics.highInterestClients - metrics.mediumInterestClients) / metrics.mediumInterestClients) * 100
        : 0,
      changeLabel: 'vs interés medio',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      accentColor: 'border-l-purple-500',
    },
    {
      label: 'INTERACCIONES',
      value: metrics.messagesExchanged,
      subtitle: 'Mensajes + Contactos totales',
      change: metrics.interactionsThisWeek > 0
        ? (metrics.interactionsThisWeek / Math.max(metrics.messagesExchanged, 1)) * 100
        : 0,
      changeLabel: `+${metrics.interactionsThisWeek} esta semana`,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      accentColor: 'border-l-blue-500',
    },
  ], [metrics]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.change >= 0;
        const displayValue = card.format === 'percent' 
          ? `${card.value}%` 
          : card.value.toLocaleString();

        return (
          <div
            key={card.label}
            className={`
              relative bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm
              hover:shadow-md transition-all duration-300
              border-l-4 ${card.accentColor}
              overflow-hidden group cursor-default
            `}
          >
            {/* Background shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--bg-tertiary)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-3.5">
              {/* Header with icon */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Main value - stock ticker style */}
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  {displayValue}
                </span>
                {/* Change indicator */}
                <span className={`
                  inline-flex items-center gap-0.5 text-[10px] font-semibold px-1 py-0.5 rounded-md
                  ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}
                `}>
                  {isUp ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {formatChange(card.change)}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-[11px] text-[var(--text-muted)]">{card.subtitle}</p>

              {/* Change label */}
              <div className="mt-1.5 flex items-center gap-1">
                <div className={`h-1 w-1 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  {card.changeLabel}
                </span>
              </div>
            </div>

            {/* Bottom sparkle line */}
            <div className={`
              absolute bottom-0 left-0 right-0 h-0.5
              bg-gradient-to-r ${isUp ? 'from-emerald-400 via-teal-400 to-emerald-300' : 'from-red-400 via-red-300 to-red-400'}
              scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
            `} />
          </div>
        );
      })}
    </div>
  );
}