'use client';

import { AgentDiscountsBanner } from './AgentDiscountsBanner';

interface Props {
  className?: string;
}

export function AgentDiscountsHeader({ className = '' }: Props) {
  return (
    <section aria-label="Encabezado de gestión de descuentos" className={`users-header ${className}`.trim()}>
      <AgentDiscountsBanner />
    </section>
  );
}
