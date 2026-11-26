'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck,
  CalendarClock,
  CirclePause,
  Eye,
  Image as ImageIcon,
  MapPin,
  MousePointerClick,
  TimerOff,
} from 'lucide-react';

import type { Banner, MarketingStats } from '@/core/domain/entities/Admin';
import { PLACEMENT_LABELS, type BannerStatusFilter } from '../config/banners.config';
import {
  calculateBannerCtr,
  formatNumber,
  getBannerStatus,
  type BannerStatus,
} from '../utils/bannerFormat';
import './styles/banners-stats.css';

type BannerTone = 'total' | 'active' | 'pending' | 'suspended' | 'danger' | 'info';

interface ToneColors {
  accent: string;
  accentSoft: string;
  accentMuted: string;
}

const TONE_COLORS: Record<BannerTone, ToneColors> = {
  total: { accent: '#164e63', accentSoft: '#e3edf1', accentMuted: '#164e63' },
  active: { accent: '#36866c', accentSoft: '#dceae4', accentMuted: '#36866c' },
  pending: { accent: '#c58a3a', accentSoft: '#fbefd9', accentMuted: '#a66b1d' },
  suspended: { accent: '#64748b', accentSoft: '#eef2f6', accentMuted: '#64748b' },
  danger: { accent: '#c45d68', accentSoft: '#f9e5e8', accentMuted: '#b94b59' },
  info: { accent: '#39769b', accentSoft: '#e5f0f8', accentMuted: '#39769b' },
};

const PLACEMENT_COLORS = [
  { accent: '#6b9080', soft: '#e8f0ec' },
  { accent: '#7ba0bc', soft: '#e6eff5' },
  { accent: '#9b8ec4', soft: '#ede8f5' },
  { accent: '#cf8a92', soft: '#f5e5e7' },
  { accent: '#c58a3a', soft: '#fbefd9' },
  { accent: '#64748b', soft: '#f1f5f9' },
];

interface BannerKpi {
  id: string;
  label: string;
  value: string;
  description: string;
  statusLabel: string;
  icon: ReactNode;
  tone: BannerTone;
  status?: BannerStatusFilter;
}

interface BannerMetricProps {
  kpi: BannerKpi;
  index: number;
  onSelect?: (status: BannerStatusFilter) => void;
}

