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
      className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_8px_28px_-20px_rgba(35,45,37,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#4A9A3E]/50 hover:shadow-[0_20px_35px_-20px_rgba(35,45,37,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] focus-visible:ring-offset-2 sm:p-6 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4A9A3E] to-[#61BF53] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start gap-3.5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCEBD8] bg-[#F4F8F2] text-lg font-bold text-[#3b7c31] ring-4 ring-[#F8FBF7]">
          {agency.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agency.logoUrl}
              alt={`Logo de ${agency.name || 'la agencia'}`}
              className="h-full w-full object-contain bg-white p-2.5"
              loading="lazy"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="line-clamp-2 text-base font-bold leading-snug tracking-[-0.02em] text-stone-900 transition-colors group-hover:text-[#3b7c31] sm:text-[17px]">
            {agency.name || 'Nombre no disponible'}
          </h2>

          <p className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-600">
            <MapPin aria-hidden="true" className="h-3 w-3 shrink-0 text-[#4A9A3E]" />
            {agency.city || 'Ubicación no disponible'}
          </p>
        </div>
      </div>

      {agency.shortDescription ? (
        <p className="mt-5 line-clamp-2 min-h-12 flex-1 text-[13px] leading-5 text-stone-600">
          {agency.shortDescription}
        </p>
      ) : (
        <p className="mt-5 min-h-12 flex-1 text-[13px] italic leading-5 text-stone-400">
          Información institucional no disponible.
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 border-y border-stone-100 py-3">
        {metrics.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="rounded-lg bg-stone-50 px-2 py-2"
          >
            <p className="flex items-center gap-1.5 text-sm font-bold tabular-nums text-stone-900">
              <Icon aria-hidden="true" className="h-3.5 w-3.5 text-[#4A9A3E]" />
              {value}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-stone-500">
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
