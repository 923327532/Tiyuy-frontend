'use client';

import { AgentsBanner } from './AgentsBanner';

interface Props {
  className?: string;
}

export function AgentsHeader({ className = '' }: Props) {
  return (
    <section aria-label="Encabezado de gestión de agentes" className={`users-header ${className}`.trim()}>
      <AgentsBanner />
    </section>
  );
}
