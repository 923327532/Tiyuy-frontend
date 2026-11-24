'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Reveal } from '../../hooks/use-scroll-reveal';
import { ParallaxImage } from '../../ui';
import { identityMedia, purposes, values } from './identity.data';

export function IdentitySection() {
  const [activeId, setActiveId] = useState<(typeof purposes)[number]['id']>(
    purposes[0].id
  );

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const active = purposes.find((purpose) => purpose.id === activeId) ?? purposes[0];

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % purposes.length;
        break;

      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + purposes.length) % purposes.length;
        break;

      case 'Home':
        nextIndex = 0;
        break;

      case 'End':
        nextIndex = purposes.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    const nextPurpose = purposes[nextIndex];

    setActiveId(nextPurpose.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section
      id="adn"
      aria-labelledby="adn-title"
      className="relative overflow-hidden bg-[var(--bg-secondary)] py-14 md:py-18 lg:py-24"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]"
          />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              A-02 / Identidad
            </p>

            <h2
              id="adn-title"
              className="mt-2 max-w-3xl text-balance text-[clamp(1.4rem,3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              No somos solo una plataforma.{' '}
              <span className="text-[var(--text-tertiary)]">
                Somos el nuevo estándar.
              </span>
            </h2>
          </div>
        </div>

        {/* Propósito + Imagen */}
        <div className="mt-6 grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Tabs + contenido */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <div
              role="tablist"
              aria-label="Propósito de TIYUY"
              aria-orientation="horizontal"
              className="inline-flex gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-0.5"
            >
              {purposes.map((purpose, index) => {
                const selected = purpose.id === activeId;

                return (
                  <button
                    key={purpose.id}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    role="tab"
                    type="button"
                    id={`adn-tab-${purpose.id}`}
                    aria-selected={selected}
                    aria-controls={`adn-panel-${purpose.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(purpose.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 sm:px-5 sm:py-2 sm:text-sm ${
                      selected
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {purpose.title}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={`adn-panel-${active.id}`}
              aria-labelledby={`adn-tab-${active.id}`}
              tabIndex={0}
              className="mt-5 focus-visible:outline-none"
            >
              <span
                key={active.id}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]"
              >
                {active.title}
              </span>

              <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-lg md:leading-relaxed">
                {active.description}
              </p>

              <ul
                aria-label="Conceptos principales"
                className="mt-4 flex flex-wrap gap-1.5"
              >
                {active.keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Imagen */}
          <figure className="relative isolate h-[260px] overflow-hidden rounded-sm bg-[var(--bg-tertiary)] md:h-[340px] lg:col-span-7 lg:h-[380px]">
            <ParallaxImage
              src={identityMedia.image}
              alt={identityMedia.alt}
              sizes="(min-width: 1024px) 58vw, 100vw"
              speed={0.05}
              className="-z-10 scale-105"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            />

            <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-4 sm:p-5">
              {identityMedia.caption.split(' / ').map((word) => (
                <span
                  key={word}
                  className="border border-white/30 bg-black/20 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md"
                >
                  {word}
                </span>
              ))}
            </figcaption>
          </figure>
        </div>

        {/* Valores compactos */}
        <div className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Principios
          </p>

          <div className="mt-4 grid gap-px overflow-hidden rounded-sm border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 60}>
                <div className="group flex flex-col gap-2.5 bg-[var(--bg-secondary)] p-5 transition-colors duration-300 hover:bg-[var(--bg-primary)] md:p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-all duration-300 group-hover:border-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                      <Icon
                        className="h-3.5 w-3.5"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                      {title}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Cierre */}
        <div className="mt-8 flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            TIYUY / A-02
          </p>

          <p className="text-[11px] text-[var(--text-tertiary)]">
            Una nueva forma de entender el mercado inmobiliario.
          </p>
        </div>
      </div>
    </section>
  );
}