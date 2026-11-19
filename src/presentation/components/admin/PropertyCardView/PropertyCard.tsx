/**
 * PropertyCard Component
 * Renders a single property as a card with image, status, price, and key details.
 * Single responsibility: renders one property card.
 */

'use client';

import { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { MapPin, Eye, BarChart3, User, Calendar } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyModerationItem;
  onClick?: (property: PropertyModerationItem) => void;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  'PUBLISHED': { label: 'Publicada', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'PENDING': { label: 'Pendiente', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'REJECTED': { label: 'Rechazada', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'SUSPENDED': { label: 'Suspendida', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'DRAFT': { label: 'Borrador', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  'PAUSED': { label: 'Pausada', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'EXPIRED': { label: 'Expirada', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'DISABLED_BY_ADMIN': { label: 'Deshabilitada', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  'RENTED': { label: 'Alquilada', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'SOLD': { label: 'Vendida', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
};

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const status = statusConfig[property.status] || statusConfig['DRAFT'];
  const formattedPrice = property.price?.toLocaleString('es-PE') || '0';
  const formattedDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div
      onClick={() => onClick?.(property)}
      className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {property.thumbnailUrl ? (
          <img
            src={property.thumbnailUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
            <div className="text-center">
              <div className="text-3xl mb-1">🏠</div>
              <span className="text-xs text-gray-400">Sin imagen</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${status.bg} ${status.text} ${status.border} shadow-sm`}>
            {status.label}
          </span>
        </div>

        {/* Featured Badge */}
        {property.isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
              ⭐ Destacada
            </span>
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <span className="text-white font-bold text-lg drop-shadow-sm">
            S/ {formattedPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2.5">
        {/* Title */}
        <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight line-clamp-2 group-hover:text-teal-600 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
          <span className="truncate">
            {property.district || 'Ubicación no disponible'}
          </span>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <User className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
          <span className="truncate">{property.ownerName}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {property.viewsCount ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {property.reportCount ?? 0} reportes
            </span>
          </div>
          {formattedDate && (
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
