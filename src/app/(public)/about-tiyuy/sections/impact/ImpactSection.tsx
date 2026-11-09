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
      className="bg-[#eef3f8] py-20 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Encabezado centrado */}
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2
            id="impact-title"
            className="text-balance text-[clamp(2.6rem,6.5vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-neutral-950"
          >
            A quién ayudamos
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-neutral-600">
            Tres perfiles, una misma plataforma: acceso, verificación y herramientas claras.
          </p>
        </Reveal>

        {/* Perfiles en tres columnas, sin tarjetas */}
        <ul className="mt-16 grid border-y border-neutral-900/15 md:grid-cols-3 lg:mt-24">
          {audiences.map(({ id, icon: Icon, title, description, cta }, index) => (
            <li
              key={id}
              className="flex flex-col justify-between gap-12 border-b border-neutral-900/15 py-10 last:border-b-0 md:border-b-0 md:px-8 md:py-14 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l lg:px-12 lg:py-16 lg:first:pl-0 lg:last:pr-0"
            >
              <Reveal delay={index * 90}>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.4} aria-hidden="true" />
                </span>
                <h3 className="mt-10 text-[clamp(1.8rem,2.8vw,2.8rem)] font-medium leading-[1] tracking-[-0.035em] text-neutral-950">
                  {title}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-neutral-600">
                  {description}
                </p>
              </Reveal>

              {cta && (
                <Link
                  href={cta.href}
                  className="group inline-flex w-fit items-center gap-2 rounded-full border border-neutral-900 px-6 py-3 text-sm font-semibold text-neutral-950 transition-colors duration-200 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  {cta.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Banner con los diferenciales sobre vidrio */}
        <Reveal className="mt-16 lg:mt-24">
          <figure className="relative isolate flex min-h-[560px] flex-col justify-end overflow-hidden rounded-[28px] bg-neutral-300 lg:min-h-[620px]">
            <ParallaxImage
              src={impactMedia.image}
              alt={impactMedia.alt}
              sizes="100vw"
              speed={0.05}
              className="-z-10 scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.55),transparent_60%)]"
            />

            <figcaption className="p-3 sm:p-5">
              <p className="mb-4 px-2 text-lg font-medium text-white sm:px-3 md:text-xl">
                Lo que nos hace diferentes
              </p>
              <ul className="grid gap-px overflow-hidden rounded-[20px] border border-white/25 bg-white/20 backdrop-blur-xl md:grid-cols-3">
                {pillars.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex items-start gap-4 bg-white/10 p-5 sm:p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/80">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        </Reveal>

        {/* Cifras grandes */}
        <dl className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8 lg:mt-24">
          {stats.map(({ value, label }, index) => (
            <Reveal key={label} delay={index * 80} className="flex flex-col-reverse gap-3">
              <dt className="max-w-[18ch] text-sm leading-snug text-neutral-600">{label}</dt>
              <dd className="text-[clamp(4rem,9vw,9rem)] font-medium leading-[0.85] tracking-[-0.06em] tabular-nums text-neutral-950">
                {value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}