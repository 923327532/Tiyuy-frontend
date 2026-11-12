'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { UserListItem } from '@/core/domain/entities/Admin';
import type { UserDetailExtras } from './userTypes';
import { getFullName, getInitials } from './userFormat';
import { getAccountState } from './userSegments';
import { AccountStateBadge } from './AccountStateBadge';
import { ROLE_LABELS, ROLE_STYLES } from './userRoleConfig';
import {
  SECONDARY_BUTTON,
  type DetailTab,
  getUserInsights,
} from './userDetailParts';
import {
  OverviewTab,
  SecurityTab,
  SupportTab,
  HistoryTab,
} from './Userdetailtabs';

export interface UserDetailModalProps {
  user: UserListItem | null;
  extras?: UserDetailExtras;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onVerifyEmail: (userId: number) => void;
  onVerifyPhone: (userId: number) => void;
  onViewProperties: (user: UserListItem) => void;
  onViewProjects: (user: UserListItem) => void;
  onResolveCancellation?: (requestId: string, decision: 'APPROVE' | 'REJECT') => void;
  isEmailVerifying: boolean;
  isPhoneVerifying: boolean;
  isResolvingCancellation?: boolean;
}

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Resumen' },
  { id: 'security', label: 'Seguridad' },
  { id: 'support', label: 'Soporte' },
  { id: 'history', label: 'Historial' },
];

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

  const fullName = getFullName(user);
  const role = user.role ?? 'USER';
  const accountState = getAccountState(user, extras);
  const insights = getUserInsights(user, extras);

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-xl">
        {/* 1. ENCABEZADO FIJO */}
        <header className="flex items-start gap-4 border-b border-slate-200/80 bg-white px-6 py-5">
          {user.profilePhotoUrl ? (
            <img
              src={user.profilePhotoUrl}
              alt=""
              className={`h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-slate-200 ${
                user.enabled ? '' : 'grayscale'
              }`}
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700 ring-1 ring-slate-200">
              {getInitials(user)}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-semibold tracking-tight text-slate-900" title={fullName}>
              {fullName}
            </h3>
            <p className="truncate text-sm text-slate-500" title={user.email}>
              {user.email}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${ROLE_STYLES[role] ?? ROLE_STYLES.USER}`}>
                {ROLE_LABELS[role] ?? role}
              </span>
              <AccountStateBadge state={accountState} />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2e3a]/30"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* 2. NAVEGACIÓN DE PESTAÑAS */}
        <nav className="border-b border-slate-200 bg-white px-6" aria-label="Pestañas de detalle de usuario">
          <div className="flex gap-6">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const badgeCount = tab.id === 'security' ? insights.securityBadge : tab.id === 'support' ? insights.supportBadge : 0;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative border-b-2 py-3 text-sm font-medium transition focus-visible:outline-none ${
                    isActive
                      ? 'border-[#0f2e3a] text-[#0f2e3a]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.label}
                    {badgeCount > 0 && (
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-100 px-1 text-[10px] font-bold text-rose-700">
                        {badgeCount}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 3. CONTENIDO DINÁMICO (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && !extras ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-500">
              Cargando detalles del usuario...
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && <OverviewTab {...tabProps} />}
              {activeTab === 'security' && <SecurityTab {...tabProps} />}
              {activeTab === 'support' && <SupportTab {...tabProps} />}
              {activeTab === 'history' && <HistoryTab {...tabProps} />}
            </div>
          )}
        </div>

        {/* 4. PIE DE PÁGINA FIJO */}
        <footer className="flex justify-end border-t border-slate-200/80 bg-white px-6 py-4">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cerrar
          </button>
        </footer>
      </div>
    </Modal>
  );
}