'use client';

import { Clock, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { STATUS_META } from '../../config/international.constants';

const ICONS = {
  pending: Clock,
  verified: ShieldCheck,
  rejected: ShieldX,
  manual: Shield,
} as const;

const STYLES = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  verified: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  manual: 'bg-sky-50 text-sky-700 ring-sky-600/20',
} as const;

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  const Icon = ICONS[meta.variant];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[meta.variant]}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}
