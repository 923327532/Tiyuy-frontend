'use client';

import { MapCoverageType } from '@/core/domain/entities/MapTypes';
import { MapPin, AlertTriangle, Info } from 'lucide-react';

interface MapCoverageMessageProps {
  coverage: MapCoverageType;
  message: string;
  districtsIncluded: string[];
  totalResults: number;
  /** Etiqueta para el tipo de item (ej: "propiedad", "proyecto") */
  itemLabel?: string;
  /** Etiqueta plural */
  itemLabelPlural?: string;
}

const coverageConfig: Record<MapCoverageType, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  EXACT_DISTRICT: {
    icon: <MapPin className="w-4 h-4 text-emerald-600" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  NEARBY_DISTRICTS: {
    icon: <MapPin className="w-4 h-4 text-amber-600" />,
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  METRO_AREA: {
    icon: <Info className="w-4 h-4 text-violet-600" />,
    bg: 'bg-violet-50',
    text: 'text-violet-800',
    border: 'border-violet-200',
  },
  PROVINCE: {
    icon: <Info className="w-4 h-4 text-violet-600" />,
    bg: 'bg-violet-50',
    text: 'text-violet-800',
    border: 'border-violet-200',
  },
  REGION: {
    icon: <Info className="w-4 h-4 text-violet-600" />,
    bg: 'bg-violet-50',
    text: 'text-violet-800',
    border: 'border-violet-200',
  },
  NO_RESULTS: {
    icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
  },
};

export function MapCoverageMessage({
  coverage,
  message,
  districtsIncluded,
  totalResults,
  itemLabel = 'propiedad',
  itemLabelPlural = 'propiedades',
}: MapCoverageMessageProps) {
  const config = coverageConfig[coverage] || coverageConfig.NO_RESULTS;

  if (coverage === 'NO_RESULTS') {
    return (
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${config.border} mb-4`}>
        <div className="mt-0.5">{config.icon}</div>
        <div>
          <p className={`text-sm font-semibold ${config.text}`}>{message}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Intenta ampliar tu búsqueda a otras zonas o ajusta los filtros.
          </p>
        </div>
      </div>
    );
  }

  const label = totalResults === 1 ? itemLabel : itemLabelPlural;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${config.border} mb-4`}>
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${config.text}`}>
          {totalResults} {label} encontrada{totalResults !== 1 ? 's' : ''}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{message}</p>
        {districtsIncluded.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {districtsIncluded.map((district) => (
              <span
                key={district}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] shadow-sm"
              >
                {district}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
