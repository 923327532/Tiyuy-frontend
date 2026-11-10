'use client';

import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroIndex } from './HeroIndex';
import { HERO_COPY } from './hero.data';
import './hero.css';

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="hero-root relative isolate flex min-h-[min(900px,calc(100svh-4rem))] flex-col overflow-hidden bg-[#111827] text-white"
    >
      <HeroBackground />

      <header className="relative z-10 mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pt-7 sm:px-8 lg:px-12 lg:pt-9">
        <p className="hero-fade hero-delay-200 border-l-2 border-[var(--brand-primary)] pl-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:text-xs">
          {HERO_COPY.chip}
        </p>

        <p className="hero-fade hero-delay-280 text-right text-[10px] font-medium uppercase tracking-[0.16em] text-white/75 sm:text-xs">
          {HERO_COPY.location}
        </p>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 items-end px-5 pb-12 pt-24 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
        <div className="w-full max-w-[1120px]">
          <HeroContent />
        </div>
      </main>

      <HeroIndex />
    </section>
  );
}