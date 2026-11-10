'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { AgencyRatingSummary } from '../../_hooks/useAgencyDetail';

interface AgencyRatingPanelProps {
  ratings: AgencyRatingSummary;
  userRating: number;
  userLoggedIn: boolean;
  sending: boolean;
  message: string;
  onRate: (score: number) => void;
}

export default function AgencyRatingPanel({
  ratings,
  userRating,
  userLoggedIn,
  sending,
  message,
  onRate,
}: AgencyRatingPanelProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            Opiniones
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
            Calificar agencia
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-0.5"
            aria-label={`${ratings.averageRating.toFixed(1)} de 5 estrellas`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                aria-hidden="true"
                className={`h-4 w-4 ${
                  star <= Math.round(ratings.averageRating)
                    ? 'fill-[#bd8a3c] text-[#bd8a3c]'
                    : 'text-[#d8ddd7]'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
            {ratings.averageRating > 0 ? ratings.averageRating.toFixed(1) : '—'}
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">({ratings.totalRatings})</span>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border-light)] pt-5">
        <p className="text-sm text-[var(--text-secondary)]">Tu valoración</p>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onFocus={() => setHoverRating(star)}
              onBlur={() => setHoverRating(0)}
              disabled={sending || userRating > 0}
              aria-label={`Calificar con ${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
              aria-pressed={userRating === star}
              className="rounded p-1 transition-colors hover:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <Star
                aria-hidden="true"
                className={`h-6 w-6 ${
                  star <= (hoverRating || userRating)
                    ? 'fill-[#bd8a3c] text-[#bd8a3c]'
                    : 'text-[#c7cec7]'
                }`}
              />
            </button>
          ))}
          {!userLoggedIn && (
            <span className="ml-2 text-xs text-[var(--text-tertiary)]">
              Inicia sesión para calificar
            </span>
          )}
        </div>
        {message && (
          <p
            role="status"
            className={`mt-2 text-xs ${
              message.includes('No pudimos') || message.includes('Ya has')
                ? 'text-red-700'
                : 'text-[var(--brand-primary-hover)]'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
