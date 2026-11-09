'use client';

import { HeroBackground } from './HeroBackground';
import { HeroContent, HeroHighlights } from './HeroContent';
import { HeroIndex } from './HeroIndex';
import { HERO_COPY } from './hero.data';
import './hero.css';

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-neutral-950 text-white"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <p className="hero-fade hero-delay-200 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
          {HERO_COPY.chip}
        </p>
        <p className="hero-fade hero-delay-280 text-sm font-medium text-white/75">
          {HERO_COPY.location}
        </p>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end gap-10 px-5 pb-10 pt-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-12 lg:pb-14">
        <HeroContent />
        <HeroHighlights />
      </div>

      <HeroIndex />
    </section>
  );
}