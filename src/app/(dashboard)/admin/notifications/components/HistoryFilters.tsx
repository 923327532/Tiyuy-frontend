'use client';

import { Search, Filter, ChevronDown, Bell, AlertTriangle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HistoryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (filter: string) => void;
  showFilter: boolean;
  onShowFilterChange: (show: boolean) => void;
}

export function HistoryFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  showFilter,
  onShowFilterChange,
}: HistoryFiltersProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        onShowFilterChange(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilter, onShowFilterChange]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      {/* Search */}
      <div className="relative flex-1 sm:flex-none">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar..."
          className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
        />
      </div>

      {/* Filter - Custom Dropdown */}
      <div className="relative w-full sm:w-auto" ref={filterRef}>
        <button
          onClick={() => onShowFilterChange(!showFilter)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{typeFilter === 'NOTIFICATION' ? 'Notificaciones' : typeFilter === 'ALERT' ? 'Alertas' : 'Todas'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
        </button>

        {showFilter && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => onShowFilterChange(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
              <button
                onClick={() => { onTypeFilterChange(''); onShowFilterChange(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${!typeFilter ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'}`}
              >
                Todas
              </button>
              <button
                onClick={() => { onTypeFilterChange('NOTIFICATION'); onShowFilterChange(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${typeFilter === 'NOTIFICATION' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'}`}
              >
                <Bell className="w-3.5 h-3.5" />
                Notificaciones
              </button>
              <button
                onClick={() => { onTypeFilterChange('ALERT'); onShowFilterChange(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${typeFilter === 'ALERT' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Alertas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}