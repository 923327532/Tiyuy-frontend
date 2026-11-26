'use client';

import { Briefcase, Mail, X } from 'lucide-react';
import type { AgentListItem } from '@/core/domain/entities/Admin';
import { getAgentFullName, getAgentInitials } from '../ui/agentDetailParts';
import { type AgentAccountState } from '../model/accountState';

interface ModalHeaderProps {
  agent: AgentListItem;
  accountState: AgentAccountState;
  onClose: () => void;
}

export function ModalHeader({ agent, accountState, onClose }: ModalHeaderProps) {
  const fullName = getAgentFullName(agent);
  const isActive = accountState === 'ACTIVE';

  return (
    <header className="relative shrink-0 bg-gradient-to-r from-[#0f2e3a] via-[#133c4b] to-[#164e63] px-5 py-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {agent.profilePhotoUrl ? (
            <img
              src={agent.profilePhotoUrl}
              alt=""
              className={`h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-white/25 ${
                !agent.enabled ? 'opacity-60 grayscale' : ''
              }`}
            />
          ) : (
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold tracking-wide text-white ring-2 ring-white/25 backdrop-blur-xs ${
                !agent.enabled ? 'opacity-60' : ''
              }`}
            >
              {getAgentInitials(agent)}
            </span>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold tracking-tight text-white" title={fullName}>
                {fullName}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-100 ring-1 ring-white/20">
                <Briefcase className="h-3 w-3" aria-hidden="true" />
                Agente
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-200 ring-rose-400/30'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                  aria-hidden="true"
                />
                {isActive ? 'Activo' : 'Suspendido'}
              </span>
            </div>

            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-200/90" title={agent.email}>
              <Mail className="h-3.5 w-3.5 shrink-0 text-teal-300" aria-hidden="true" />
              <span className="truncate">{agent.email}</span>
            </p>
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
  );
}