'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { HERO_COPY } from './hero.data';
import './hero.css';

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[min(440px,calc(100svh-4rem))] items-center overflow-hidden"
    >
      {/* ============ LEFT PANEL - White ============ */}
      <div className="absolute inset-y-0 left-0 z-10 w-full bg-white lg:w-[46%]" />

      {/* ============ RIGHT PANEL - Blue with Curve ============ */}
      <div className="absolute inset-y-0 right-0 z-0 hidden w-[54%] lg:block">
        {/* Blue background */}
        <div className="absolute inset-0 bg-[var(--brand-primary)]" />

        {/* Background image - architectural photo from local assets */}
        <Image
          src="/assets/images/hero/hero-1.jpg"
          alt=""
          width={800}
          height={600}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          aria-hidden="true"
        />

        {/* Smooth dark overlay with gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-primary)]/50 via-[#1a2e1a]/80 to-[#0f1a0f]/90" />

        {/* Organic curved shape - white curving into blue */}
        <svg
          className="absolute left-0 top-0 h-full w-[220px]"
          viewBox="0 0 220 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 0 0 C 140 50, 20 160, 160 260 C 220 360, 40 480, 0 700 Z"
            fill="#ffffff"
          />
        </svg>

        {/* Decorative elements */}
        {/* Orange dot top-right */}
        <div
          className="absolute right-10 top-10 h-8 w-8 rounded-full bg-[#f59e0b] shadow-lg"
          aria-hidden="true"
        />

        {/* Plus sign - center area */}
        <svg
          className="absolute left-[130px] top-[42%] h-7 w-7 text-white/30"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 2v20M2 12h20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Circle outline */}
        <div
          className="absolute right-20 top-[58%] h-12 w-12 rounded-full border-2 border-white/20"
          aria-hidden="true"
        />

        {/* Small X */}
        <svg
          className="absolute right-16 bottom-[28%] h-5 w-5 text-white/20"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Small dot */}
        <div
          className="absolute bottom-[18%] right-[35%] h-2 w-2 rounded-full bg-white/30"
          aria-hidden="true"
        />

        {/* Person image - overlapping the curve */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/assets/roberto.png"
            alt="Roberto - Fundador de TIYUY"
            width={500}
            height={650}
            priority
            className="absolute bottom-0 left-[8%] h-[85%] w-auto object-contain object-bottom"
            style={{
              filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.3))',
            }}
          />
        </div>
      </div>

      {/* Content overlay - desktop only */}
      <div className="relative z-30 mx-auto hidden w-full lg:block lg:px-10 lg:py-10 xl:px-14">
        {/* Left content */}
        <div className="w-full lg:w-[42%]">
          {/* Decorative line */}
          <div className="hero-fade hero-delay-150 mb-6 h-1 w-12 rounded-full bg-[var(--brand-primary)]" />

          {/* Headline */}
          <h1
            id="hero-title"
            className="hero-fade hero-delay-200 text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[#1a1a2e]"
          >
            Transformamos el
            <br />
            <span className="relative inline-block">
              mercado inmobiliario
              <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[var(--brand-primary)]/15" />
            </span>
            <br />
            <span className="text-[var(--brand-primary)]">peruano.</span>
          </h1>

          {/* Description */}
          <p className="hero-fade hero-delay-400 mt-6 max-w-[400px] text-[15px] leading-[1.7] text-[#4b5563]">
            {HERO_COPY.description}
          </p>

          {/* CTA + secondary */}
          <div className="hero-fade hero-delay-500 mt-8 flex flex-wrap items-center gap-4">
            <a
              href={HERO_COPY.primaryCta.href}
              className="inline-flex items-center gap-2.5 rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] hover:shadow-xl"
            >
              {HERO_COPY.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={HERO_COPY.secondaryCta.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] transition-colors hover:text-[var(--brand-primary)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] transition-colors hover:border-[var(--brand-primary)]">
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {HERO_COPY.secondaryCta.label}
            </a>
          </div>

          {/* Credit card mockup */}
          <div className="hero-fade hero-delay-700 mt-10 hidden lg:block">
            <div className="relative w-[260px] rounded-2xl bg-gradient-to-br from-[#1a3a2e] via-[#152d24] to-[#0f2418] p-5 shadow-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                TIYUY
              </p>
              <p className="mt-6 text-base font-mono tracking-[0.15em] text-white/90">
                4500 1953 5643 4526
              </p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[7px] uppercase tracking-wider text-white/40">
                    Titular
                  </p>
                  <p className="text-xs font-medium text-white/80">
                    TIYUY Member
                  </p>
                </div>
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-full bg-[var(--brand-primary)]" />
                  <div className="-ml-3 h-6 w-6 rounded-full bg-[#f59e0b] opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MOBILE / TABLET FALLBACK ============ */}
      <div className="relative z-10 w-full bg-white px-4 py-6 sm:px-6 sm:py-8 lg:hidden">
        <div className="hero-fade hero-delay-100 mb-5">
          {/* Decorative line */}
          <div className="h-1 w-10 rounded-full bg-[var(--brand-primary)]" />
        </div>

        <h1 className="hero-fade hero-delay-200 text-[clamp(1.5rem,5vw,2.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[#1a1a2e]">
          Transformamos el
          <br />
          mercado inmobiliario
          <br />
          <span className="text-[var(--brand-primary)]">peruano.</span>
        </h1>

        <p className="hero-fade hero-delay-400 mt-4 max-w-[360px] text-[14px] leading-[1.6] text-[#4b5563]">
          {HERO_COPY.description}
        </p>

        <div className="hero-fade hero-delay-500 mt-6 flex items-center gap-3">
          <a
            href={HERO_COPY.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]"
          >
            {HERO_COPY.primaryCta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-8 flex justify-center">
          <Image
            src="/assets/roberto.png"
            alt="Roberto - Fundador de TIYUY"
            width={320}
            height={400}
            className="h-auto w-[260px] sm:w-[300px] object-contain"
            style={{
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.15))',
            }}
          />
        </div>
      </div>
    </section>
  );
}
