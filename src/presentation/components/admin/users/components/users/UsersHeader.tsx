'use client';

import { Banner } from './Banner';

interface UsersHeaderProps {
  className?: string;
}

export function UsersHeader({ className = '' }: UsersHeaderProps) {
  return (
    <section aria-label="Encabezado de gestión de usuarios" className={`users-header ${className}`.trim()}>
      <Banner />
    </section>
  );
}