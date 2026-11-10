'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  HardHat,
  House,
  Landmark,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  number: string;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: Building2,
    number: '01',
    title: 'Inmobiliarias',
    desc: 'Empresas del sector inmobiliario.',
  },
  {
    icon: HardHat,
    number: '02',
    title: 'Constructoras',
    desc: 'Empresas dedicadas a la construcción.',
  },
  {
    icon: Landmark,
    number: '03',
    title: 'Desarrolladores',
    desc: 'Proyectos y desarrollos inmobiliarios.',
  },
  {
    icon: House,
    number: '04',
    title: 'Propiedades',
    desc: 'Espacios y oportunidades inmobiliarias.',
  },
];

export default function AgenciesHero() {
  return (
    <section
      aria-labelledby="agencies-title"
      className="relative isolate min-h-[680px] overflow-hidden bg-[#111827] text-white lg:min-h-[740px]"
    >
      {/* Fotografía arquitectónica */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://edifica.com.pe/blog/wp-content/uploads/departamento-jovenes.jpg')",
        }}
      />

      {/* Capas de degradado */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#111827] via-[#111827]/90 to-[#111827]/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/30"
      />

      {/* Límite superior corporativo */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-[var(--brand-primary)] to-transparent"
      />

      {/* Contenido principal */}
      <div className="mx-auto flex min-h-[680px] max-w-[1600px] flex-col justify-between px-5 sm:px-8 lg:min-h-[740px] lg:px-12">
        {/* Encabezado editorial */}
        <header className="flex items-center justify-between pt-9 lg:pt-12">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-xs">
              Directorio inmobiliario
            </span>
          </div>

          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55 sm:text-xs">
            TIYUY / PERÚ
          </span>
        </header>

        {/* Cuerpo principal */}
        <div className="grid gap-14 py-20 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
          {/* Presentación */}
          <div className="lg:col-span-7">
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
              <span className="h-px w-9 bg-[var(--brand-primary)]" />
              Empresas del sector inmobiliario
            </p>

            <h1
              id="agencies-title"
              className="max-w-4xl text-balance text-[clamp(3.2rem,7.5vw,7rem)] font-semibold leading-[0.94] tracking-[-0.055em]"
            >
              Conoce a quienes{' '}
              <span className="text-white/65">
                construyen el futuro inmobiliario.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Empresas, constructoras y desarrolladores registrados en TIYUY.
              Explora sus proyectos y propiedades en diferentes regiones del Perú.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <a
                href="#directorio"
                className="group inline-flex min-h-12 items-center gap-4 rounded-full bg-[var(--brand-primary)] py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[var(--brand-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
              >
                Explorar directorio
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <ArrowDown
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </div>
          </div>

          {/* Categorías del directorio */}
          <div className="lg:col-span-5">
            <div className="mb-5 flex items-center justify-between border-b border-white/20 pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
                Explora por categoría
              </p>

              <span className="text-xs tabular-nums text-white/40">
                01 — 04
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
              {FEATURES.map(({ icon: Icon, number, title, desc }) => (
                <article
                  key={number}
                  className="group relative min-h-[150px] overflow-hidden rounded-xl border border-white/15 bg-[#111827]/65 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/60 hover:bg-[#111827]/85"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--brand-primary)]/35 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] transition-colors duration-300 group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </span>

                    <span className="text-[10px] font-medium tracking-widest text-white/35">
                      {number}
                    </span>
                  </div>

                  <div className="mt-7 flex items-end justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        {title}
                      </h2>
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {desc}
                      </p>
                    </div>

                    <ArrowUpRight
                      className="mb-1 h-4 w-4 shrink-0 text-white/35 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--brand-primary)]"
                      aria-hidden="true"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Pie editorial */}
        <footer className="flex flex-col gap-3 border-t border-white/20 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
            TIYUY · Directorio inmobiliario
          </p>

          <p className="text-xs text-white/55">
            Conectando empresas, proyectos y personas en el Perú.
          </p>
        </footer>
      </div>
    </section>
  );
}