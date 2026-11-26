'use client';

import type { Banner } from '@/core/domain/entities/Admin';
import { BannerCard } from './BannerCard';
import './styles/banners-cards.css';

interface Props {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onToggle: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  busyId?: number | null;
}

export function BannerCardView({ banners, onEdit, onToggle, onDelete, busyId }: Props) {
  return (
    <div className="campaigns-cards-container banners-cards-container">
      <ul className="campaigns-card-grid">
        {banners.map((banner) => (
          <li key={banner.id} className="h-full min-w-0">
            <BannerCard
              banner={banner}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
              busyId={busyId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
