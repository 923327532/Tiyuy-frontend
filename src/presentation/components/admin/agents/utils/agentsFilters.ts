/**
 * Helpers puros de filtrado y exportación de agentes.
 */

import type { AgentListItem } from '@/core/domain/entities/Admin';
import {
  exportToModernExcel,
  type ModernExcelColumn,
} from '@/utils/modernExcelExport';

export interface AgentsFilterCriteria {
  searchQuery: string;
  statusFilter: string;
  verificationFilter: string;
  planFilter: string;
  dateRange: { start?: Date; end?: Date };
  minRevenue: string;
}

function matchesAgentFilters(agent: AgentListItem, filters: AgentsFilterCriteria): boolean {
  const { searchQuery, statusFilter, verificationFilter, planFilter, dateRange, minRevenue } = filters;
  const q = searchQuery.toLowerCase();
  const matchesSearch =
    !searchQuery ||
    (agent.firstName?.toLowerCase() || '').includes(q) ||
    (agent.lastName?.toLowerCase() || '').includes(q) ||
    agent.email.toLowerCase().includes(q);
  const matchesStatus =
    statusFilter === 'all' || (statusFilter === 'active' && agent.enabled) || (statusFilter === 'inactive' && !agent.enabled);
  const matchesVerification =
    verificationFilter === 'all' ||
    (verificationFilter === 'verified' && agent.emailVerified) ||
    (verificationFilter === 'unverified' && !agent.emailVerified);
  const matchesPlan = planFilter === 'all' || agent.currentPlan === planFilter;

  const createdAt = agent.createdAt ? new Date(agent.createdAt) : null;
  const matchesDateRange = Boolean(
    (!dateRange.start || (createdAt && createdAt >= dateRange.start)) &&
    (!dateRange.end || (createdAt && createdAt <= dateRange.end))
  );
  const matchesMinRevenue =
    !minRevenue || (agent.monthRevenue ?? 0) >= Number(minRevenue);

  return matchesSearch && matchesStatus && matchesVerification && matchesPlan && matchesDateRange && matchesMinRevenue;
}

export function filterAgents(agents: AgentListItem[], filters: AgentsFilterCriteria): AgentListItem[] {
  return agents.filter(agent => matchesAgentFilters(agent, filters));
}

export function hasActiveFilters(filters: AgentsFilterCriteria): boolean {
  return Boolean(
    filters.searchQuery ||
    filters.statusFilter !== 'all' ||
    filters.verificationFilter !== 'all' ||
    filters.planFilter !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.minRevenue
  );
}

const COLUMNS: ModernExcelColumn<AgentListItem>[] = [
  { header: 'ID', type: 'integer', value: (a) => a.id, totalLabel: 'TOTAL' },
  { header: 'Nombre', value: (a) => `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() },
  { header: 'Email', value: (a) => a.email },
  { header: 'Estado', type: 'status', value: (a) => (a.enabled ? 'Activo' : 'Inactivo') },
  { header: 'Verificado', type: 'status', value: (a) => (a.emailVerified ? 'Sí' : 'No') },
  { header: 'Plan', value: (a) => a.currentPlan || 'Free' },
  { header: 'Ingresos Mes', type: 'currency', value: (a) => a.monthRevenue ?? 0, total: true },
  { header: 'Propiedades', type: 'integer', value: (a) => a.propertiesCount ?? 0, total: true },
  { header: 'Registro', type: 'date', value: (a) => a.createdAt ?? '' },
];

export function exportAgentsExcel(
  agents: AgentListItem[],
  filters?: Record<string, unknown>
) {
  if (!agents.length) return;
  void exportToModernExcel({
    title: 'Reporte de Agentes — TIYUY',
    fileName: `agentes_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Agentes',
    rows: agents,
    columns: COLUMNS,
    filters,
  });
}
