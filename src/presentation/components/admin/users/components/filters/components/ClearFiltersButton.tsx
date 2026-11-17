'use client';

import { X } from 'lucide-react';

interface ClearFiltersButtonProps {
  onClick: () => void;
}

export function ClearFiltersButton({ onClick }: ClearFiltersButtonProps) {
  return (
    <button
      type="button"
      className="users-filters__clear"
      onClick={onClick}
      aria-label="Limpiar todos los filtros"
    >
      <X aria-hidden="true" />
      <span>Limpiar</span>
    </button>
  );
}
