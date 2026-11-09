
'use client';

import { ArrowRight } from 'lucide-react';
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
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-neutral-900"
    >
      <ParallaxImage
        src={IMAGE}
        alt="Arquitectura residencial contemporánea que representa el futuro de los espacios para vivir"
        sizes="100vw"
        speed={0.06}
        className="-z-20 scale-105"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.2)_35%,rgba(10,10,10,0.8)_100%)]"
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end gap-10 px-5 pb-10 pt-32 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-12 lg:pb-14">
        <Reveal className="max-w-4xl">
          <h2
            id="commitment-title"
            className="text-balance text-[clamp(3rem,8.5vw,9rem)] font-medium leading-[0.92] tracking-[-0.045em] !text-white"
          >
            Construimos nuevas posibilidades para vivir.
          </h2>
        </Reveal>

        <Reveal delay={150} className="w-full lg:max-w-md">
          <div className="rounded-[22px] border border-white/25 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-base leading-relaxed text-white/90">
              Creemos en un mercado inmobiliario más accesible,
              transparente y conectado. Desde el Perú, desarrollamos
              tecnología que pone a las personas en el centro y busca
              transformar la manera de encontrar y ofrecer espacios para vivir.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {commitmentValues.map((value) => (
                <li
                  key={value}
                  className="rounded-full border border-white/30 px-4 py-1.5 text-xs font-medium text-white"
                >
                  {value}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-neutral-950 transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Conoce TIYUY
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-white/25 bg-white/10 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-4 text-sm font-medium text-white/80 sm:px-8 lg:px-12">
          <span>TIYUY · Perú</span>
          <a
            href="#hero"
            className="transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </section>
  );
}
