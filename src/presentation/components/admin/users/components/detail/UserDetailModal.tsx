'use client';

import { useState } from 'react';
import {
  HeadphonesIcon,
  History,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import type { UserDetailModalProps } from '@/presentation/components/admin/users/types/users.types';
import { getFullName, getInitials } from '@/presentation/components/admin/users/utils/users.utils';
import { ROLE_LABELS } from '@/presentation/components/admin/users/userRoleConfig';
import {
  AdminDetailShell,
  type AdminDetailTabItem,
} from '@/presentation/components/admin/shared/detail-shell/AdminDetailShell';
import { ACCOUNT_STATE_META, getAccountState } from './model/accountState';
import { type DetailTab } from './ui/detailParts';
import { ModalContent } from './components/ModalContent';

export function UserDetailModal({
  user,
  extras,
  isOpen,
  isLoading,
  onClose,
  onVerifyEmail,
  onVerifyPhone,
  onViewProperties,
  onViewProjects,
  onResolveCancellation,
  isEmailVerifying,
  isPhoneVerifying,
  isResolvingCancellation,
}: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!user) return null;

  const accountState = getAccountState(user, extras);
  const stateMeta = ACCOUNT_STATE_META[accountState];
  const role = user.role ?? 'USER';

  const securityBadge =
    (extras?.openAlerts?.length ?? 0) + (!user.emailVerified ? 1 : 0);

  const openClaimsCount = (extras?.formalClaims ?? extras?.claims ?? []).filter(
    (c) =>
      c.status === 'OPEN' ||
      c.status === 'IN_REVIEW' ||
      c.status === 'PENDING' ||
      c.status === 'IN_PROGRESS',
  ).length;

  const openTicketsCount = (extras?.openTickets ?? extras?.tickets ?? []).filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS',
  ).length;

  const pendingCancellationsCount = (
    extras?.cancellationRequests ??
    (extras?.cancellationRequest ? [extras.cancellationRequest] : [])
  ).filter((r) => r.status === 'REQUESTED' || r.status === 'PENDING').length;

  const supportBadge =
    openClaimsCount + openTicketsCount + pendingCancellationsCount;

  const tabs: AdminDetailTabItem<DetailTab>[] = [
    { id: 'overview', label: 'Resumen', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { id: 'security', label: 'Seguridad', icon: <ShieldCheck className="h-3.5 w-3.5" />, badge: securityBadge },
    { id: 'support', label: 'Soporte', icon: <HeadphonesIcon className="h-3.5 w-3.5" />, badge: supportBadge },
    { id: 'history', label: 'Historial', icon: <History className="h-3.5 w-3.5" /> },
  ];

  const tabProps = {
    user,
    extras,
    loading: isLoading,
    goToTab: setActiveTab,
    onVerifyEmail,
    onVerifyPhone,
    onViewProperties,
    onViewProjects,
    isEmailVerifying,
    isPhoneVerifying,
    onResolveCancellation,
    isResolvingCancellation,
  };

  return (
    <AdminDetailShell
      isOpen={isOpen}
      onClose={onClose}
      title={getFullName(user)}
      subtitle={
        <>
          <Mail className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          <span className="truncate">{user.email}</span>
        </>
      }
      avatarUrl={user.profilePhotoUrl}
      avatarFallback={getInitials(user)}
      avatarDisabled={!user.enabled}
      badges={
        <>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-100 ring-1 ring-white/20">
            <UserIcon className="h-3 w-3" />
            {ROLE_LABELS[role] ?? role}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/20">
            <span className={`h-1.5 w-1.5 rounded-full ${stateMeta.dot}`} />
            {stateMeta.label}
          </span>
        </>
      }
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      footerLeft={<span className="hidden sm:inline">ID de usuario: #{user.id}</span>}
    >
      <ModalContent
        activeTab={activeTab}
        isLoading={isLoading}
        hasExtras={Boolean(extras)}
        tabProps={tabProps}
      />
    </AdminDetailShell>
  );
}

export default UserDetailModal;