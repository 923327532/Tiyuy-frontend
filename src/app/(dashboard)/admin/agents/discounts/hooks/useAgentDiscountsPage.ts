/**
 * Page logic hook for the Agent Discounts page
 */

import { useState, useMemo } from 'react';
import {
  useAgentDiscounts,
  useAvailableDiscountsForAgent,
  useAssignDiscountToAgent,
  useRemoveDiscountFromAgent,
  useToggleAgentDiscountStatus,
  useCreateDiscountCode,
  useAgentList,
  useCreateAgentPlanDiscount,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { AgentDiscount } from '@/core/domain/entities/AgentDiscount';
import { AgentListItem } from '@/core/domain/entities/Admin';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';

export interface AgentPlan {
  code: string;
  name: string;
  price: string;
  color: string;
}

export interface NewDiscountForm {
  code: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
}

export interface PlanDiscountForm {
  discountPercentage: string;
  customPrice: string;
  startDate: string;
  endDate: string;
}

export const EMPTY_NEW_DISCOUNT: NewDiscountForm = {
  code: '', discountPercentage: '', startDate: '', endDate: '', usageLimit: '',
};

export const EMPTY_PLAN_DISCOUNT: PlanDiscountForm = {
  discountPercentage: '', customPrice: '', startDate: '', endDate: '',
};

export function useAgentDiscountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedAgent, setSelectedAgent] = useState<AgentListItem | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<AgentPlan | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateDiscountModalOpen, setIsCreateDiscountModalOpen] = useState(false);
  const [isPlanDiscountModalOpen, setIsPlanDiscountModalOpen] = useState(false);
  const [planDiscount, setPlanDiscount] = useState<PlanDiscountForm>(EMPTY_PLAN_DISCOUNT);
  const [newDiscount, setNewDiscount] = useState<NewDiscountForm>(EMPTY_NEW_DISCOUNT);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { hasPermission } = usePermissions();
  const canManageDiscounts = hasPermission('DISCOUNTS_MANAGE');

  const params = { page: 0, size: 100 };
  const { data: agentsData } = useAgentList(params);
  const allAgents = agentsData?.content || [];

  const filteredAgents = useMemo(() => {
    if (!agentSearchQuery.trim()) return [];
    const query = agentSearchQuery.toLowerCase();
    return allAgents.filter((agent: AgentListItem) =>
      (agent.firstName?.toLowerCase() || '').includes(query) ||
      (agent.lastName?.toLowerCase() || '').includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      (agent.dni || '').toLowerCase().includes(query)
    ).slice(0, 5);
  }, [allAgents, agentSearchQuery]);

  const { data: discountsData, isLoading, refetch } = useAgentDiscounts(
    selectedAgent ? { agentId: selectedAgent.id } : {},
    { page: currentPage - 1, size: pageSize }
  );

  const { data: availableDiscounts } = useAvailableDiscountsForAgent(selectedAgent?.id || 0);
  const assignDiscountMutation = useAssignDiscountToAgent();
  const removeDiscountMutation = useRemoveDiscountFromAgent();
  const toggleStatusMutation = useToggleAgentDiscountStatus();
  const createDiscountMutation = useCreateDiscountCode();
  const createPlanDiscountMutation = useCreateAgentPlanDiscount();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectAgent = (agent: AgentListItem) => {
    setSelectedAgent(agent);
    setAgentSearchQuery(`${agent.firstName} ${agent.lastName} (${agent.email})`);
    setShowAgentDropdown(false);
    // Auto-fetch discounts when agent is selected
    refetch();
  };

  const handleAssignDiscount = async (discountId: number) => {
    if (!selectedAgent) return;
    try {
      await assignDiscountMutation.mutateAsync({
        userId: selectedAgent.id,
        discountCodeId: discountId,
        notes: `Asignado por admin el ${new Date().toLocaleDateString()}`
      });
      showNotification('Descuento asignado correctamente', 'success');
      refetch();
    } catch (error) {
      showNotification('Error al asignar descuento', 'error');
    }
  };

  const handleRemoveDiscount = async (assignmentId: number) => {
    try {
      await removeDiscountMutation.mutateAsync(assignmentId);
      showNotification('Descuento eliminado correctamente', 'success');
      refetch();
    } catch (error) {
      showNotification('Error al eliminar descuento', 'error');
    }
  };

  const handleToggleStatus = async (discountId: number) => {
    try {
      await toggleStatusMutation.mutateAsync(discountId);
      showNotification('Estado actualizado', 'success');
      refetch();
    } catch (error) {
      showNotification('Error al actualizar estado', 'error');
    }
  };

  const handleCreateCustomDiscount = async () => {
    if (!selectedAgent) return;
    try {
      await createDiscountMutation.mutateAsync({
        code: newDiscount.code,
        discountPercentage: parseFloat(newDiscount.discountPercentage),
        applicability: 'USER_SPECIFIC',
        startDate: new Date(newDiscount.startDate),
        endDate: new Date(newDiscount.endDate),
        usageLimit: newDiscount.usageLimit ? parseInt(newDiscount.usageLimit) : undefined,
        applicableUserId: selectedAgent.id,
        singleUse: false
      });
      showNotification('Descuento creado correctamente', 'success');
      setIsCreateDiscountModalOpen(false);
      setNewDiscount(EMPTY_NEW_DISCOUNT);
      refetch();
    } catch (error) {
      showNotification('Error al crear descuento', 'error');
    }
  };

  const handleCreatePlanDiscount = async () => {
    if (!selectedAgent || !selectedPlan) return;
    try {
      await createPlanDiscountMutation.mutateAsync({
        agentId: selectedAgent.id,
        data: {
          planCode: selectedPlan.code,
          discountPercentage: parseFloat(planDiscount.discountPercentage),
          customPricePen: parseFloat(planDiscount.customPrice),
          validFrom: planDiscount.startDate ? new Date(planDiscount.startDate).toISOString() : undefined,
          validUntil: planDiscount.endDate ? new Date(planDiscount.endDate).toISOString() : undefined,
          notes: `Descuento creado desde panel admin`
        }
      });
      showNotification(`Descuento del ${planDiscount.discountPercentage}% aplicado a ${selectedPlan.name}`, 'success');
      setIsPlanDiscountModalOpen(false);
      setPlanDiscount(EMPTY_PLAN_DISCOUNT);
    } catch (error) {
      showNotification('Error al aplicar descuento', 'error');
    }
  };

  const discounts = discountsData?.content || [];
  const filteredDiscounts = discounts.filter((discount: AgentDiscount) => {
    const matchesSearch = !searchQuery ||
      discount.discountCode.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.discountCode.discountPercentage.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDiscounts = filteredDiscounts.slice(startIndex, endIndex);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return {
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    agentSearchQuery, setAgentSearchQuery,
    showAgentDropdown, setShowAgentDropdown,
    currentPage, setCurrentPage,
    pageSize, viewMode, setViewMode,
    selectedAgent, setSelectedAgent,
    selectedPlan, setSelectedPlan,
    isAssignModalOpen, setIsAssignModalOpen,
    isCreateDiscountModalOpen, setIsCreateDiscountModalOpen,
    isPlanDiscountModalOpen, setIsPlanDiscountModalOpen,
    planDiscount, setPlanDiscount,
    newDiscount, setNewDiscount,
    notification,
    canManageDiscounts,
    isLoading,
    filteredAgents,
    availableDiscounts,
    filteredDiscounts,
    paginatedDiscounts,
    startIndex,
    endIndex,
    assignPending: assignDiscountMutation.isPending,
    createPending: createDiscountMutation.isPending,
    planPending: createPlanDiscountMutation.isPending,
    handleSelectAgent,
    handleAssignDiscount,
    handleRemoveDiscount,
    handleToggleStatus,
    handleCreateCustomDiscount,
    handleCreatePlanDiscount,
    handleClearFilters,
  };
}
