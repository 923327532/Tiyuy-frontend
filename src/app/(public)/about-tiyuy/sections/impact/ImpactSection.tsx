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
      className="relative overflow-hidden bg-[var(--bg-secondary)] py-14 md:py-18 lg:py-24"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Header compacto */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]"
          />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              A-05 / Alcance
            </p>

            <h2
              id="impact-title"
              className="mt-2 max-w-3xl text-balance text-[clamp(1.4rem,3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Nuestro ecosistema.
            </h2>
          </div>
        </div>

        {/* Perfiles compactos */}
        <div className="mt-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            A quién ayudamos
          </p>

          <ul className="grid gap-px overflow-hidden rounded-sm border border-[var(--border-color)] bg-[var(--border-color)] md:grid-cols-3">
            {audiences.map(
              ({ id, icon: Icon, title, description, cta }, index) => (
                <li
                  key={id}
                  className="flex flex-col gap-3 bg-[var(--bg-secondary)] p-5 md:p-6"
                >
                  <Reveal delay={index * 90}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium tabular-nums text-[var(--text-tertiary)]">
                        0{index + 1}
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--brand-primary)]">
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)] md:text-lg">
                      {title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] md:text-sm">
                      {description}
                    </p>
                  </Reveal>

                  {cta && (
                    <Link
                      href={cta.href}
                      className="group mt-auto inline-flex w-fit items-center gap-2 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--brand-primary)]"
                    >
                      {cta.label}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Indicadores compactos */}
        <div className="mt-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            En perspectiva
          </p>

          <dl className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {stats.map(({ value, label }, index) => (
              <Reveal
                key={label}
                delay={index * 80}
                className="flex flex-col gap-2"
              >
                <dd className="order-1 text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[0.9] tracking-[-0.04em] tabular-nums text-[var(--text-primary)]">
                  {value}
                </dd>

                <dt className="order-2 flex max-w-[22ch] items-start gap-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--brand-primary)]"
                  />
                  {label}
                </dt>
              </Reveal>
            ))}
          </dl>
        </div>

        {/* Cierre */}
        <div className="mt-8 flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            TIYUY / A-05
          </p>

          <a
            href="#compromiso"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)]"
          >
            Compromiso
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}