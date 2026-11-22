'use client';

import { X } from 'lucide-react';

interface ClearFiltersButtonProps {
  onClick: () => void;
}

export function ClearFiltersButton({ onClick }: ClearFiltersButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="users-filters__clear"
      aria-label="Limpiar filtros"
    >
      <X className="w-4 h-4" aria-hidden="true" />
      <span>Limpiar</span>
    </button>
  );
}