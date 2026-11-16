'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

import type { KpiItemProps } from './Config';
import { TONE_CONFIG } from './Config';

export function KpiItem({
  tone,
  label,
  value,
  description,
  icon,
  statusLabel,
  progress,
  index = 0,
}: KpiItemProps) {
  const reducedMotion = useReducedMotion();
  const colors = TONE_CONFIG[tone];

  return (
    <motion.article
      className="users-overview-metric users-kpi-card"
      data-tone={tone}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: reducedMotion ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        '--metric-accent': colors.accent,
        '--metric-soft': colors.accentSoft,
      } as React.CSSProperties}
    >
      <div className="users-overview-metric__top users-kpi-card__top">
        <span className="users-overview-metric__icon users-kpi-card__icon" aria-hidden="true">
          <span style={{ color: colors.accent }}>{icon}</span>
        </span>

        <span className="users-overview-metric__status users-kpi-card__status">
          <span
            className="users-overview-metric__status-dot users-kpi-card__status-dot"
            style={{ background: colors.accent }}
            aria-hidden="true"
          />
          {statusLabel}
        </span>
      </div>

      <p className="users-overview-metric__label users-kpi-card__label">{label}</p>
      <p
        className="users-overview-metric__value users-kpi-card__value"
        aria-label={`${value.toLocaleString('es-PE')} ${label.toLowerCase()}`}
      >
        {value.toLocaleString('es-PE')}
      </p>
      <p className="users-overview-metric__description users-kpi-card__description">{description}</p>

      {progress !== undefined && (
        <div className="users-overview-metric__progress users-kpi-card__progress">
          <div className="users-overview-metric__progress-meta users-kpi-card__progress-info">
            <span>Proporción del total</span>
            <strong style={{ color: colors.accent }}>{progress}%</strong>
          </div>

          <div
            className="users-overview-metric__progress-track users-kpi-card__progress-track"
            role="progressbar"
            aria-label="Porcentaje de usuarios activos"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="users-overview-metric__progress-fill users-kpi-card__progress-fill"
              initial={reducedMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{
                duration: 0.8,
                delay: reducedMotion ? 0 : index * 0.06 + 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: 'left center' }}
            />
          </div>
        </div>
      )}
    </motion.article>
  );
}