'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';

export interface AdminDetailTabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
  badge?: number;
}

interface AdminDetailShellProps<T extends string = string> {
  isOpen: boolean;
  onClose: () => void;
  size?: 'md' | 'lg' | 'xl';
  /** Identidad en el header */
  title: string;
  subtitle?: ReactNode;
  avatarUrl?: string | null;
  avatarFallback?: ReactNode;
  avatarDisabled?: boolean;
  badges?: ReactNode;
  /** Navegación opcional por pestañas */
  tabs?: AdminDetailTabItem<T>[];
  activeTab?: T;
  onTabChange?: (tab: T) => void;
  /** Contenido principal */
  children: ReactNode;
  /** Pie de modal */
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  closeLabel?: string;
}

export function AdminDetailShell<T extends string = string>({
  isOpen,
  onClose,
  size = 'xl',
  title,
  subtitle,
  avatarUrl,
  avatarFallback,
  avatarDisabled = false,
  badges,
  tabs,
  activeTab,
  onTabChange,
  children,
  footerLeft,
  footerRight,
  closeLabel = 'Cerrar',
}: AdminDetailShellProps<T>) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col bg-slate-50/80">
        {/* Header ejecutivo unificado */}
        <header className="relative shrink-0 bg-gradient-to-r from-[#0f2e3a] via-[#133c4b] to-[#164e63] px-5 py-4 text-white sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className={`h-13 w-13 shrink-0 rounded-2xl object-cover ring-2 ring-white/25 sm:h-14 sm:w-14 ${
                    avatarDisabled ? 'opacity-60 grayscale' : ''
                  }`}
                />
              ) : avatarFallback ? (
                <span
                  className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-base font-bold tracking-wide text-white ring-2 ring-white/25 backdrop-blur-xs sm:h-14 sm:w-14 sm:text-lg ${
                    avatarDisabled ? 'opacity-60' : ''
                  }`}
                >
                  {avatarFallback}
                </span>
              ) : null}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className="truncate text-base font-bold tracking-tight text-white sm:text-lg"
                    title={title}
                  >
                    {title}
                  </h3>
                  {badges}
                </div>
                {subtitle && (
                  <div className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-200/90">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Barra de pestañas compartida */}
        {tabs && tabs.length > 0 && activeTab && onTabChange && (
          <nav
            className="shrink-0 border-b border-slate-200 bg-white px-5 py-2.5"
            aria-label="Secciones del detalle"
          >
            <div className="flex gap-1.5 overflow-x-auto" role="tablist">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const badgeCount = tab.badge ?? 0;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onTabChange(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#0f2e3a] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2e3a]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {badgeCount > 0 && (
                      <span
                        className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Área única de scroll */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* Footer unificado */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3.5">
          <div className="min-w-0 text-xs text-slate-400">{footerLeft}</div>
          <div className="ml-auto flex items-center gap-2">
            {footerRight}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
            >
              {closeLabel}
            </button>
          </div>
        </footer>
      </div>
    </Modal>
  );
}