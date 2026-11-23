'use client';

import Image from 'next/image';

export function HeroImage() {
  return (
    <div className="hero-fade hero-delay-400 relative">
      {/* Decorative accent behind image */}
      <div
        aria-hidden="true"
        className="absolute -right-8 top-8 h-full w-full rounded-2xl border border-[var(--brand-primary)]/20"
      />
      
      {/* Main image container */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Gradient overlay for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-t from-[#111827]/40 via-transparent to-transparent"
        />
        
        {/* Subtle brand color tint */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent"
        />
        
        <Image
          src="/assets/roberto.png"
          alt="Roberto - Fundador de TIYUY"
          width={600}
          height={700}
          priority
          className="h-auto w-full object-cover object-[center_top]"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
        
        {/* Bottom info card overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)]">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Plataforma verificada</p>
              <p className="text-xs text-white/60">Conectando personas con espacios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent elements */}
      <div
        aria-hidden="true"
        className="absolute -left-4 top-12 h-20 w-20 rounded-full border border-[var(--brand-primary)]/20"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[var(--brand-primary)]/10 blur-xl"
      />
    </div>
  );
}
