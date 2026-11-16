'use client';

import { Users } from 'lucide-react';

import type { KPIsProps } from '../kpis/Config';
import { KpiGrid } from '../kpis';
import { RoleDistribution } from './RoleDistribution';

export interface UsersStatsProps extends KPIsProps {
  usersByRole?: Record<string, number>;
}

export function UsersStats({
  totalUsers,
  activeUsers,
  pendingUsers,
  suspendedUsers = 0,
  usersByRole = {},
}: UsersStatsProps) {
  const roleEntries = Object.entries(usersByRole).filter(
    ([, count]) => Number.isFinite(count) && count > 0,
  );

  return (
    <section className="users-overview" aria-label="Resumen de usuarios">
      <div className="users-overview__card">
        <header className="users-overview__header">
          <div>
            <h2 className="users-overview__title">Indicadores y distribución</h2>
            <p className="users-overview__subtitle">
              Vista consolidada del estado de cuentas y composición por rol.
            </p>
          </div>
          <span className="users-overview__badge" aria-label="Estado del resumen">
            <span className="users-overview__badge-dot" aria-hidden="true" />
            Actualizado
          </span>
        </header>

        <KpiGrid
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          pendingUsers={pendingUsers}
          suspendedUsers={suspendedUsers}
        />

        <RoleDistribution entries={roleEntries} embedded />
      </div>
    </section>
  );
}