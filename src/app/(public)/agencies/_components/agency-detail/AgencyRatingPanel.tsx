'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LoaderCircle, Star } from 'lucide-react';
import AgencyStars from './AgencyStars';
import type { AgencyRatingSummary } from '../../_hooks/useAgencyDetail';

interface AgencyRatingPanelProps {
  agencyName: string;
  ratings: AgencyRatingSummary;
  userRating: number;
  userLoggedIn: boolean;
  sending: boolean;
  message: string;
  onRate: (score: number) => void;
}

export default function AgencyRatingPanel({
  agencyName,
  ratings,
  userRating,
  userLoggedIn,
  sending,
  message,
  onRate,
}: AgencyRatingPanelProps) {
  const [hoverScore, setHoverScore] = useState(0);
  const shownScore = hoverScore || userRating;
  const hasRatings = ratings.totalRatings > 0;

  return (
    <section aria-labelledby="rate-title" className="pt-2">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-[#C25E00]" />
        <h2 id="rate-title" className="text-lg font-semibold tracking-tight text-stone-900">
          Valoraciones
        </h2>
      </div>

      {/* Score destacado */}
      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-5xl font-semibold tabular-nums tracking-tight text-stone-900">
          {hasRatings ? ratings.averageRating.toFixed(1) : '—'}
        </span>
        <div className="flex flex-col">
          <AgencyStars value={ratings.averageRating} />
          <span className="mt-1 text-xs text-stone-500">
            ({ratings.totalRatings} {ratings.totalRatings === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      </div>

      {/* Calificación interactiva */}
      <div className="mt-6 rounded-2xl border border-stone-200/60 bg-white/60 p-4">
        <h3 className="text-xs font-semibold text-stone-800">
          {userRating > 0 ? 'Tu calificación guardada' : `Califica a ${agencyName}`}
        </h3>

        {userLoggedIn ? (
          <div className="mt-2 flex flex-col gap-1.5">
            <div
              role="radiogroup"
              aria-label="Calificación de 1 a 5 estrellas"
              className="flex items-center gap-1"
              onMouseLeave={() => setHoverScore(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={userRating === n}
                  aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                  disabled={sending}
                  onMouseEnter={() => setHoverScore(n)}
                  onFocus={() => setHoverScore(n)}
                  onBlur={() => setHoverScore(0)}
                  onClick={() => onRate(n)}
                  className="rounded-lg p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] disabled:opacity-50 motion-reduce:transition-none"
                >
                  <Star
                    aria-hidden="true"
                    className={`h-6 w-6 ${
                      n <= shownScore
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-stone-200 text-stone-300'
                    }`}
                  />
                </button>
              ))}
              {sending && (
                <LoaderCircle
                  aria-hidden="true"
                  className="ml-2 h-4 w-4 animate-spin text-stone-400"
                />
              )}
            </div>
            {message && (
              <p className="text-xs text-stone-600" role="status" aria-live="polite">
                {message}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-1.5 text-xs text-stone-500">
            <Link href="/login" className="font-bold text-[#3b7c31] underline">
              Inicia sesión
            </Link>{' '}
            para calificar a {agencyName}.
          </p>
        )}
      </div>
    </section>
  );
}
