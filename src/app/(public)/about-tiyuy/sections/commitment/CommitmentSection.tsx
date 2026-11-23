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
      className="commitment-section relative isolate flex flex-col overflow-hidden bg-[#111827] text-white"
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

      <div className="relative mx-auto w-full max-w-[1600px] px-5 pt-14 sm:px-8 lg:px-12 lg:pt-16">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[var(--brand-primary)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
            C-06 / Compromiso
          </p>
        </div>

        <h2
          id="commitment-title"
          className="max-w-4xl text-balance text-[clamp(1.6rem,3.5vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white"
        >
          Construimos nuevas posibilidades
          <span className="block text-white/65">
            para vivir<span className="text-[var(--brand-primary)]">.</span>
          </span>
        </h2>

        <div className="mt-4 grid gap-6 border-t border-white/20 pt-4 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              Creemos en un mercado inmobiliario más accesible,
              transparente y conectado. Desde el Perú, desarrollamos
              tecnología que pone a las personas en el centro.
            </p>

            <Link
              href="/contact"
              className="group mt-4 inline-flex items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-[var(--brand-primary)]"
            >
              Conoce TIYUY
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
              Principios
            </p>

            <ul className="divide-y divide-white/15 border-y border-white/15">
              {commitmentValues.map((value, index) => (
                <li
                  key={value}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <span className="text-xs font-medium text-white/85 sm:text-sm">
                    {value}
                  </span>
                  <span className="text-[10px] tabular-nums text-white/40">
                    0{index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="relative border-t border-white/20 bg-[#111827]">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 py-3 text-[11px] font-medium text-white/60 sm:px-8 lg:px-12">
          <span className="uppercase tracking-[0.16em]">
            TIYUY · Perú
          </span>

          <a
            href="#hero"
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            Volver al inicio
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </section>
  );
}