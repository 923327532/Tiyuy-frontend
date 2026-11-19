'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { HERO_COPY } from './hero.data';

export function HeroContent() {
  return (
    <div className="max-w-[1080px]">
      <p className="hero-fade hero-delay-200 mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
        <span className="h-px w-8 bg-[var(--brand-primary)]" />
        Tecnología para conectar espacios y personas
      </p>

      <h1
        id="hero-title"
        className="hero-heading max-w-[1050px] text-balance text-[clamp(3.1rem,7.8vw,7.2rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-white"
      >
        {HERO_COPY.lines.map((line, index) => {
          const isLast = index === HERO_COPY.lines.length - 1;
          const cleanLine = isLast ? line.replace(/\.$/, '') : line;

          return (
            <span
              key={`${line}-${index}`}
              className="block overflow-hidden pb-[0.08em]"
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

      <p className="hero-fade hero-delay-900 mt-7 max-w-[620px] text-base leading-[1.8] text-white/80 md:text-lg">
        {HERO_COPY.description}
      </p>

      <div className="hero-fade hero-delay-1000 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={HERO_COPY.primaryCta.href}
          className="group inline-flex min-h-14 items-center justify-center gap-5 rounded-full bg-[var(--brand-primary)] py-2 pl-7 pr-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[var(--brand-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] sm:text-base"
        >
          {HERO_COPY.primaryCta.label}

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </span>
        </a>

        <Link
          href={HERO_COPY.secondaryCta.href}
          className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/35 px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] sm:text-base"
        >
          {HERO_COPY.secondaryCta.label}

          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </Link>
      </div>

      <p className="hero-fade hero-delay-1200 mt-10 hidden text-[10px] font-medium uppercase tracking-[0.2em] text-white/45 sm:block">
        Una nueva forma de conectar con el mercado inmobiliario
      </p>
    </div>
  );
}