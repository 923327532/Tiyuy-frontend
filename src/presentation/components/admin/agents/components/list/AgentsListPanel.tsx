'use client';

import { useState } from 'react';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import {
  UsersViewToggle,
} from '@/presentation/components/admin/users/components/view-toolbar';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import { AgentsTableView } from './table/AgentsTableView';
import { AgentCard } from './cards/AgentCard';

interface Props {
  agents: AgentListItem[];
  isLoading: boolean;
  error?: string;
  hasFilter: boolean;
  canManage?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (agent: AgentListItem) => void;
  onStats: (agent: AgentListItem) => void;
  onToggleStatus: (agent: AgentListItem) => void;
  onClearFilters: () => void;
}

export function AgentsListPanel({
  agents,
  isLoading,
  error,
  hasFilter,
  canManage,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onView,
  onStats,
  onToggleStatus,
  onClearFilters,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const effectiveView: ViewMode = viewMode;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {!isLoading && agents.length > 0 && (
        <UsersViewToggle value={viewMode} onChange={setViewMode} />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-500" />
          <span className="text-sm font-medium">Cargando agentes...</span>
        </div>
      ) : error ? (
        <div className="px-6 py-12 text-center text-sm text-rose-600">Error: {error}</div>
      ) : agents.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">No se encontraron agentes</p>
          <p className="mt-1 text-sm text-slate-500">
            {hasFilter ? 'Intenta ajustar tu búsqueda o filtros.' : 'Aún no hay agentes para mostrar.'}
          </p>
          {hasFilter && (
            <button type="button" onClick={onClearFilters} className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : effectiveView === 'table' ? (
        <AgentsTableView agents={agents} canManage={canManage} onView={onView} onStats={onStats} onToggleStatus={onToggleStatus} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {agents.map((agent) => (
            <li key={agent.id}>
              <AgentCard agent={agent} canManage={canManage} onView={onView} onStats={onStats} onToggleStatus={onToggleStatus} />
            </li>
          ))}
        </ul>
      )}

      {total > 0 && !isLoading && !error && (
        <UsersPagination
          currentPage={page}
          pageSize={pageSize}
          totalElements={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemLabel="agentes"
        />
      )}
    </div>
  );
}
