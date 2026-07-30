'use client';

import React, { useState } from 'react';
import { Image, ChevronRight } from 'lucide-react';
import { MapPropertySummary } from '@/core/domain/entities/Property';
import Link from 'next/link';

interface PropertyMapCardProps {
  property: MapPropertySummary;
  isSelected?: boolean;
  onClick?: () => void;
  /** Distrito solicitado originalmente (para mostrar badge de distrito cercano) */
  requestedDistrict?: string;
}

export function PropertyMapCard({ property, isSelected, onClick }: PropertyMapCardProps) {
  const [imgError, setImgError] = useState(false);

  // Limpiar "| Wasyn" del título si existe
  const cleanTitle = property.title?.replace(/\s*\|\s*Wasyn\s*$/i, '').trim() || property.title || '';

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency || 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const typeLabels: Record<string, string> = {
    APARTMENT: 'Dpto',
    HOUSE: 'Casa',
    LAND: 'Terreno',
    OFFICE: 'Oficina',
    COMMERCIAL: 'Local',
    ROOM: 'Hab.',
  };

  const transactionLabels: Record<string, string> = {
    SALE: 'Venta',
    RENT: 'Alquiler',
  };

  return (
    <Link href={`/property/${property.slug || property.id}`} className="block w-full">
      <div className={`w-full bg-[var(--bg-card)] rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md border ${
        isSelected ? 'border-brand ring-1 ring-brand shadow-md' : 'border-[var(--border-color)] shadow-sm hover:border-brand/40'
      }`}>
        <div className="flex">
          <div className="relative w-28 sm:w-32 h-24 sm:h-28 flex-shrink-0 bg-[var(--bg-tertiary)] overflow-hidden">
            {property.mainPhotoUrl && !imgError ? (
              <img src={property.mainPhotoUrl} alt={property.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--text-muted)]"><Image className="w-8 h-8" strokeWidth={1.5} /></div>
            )}
            {property.isFeatured && (
              <span className="absolute top-1 left-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">Destacado</span>
            )}
          </div>
          <div className="flex-1 min-w-0 p-2.5 sm:p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                {property.transactionType && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-light text-brand-dark">{transactionLabels[property.transactionType] || property.transactionType}</span>}
                {property.type && <span className="text-[10px] text-[var(--text-muted)] font-medium">{typeLabels[property.type] || property.type}</span>}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-1">{cleanTitle}</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 truncate">{property.district}{property.province ? `, ${property.province}` : ''}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-secondary)] flex-wrap">
                {property.bedrooms && <span>{property.bedrooms} dorm</span>}
                {property.bathrooms && <span>{property.bathrooms} baños</span>}
                {property.area && <span>{property.area} m²</span>}
              </div>
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[var(--border-color)]">
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Precio</p>
                <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{formatPrice(property.price, property.currency)}</p>
              </div>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-white bg-brand px-2 py-1 rounded-md hover:bg-brand-dark transition-colors">
                Ver <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
