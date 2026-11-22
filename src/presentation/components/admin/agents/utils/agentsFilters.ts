/**
 * Helpers puros de filtrado y exportación de agentes.
 */

import type { AgentListItem } from '@/core/domain/entities/Admin';

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

export function buildAgentsCsv(agents: AgentListItem[]): string {
  return [
    ['ID', 'Nombre', 'Email', 'Estado', 'Plan', 'Ingresos Mes'].join(','),
    ...agents.map((a) =>
      [a.id, `${a.firstName || ''} ${a.lastName || ''}`.trim(), a.email, a.enabled ? 'Activo' : 'Inactivo', a.currentPlan || 'Free', a.monthRevenue || 0].join(',')
    ),
  ].join('\n');
}
