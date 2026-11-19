'use client';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { getInitials } from '../../utils/properties.utils';

interface PropertyIdentityCellProps {
  property: PropertyModerationItem;
}

export function PropertyIdentityCell({ property }: PropertyIdentityCellProps) {
  return (
    <div className="properties-identity">
      <span className="properties-identity__thumb">
        {property.thumbnailUrl ? (
          <img src={property.thumbnailUrl} alt="" loading="lazy" />
        ) : (
          <span className="properties-identity__fallback">
            {getInitials(property.title)}
          </span>
        )}
      </span>

      <span className="properties-identity__info">
        <span className="properties-cell-primary">{property.title}</span>
        <span className="properties-cell-secondary">
          {property.district || 'Sin distrito'} · #{property.id}
        </span>
      </span>
    </div>
  );
}