function BannerMetric({ kpi, index, onSelect }: BannerMetricProps) {
  const reducedMotion = useReducedMotion();
  const colors = TONE_COLORS[kpi.tone];
  const style = {
    '--metric-accent': colors.accent,
    '--metric-soft': colors.accentSoft,
    '--metric-muted': colors.accentMuted,
  } as CSSProperties;

  const content = (
    <>
      <div className="users-overview-metric__top">
        <span className="users-overview-metric__icon">
          <span>{kpi.icon}</span>
        </span>
        <span className="users-overview-metric__status">
          <span className="users-overview-metric__status-dot" aria-hidden="true" />
          {kpi.statusLabel}
        </span>
      </div>

      <p className="users-overview-metric__label">{kpi.label}</p>
      <p className="users-overview-metric__value">{kpi.value}</p>
      <p className="users-overview-metric__description">{kpi.description}</p>
    </>
  );

  const animationProps = {
    initial: reducedMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.45,
      delay: reducedMotion ? 0 : index * 0.06,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };

  if (kpi.status && onSelect) {
    return (
      <motion.button
        type="button"
        className="users-overview-metric banner-metric-button"
        data-tone={kpi.tone}
        style={style}
        onClick={() => onSelect(kpi.status as BannerStatusFilter)}
        aria-label={`Filtrar banners: ${kpi.label}`}
        {...animationProps}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.article
      className="users-overview-metric"
      data-tone={kpi.tone}
      style={style}
      {...animationProps}
    >
      {content}
    </motion.article>
  );
}

interface Props {
  banners: Banner[];
  stats?: MarketingStats | null;
  loading?: boolean;
  onSelectStatus?: (status: BannerStatusFilter) => void;
}

export function BannersStats({ banners, stats, loading, onSelectStatus }: Props) {
  const statuses = banners.reduce<Record<BannerStatus, number>>(
    (acc, banner) => {
      acc[getBannerStatus(banner)] += 1;
      return acc;
    },
    { active: 0, scheduled: 0, paused: 0, expired: 0 }
  );

  const total = banners.length > 0 ? banners.length : (stats?.totalBanners ?? 0);
  const active = banners.length > 0 ? statuses.active : (stats?.activeBanners ?? 0);
  const impressions = banners.reduce((sum, banner) => sum + (banner.impressions ?? 0), 0);
  const clicks = banners.reduce((sum, banner) => sum + (banner.clicks ?? 0), 0);
  const ctr = calculateBannerCtr(clicks, impressions);

  const kpis: BannerKpi[] = [
    {
      id: 'total',
      label: 'Total banners',
      value: formatNumber(total),
      description: 'Piezas registradas en el panel',
      statusLabel: 'Resumen general',
      icon: <ImageIcon aria-hidden="true" />,
      tone: 'total',
      status: 'all',
    },
    {
      id: 'active',
      label: 'Activos ahora',
      value: formatNumber(active),
      description: 'Visibles actualmente en la plataforma',
      statusLabel: active > 0 ? 'En línea' : 'Sin activos',
      icon: <BadgeCheck aria-hidden="true" />,
      tone: 'active',
      status: 'active',
    },
    {
      id: 'scheduled',
      label: 'Programados',
      value: formatNumber(statuses.scheduled),
      description: 'Inician en una fecha futura',
      statusLabel: statuses.scheduled > 0 ? 'Por iniciar' : 'Al día',
      icon: <CalendarClock aria-hidden="true" />,
      tone: 'pending',
      status: 'scheduled',
    },
    {
      id: 'paused',
      label: 'Pausados',
      value: formatNumber(statuses.paused),
      description: 'Desactivados manualmente',
      statusLabel: statuses.paused > 0 ? 'Requieren revisión' : 'Sin pausas',
      icon: <CirclePause aria-hidden="true" />,
      tone: 'suspended',
      status: 'paused',
    },
    {
      id: 'expired',
      label: 'Expirados',
      value: formatNumber(statuses.expired),
      description: 'Su vigencia ya terminó',
      statusLabel: statuses.expired > 0 ? 'Vigencia vencida' : 'Sin vencidos',
      icon: <TimerOff aria-hidden="true" />,
      tone: 'danger',
      status: 'expired',
    },
    {
      id: 'impressions',
      label: 'Impresiones',
      value: formatNumber(impressions),
      description: `${formatNumber(clicks)} clics registrados`,
      statusLabel: 'Alcance',
      icon: <Eye aria-hidden="true" />,
      tone: 'info',
    },
    {
      id: 'ctr',
      label: 'CTR',
      value: `${ctr.toFixed(2)}%`,
      description: 'Clics sobre impresiones',
      statusLabel: 'Rendimiento',
      icon: <MousePointerClick aria-hidden="true" />,
      tone: 'active',
    },
  ];

  const placementEntries = Object.entries(
    banners.reduce<Record<string, number>>((acc, banner) => {
      const placement = banner.placement || 'UNKNOWN';
      acc[placement] = (acc[placement] ?? 0) + 1;
      return acc;
    }, {})
  )
    .filter(([, count]) => Number.isFinite(count) && count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <section className="users-overview banners-stats" aria-label="Resumen de banners publicitarios">
      <div className="users-overview__card">
        <header className="users-overview__header">
          <div>
            <h2 className="users-overview__title">{'Indicadores y distribución'}</h2>
            <p className="users-overview__subtitle">
              {'Vista consolidada del estado de publicación, el rendimiento y la ubicación de los banners.'}
            </p>
          </div>
          <span className="users-overview__badge" aria-label="Estado del resumen">
            <span className="users-overview__badge-dot" aria-hidden="true" />
            {loading ? 'Actualizando' : 'Actualizado'}
          </span>
        </header>

        <div
          className="users-overview__metrics banners-kpi-grid grid-cols-2 gap-4 md:gap-5"
          aria-label="Indicadores generales de banners"
          role="group"
        >
          {kpis.map((kpi, index) => (
            <BannerMetric key={kpi.id} kpi={kpi} index={index} onSelect={onSelectStatus} />
          ))}
        </div>

        <div className="users-stats-roles users-overview__roles" aria-label={'Distribución de banners por ubicación'}>
          <div className="users-stats-roles__header users-overview__roles-header">
            <div>
              <h3 className="users-stats-roles__title users-overview__roles-title">
                {'Distribución por ubicación'}
              </h3>
              <p className="users-stats-roles__subtitle users-overview__roles-subtitle">
                {'Banners agrupados según el lugar donde se muestran'}
              </p>
            </div>
            <div className="users-stats-roles__icon users-overview__roles-icon">
              <ImageIcon aria-hidden="true" />
            </div>
          </div>

          {placementEntries.length > 0 ? (
            <div className="users-stats-roles__list users-overview__roles-list">
              {placementEntries.map(([placement, count], index) => {
                const colors = PLACEMENT_COLORS[index % PLACEMENT_COLORS.length];
                return (
                  <span
                    key={placement}
                    className="users-stats-role users-overview-role"
                    style={
                      {
                        '--role-index': index,
                        '--role-accent': colors.accent,
                        '--role-soft': colors.soft,
                      } as CSSProperties
                    }
                  >
                    <span className="users-stats-role__icon users-overview-role__icon">
                      <MapPin aria-hidden="true" />
                    </span>
                    <span className="users-stats-role__name users-overview-role__name">
                      {PLACEMENT_LABELS[placement] ?? placement}
                    </span>
                    <span className="users-stats-role__count users-overview-role__count">
                      {formatNumber(count)}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="users-overview__empty-roles">
              {'No hay datos de distribución por ubicación disponibles.'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}