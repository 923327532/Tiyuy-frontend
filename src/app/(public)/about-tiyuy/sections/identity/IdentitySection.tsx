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
      className="relative overflow-hidden bg-[var(--bg-secondary)] py-20 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Declaración editorial */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex items-start gap-3 lg:col-span-3 lg:pt-3">
            <span
              aria-hidden="true"
              className="mt-2 h-2 w-2 rounded-full bg-[var(--brand-primary)]"
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                A-02 / Identidad
              </p>

              <p className="mt-2 text-sm text-[var(--text-tertiary)]">
                Nuestro ADN
              </p>
            </div>
          </div>

          <Reveal className="lg:col-span-9">
            <h2
              id="adn-title"
              className="max-w-5xl text-balance text-[clamp(2.4rem,5.5vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.045em] text-[var(--text-primary)]"
            >
              No somos solo una plataforma.{' '}
              <span className="text-[var(--text-tertiary)]">
                Somos el nuevo estándar.
              </span>
            </h2>
          </Reveal>
        </div>

        {/* Separador editorial */}
        <div className="mt-12 h-px w-full bg-[var(--border-color)] lg:mt-16" />

        {/* Misión y visión */}
        <div className="mt-12 lg:mt-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                01 / Propósito
              </p>

              <h3 className="mt-3 text-2xl font-medium tracking-tight text-[var(--text-primary)] md:text-3xl">
                Lo que nos mueve.
              </h3>
            </div>

            <div className="lg:col-span-8">
              <div
                role="tablist"
                aria-label="Propósito de TIYUY"
                aria-orientation="horizontal"
                className="inline-flex flex-wrap gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-1"
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
                      className={`rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 ${
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
            </div>
          </div>

          {/* Contenido dinámico */}
          <div
            role="tabpanel"
            id={`adn-panel-${active.id}`}
            aria-labelledby={`adn-tab-${active.id}`}
            tabIndex={0}
            className="mt-10 grid items-stretch gap-10 focus-visible:outline-none lg:mt-14 lg:grid-cols-12 lg:gap-14"
          >
            {/* Descripción */}
            <div
              key={active.id}
              className="flex flex-col justify-between gap-10 lg:col-span-5"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                  {active.title}
                </span>

                <p className="mt-6 max-w-xl text-balance text-xl leading-relaxed tracking-[-0.015em] text-[var(--text-primary)] md:text-2xl md:leading-[1.5]">
                  {active.description}
                </p>
              </div>

              <ul
                aria-label="Conceptos principales"
                className="flex flex-wrap gap-2"
              >
                {active.keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-full border border-[var(--border-color)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fotografía */}
            <figure className="relative isolate min-h-[320px] overflow-hidden rounded-sm bg-[var(--bg-tertiary)] lg:col-span-7 lg:min-h-[500px]">
              <ParallaxImage
                src={identityMedia.image}
                alt={identityMedia.alt}
                sizes="(min-width: 1024px) 58vw, 100vw"
                speed={0.05}
                className="-z-10 scale-105"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
              />

              <div
                aria-hidden="true"
                className="absolute left-5 top-5 flex items-center gap-2 sm:left-7 sm:top-7"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                  TIYUY / Identidad
                </span>
              </div>

              <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5 sm:p-7">
                {identityMedia.caption.split(' / ').map((word) => (
                  <span
                    key={word}
                    className="border border-white/30 bg-black/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-md"
                  >
                    {word}
                  </span>
                ))}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Valores */}
        <div className="mt-24 lg:mt-36">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                02 / Principios
              </p>

              <h3 className="mt-4 text-[clamp(2.2rem,4.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
                Nuestros valores.
              </h3>
            </div>

            <div className="lg:col-span-5 lg:justify-self-end">
              <p className="max-w-sm text-base leading-relaxed text-[var(--text-secondary)]">
                Los principios que definen nuestra cultura y guían cada
                decisión que tomamos.
              </p>
            </div>
          </div>

          {/* Lista tipográfica */}
          <ul className="mt-10 border-t border-[var(--border-color)] lg:mt-14">
            {values.map(({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className="border-b border-[var(--border-color)]"
              >
                <Reveal delay={index * 60}>
                  <div className="group grid items-center gap-5 py-7 md:grid-cols-12 md:gap-8 md:py-9">
                    {/* Número */}
                    <div className="flex items-center gap-3 md:col-span-1">
                      <span className="text-xs font-medium tabular-nums text-[var(--text-tertiary)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-px w-5 bg-[var(--brand-primary)]"
                      />
                    </div>

                    {/* Título */}
                    <h4 className="text-[clamp(2rem,4.2vw,4rem)] font-medium leading-none tracking-[-0.045em] text-[var(--text-tertiary)] transition-colors duration-300 group-hover:text-[var(--text-primary)] md:col-span-5">
                      {title}
                    </h4>

                    {/* Descripción */}
                    <p className="max-w-md text-base leading-relaxed text-[var(--text-secondary)] md:col-span-5">
                      {description}
                    </p>

                    {/* Icono */}
                    <div className="hidden justify-end md:col-span-1 md:flex">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-all duration-300 group-hover:border-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Cierre editorial */}
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:items-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            TIYUY / A-02
          </p>

          <p className="text-xs text-[var(--text-tertiary)]">
            Una nueva forma de entender el mercado inmobiliario.
          </p>
        </div>
      </div>
    </section>
  );
}