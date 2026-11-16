'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '../../hooks/use-scroll-reveal';
import { ParallaxImage } from '../../ui';
import { commitmentValues } from '../impact/impact.data';

const IMAGE =
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1920&auto=format&fit=crop';

export function CommitmentSection() {
  return (
    <section
      id="compromiso"
      aria-labelledby="commitment-title"
      className="commitment-section relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#111827] text-white"
    >
      <ParallaxImage
        src={IMAGE}
        alt="Arquitectura contemporánea con líneas geométricas y luz natural"
        sizes="100vw"
        speed={0.06}
        className="-z-20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,24,39,0.88)_0%,rgba(17,24,39,0.62)_55%,rgba(17,24,39,0.28)_100%),linear-gradient(0deg,rgba(17,24,39,0.96)_0%,transparent_65%)]"
      />

      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-[2px] w-full bg-[var(--brand-primary)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-12 pt-32 sm:px-8 lg:px-12 lg:pb-20">
        <Reveal className="mb-12">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[var(--brand-primary)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              C-06 / Nuestro compromiso
            </p>
          </div>

          <h2
            id="commitment-title"
            className="max-w-5xl text-balance text-[clamp(3.2rem,8vw,8rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white"
          >
            Construimos nuevas posibilidades
            <span className="block text-white/65">
              para vivir<span className="text-[var(--brand-primary)]">.</span>
            </span>
          </h2>
        </Reveal>

        <div className="grid gap-12 border-t border-white/25 pt-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              Creemos en un mercado inmobiliario más accesible,
              transparente y conectado. Desde el Perú, desarrollamos
              tecnología que pone a las personas en el centro y busca
              transformar la manera de encontrar y ofrecer espacios para vivir.
            </p>

            <Link
              href="/contact"
              className="group mt-9 inline-flex items-center gap-4 border-b border-white/50 pb-3 text-sm font-semibold text-white transition-colors hover:border-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#111827]"
            >
              Conoce TIYUY
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Nuestros principios
            </p>

            <ul className="divide-y divide-white/20 border-y border-white/20">
              {commitmentValues.map((value, index) => (
                <li
                  key={value}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span className="text-sm font-medium text-white/90 sm:text-base">
                    {value}
                  </span>
                  <span className="text-xs tabular-nums text-white/45">
                    0{index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <footer className="relative border-t border-white/25 bg-[#111827]/75 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 py-5 text-xs font-medium text-white/70 sm:px-8 lg:px-12">
          <span className="uppercase tracking-[0.16em]">
            TIYUY · Perú
          </span>

          <a
            href="#hero"
            className="inline-flex items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#111827]"
          >
            Volver al inicio
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </section>
  );
}