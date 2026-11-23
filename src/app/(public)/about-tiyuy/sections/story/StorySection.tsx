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
      className="relative grid grid-cols-[48px_1fr] gap-5"
    >
      <span
        className={`relative z-10 mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ${
          isVisible
            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
            : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-tertiary)]'
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </span>

      <div
        className={`border-b border-[var(--border-color)] pb-5 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-70'
        }`}
      >
        <h3 className="text-base font-medium tracking-[-0.02em] text-[var(--text-primary)] md:text-lg">
          {feature.title}
        </h3>

        <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-[var(--text-secondary)] md:text-sm">
          {feature.description}
        </p>
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
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-[23px] top-2 w-px bg-[var(--border-color)]"
      />

      <span
        aria-hidden="true"
        className="about-timeline-fill absolute bottom-4 left-[23px] top-2 w-px bg-[var(--brand-primary)]"
      />

      <ol className="relative space-y-4 pt-2">
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
      className="relative overflow-hidden bg-[var(--bg-primary)] py-10 md:py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]"
          />

          <h2
            id="story-title"
            className="text-balance text-[clamp(1.25rem,2.5vw,2rem)] font-medium leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Cómo empezó{' '}
            <span className="text-[var(--text-tertiary)]">
              todo.
            </span>
          </h2>
        </div>

        {/* Historia + Timeline compacto */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Columna visual */}
          <div className="relative">
            <div className="relative">
              <StoryMedia />

              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white drop-shadow-md">
                  TIYUY / Archivo
                </span>
              </div>
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="relative">
            <TimelineRail />
          </div>
        </div>

        {/* Cierre */}
        <div className="mt-6 flex items-center justify-between border-t border-[var(--border-color)] pt-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            TIYUY / A-04
          </p>

          <a
            href="#alcance"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)]"
          >
            Explorar alcance
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}