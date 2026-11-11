import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { AgencyDetail } from '../types';

interface AgencyDescriptionProps {
  agency: AgencyDetail;
}

const ABOUT_IMAGE = '/assets/images/hero/hero-2.jpg';

export default function AgencyDescription({ agency }: AgencyDescriptionProps) {
  const links = [
    agency.projectsUrl?.trim() && {
      label: 'Ver proyectos',
      href: agency.projectsUrl.trim(),
    },
    agency.propertiesUrl?.trim() && {
      label: 'Ver inmuebles',
      href: agency.propertiesUrl.trim(),
    },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section aria-labelledby="about-title">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-[#C25E00]" />
        <h2 id="about-title" className="text-lg font-semibold tracking-tight text-stone-900">
          Sobre la agencia
        </h2>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-7">
          <p className="whitespace-pre-line text-xs leading-relaxed text-stone-600">
            {agency.description?.trim() ||
              'Esta agencia aún no ha publicado su descripción institucional.'}
          </p>

          {links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {links.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E]"
                >
                  {label}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Imagen ilustrativa */}
        <div className="overflow-hidden rounded-2xl border border-stone-200/60 shadow-sm md:col-span-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ABOUT_IMAGE}
            alt="Inmuebles gestionados por la agencia"
            className="h-44 w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
