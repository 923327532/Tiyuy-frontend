'use client';

import type { CSSProperties } from 'react';
import { Home } from 'lucide-react';

interface PropertyItemProps {
  item: unknown;
  index?: number;
}

export function PropertyItem({ item, index = 0 }: PropertyItemProps) {
  const prop = item as Record<string, unknown>;
  const status = String(prop.status ?? '');
  const statusVariant =
    status === 'PUBLISHED' ? 'published' : status === 'PENDING' ? 'pending' : 'other';

  const price =
    typeof prop.price === 'number'
      ? new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN',
          maximumFractionDigits: 0,
        }).format(prop.price)
      : 'S/ 0';

  return (
    <div
      className="user-properties-modal__item"
      style={{ ['--item-index' as string]: index } as CSSProperties}
    >
      <div className="user-properties-modal__item-media">
        {prop.thumbnailUrl ? (
          <img
            src={String(prop.thumbnailUrl)}
            alt={String(prop.title ?? 'Propiedad')}
            className="user-properties-modal__thumbnail"
          />
        ) : (
          <div className="user-properties-modal__thumbnail-placeholder">
            <Home className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="user-properties-modal__item-info">
        <p className="user-properties-modal__item-title" title={String(prop.title ?? '')}>
          {String(prop.title ?? 'Sin título')}
        </p>
        <p className="user-properties-modal__item-location">
          {[prop.district, prop.city].filter(Boolean).map(String).join(', ') || '—'}
        </p>
      </div>

      <div className="user-properties-modal__item-meta">
        <span className="user-properties-modal__item-price">{price}</span>
        <span
          className={`user-properties-modal__item-status user-properties-modal__item-status--${statusVariant}`}
        >
          {status || '—'}
        </span>
      </div>
    </div>
  );
}
