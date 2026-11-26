'use client';

import { useState } from 'react';
import { Building2, History, LayoutDashboard, Percent, Users } from 'lucide-react';
import type { AgencyDetailModalProps } from '@/presentation/components/admin/agencies/types/agencies.types';
import {
  AdminDetailShell,
  type AdminDetailTabItem,
} from '@/presentation/components/admin/shared/detail-shell/AdminDetailShell';
import { getAgencyAccountState } from './model/agencyState';
import type { DetailTab } from './ui/detailParts';
import { ModalContent } from './components/ModalContent';
import './styles/AgencyDetailModal.css';

export function AgencyDetailModal({
  agency,
  agents,
  discounts,
  stats,
  statusHistory,
  historyPage,
  totalHistoryPages,
  totalHistoryElements,
  onHistoryPageChange,
  onClearHistory,
  onDeleteHistoryEntry,
  onClose,
  onActivate,
  onSuspend,
  onBlock,
  onCreateDiscount,
  onApplyDirectDiscount,
  onNotify,
  isChangingStatus = false,
  isLoading = false,
}: AgencyDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!agency) return null;

  const displayName =
    agency.name?.trim() ||
    agency.email?.split('@')[0] ||
    'Inmobiliaria';
  const initial = (displayName[0] ?? 'I').toUpperCase();
  const stateInfo = getAgencyAccountState(agency);

  const agentsCount = agents?.length || 0;
  const discountsCount = discounts?.length || 0;
  const historyCount = totalHistoryElements || 0;

  const tabs: AdminDetailTabItem<DetailTab>[] = [
    { id: 'overview', label: 'Resumen', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { id: 'agents', label: 'Agentes', icon: <Users className="h-3.5 w-3.5" />, badge: agentsCount },
    { id: 'discounts', label: 'Descuentos', icon: <Percent className="h-3.5 w-3.5" />, badge: discountsCount },
    { id: 'history', label: 'Historial', icon: <History className="h-3.5 w-3.5" />, badge: historyCount },
  ];

  const tabProps = {
    agency,
    agents: agents || [],
    discounts: discounts || [],
    stats,
    statusHistory: statusHistory || [],
    historyPage,
    totalHistoryPages,
    totalHistoryElements,
    onHistoryPageChange,
    onClearHistory,
    onDeleteHistoryEntry,
    onActivate,
    onSuspend,
    onBlock,
    onCreateDiscount,
    onApplyDirectDiscount,
    onNotify,
    isChangingStatus,
    loading: isLoading,
  };

  return (
    <AdminDetailShell
      isOpen
      onClose={onClose}
      title={displayName}
      subtitle={
        <>
          <Building2 className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          <span className="truncate">
            {agency.email || 'Sin correo'}
            {agency.ruc ? ` Â· RUC: ${agency.ruc}` : ''}
          </span>
        </>
      }
      avatarUrl={agency.logoUrl}
      avatarFallback={initial}
      avatarDisabled={agency.enabled === false}
      badges={
        <>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-100 ring-1 ring-white/20">
            Inmobiliaria
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              stateInfo.tone === 'active'
                ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/30'
                : stateInfo.tone === 'suspended'
                  ? 'bg-rose-500/20 text-rose-200 ring-rose-400/30'
                  : 'bg-white/15 text-slate-200 ring-white/20'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stateInfo.tone === 'active'
                  ? 'bg-emerald-400'
                  : stateInfo.tone === 'suspended'
                    ? 'bg-rose-400'
                    : 'bg-slate-300'
              }`}
            />
            {stateInfo.label}
          </span>
        </>
      }
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      footerLeft={<span className="hidden sm:inline">ID de inmobiliaria: #{agency.id}</span>}
    >
      <div className="agency-detail-shell">
        <ModalContent
          activeTab={activeTab}
          isLoading={isLoading}
          hasExtras={Boolean(agents?.length || discounts?.length || statusHistory?.length)}
          tabProps={tabProps}
        />
      </div>
    </AdminDetailShell>
  );
}

export default AgencyDetailModal;