'use client';

import { SlidersHorizontal } from 'lucide-react';
import { SearchField } from '@/presentation/components/admin/agencies/components/filters/components/SearchField';
import { SelectField } from '@/presentation/components/admin/agencies/components/filters/components/SelectField';
import { ClearFiltersButton } from '@/presentation/components/admin/agencies/components/filters/components/ClearFiltersButton';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'ACTIVE', label: 'Aprobadas' },
  { value: 'REJECTED', label: 'Rechazadas' },
];

const SORT_OPTIONS = [
  { value: 'requestedAt', label: 'Más recientes' },
  { value: 'agent', label: 'Nombre del agente' },
  { value: 'developer', label: 'Inmobiliaria' },
];

export function AssociationRequestsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onClear,
}: Props) {
  const hasFilters = searchQuery.trim().length > 0 || statusFilter !== '' || sortBy !== 'requestedAt';

  return (
    <section className="users-filters" aria-label="Filtros de solicitudes de asociación">
      <div className="users-filters__main">
        <SearchField
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar por agente o inmobiliaria..."
        />

        <div className="users-filters__selects">
          <SelectField
            label="Filtrar por estado"
            value={statusFilter}
            onChange={onStatusChange}
            options={STATUS_OPTIONS}
            icon={<SlidersHorizontal />}
          />
          <SelectField
            label="Ordenar por"
            value={sortBy}
            onChange={onSortChange}
            options={SORT_OPTIONS}
          />
        </div>

        {hasFilters && <ClearFiltersButton onClick={onClear} />}
      </div>
    </section>
  );
}
