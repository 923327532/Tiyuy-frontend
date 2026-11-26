'use client';

import dynamic from 'next/dynamic';
import type { AgentListItem, AgentDashboardStats } from '@/core/domain/entities/Admin';

const AgentDetailModal = dynamic(() => import('../detail/AgentDetailModal'), { ssr: false });
const AgentStatsModal = dynamic(() => import('@/app/(dashboard)/admin/agents/components/AgentStatsModal'), { ssr: false });
const PlanDetailsModal = dynamic(() => import('@/app/(dashboard)/admin/agents/components/PlanDetailsModal'), { ssr: false });
const FreeAgentsModal = dynamic(() => import('@/app/(dashboard)/admin/agents/components/FreeAgentsModal'), { ssr: false });

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
      {selectedAgent && isStatsModalOpen && (
        <AgentStatsModal
          agent={selectedAgent}
          isOpen={isStatsModalOpen}
          onClose={onCloseStats}
          onViewDetails={onViewDetailsFromStats}
        />
      )}
      {selectedAgent && isViewModalOpen && (
        <AgentDetailModal
          agent={selectedAgent}
          isOpen={isViewModalOpen}
          onClose={onCloseDetail}
        />
      )}
      {isPlanDetailsModalOpen && (
        <PlanDetailsModal
          isOpen={isPlanDetailsModalOpen}
          onClose={onClosePlanDetails}
          planDistribution={dashboardStats?.planDistribution}
        />
      )}
      {isFreeAgentsModalOpen && (
        <FreeAgentsModal
          isOpen={isFreeAgentsModalOpen}
          onClose={onCloseFreeAgents}
          freeAgentList={dashboardStats?.freeAgentList}
          lostPotentialRevenue={dashboardStats?.lostPotentialRevenue}
          freeAgentsCount={dashboardStats?.freeAgents}
        />
      )}
    </>
  );
}