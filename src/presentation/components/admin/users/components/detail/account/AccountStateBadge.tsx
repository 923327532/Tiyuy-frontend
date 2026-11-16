'use client';

import { ACCOUNT_STATE_META } from '../model/accountState';
import type { UserAccountState } from '../model/accountState';

interface AccountStateBadgeProps {
  state: UserAccountState;
  className?: string;
}

export function AccountStateBadge({ state, className = '' }: AccountStateBadgeProps) {
  const meta = ACCOUNT_STATE_META[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.chip} ${className}`.trim()}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
