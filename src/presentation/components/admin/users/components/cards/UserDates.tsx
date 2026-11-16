'use client';

import { CalendarDays, Clock3 } from 'lucide-react';
import { formatRegistered, formatLastAccess } from './Config';

interface UserDatesProps {
  user: {
    createdAt?: string | Date | null;
    lastLoginAt?: string | Date | null;
  };
}

export function UserDates({ user }: UserDatesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 text-slate-400">
          <CalendarDays className="h-3 w-3" aria-hidden="true" />
          <span className="text-[10px] font-medium uppercase tracking-wide">Registro</span>
        </div>
        <p className="truncate text-xs font-medium text-slate-600">
          {formatRegistered(user.createdAt)}
        </p>
      </div>

      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 text-slate-400">
          <Clock3 className="h-3 w-3" aria-hidden="true" />
          <span className="text-[10px] font-medium uppercase tracking-wide">Último acceso</span>
        </div>
        <p className="truncate text-xs font-medium text-slate-600">
          {formatLastAccess(user.lastLoginAt)}
        </p>
      </div>
    </div>
  );
}