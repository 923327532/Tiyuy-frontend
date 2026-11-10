import Link from 'next/link';
import {
  ArrowRight,
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
      className="group relative flex min-h-[286px] flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 transition-colors duration-200 hover:border-[var(--brand-primary)] hover:bg-[var(--bg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 sm:p-6 motion-reduce:transition-none"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xl font-semibold text-[var(--brand-primary-hover)]">
          {agency.logoUrl ? (
            <img
              src={agency.logoUrl}
              alt={`Logo de ${agency.name || 'la agencia'}`}
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="line-clamp-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand-primary-hover)]">
            {agency.name || 'Nombre no disponible'}
          </h2>

          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--brand-primary)]" />
            {agency.city || 'Ubicación no disponible'}
          </p>
        </div>
      </div>

      {agency.shortDescription ? (
        <p className="mt-5 line-clamp-2 min-h-12 flex-1 text-[13px] leading-6 text-[var(--text-secondary)]">
          {agency.shortDescription}
        </p>
      ) : (
        <p className="mt-5 min-h-12 flex-1 text-[13px] italic leading-6 text-[var(--text-tertiary)]">
          Información institucional no disponible.
        </p>
      )}

      <div className="grid grid-cols-3 border-y border-[var(--border-color)] py-3.5">
        <div className="pr-2">
          <p className="flex items-center gap-1.5 text-base font-semibold tabular-nums text-[var(--text-primary)]">
            <Users aria-hidden="true" className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            {agency.agentsCount}
          </p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Agentes</p>
        </div>
        <div className="border-l border-[var(--border-color)] px-2">
          <p className="flex items-center gap-1.5 text-base font-semibold tabular-nums text-[var(--text-primary)]">
            <FolderGit aria-hidden="true" className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            {agency.activeProjectsCount}
          </p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Proyectos</p>
        </div>
        <div className="border-l border-[var(--border-color)] pl-2">
          <p className="flex items-center gap-1 text-base font-semibold tabular-nums text-[var(--text-primary)]">
            <Home aria-hidden="true" className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            {agency.activePropertiesCount}
          </p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Inmuebles</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border-light)] pt-4 text-xs font-semibold text-[var(--brand-primary-hover)]">
        <span>Ver perfil de agencia</span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </div>
    </Link>
  );
}