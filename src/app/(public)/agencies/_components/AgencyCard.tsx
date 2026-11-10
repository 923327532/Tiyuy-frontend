import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  FolderGit,
  Home,
  MapPin,
  Users,
} from 'lucide-react';
import type { PublicAgency } from './types';

interface Props {
  agency: PublicAgency;
}

export default function AgencyCard({ agency }: Props) {
  const initial = agency.name?.charAt(0).toUpperCase() || 'I';

  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="group flex flex-col rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[0_12px_40px_rgba(74,154,62,0.12)]"
    >
      {/* Cabecera de la tarjeta */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xl font-bold text-[var(--text-primary)]">
          {agency.logoUrl ? (
            <img
              src={agency.logoUrl}
              alt={`Logo de ${agency.name}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand-primary)]">
              {agency.name}
            </h3>
            <CheckCircle
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[var(--brand-primary)]"
            />
          </div>

          {agency.city && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {agency.city}
            </p>
          )}
        </div>
      </div>

      {/* Descripción corta */}
      {agency.shortDescription ? (
        <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          {agency.shortDescription}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      {/* Métricas y pie */}
      <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border-color)] pt-4 text-sm text-[var(--text-secondary)]">
        {agency.activeProjectsCount > 0 && (
          <span className="flex items-center gap-1.5">
            <FolderGit
              aria-hidden="true"
              className="h-4 w-4 text-[var(--brand-primary)]/60"
            />
            <span className="font-medium text-[var(--text-primary)]">
              {agency.activeProjectsCount}
            </span>{' '}
            proy.
          </span>
        )}

        {agency.activePropertiesCount > 0 && (
          <span className="flex items-center gap-1.5">
            <Home
              aria-hidden="true"
              className="h-4 w-4 text-[var(--brand-primary)]/60"
            />
            <span className="font-medium text-[var(--text-primary)]">
              {agency.activePropertiesCount}
            </span>{' '}
            prop.
          </span>
        )}

        <span className="flex items-center gap-1.5">
          <Users
            aria-hidden="true"
            className="h-4 w-4 text-[var(--brand-primary)]/60"
          />
          <span className="font-medium text-[var(--text-primary)]">
            {agency.agentsCount}
          </span>
        </span>

        <span className="ml-auto flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)] opacity-0 transition-opacity group-hover:opacity-100">
          Ver <ArrowRight aria-hidden="true" className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}