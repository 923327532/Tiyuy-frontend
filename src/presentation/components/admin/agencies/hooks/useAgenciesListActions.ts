/**
 * Acciones de listado: exportación CSV y limpieza de filtros.
 */

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type { AgenciesFiltersState } from '@/presentation/components/admin/agencies/types/agencies.types';

export interface AgenciesListActionsInput {
  agencies: InmobiliariaWithStats[];
  setFilters: (filters: Partial<AgenciesFiltersState>) => void;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const DEFAULT_FILTERS: AgenciesFiltersState = {
  searchQuery: '',
  statusFilter: '',
  planFilter: '',
  discountFilter: '',
  sortBy: 'name',
};

export function useAgenciesListActions({
  agencies,
  setFilters,
  setCurrentPage,
}: AgenciesListActionsInput) {
  const handleExport = useCallback(() => {
    if (!agencies || agencies.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = ['ID', 'Nombre', 'RUC', 'Email', 'Teléfono', 'Estado', 'Plan', 'Agentes', 'Ingresos 30d', 'Descuentos', 'Última Actividad'];
    const rows = agencies.map(dev => [
      dev.id,
      `"${dev.name || ''}"`,
      dev.ruc || '',
      dev.email || '',
      dev.phone || '',
      dev.status || '',
      dev.currentPlan || '',
      dev.totalAgents || 0,
      dev.revenue30Days || 0,
      dev.activeDiscounts || 0,
      dev.lastActivity ? new Date(dev.lastActivity).toLocaleDateString('es-PE') : ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inmobiliarias_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [agencies]);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, [setFilters, setCurrentPage]);

  return { handleExport, handleClearFilters };
}
