import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building2, Mail, MapPin, Phone } from 'lucide-react';
import type { AgencyDetail } from '../types';

interface AgencyProfileHeaderProps {
  agency: AgencyDetail;
}

export default function AgencyProfileHeader({ agency }: AgencyProfileHeaderProps) {
  return (
    <header className="overflow-hidden bg-[var(--brand-primary-hover)] text-white">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8 lg:px-12">
        <Link
          href="/agencies"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-primary-hover)]"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Directorio de agencias
        </Link>

        <div className="mt-9 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-center sm:gap-7">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white p-2 text-2xl font-semibold text-[var(--brand-primary-hover)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:h-24 sm:w-24">
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agency.logoUrl}
                alt={`Logo de ${agency.name}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span aria-hidden="true">
                {agency.name?.charAt(0).toUpperCase() || <Building2 />}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              {agency.name || 'Nombre no disponible'}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              {agency.city && (
                <span className="inline-flex items-center gap-2">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  {agency.city}
                </span>
              )}
              {agency.email && (
                <a
                  className="inline-flex items-center gap-2 hover:text-white focus-visible:outline-none focus-visible:underline"
                  href={`mailto:${agency.email}`}
                >
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  {agency.email}
                </a>
              )}
              {agency.phone && (
                <a
                  className="inline-flex items-center gap-2 hover:text-white focus-visible:outline-none focus-visible:underline"
                  href={`tel:${agency.phone}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  {agency.phone}
                </a>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-center self-center rounded-2xl border border-white/15 bg-white/10 p-2 sm:p-3">
            <Image
              src="/assets/icons/agency-building.png"
              alt="Icono de edificios para el perfil de la agencia"
              width={180}
              height={180}
              sizes="(max-width: 639px) 96px, 160px"
              className="h-auto w-24 drop-shadow-[0_12px_18px_rgba(0,0,0,0.12)] sm:w-36 lg:w-40"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
