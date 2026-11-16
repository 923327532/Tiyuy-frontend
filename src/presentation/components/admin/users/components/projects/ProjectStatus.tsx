'use client';

import type { UserProjectSummary } from '@/core/domain/entities/Admin';
import { STATUS_CONFIG, DEFAULT_STATUS } from './Config';

interface ProjectStatusProps {
  status: UserProjectSummary['status'];
}

export function ProjectStatus({ status }: ProjectStatusProps) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_STATUS;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}