'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { HERO_COPY } from './hero.data';

export function HeroContent() {
  return (
    <div className="max-w-[640px]">
      <p className="hero-fade hero-delay-200 mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
        <span className="h-px w-8 bg-[var(--brand-primary)]" />
        Tecnología para conectar espacios y personas
      </p>

      <h1
        id="hero-title"
        className="hero-heading text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white"
      >
        {HERO_COPY.lines.map((line, index) => {
          const isLast = index === HERO_COPY.lines.length - 1;
          const cleanLine = isLast ? line.replace(/\.$/, '') : line;

          return (
            <span
              key={`${line}-${index}`}
              className="block overflow-hidden pb-[0.06em]"
            >
              <span
                className="hero-line inline-block"
                style={{ animationDelay: `${400 + index * 140}ms` }}
              >
                {cleanLine}
                {isLast && (
                  <span className="text-[var(--brand-primary)]">.</span>
                )}
              </span>
            </span>
          );
        })}
      </h1>

      <p className="hero-fade hero-delay-900 mt-6 max-w-[520px] text-base leading-[1.7] text-white/70 md:text-lg">
        {HERO_COPY.description}
      </p>

      <div className="hero-fade hero-delay-1000 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={HERO_COPY.primaryCta.href}
          className="group inline-flex min-h-12 items-center justify-center gap-4 rounded-full bg-[var(--brand-primary)] py-2 pl-6 pr-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-primary-hover)] hover:shadow-lg hover:shadow-[var(--brand-primary)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] sm:text-base"
        >
          {HERO_COPY.primaryCta.label}

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>
        </a>

        <Link
          href={HERO_COPY.secondaryCta.href}
          className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/50 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] sm:text-base"
        >
          {HERO_COPY.secondaryCta.label}

          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Stats inline */}
      <div className="hero-fade hero-delay-1200 mt-10 hidden items-center gap-8 border-t border-white/10 pt-6 sm:flex">
        <div>
          <p className="text-xl font-semibold text-white">Perú</p>
          <p className="text-xs text-white/50">Mercado de origen</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div>
          <p className="text-xl font-semibold text-white">3</p>
          <p className="text-xs text-white/50">Perfiles conectados</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div>
          <p className="text-xl font-semibold text-white">1</p>
          <p className="text-xs text-white/50">Plataforma integral</p>
        </div>
      </div>
    </div>
  );
}