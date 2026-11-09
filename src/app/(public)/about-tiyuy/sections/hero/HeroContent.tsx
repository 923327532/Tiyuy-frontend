'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { type CSSProperties } from 'react';
import { HERO_COPY, HERO_HIGHLIGHTS } from './hero.data';

export function HeroContent() {
  return (
    <div className="max-w-4xl">
      <h1
        id="hero-title"
        className="text-[clamp(2.7rem,min(7.4vw,12.5vh),7.5rem)] font-medium leading-[0.92] tracking-[-0.045em] text-white [text-shadow:0_4px_60px_rgba(0,0,0,0.4)]"
      >
        {HERO_COPY.lines.map((line, index) => (
          <span key={line} className="block overflow-hidden pb-[0.05em]">
            <span
              className="hero-line block"
              style={{ '--hero-line-index': index } as CSSProperties}
            >
              {line === 'peruano.' ? (
                <span className="text-white/50">{line}</span>
              ) : (
                line
              )}
            </span>
          </span>
        ))}
      </h1>

      <p className="hero-fade hero-delay-700 mt-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg md:leading-relaxed">
        {HERO_COPY.description}
      </p>

      <div className="hero-fade hero-delay-900 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <a
          href={HERO_COPY.primaryCta.href}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-base font-semibold text-neutral-950 transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          {HERO_COPY.primaryCta.label}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </a>

        <Link
          href={HERO_COPY.secondaryCta.href}
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          {HERO_COPY.secondaryCta.label}
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

export function HeroHighlights() {
  return (
    <aside
      aria-label="Lo que nos hace diferentes"
      className="hero-fade hero-delay-1100 hidden w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-2xl lg:block"
    >
      <p className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Lo que nos hace diferentes
      </p>
      <ul className="space-y-1.5">
        {HERO_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="flex items-start gap-4 rounded-2xl bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.08]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white">
              <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs leading-snug text-white/60">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}