'use client';

import {
  Reveal,
  useElementProgressVar,
  useScrollReveal,
} from '../../hooks/use-scroll-reveal';

import { HighlightsRow } from './HighlightsRow';
import { StoryMedia } from './StoryMedia';
import { features, story, type Feature } from './story.data';

function TimelineChapter({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLLIElement>({
    once: false,
    threshold: 0.35,
    rootMargin: '-12% 0px -20% 0px',
  });

  const Icon = feature.icon;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[44px_1fr] gap-5 md:grid-cols-[56px_1fr] md:gap-8"
    >
      {/* Indicador del capítulo */}
      <span
        className={`relative z-10 mt-1 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 md:h-12 md:w-12 ${
          isVisible
            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
            : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-tertiary)]'
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </span>

      {/* Contenido */}
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] pb-10 md:pb-14">
        <div
          className={`max-w-xl transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-75'
          }`}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
            Capítulo {String(index + 1).padStart(2, '0')}
          </p>

          <h3 className="text-2xl font-medium tracking-[-0.035em] text-[var(--text-primary)] md:text-3xl">
            {feature.title}
          </h3>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)]">
            {feature.description}
          </p>
        </div>

        <span
          aria-hidden="true"
          className={`hidden text-5xl font-medium leading-none tracking-[-0.06em] tabular-nums transition-colors duration-500 sm:block md:text-7xl ${
            isVisible
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-tertiary)] opacity-40'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </li>
  );
}

function TimelineRail() {
  const railRef = useElementProgressVar<HTMLDivElement>(
    '--about-progress',
    0.12
  );

  return (
    <div ref={railRef} className="relative">
      {/* Línea base */}
      <span
        aria-hidden="true"
        className="absolute bottom-14 left-[21px] top-2 w-px bg-[var(--border-color)] md:left-[23px]"
      />

      {/* Progreso */}
      <span
        aria-hidden="true"
        className="about-timeline-fill absolute bottom-14 left-[21px] top-2 w-px bg-[var(--brand-primary)] md:left-[23px]"
      />

      <ol className="relative space-y-16 pt-2 md:space-y-20">
        {features.map((feature, index) => (
          <TimelineChapter
            key={feature.title}
            feature={feature}
            index={index}
          />
        ))}
      </ol>
    </div>
  );
}

export function StorySection() {
  return (
    <section
      id="origen"
      aria-labelledby="story-title"
      className="relative overflow-hidden bg-[var(--bg-primary)] py-20 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Encabezado */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[var(--brand-primary)]"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                A-04 / Origen
              </p>
            </div>

            <p className="mt-3 text-sm text-[var(--text-tertiary)]">
              Nuestra historia
            </p>
          </div>

          <Reveal className="lg:col-span-9">
            <h2
              id="story-title"
              className="max-w-5xl text-balance text-[clamp(2.8rem,7vw,7.5rem)] font-medium leading-[0.94] tracking-[-0.05em] text-[var(--text-primary)]"
            >
              Cómo empezó{' '}
              <span className="text-[var(--text-tertiary)]">
                todo.
              </span>
            </h2>
          </Reveal>
        </div>

        {/* Historia */}
        <div className="mt-14 grid grid-cols-1 gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          {/* Columna visual */}
          <div className="relative lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <div className="relative">
              <StoryMedia />

              {/* Identificación editorial */}
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white drop-shadow-md">
                  TIYUY / Archivo
                </span>
              </div>
            </div>

            {/* Cita */}
            <Reveal className="mt-9">
              <blockquote className="border-t border-[var(--border-color)] pt-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                  Nuestra perspectiva
                </span>

                <p className="mt-5 text-balance text-2xl font-medium leading-snug tracking-[-0.035em] text-[var(--text-primary)] md:text-3xl">
                  {story.quote}
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={100} className="mt-6">
              <p className="max-w-md text-base leading-relaxed text-[var(--text-secondary)]">
                {story.note}
              </p>
            </Reveal>
          </div>

          {/* Línea de tiempo */}
          <div className="relative lg:col-span-7">
            <div className="mb-9 flex items-center justify-between border-b border-[var(--border-color)] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                Recorrido
              </p>

              <span className="text-xs tabular-nums text-[var(--text-tertiary)]">
                {String(features.length).padStart(2, '0')} etapas
              </span>
            </div>

            <TimelineRail />
          </div>
        </div>

        {/* Aspectos destacados */}
        <Reveal
          delay={120}
          className="mt-20 border-t border-[var(--border-color)] pt-10 lg:mt-32 lg:pt-14"
        >
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                02 / Esencia
              </p>

              <h3 className="mt-3 text-2xl font-medium tracking-tight text-[var(--text-primary)] md:text-3xl">
                Lo que define nuestro camino.
              </h3>
            </div>

            <span className="text-xs text-[var(--text-tertiary)]">
              TIYUY / Origen
            </span>
          </div>

          <HighlightsRow />
        </Reveal>

        {/* Cierre editorial */}
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:items-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            TIYUY / A-04
          </p>

          <a
            href="#alcance"
            className="group inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-4"
          >
            Explorar nuestro alcance
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}