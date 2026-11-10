'use client';

import { ParallaxImage } from '../../ui/ParallaxImage';
import { HERO_CONFIG } from './hero.data';

export function HeroBackground() {
  return (
    <>
      <ParallaxImage
        src={HERO_CONFIG.image}
        alt={HERO_CONFIG.alt}
        preload
        sizes="100vw"
        speed={HERO_CONFIG.parallaxSpeed}
        className="-z-20"
      />

      <div
        aria-hidden="true"
        className="hero-overlay pointer-events-none absolute inset-0 -z-10"
      />

      <div
        aria-hidden="true"
        className="hero-grid pointer-events-none absolute inset-0 -z-10"
      />

      <div
        aria-hidden="true"
        className="about-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay"
      />

      {/* Línea de identidad */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-0 z-10 h-20 w-px bg-gradient-to-b from-[var(--brand-primary)] to-transparent sm:left-8 lg:left-12"
      />
    </>
  );
}