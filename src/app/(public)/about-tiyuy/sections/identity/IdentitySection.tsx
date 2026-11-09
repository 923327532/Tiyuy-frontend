'use client';

import { useState } from 'react';
import { Reveal } from '../../hooks/use-scroll-reveal';
import { ParallaxImage } from '../../ui';
import { identityMedia, purposes, values } from './identity.data';

export function IdentitySection() {
  const [activeId, setActiveId] = useState<(typeof purposes)[number]['id']>(purposes[0].id);
  const active = purposes.find((p) => p.id === activeId) ?? purposes[0];

  return (
    <section
      id="adn"
      aria-labelledby="adn-title"
      className="bg-neutral-100 py-20 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Declaración: etiqueta a la izquierda, texto desplazado a la derecha */}
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="text-sm font-medium text-neutral-500 lg:col-span-3 lg:pt-3">ADN</p>
          <Reveal className="lg:col-span-9">
            <h2
              id="adn-title"
              className="text-balance text-[clamp(2.2rem,5vw,5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-neutral-950"
            >
              No somos solo una plataforma.{' '}
              <span className="text-neutral-400">Somos el nuevo estándar.</span>
            </h2>
          </Reveal>
        </div>

        {/* Misión / Visión con selector */}
        <div className="mt-14 lg:mt-20">
          <div
            role="tablist"
            aria-label="Misión y visión"
            className="inline-flex rounded-full border border-neutral-900/15 bg-white p-1"
          >
            {purposes.map((p) => {
              const selected = p.id === activeId;
              return (
                <button
                  key={p.id}
                  role="tab"
                  type="button"
                  id={`adn-tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls={`adn-panel-${p.id}`}
                  onClick={() => setActiveId(p.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                    selected ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`adn-panel-${active.id}`}
            aria-labelledby={`adn-tab-${active.id}`}
            className="mt-8 grid items-stretch gap-8 lg:grid-cols-12 lg:gap-14"
          >
            <div key={active.id} className="flex flex-col justify-between gap-10 lg:col-span-5">
              <p className="text-balance text-xl leading-relaxed tracking-[-0.01em] text-neutral-900 md:text-2xl md:leading-[1.45]">
                {active.description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {active.keywords.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-neutral-900/20 px-4 py-1.5 text-sm font-medium text-neutral-700"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="relative isolate min-h-[320px] overflow-hidden rounded-[28px] bg-neutral-300 lg:col-span-7 lg:min-h-[500px]">
              <ParallaxImage
                src={identityMedia.image}
                alt={identityMedia.alt}
                sizes="(min-width: 1024px) 58vw, 100vw"
                speed={0.05}
                className="-z-10 scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.55),transparent_55%)]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5 sm:p-6">
                {identityMedia.caption.split(' / ').map((word) => (
                  <span
                    key={word}
                    className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md"
                  >
                    {word}
                  </span>
                ))}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Valores como lista tipográfica */}
        <div className="mt-20 lg:mt-32">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-[clamp(1.8rem,3.4vw,3.2rem)] font-medium tracking-[-0.035em] text-neutral-950">
              Nuestros valores
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
              Los principios que definen nuestra cultura y guían cada decisión que tomamos.
            </p>
          </div>

          <ul className="mt-8 border-t border-neutral-900/20">
            {values.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="border-b border-neutral-900/20">
                <Reveal delay={index * 60}>
                  <div className="group grid items-center gap-4 py-7 transition-colors duration-300 md:grid-cols-12 md:gap-8 md:py-9">
                    <h4 className="text-[clamp(2rem,4.4vw,4.2rem)] font-medium leading-none tracking-[-0.045em] text-neutral-400 transition-colors duration-300 group-hover:text-neutral-950 md:col-span-6">
                      {title}
                    </h4>
                    <p className="max-w-md text-base leading-relaxed text-neutral-600 md:col-span-5">
                      {description}
                    </p>
                    <span className="hidden justify-end md:col-span-1 md:flex">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-900/30 text-neutral-700 transition-colors duration-300 group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}