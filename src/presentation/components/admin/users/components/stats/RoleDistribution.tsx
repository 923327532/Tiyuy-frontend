'use client';

import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

import { RoleItem } from './RoleItem';

interface RoleDistributionProps {
  entries: [string, number][];
  embedded?: boolean;
}

export function RoleDistribution({ entries, embedded = false }: RoleDistributionProps) {
  const reducedMotion = useReducedMotion();
  const filteredEntries = entries.filter(([, count]) => count > 0);

  if (!embedded && filteredEntries.length === 0) return null;

  const content = (
    <>
      <div className="users-stats-roles__header users-overview__roles-header">
        <div>
          <h3 className="users-stats-roles__title users-overview__roles-title">
            Distribución por tipo de cuenta
          </h3>

          <p className="users-stats-roles__subtitle users-overview__roles-subtitle">
            Usuarios agrupados según su rol en la plataforma
          </p>
        </div>

        <div className="users-stats-roles__icon users-overview__roles-icon">
          <Users aria-hidden="true" />
        </div>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="users-stats-roles__list users-overview__roles-list">
          {filteredEntries.map(([role, count], index) => (
            <RoleItem key={role} role={role} count={count} index={index} />
          ))}
        </div>
      ) : (
        <p className="users-overview__empty-roles">No hay datos de distribución por rol disponibles.</p>
      )}
    </>
  );

  if (embedded) {
    return (
      <div className="users-stats-roles users-overview__roles" aria-label="Distribución de usuarios por tipo de cuenta">
        {content}
      </div>
    );
  }

  return (
    <motion.section
      className="users-stats-roles"
      aria-label="Distribución de usuarios por tipo de cuenta"
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      {content}
    </motion.section>
  );
}