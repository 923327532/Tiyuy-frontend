'use client';

import { Map } from 'lucide-react';

interface ViewMapButtonProps {
  onClick: () => void;
  totalProperties?: number;
}

export function ViewMapButton({ onClick, totalProperties }: ViewMapButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 active:scale-95"
    >
      <Map className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">Ver mapa</span>
      <span className="sm:hidden">Mapa</span>
      {totalProperties !== undefined && totalProperties > 0 && (
        <span className="bg-white/20 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
          {totalProperties}
        </span>
      )}
    </button>
  );
}
