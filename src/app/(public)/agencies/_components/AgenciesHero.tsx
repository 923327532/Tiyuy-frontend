'use client';

import type { MouseEvent } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  Building2,
  MapPin,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react';

const HERO_IMAGE = '/assets/images/agencies/hero-agencies.jpg';

const HIGHLIGHTS = [
  { Icon: ShieldCheck, label: 'Agencias registradas' },
  { Icon: MapPin, label: 'Cobertura nacional' },
  { Icon: MessagesSquare, label: 'Contacto directo' },
];

export default function AgenciesHero() {
  const scrollToDirectory = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    document.getElementById('directorio')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <section
        aria-labelledby="agencies-title"
        className="relative isolate overflow-hidden bg-[#F3EFEA]"
      >
        {/* Detalles de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#4A9A3E]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#61BF53]/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-14 pt-9 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20 lg:pt-12">
          {/* Eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#4A9A3E]" />
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600 sm:text-xs">
                <Building2 className="h-4 w-4 text-[#4A9A3E]" aria-hidden="true" />
                Directorio inmobiliario
                <span className="text-[#4A9A3E]">/</span>
                Perú
              </p>
            </div>

            <span className="hidden items-center gap-2 rounded-full border border-stone-300/70 bg-white/60 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500 backdrop-blur-sm sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4A9A3E]" />
              Tiyuy · Agencias
            </span>
          </div>

          <div className="mt-9 grid items-center gap-12 md:mt-12 md:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            {/* Contenido */}
            <div className="relative z-10 max-w-2xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#4A9A3E]">
                Profesionales del sector inmobiliario
              </p>

              <h1
                id="agencies-title"
                className="max-w-[640px] text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-stone-900"
              >
                Encuentra la agencia
                <span className="block text-[#4A9A3E]">
                  que conecta contigo.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
                Explora agencias inmobiliarias, conoce su trayectoria y descubre
                los proyectos y propiedades que tienen para ofrecer.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#directorio"
                  onClick={scrollToDirectory}
                  className="group inline-flex min-h-14 items-center gap-4 rounded-full bg-[#4A9A3E] px-7 text-sm font-semibold text-white shadow-[0_14px_32px_-16px_rgba(74,154,62,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3b7c31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61BF53] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F3EFEA] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  Explorar agencias
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none">
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>

                <a
                  href="#directorio"
                  onClick={scrollToDirectory}
                  className="group inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold text-[#3b7c31] transition-colors hover:text-[#4A9A3E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F3EFEA]"
                >
                  Buscar por ciudad
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </a>
              </div>

              {/* Beneficios rápidos */}
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-stone-300/60 pt-6">
                {HIGHLIGHTS.map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 text-xs font-medium text-stone-600"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-[#4A9A3E]">
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fotografía */}
            <div
              className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] border border-white/60 bg-stone-200 shadow-[0_30px_80px_-35px_rgba(35,45,37,0.35)] sm:min-h-[400px] lg:min-h-[500px]"
              aria-hidden="true"
            >
              <Image
                src={HERO_IMAGE}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-[1200ms] hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                    Tiyuy · Directorio
                  </span>
                  <p className="mt-2 max-w-xs text-xl font-semibold leading-snug text-white sm:text-2xl">
                    Profesionales que dan forma a nuevos espacios.
                  </p>
                </div>

                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white sm:flex">
                  <ArrowDown className="h-4 w-4 -rotate-45" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franja de navegación */}
      <nav
        aria-label="Navegación del directorio"
        className="border-y border-stone-200 bg-white"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 text-[#4A9A3E]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>

            <div>
              <p className="text-sm font-semibold text-stone-800">
                Encuentra tu próxima conexión inmobiliaria
              </p>
              <p className="mt-0.5 text-xs text-stone-500">
                Busca agencias por nombre o ciudad
              </p>
            </div>
          </div>

          <a
            href="#directorio"
            onClick={scrollToDirectory}
            className="group inline-flex min-h-10 items-center gap-3 text-sm font-semibold text-[#3b7c31] transition-colors hover:text-[#4A9A3E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] focus-visible:ring-offset-4"
          >
            Ver todas las agencias
            <ArrowDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1 motion-reduce:transition-none"
            />
          </a>
        </div>
      </nav>
    </>
  );
}
