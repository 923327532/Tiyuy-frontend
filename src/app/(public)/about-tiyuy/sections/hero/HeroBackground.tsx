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
        className="-z-20 scale-105"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.75)_0%,rgba(10,10,10,0.4)_45%,rgba(10,10,10,0.95)_100%)]"
      />

      <div
        aria-hidden="true"
        className="about-grain absolute inset-0 -z-10 opacity-40 mix-blend-overlay pointer-events-none"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />
    </>
  );
}