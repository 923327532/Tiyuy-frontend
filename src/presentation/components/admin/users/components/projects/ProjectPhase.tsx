'use client';

import type { UserProjectSummary } from '@/core/domain/entities/Admin';
import { PHASE_CONFIG } from './Config';

interface ProjectPhaseProps {
  phase: UserProjectSummary['phase'];
}

export function ProjectPhase({ phase }: ProjectPhaseProps) {
  const config = PHASE_CONFIG[phase] ?? { label: phase, className: 'bg-slate-100 text-slate-700' };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}