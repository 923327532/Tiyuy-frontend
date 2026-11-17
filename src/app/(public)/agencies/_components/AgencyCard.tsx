import Link from 'next/link';
import { ArrowRight, Folder, Home, MapPin, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PublicAgency } from './types';

interface Props {
  agency: PublicAgency;
}

export default function AgencyCard({ agency }: Props) {
  const initial = agency.name?.charAt(0).toUpperCase() || 'I';

  const metrics = [
    { label: 'Agentes', value: agency.agentsCount, Icon: Users as LucideIcon },
    {
      label: 'Proyectos',
      value: agency.activeProjectsCount,
      Icon: Folder as LucideIcon,
    },
    {
      label: 'Inmuebles',
      value: agency.activePropertiesCount,
      Icon: Home as LucideIcon,
    },
  ];

  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="group relative flex min-h-[286px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4A9A3E]/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] focus-visible:ring-offset-2 sm:p-6 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4A9A3E] to-[#61BF53] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-[#F4F8F2] text-xl font-bold text-[#3b7c31]">
          {agency.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
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
          <h2 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.02em] text-stone-900 transition-colors group-hover:text-[#3b7c31]">
            {agency.name || 'Nombre no disponible'}
          </h2>

          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-stone-600">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#4A9A3E]" />
            {agency.city || 'Ubicación no disponible'}
          </p>
        </div>
      </div>

      {agency.shortDescription ? (
        <p className="mt-5 line-clamp-2 min-h-12 flex-1 text-[13px] leading-6 text-stone-600">
          {agency.shortDescription}
        </p>
      ) : (
        <p className="mt-5 min-h-12 flex-1 text-[13px] italic leading-6 text-stone-400">
          Información institucional no disponible.
        </p>
      )}

      <div className="grid grid-cols-3 border-y border-stone-100 py-3.5">
        {metrics.map(({ label, value, Icon }, index) => (
          <div
            key={label}
            className={index > 0 ? 'border-l border-stone-100 px-2' : 'pr-2'}
          >
            <p className="flex items-center gap-1.5 text-base font-bold tabular-nums text-stone-900">
              <Icon aria-hidden="true" className="h-3.5 w-3.5 text-[#4A9A3E]" />
              {value}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-stone-500">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-bold text-[#3b7c31]">
        <span>Ver perfil de agencia</span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </div>
    </Link>
  );
}
