import Link from 'next/link';
import { ArrowLeft, Folder, Home, Mail, MapPin, Phone, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AgencyStars from './AgencyStars';
import type { AgencyRatingSummary } from '../../_hooks/useAgencyDetail';
import type { AgencyDetail } from '../types';

interface AgencyProfileHeaderProps {
  agency: AgencyDetail;
  ratings: AgencyRatingSummary;
}

const HERO_IMAGE = '/assets/images/agencies/hero-agencies.jpg';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export default function AgencyProfileHeader({
  agency,
  ratings,
}: AgencyProfileHeaderProps) {
  const contactRows = [
    agency.city && {
      Icon: MapPin as LucideIcon,
      label: agency.city,
      href: undefined,
    },
    agency.phone && {
      Icon: Phone as LucideIcon,
      label: agency.phone,
      href: `tel:${agency.phone.replace(/\s+/g, '')}`,
    },
    agency.email && {
      Icon: Mail as LucideIcon,
      label: agency.email,
      href: `mailto:${agency.email}`,
    },
  ].filter(Boolean) as { Icon: LucideIcon; label: string; href?: string }[];

  const metrics = [
    {
      label: 'Agentes',
      value: agency.agentsCount,
      Icon: Users,
      href: undefined,
    },
    {
      label: 'Proyectos',
      value: agency.activeProjectsCount,
      Icon: Folder,
      href: agency.projectsUrl?.trim() || undefined,
    },
    {
      label: 'Inmuebles',
      value: agency.activePropertiesCount,
      Icon: Home,
      href: agency.propertiesUrl?.trim() || undefined,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#F3EFEA] pb-10 pt-6">
      {/* Imagen de fondo en la esquina superior derecha con difuminado suave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-3/5 lg:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F3EFEA] via-[#F3EFEA]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F3EFEA] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Botón Volver */}
        <Link
          href="/agencies"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E]"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Todas las agencias
        </Link>

        {/* Bloque principal del header */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Logo de la agencia */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-md sm:h-32 sm:w-32">
              {agency.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={agency.logoUrl}
                  alt={`Logo de ${agency.name}`}
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-700">
                  <Home aria-hidden="true" className="h-10 w-10 stroke-[1.5] text-[#4A9A3E]" />
                  <span className="mt-1 text-xs font-bold tracking-wider">
                    {initials(agency.name)}
                  </span>
                </div>
              )}
            </div>

            {/* Información y detalles */}
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-stone-900 sm:text-4xl">
                {agency.name}
              </h1>

              {/* Estrellas y número de reseñas */}
              <div className="mt-2.5 flex items-center gap-2 text-xs">
                <AgencyStars value={ratings.averageRating} />
                <span className="font-bold text-stone-900">
                  {ratings.totalRatings > 0 ? ratings.averageRating.toFixed(1) : '—'}
                </span>
                <span className="text-stone-500">
                  ({ratings.totalRatings}{' '}
                  {ratings.totalRatings === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>

              {/* Etiquetas de datos de contacto */}
              {contactRows.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-stone-700">
                  {contactRows.map(({ Icon, label, href }) =>
                    href ? (
                      <a
                        key={label}
                        href={href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-stone-200/60 px-3.5 py-1.5 transition-colors hover:bg-stone-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E]"
                      >
                        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-stone-700" />
                        <span>{label}</span>
                      </a>
                    ) : (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full bg-stone-200/60 px-3.5 py-1.5"
                      >
                        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-stone-700" />
                        <span>{label}</span>
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de métricas (Agentes, Proyectos, Inmuebles) */}
        <div className="mt-6 max-w-xl rounded-2xl border border-stone-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-3 divide-x divide-stone-200 text-center">
            {metrics.map(({ label, value, Icon, href }) =>
              href && value > 0 ? (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center justify-center gap-1.5 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4A9A3E] sm:flex-row sm:gap-2"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-stone-700" />
                  <MetricValue label={label} value={value} />
                </Link>
              ) : (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-2"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-stone-700" />
                  <MetricValue label={label} value={value} />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-left">
      <span className="text-sm font-bold tabular-nums text-stone-900">{value}</span>
      <span className="ml-1 text-xs text-stone-500">{label}</span>
    </div>
  );
}
