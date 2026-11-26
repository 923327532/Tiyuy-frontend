'use client';

import { useState } from 'react';
import { extractBackendErrorMessage, type AdminActionErrorState } from '@/presentation/components/admin/shared/action-modal/AdminActionErrorModal';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import { useAgentList, useAgentDashboardStats, useToggleUserStatus } from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import type { PaginationParams } from '@/core/domain/repositories/IAdminRepository';
import { getRevenueChartData, revenueChartOptions, getPlanDistributionData } from '../utils/agentsCharts';
import {
  filterAgents,
  hasActiveFilters,
  exportAgentsExcel,
  type AgentsFilterCriteria,
} from '../utils/agentsFilters';

export function useAgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [chartPeriod, setChartPeriod] = useState<string>('30D');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [minRevenue, setMinRevenue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] = useState(false);
  const [isFreeAgentsModalOpen, setIsFreeAgentsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentListItem | null>(null);
  const [actionError, setActionError] = useState<AdminActionErrorState | null>(null);

  const { hasPermission } = usePermissions();
  const canManageAgents = hasPermission('USERS_UPDATE');

  const params: PaginationParams = { page: currentPage - 1, size: pageSize };
  const { data: dashboardStats, isLoading: statsLoading } = useAgentDashboardStats(chartPeriod);
  const { data: agentsData, isLoading, error, refetch } = useAgentList(params);
  const toggleStatusMutation = useToggleUserStatus();

  const handleViewAgent = (agent: AgentListItem) => {
    setSelectedAgent(agent);
    setIsViewModalOpen(true);
  };
  const handleViewAgentStats = (agent: AgentListItem) => {
    setSelectedAgent(agent);
    setIsStatsModalOpen(true);
  };
  const handleToggleStatus = async (agent: AgentListItem) => {
    try {
      await toggleStatusMutation.mutateAsync({
        userId: agent.id,
        enabled: !agent.enabled,
        reason: 'Agent status changed by admin',
      });
      refetch();
    } catch (err) {
      setActionError({
        isOpen: true,
        title: agent.enabled
          ? 'No se puede suspender este agente'
          : 'No se pudo reactivar este agente',
        message: extractBackendErrorMessage(
          err,
          'La operación fue rechazada por las reglas de seguridad del sistema.'
        ),
        hint: 'Verifica el estado de la cuenta o tus permisos de administrador antes de volver a intentarlo.',
      });
    }
  };

  const agents = agentsData?.content || [];
  const criteria: AgentsFilterCriteria = {
    searchQuery, statusFilter, verificationFilter, planFilter, dateRange, minRevenue,
  };
  const filteredAgents = filterAgents(agents, criteria);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAgents = filteredAgents.slice(startIndex, startIndex + pageSize);
  const hasFilter = hasActiveFilters(criteria);

  const revenueChartData = getRevenueChartData(dashboardStats);
  const planDistributionData = getPlanDistributionData(dashboardStats);

  const handleFilterChange = (filters: Record<string, any>) => {
    if (filters.verification !== undefined) setVerificationFilter(filters.verification);
    if (filters.status !== undefined) setStatusFilter(filters.status);
    if (filters.plan !== undefined) setPlanFilter(filters.plan);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: { start?: Date; end?: Date }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleMinRevenueChange = (value: string) => {
    setMinRevenue(value);
    setCurrentPage(1);
  };

  const handlePlanSelect = (plan: string) => {
    setPlanFilter(plan);
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportAgentsExcel(filteredAgents, {
      Búsqueda: searchQuery,
      Estado: statusFilter === 'all' ? '' : statusFilter,
      Verificación: verificationFilter === 'all' ? '' : verificationFilter,
      Plan: planFilter === 'all' ? '' : planFilter,
      'Ingresos mín.': minRevenue,
      'Desde': dateRange.start ? dateRange.start.toLocaleDateString('es-PE') : '',
      'Hasta': dateRange.end ? dateRange.end.toLocaleDateString('es-PE') : '',
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setVerificationFilter('all');
    setPlanFilter('all');
    setDateRange({});
    setMinRevenue('');
    setCurrentPage(1);
  };

  return {
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    verificationFilter, setVerificationFilter,
    planFilter, setPlanFilter,
    chartPeriod, setChartPeriod,
    dateRange, setDateRange,
    minRevenue, setMinRevenue,
    showFilters, setShowFilters,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    isViewModalOpen, setIsViewModalOpen,
    isStatsModalOpen, setIsStatsModalOpen,
    isPlanDetailsModalOpen, setIsPlanDetailsModalOpen,
    isFreeAgentsModalOpen, setIsFreeAgentsModalOpen,
    selectedAgent, setSelectedAgent,
    canManageAgents,
    dashboardStats, statsLoading, isLoading, error, refetch,
    paginatedAgents, filteredAgentsCount: filteredAgents.length, hasFilter,
    revenueChartData, revenueChartOptions, planDistributionData,
    handleViewAgent, handleViewAgentStats, handleToggleStatus,
    handleFilterChange, handleSearchChange, handleDateRangeChange,
    handleMinRevenueChange, handlePlanSelect, handleExport, handleClearFilters,
    actionError, clearActionError: () => setActionError(null),
  };
}
