'use client';

import { UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

import { ROLE_CONFIG, ROLE_LABELS } from './Config';

interface RoleItemProps {
  role: string;
  count: number;
  index: number;
}

export function RoleItem({ role, count, index }: RoleItemProps) {
  const reducedMotion = useReducedMotion();
  const config = ROLE_CONFIG[role] ?? {
    icon: <UserRound aria-hidden="true" />,
    tone: 'default',
  };

  const toneColors: Record<string, { accent: string; soft: string }> = {
    admin: { accent: '#b94b59', soft: '#fce8e8' },
    agent: { accent: '#39769b', soft: '#e5f0f8' },
    developer: { accent: '#626da7', soft: '#e8eaf7' },
    user: { accent: '#36866c', soft: '#e5f1eb' },
    default: { accent: '#64748b', soft: '#f1f5f9' },
  };

  const colors = toneColors[config.tone] ?? toneColors.default;

  return (
    <motion.div
      className="users-stats-role users-overview-role"
      data-role-tone={config.tone}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={reducedMotion ? undefined : { y: -1 }}
      style={{ '--role-index': index, '--role-accent': colors.accent } as React.CSSProperties}
    >
      <span
        className="users-stats-role__icon users-overview-role__icon"
        style={{ background: colors.soft, color: colors.accent } as React.CSSProperties}
      >
        {config.icon}
      </span>

      <span className="users-stats-role__name users-overview-role__name">{ROLE_LABELS[role] || role}</span>

      <span className="users-stats-role__count users-overview-role__count">
        {count.toLocaleString('es-PE')}
      </span>
    </motion.div>
  );
}