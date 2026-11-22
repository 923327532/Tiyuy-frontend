'use client';

import type { AgentListItem, AgentDashboardStats } from '@/core/domain/entities/Admin';
import { AgentDetailModal } from '../detail';
import AgentStatsModal from '@/app/(dashboard)/admin/agents/components/AgentStatsModal';
import PlanDetailsModal from '@/app/(dashboard)/admin/agents/components/PlanDetailsModal';
import FreeAgentsModal from '@/app/(dashboard)/admin/agents/components/FreeAgentsModal';

interface AgentsModalsPanelProps {
  selectedAgent: AgentListItem | null;
  isStatsModalOpen: boolean;
  isViewModalOpen: boolean;
  isPlanDetailsModalOpen: boolean;
  isFreeAgentsModalOpen: boolean;
  dashboardStats?: AgentDashboardStats;
  onCloseStats: () => void;
  onViewDetailsFromStats: () => void;
  onCloseDetail: () => void;
  onClosePlanDetails: () => void;
  onCloseFreeAgents: () => void;
}

export function AgentsModalsPanel({
  selectedAgent,
  isStatsModalOpen,
  isViewModalOpen,
  isPlanDetailsModalOpen,
  isFreeAgentsModalOpen,
  dashboardStats,
  onCloseStats,
  onViewDetailsFromStats,
  onCloseDetail,
  onClosePlanDetails,
  onCloseFreeAgents,
}: AgentsModalsPanelProps) {
  return (
    <>
      {selectedAgent && (
        <AgentStatsModal agent={selectedAgent} isOpen={isStatsModalOpen}
          onClose={onCloseStats}
          onViewDetails={onViewDetailsFromStats} />
      )}
      {selectedAgent && (
        <AgentDetailModal agent={selectedAgent} isOpen={isViewModalOpen}
          onClose={onCloseDetail} />
      )}
      <PlanDetailsModal isOpen={isPlanDetailsModalOpen}
        onClose={onClosePlanDetails}
        planDistribution={dashboardStats?.planDistribution} />
      <FreeAgentsModal isOpen={isFreeAgentsModalOpen}
        onClose={onCloseFreeAgents}
        freeAgentList={dashboardStats?.freeAgentList}
        lostPotentialRevenue={dashboardStats?.lostPotentialRevenue}
        freeAgentsCount={dashboardStats?.freeAgents} />
    </>
  );
}
