'use client';

import Link from 'next/link';
import { BedDouble, Bath, Maximize, MapPin } from 'lucide-react';
import { MapItem } from '@/core/domain/entities/MapTypes';
import { formatPrice } from '../utils/mapUtils';

interface PropertyMapCardProps {
  item: MapItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
  detailBaseUrl?: string;
}

export function PropertyMapCard({
  item,
  isSelected,
  onSelect,
  detailBaseUrl = '/property/',
}: PropertyMapCardProps) {
  const isProject = item.type === 'PROJECT';
  const slug = String(item.slug || item.id);
  const detailUrl = isProject ? '/projects/detail/' + slug : '/property/' + slug;

  return (
    <div
      className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
          : 'bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-300 hover:shadow-sm'
      }`}
      onClick={() => onSelect(item.id)}
    >
      <Link href={detailUrl} className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {item.imageUrl ? (
          <img
            src={`/api/images/proxy?url=${encodeURIComponent(item.imageUrl)}`}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl flex items-center justify-center w-full h-full bg-[var(--bg-secondary)]">${isProject ? '🏗️' : '🏠'}</span>`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)] text-2xl">
            {isProject ? '🏗️' : '🏠'}
          </div>
        )}
        {item.isFeatured && (
          <div className="absolute top-1 left-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Destacado
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={detailUrl}
          className="block"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {item.title}
          </h3>
        </Link>

        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
          {item.district}{item.province ? `, ${item.province}` : ''}
        </p>

        {/* Metadatos específicos según tipo */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
          {!isProject && item.metadata?.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3 h-3" />
              {item.metadata.bedrooms}
            </span>
          )}
          {!isProject && item.metadata?.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              {item.metadata.bathrooms}
            </span>
          )}
          {item.metadata?.area && (
            <span className="flex items-center gap-1">
              <Maximize className="w-3 h-3" />
              {item.metadata.area}m²
            </span>
          )}
          {isProject && item.metadata?.availableUnits && (
            <span>{item.metadata.availableUnits} disp.</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {formatPrice(item.price, item.currency)}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={detailUrl}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Ver
            </Link>
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {item.district}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}