'use client';

import type { KPIsProps } from './Config';
import { KpiItem } from './KpiItem';
import { normalizeCount, calculatePercentage, formatNumber } from './Config';
import { Users, Clock3, ShieldCheck, UserRoundX, UserRoundCheck } from 'lucide-react';

const KPI_DEFINITIONS = [
  {
    key: 'active',
    tone: 'active' as const,
    label: 'Usuarios activos',
    getValue: (props: KPIsProps) => normalizeCount(props.activeUsers),
    getDescription: (props: KPIsProps) => {
      const total = normalizeCount(props.totalUsers);
      const active = normalizeCount(props.activeUsers);
      const percentage = calculatePercentage(active, total);
      return total > 0
        ? `De ${formatNumber(total)} usuarios registrados${percentage !== undefined ? ` (${percentage}%)` : ''}`
        : 'Sin usuarios registrados';
    },
    statusLabel: 'Cuentas habilitadas',
    icon: <Users />,
  },
  {
    key: 'pending',
    tone: 'pending' as const,
    label: 'Pendientes de verificación',
    getValue: (props: KPIsProps) => normalizeCount(props.pendingUsers),
    getDescription: (props: KPIsProps) =>
      props.pendingUsers > 0
        ? 'Requieren revisión administrativa'
        : 'No hay verificaciones pendientes',
    statusLabel: (props: KPIsProps) =>
      props.pendingUsers > 0 ? 'Requieren atención' : 'Al día',
    icon: <Clock3 />,
  },
  {
    key: 'suspended',
    tone: 'suspended' as const,
    label: 'Usuarios suspendidos',
    getValue: (props: KPIsProps) => normalizeCount(props.suspendedUsers),
    getDescription: (props: KPIsProps) =>
      props.suspendedUsers > 0
        ? 'Cuentas actualmente deshabilitadas'
        : 'No hay cuentas suspendidas',
    statusLabel: (props: KPIsProps) =>
      props.suspendedUsers > 0 ? 'Cuentas suspendidas' : 'Sin suspensiones',
    icon: <UserRoundX />,
  },
  {
    key: 'total',
    tone: 'total' as const,
    label: 'Total de usuarios',
    getValue: (props: KPIsProps) => normalizeCount(props.totalUsers),
    getDescription: 'Usuarios registrados en la plataforma',
    statusLabel: 'Resumen general',
    icon: <UserRoundCheck />,
  },
  {
    key: 'verified',
    tone: 'active' as const,
    label: 'Usuarios verificados',
    getValue: (props: KPIsProps) =>
      Math.max(0, normalizeCount(props.totalUsers) - normalizeCount(props.pendingUsers)),
    getDescription: (props: KPIsProps) =>
      props.totalUsers > 0
        ? 'Con email y teléfono confirmados'
        : 'Sin usuarios registrados',
    statusLabel: 'Identidad confirmada',
    icon: <ShieldCheck />,
  },
] as const;

interface KpiGridProps {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
}

export function KpiGrid({
  totalUsers,
  activeUsers,
  pendingUsers,
  suspendedUsers,
}: KpiGridProps) {
  const props = { totalUsers, activeUsers, pendingUsers, suspendedUsers };

  return (
    <div
      className="users-overview__metrics users-kpi-grid grid-cols-2 gap-4 md:gap-5 xl:grid-cols-4"
      aria-label="Indicadores generales de usuarios"
      role="group"
    >
      {KPI_DEFINITIONS.map((def, index) => {
        const value = def.getValue(props);

        return (
          <KpiItem
            key={def.key}
            tone={def.tone}
            label={def.label}
            value={value}
            description={typeof def.getDescription === 'function' ? def.getDescription(props) : def.getDescription}
            statusLabel={typeof def.statusLabel === 'function' ? def.statusLabel(props) : def.statusLabel}
            icon={def.icon}
            index={index}
          />
        );
      })}
    </div>
  );
}
