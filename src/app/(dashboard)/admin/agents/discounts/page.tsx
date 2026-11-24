'use client';

import { AgentDiscountsHeader } from '@/presentation/components/admin/agents/components/header/AgentDiscountsHeader';
import AssignDiscountModal from './components/AssignDiscountModal';
import CreateDiscountModal from './components/CreateDiscountModal';
import PlanDiscountModal from './components/PlanDiscountModal';
import { AgentSelection } from './components/AgentSelection';
import { AvailablePlans } from './components/AvailablePlans';
import { DiscountHistory } from './components/DiscountHistory';
import { useAgentDiscountsPage } from './hooks/useAgentDiscountsPage';
import '@/presentation/components/admin/users/components/filters/styles/UsersFilters.css';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';
import '@/presentation/components/ui/GenericUserTable/GenericUserTable.css';
import './agent-discounts.css';

export default function AgentDiscountsPage() {
  const {
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
    assignPending,
    createPending,
    planPending,
    handleSelectAgent,
    handleAssignDiscount,
    handleRemoveDiscount,
    handleToggleStatus,
    handleCreateCustomDiscount,
    handleCreatePlanDiscount,
    handleClearFilters,
  } = useAgentDiscountsPage();

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`agent-discounts__notification agent-discounts__notification--${notification.type}`} role="status">
          {notification.message}
        </div>
      )}

      {/* Header - same banner as the users section */}
      <AgentDiscountsHeader />

      {/* 1. Agent selection */}
      <AgentSelection
        agentSearchQuery={agentSearchQuery}
        setAgentSearchQuery={setAgentSearchQuery}
        showAgentDropdown={showAgentDropdown}
        setShowAgentDropdown={setShowAgentDropdown}
        filteredAgents={filteredAgents}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        onSelectAgent={handleSelectAgent}
        canManageDiscounts={canManageDiscounts}
        onOpenAssign={() => setIsAssignModalOpen(true)}
        onCreate={() => setIsCreateDiscountModalOpen(true)}
      />

      {/* 2. Available plans with discounts */}
      <AvailablePlans
        show={!!selectedAgent}
        onSelectPlan={(plan) => {
          setSelectedPlan(plan);
          setIsPlanDiscountModalOpen(true);
        }}
      />

      {/* 3. Discount history - same table language as users */}
      <DiscountHistory
        selectedAgent={selectedAgent}
        isLoading={isLoading}
        paginatedDiscounts={paginatedDiscounts}
        filteredCount={filteredDiscounts.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        startIndex={startIndex}
        endIndex={endIndex}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        canManageDiscounts={canManageDiscounts}
        onClearFilters={handleClearFilters}
        onCreate={() => setIsCreateDiscountModalOpen(true)}
        onToggleStatus={handleToggleStatus}
        onRemove={handleRemoveDiscount}
      />

      {/* Assign Discount Modal */}
      <AssignDiscountModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        selectedAgent={selectedAgent}
        availableDiscounts={availableDiscounts}
        onAssign={handleAssignDiscount}
        isPending={assignPending}
      />

      {/* Create Custom Discount Modal */}
      <CreateDiscountModal
        isOpen={isCreateDiscountModalOpen}
        onClose={() => setIsCreateDiscountModalOpen(false)}
        selectedAgent={selectedAgent}
        newDiscount={newDiscount}
        setNewDiscount={setNewDiscount}
        onCreate={handleCreateCustomDiscount}
        isPending={createPending}
      />

      {/* Plan Discount Modal */}
      <PlanDiscountModal
        isOpen={isPlanDiscountModalOpen}
        onClose={() => setIsPlanDiscountModalOpen(false)}
        selectedAgent={selectedAgent}
        selectedPlan={selectedPlan}
        planDiscount={planDiscount}
        setPlanDiscount={setPlanDiscount}
        onCreate={handleCreatePlanDiscount}
        isPending={planPending}
      />
    </div>
  );
}
