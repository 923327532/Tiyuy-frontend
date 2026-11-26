'use client';

import { useState } from 'react';
import { Briefcase, CreditCard, History, LayoutDashboard, Mail, ShieldCheck } from 'lucide-react';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import {
  AdminDetailShell,
  type AdminDetailTabItem,
} from '@/presentation/components/admin/shared/detail-shell/AdminDetailShell';
import { getAccountState } from './model/accountState';
import {
  getAgentFullName,
  getAgentInitials,
  type AgentDetailTab,
} from './ui/agentDetailParts';
import { ModalContent } from './components/ModalContent';
import type { AgentTabProps } from './tabs';

interface AgentDetailModalProps {
  agent: AgentListItem;
  isOpen: boolean;
  onClose: () => void;
  onViewProperties?: (agent: AgentListItem) => void;
}

export function AgentDetailModal({
  agent,
  isOpen,
  onClose,
  onViewProperties,
}: AgentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<AgentDetailTab>('overview');

  if (!agent) return null;

  const accountState = getAccountState(agent);
  const isActive = accountState === 'ACTIVE';
  const securityBadge = agent.emailVerified ? 0 : 1;

  const tabs: AdminDetailTabItem<AgentDetailTab>[] = [
    { id: 'overview', label: 'Resumen', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { id: 'security', label: 'Seguridad', icon: <ShieldCheck className="h-3.5 w-3.5" />, badge: securityBadge },
    { id: 'plan', label: 'Plan e ingresos', icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: 'history', label: 'Historial', icon: <History className="h-3.5 w-3.5" /> },
  ];

  const tabProps: AgentTabProps = {
    agent,
    goToTab: setActiveTab,
    onViewProperties,
  };

  return (
    <AdminDetailShell
      isOpen={isOpen}
      onClose={onClose}
      title={getAgentFullName(agent)}
      subtitle={
        <>
          <Mail className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          <span className="truncate">{agent.email}</span>
        </>
      }
      avatarUrl={agent.profilePhotoUrl}
      avatarFallback={getAgentInitials(agent)}
      avatarDisabled={!agent.enabled}
      badges={
        <>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-100 ring-1 ring-white/20">
            <Briefcase className="h-3 w-3" />
            Agente
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/30'
                : 'bg-rose-500/20 text-rose-200 ring-rose-400/30'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {isActive ? 'Activo' : 'Suspendido'}
          </span>
        </>
      }
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      footerLeft={<span className="hidden sm:inline">ID de agente: #{agent.id}</span>}
    >
      <ModalContent activeTab={activeTab} tabProps={tabProps} />
    </AdminDetailShell>
  );
}

export default AgentDetailModal;