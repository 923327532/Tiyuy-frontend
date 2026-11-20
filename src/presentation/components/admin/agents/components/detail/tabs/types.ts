'use client';

import type { AgentListItem } from '@/core/domain/entities/Admin';
import type { AgentDetailTab } from '../ui/agentDetailParts';

export interface AgentTabProps {
  agent: AgentListItem;
  goToTab: (tab: AgentDetailTab) => void;
  onViewProperties?: (agent: AgentListItem) => void;
}

export type { AgentDetailTab };
