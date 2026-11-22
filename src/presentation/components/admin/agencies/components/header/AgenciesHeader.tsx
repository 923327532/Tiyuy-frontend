'use client';

import { AgenciesBanner } from './AgenciesBanner';

interface Props {
  className?: string;
  onExport?: () => void;
}

export function AgenciesHeader({ className = '', onExport }: Props) {
  return (
    <section aria-label="Encabezado de gestión de inmobiliarias" className={`users-header ${className}`.trim()}>
      <AgenciesBanner onExport={onExport} />
    </section>
  );
}