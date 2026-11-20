'use client';

import { Globe2, Layers3, ShieldAlert, SlidersHorizontal } from 'lucide-react';

import { ClearFiltersButton } from '@/presentation/components/admin/users/components/filters/components/ClearFiltersButton';
import { SearchField } from '@/presentation/components/admin/users/components/filters/components/SearchField';
import { SelectField } from '@/presentation/components/admin/users/components/filters/components/SelectField';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';
import './GroupsFilters.css';

import type {
  GroupsFiltersState,
  GroupsSortBy,
  GroupsStatusFilter,
  GroupsSuspendedFilter,
  GroupsViewType,
} from '../types';

interface GroupsFiltersProps {
  filters: GroupsFiltersState;
  setFilters: (updates: Partial<GroupsFiltersState>) => void;
  viewType: GroupsViewType;
  setViewType: (value: GroupsViewType) => void;
  suspendedFilter: GroupsSuspendedFilter;
  setSuspendedFilter: (value: GroupsSuspendedFilter) => void;
  cityOptions: string[];
  onClear: () => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
  { value: 'violations', label: 'Con violaciones' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'az', label: 'Nombre A-Z' },
  { value: 'za', label: 'Nombre Z-A' },
  { value: 'most_members', label: 'Más miembros' },
  { value: 'least_members', label: 'Menos miembros' },
];

export function GroupsFilters({
  filters,
  setFilters,
  viewType,
  setViewType,
  suspendedFilter,
  setSuspendedFilter,
  cityOptions,
  onClear,
}: GroupsFiltersProps) {
  const hasFilters =
    filters.searchQuery.trim().length > 0 ||
    filters.statusFilter !== 'all' ||
    filters.sortBy !== 'newest' ||
    filters.cityFilter.trim().length > 0 ||
    suspendedFilter !== 'all';

  return (
    <div className="border-b border-slate-100 bg-white">
      <SegmentedTabs
        ariaLabel="Tipo de elementos"
        value={viewType}
        onChange={(value) => setViewType(value as GroupsViewType)}
        options={[
          { value: 'groups', label: 'Grupos sociales', icon: <Layers3 className="h-3.5 w-3.5 shrink-0" /> },
          { value: 'channels', label: 'Canales por ciudad', icon: <Globe2 className="h-3.5 w-3.5 shrink-0" /> },
          { value: 'suspended', label: 'Suspendidos / Bloqueados', icon: <ShieldAlert className="h-3.5 w-3.5 shrink-0" /> },
        ]}
      />

      {viewType === 'suspended' && (
        <SegmentedTabs
          ariaLabel="Filtrar suspendidos"
          value={suspendedFilter}
          onChange={(value) => setSuspendedFilter(value as GroupsSuspendedFilter)}
          tone="danger"
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'groups', label: 'Solo grupos' },
            { value: 'channels', label: 'Solo canales' },
          ]}
        />
      )}

      <section className="users-filters" aria-label="Filtros de grupos y canales">
        <div className="users-filters__main">
          <SearchField
            value={filters.searchQuery}
            onChange={(value) => setFilters({ searchQuery: value })}
            placeholder="Buscar por nombre, descripción o ciudad..."
          />

          <div className="users-filters__selects">
            <SelectField
              label="Filtrar por estado"
              value={filters.statusFilter}
              onChange={(value) => setFilters({ statusFilter: value as GroupsStatusFilter })}
              options={STATUS_OPTIONS}
              icon={<SlidersHorizontal />}
            />
            <SelectField
              label="Ordenar por"
              value={filters.sortBy}
              onChange={(value) => setFilters({ sortBy: value as GroupsSortBy })}
              options={SORT_OPTIONS}
            />
            <SelectField
              label="Filtrar por ciudad"
              value={filters.cityFilter}
              onChange={(value) => setFilters({ cityFilter: value })}
              options={[
                { value: '', label: 'Todas las ciudades' },
                ...cityOptions.map((city) => ({ value: city, label: city })),
              ]}
            />
          </div>

          {hasFilters && <ClearFiltersButton onClick={onClear} />}
        </div>
      </section>
    </div>
  );
}

interface SegmentedTabsProps {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  tone?: 'default' | 'danger';
}

function SegmentedTabs({ ariaLabel, value, onChange, options, tone = 'default' }: SegmentedTabsProps) {
  const activeClass =
    tone === 'danger'
      ? 'bg-rose-50 text-rose-700 shadow-sm ring-1 ring-rose-100'
      : 'bg-[#0f2e3a] text-white shadow-sm';

  return (
    <div
      className="groups-tabs flex items-center gap-2 overflow-x-auto px-3 py-3 sm:px-6"
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={[
              'group-tab inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all',
              isActive ? activeClass : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
            ].join(' ')}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
