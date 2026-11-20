'use client';

import { Eye, MapPin, Star } from 'lucide-react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { Badge } from '@/presentation/components/ui/Badge';
import { PROPERTY_STATUS_LABELS } from '../config/properties.constants';
import { formatCurrency, formatDate } from '../utils/properties.utils';
import { PropertyStatusBadge } from './table/PropertyStatusBadge';
import './styles/properties-cards.css';

interface PropertiesCardViewProps {
  properties: PropertyModerationItem[];
  onViewDetail: (property: PropertyModerationItem) => void;
}

export function PropertiesCardView({ properties, onViewDetail }: PropertiesCardViewProps) {
  return (
    <ul className="properties-card-grid">
      {properties.map((property) => (
        <li key={property.id}>
          <article className="properties-card" onClick={() => onViewDetail(property)}>
            <div className="properties-card__media">
              {property.thumbnailUrl ? (
                <img src={property.thumbnailUrl} alt="" loading="lazy" />
              ) : (
                <span className="properties-card__placeholder">#{property.id}</span>
              )}
              {property.isFeatured && (
                <span className="properties-card__featured">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" /> Destacada
                </span>
              )}
            </div>

            <div className="properties-card__body">
              <div className="properties-card__top">
                <PropertyStatusBadge status={property.status} />
                <span className="properties-card__price">
                  {formatCurrency(Number(property.price))}
                </span>
              </div>

              <h3 className="properties-card__title">{property.title}</h3>

              <p className="properties-card__location">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{property.district || 'Sin distrito'}</span>
              </p>

              <p className="properties-card__owner">
                {property.ownerName || 'Sin nombre'} · {property.ownerEmail}
              </p>

              <div className="properties-card__footer">
                <span>{formatDate(property.createdAt)}</span>
                <Badge variant="neutral" size="xs">
                  <Eye className="h-3 w-3" aria-hidden="true" />
                  {Number(property.viewsCount ?? 0)}
                </Badge>
                {Number(property.reportCount) > 0 && (
                  <Badge variant="danger" size="xs">
                    {property.reportCount} reporte(s)
                  </Badge>
                )}
                <span className="properties-card__status">
                  {PROPERTY_STATUS_LABELS[property.status] ?? property.status}
                </span>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
