'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '../../hooks/use-scroll-reveal';
import { ParallaxImage } from '../../ui';
import { audiences, impactMedia, pillars, stats } from './impact.data';

export function ImpactSection() {
  return (
    <section
      id="alcance"
      aria-labelledby="impact-title"
      className="relative overflow-hidden bg-[var(--bg-secondary)] py-20 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Encabezado editorial */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[var(--brand-primary)]"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                A-05 / Alcance
              </p>
            </div>

            <p className="mt-3 text-sm text-[var(--text-tertiary)]">
              Nuestro ecosistema
            </p>
          </div>

          <Reveal className="lg:col-span-9">
            <h2
              id="impact-title"
              className="max-w-5xl text-balance text-[clamp(2.6rem,6.5vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-[var(--text-primary)]"
            >
              Conectamos personas.
              <span className="block text-[var(--text-tertiary)]">
                Generamos posibilidades.
              </span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
              Tres perfiles, una misma plataforma: acceso, verificación y
              herramientas claras.
            </p>
          </Reveal>
        </div>

        {/* Perfiles */}
        <div className="mt-14 border-t border-[var(--border-color)] lg:mt-24">
          <div className="flex items-center justify-between py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              01 / A quién ayudamos
            </p>

            <span className="text-xs tabular-nums text-[var(--text-tertiary)]">
              {String(audiences.length).padStart(2, '0')} perfiles
            </span>
          </div>

          <ul className="grid border-y border-[var(--border-color)] md:grid-cols-3">
            {audiences.map(
              ({ id, icon: Icon, title, description, cta }, index) => (
                <li
                  key={id}
                  className={`flex min-h-[360px] flex-col justify-between gap-10 py-9 md:min-h-[410px] md:px-7 md:py-10 lg:min-h-[440px] lg:px-10 lg:py-12 ${
                    index !== 0
                      ? 'border-t border-[var(--border-color)] md:border-l md:border-t-0'
                      : ''
                  }`}
                >
                  <Reveal delay={index * 90}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium tabular-nums text-[var(--text-tertiary)]">
                        0{index + 1}
                      </span>

                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--brand-primary)] transition-colors duration-300 group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <h3 className="mt-12 text-[clamp(1.8rem,2.8vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--text-primary)]">
                      {title}
                    </h3>

                    <p className="mt-5 max-w-sm text-base leading-relaxed text-[var(--text-secondary)]">
                      {description}
                    </p>
                  </Reveal>

                  {cta && (
                    <Link
                      href={cta.href}
                      className="group inline-flex w-fit items-center gap-3 border-b border-[var(--border-color)] pb-2 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-300 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-4"
                    >
                      {cta.label}

                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Diferenciales */}
        <div className="mt-20 lg:mt-32">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                02 / Diferenciación
              </p>

              <h3 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)]">
                Lo que nos hace diferentes.
              </h3>
            </div>

            <span className="text-xs text-[var(--text-tertiary)]">
              TIYUY / Plataforma
            </span>
          </div>

          <Reveal>
            <figure className="relative isolate flex min-h-[560px] flex-col justify-end overflow-hidden rounded-sm bg-[var(--bg-tertiary)] lg:min-h-[620px]">
              <ParallaxImage
                src={impactMedia.image}
                alt={impactMedia.alt}
                sizes="(min-width: 1024px) 90vw, 100vw"
                speed={0.05}
                className="-z-10 scale-105"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
              />

              <div className="absolute left-6 top-6 flex items-center gap-3 sm:left-9 sm:top-9">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                  TIYUY / Diferenciales
                </span>
              </div>

              <figcaption className="relative p-5 sm:p-9 lg:p-12">
                <p className="mb-6 max-w-xl text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  Una plataforma. Distintas necesidades. Un mismo propósito.
                </p>

                <ul className="grid gap-0 border-t border-white/30 md:grid-cols-3">
                  {pillars.map(({ icon: Icon, title, description }, index) => (
                    <li
                      key={title}
                      className={`flex items-start gap-4 py-7 md:pr-6 lg:pr-10 ${
                        index !== 0
                          ? 'border-t border-white/25 md:border-l md:border-t-0 md:pl-6 lg:pl-10'
                          : ''
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>

                      <div>
                        <p className="font-medium text-white">{title}</p>

                        <p className="mt-2 text-sm leading-relaxed text-white/75">
                          {description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Indicadores */}
        <div className="mt-20 lg:mt-32">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-color)] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                03 / En perspectiva
              </p>

              <h3 className="mt-3 text-2xl font-medium tracking-tight text-[var(--text-primary)] md:text-3xl">
                Nuestro alcance en cifras.
              </h3>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
              Una mirada a los indicadores que describen nuestro alcance.
            </p>
          </div>

          <dl className="grid gap-10 py-10 sm:grid-cols-3 sm:gap-8 lg:py-14">
            {stats.map(({ value, label }, index) => (
              <Reveal
                key={label}
                delay={index * 80}
                className="flex flex-col gap-5"
              >
                <dd className="order-1 text-[clamp(3.8rem,8vw,8rem)] font-medium leading-[0.85] tracking-[-0.065em] tabular-nums text-[var(--text-primary)]">
                  {value}
                </dd>

                <dt className="order-2 flex max-w-[22ch] items-start gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]"
                  />
                  {label}
                </dt>
              </Reveal>
            ))}
          </dl>
        </div>

        {/* Cierre */}
        <div className="flex flex-col justify-between gap-4 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:items-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            TIYUY / A-05
          </p>

          <a
            href="#compromiso"
            className="group inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-4"
          >
            Conoce nuestro compromiso
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}