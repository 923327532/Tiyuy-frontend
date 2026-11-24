/**
 * Acciones de listado: exportación Excel y limpieza de filtros.
 */

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import type { AgenciesFiltersState } from '@/presentation/components/admin/agencies/types/agencies.types';
import {
  exportToModernExcel,
  type ModernExcelColumn,
} from '@/utils/modernExcelExport';

export interface AgenciesListActionsInput {
  agencies: InmobiliariaWithStats[];
  filters: AgenciesFiltersState;
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

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  SUSPENDED: 'Suspendido',
};

const COLUMNS: ModernExcelColumn<InmobiliariaWithStats>[] = [
  { header: 'ID', type: 'integer', value: (a) => a.id, totalLabel: 'TOTAL' },
  { header: 'Nombre', value: (a) => a.name ?? '' },
  { header: 'RUC', value: (a) => a.ruc ?? '' },
  { header: 'Email', value: (a) => a.email ?? '' },
  { header: 'Teléfono', value: (a) => a.phone ?? '' },
  { header: 'Estado', type: 'status', value: (a) => STATUS_LABELS[a.status] ?? a.status },
  { header: 'Plan', value: (a) => a.currentPlan ?? '' },
  { header: 'Agentes', type: 'integer', value: (a) => a.totalAgents ?? 0, total: true },
  { header: 'Ingresos 30d', type: 'currency', value: (a) => a.revenue30Days ?? 0, total: true },
  { header: 'Descuentos', type: 'integer', value: (a) => a.activeDiscounts ?? 0, total: true },
  { header: 'Última Actividad', type: 'date', value: (a) => a.lastActivity ?? '' },
];

export function useAgenciesListActions({
  agencies,
  filters,
  setFilters,
  setCurrentPage,
}: AgenciesListActionsInput) {
  const handleExport = useCallback(() => {
    if (!agencies?.length) {
      alert('No hay datos para exportar');
      return;
    }
    void exportToModernExcel({
      title: 'Reporte de Inmobiliarias — TIYUY',
      fileName: `inmobiliarias_${new Date().toISOString().slice(0, 10)}`,
      sheetName: 'Inmobiliarias',
      rows: agencies,
      columns: COLUMNS,
      filters: { ...filters },
    });
  }, [agencies, filters]);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, [setFilters, setCurrentPage]);

  return { handleExport, handleClearFilters };
}
