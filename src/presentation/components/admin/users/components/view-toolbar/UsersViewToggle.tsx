'use client';

import { LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';

interface UsersViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function UsersViewToggle({ value, onChange }: UsersViewToggleProps) {
  return (
    <div className="flex items-center justify-end px-3 sm:px-6 py-2 border-b border-slate-100 bg-slate-50/30">
      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-sm">
        <button
          type="button"
          onClick={() => onChange('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            value === 'table'
              ? 'bg-[#0f2e3a] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          aria-pressed={value === 'table'}
        >
          <List className="w-3.5 h-3.5" aria-hidden="true" />
          Tabla
        </button>
        <button
          type="button"
          onClick={() => onChange('cards')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            value === 'cards'
              ? 'bg-[#0f2e3a] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          aria-pressed={value === 'cards'}
        >
          <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
          Tarjetas
        </button>
      </div>
    </div>
  );
}
