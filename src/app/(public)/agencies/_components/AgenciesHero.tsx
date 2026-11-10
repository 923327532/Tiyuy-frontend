'use client';

import type { MouseEvent } from 'react';
import { ArrowDown, Building2, MapPin } from 'lucide-react';

export default function AgenciesHero() {
  const scrollToDirectory = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    document.getElementById('directorio')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <section
        aria-labelledby="agencies-title"
        className="relative isolate overflow-hidden border-b border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-10 hidden w-[43%] bg-[var(--bg-secondary)] md:block"
        />
        <div
          aria-hidden="true"
          className="absolute right-[8%] top-0 -z-10 hidden h-full border-l border-[var(--border-color)] md:block"
        />

        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-10 lg:px-12 lg:pb-16 lg:pt-12">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)] sm:text-xs">
            <Building2 aria-hidden="true" className="h-4 w-4 text-[var(--brand-primary)]" />
            <span>Directorio inmobiliario</span>
            <span className="text-[var(--border-color)]">/</span>
            <span>Perú</span>
          </div>

          <div className="grid items-center gap-7 md:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:gap-12">
            <div className="relative z-10 pt-7 sm:pt-9 md:py-10">
              <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary-hover)] sm:text-xs">
                <span className="h-px w-8 bg-[var(--brand-primary)]" />
                Empresas inmobiliarias
              </p>
              <h1
                id="agencies-title"
                className="max-w-3xl text-balance text-[clamp(2.7rem,5.4vw,5rem)] font-semibold leading-[1.02] tracking-[-0.052em] text-[var(--text-primary)]"
              >
                Agencias con trayectoria y visión.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
                Explora agencias, conoce su actividad y encuentra sus proyectos y propiedades disponibles.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="relative mx-auto flex min-h-[220px] w-full max-w-[580px] items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-5 sm:min-h-[280px] sm:px-6 sm:py-7 md:min-h-[340px] md:border-transparent md:bg-transparent lg:min-h-[380px]"
            >
              <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_50%_80%,var(--brand-primary-light),transparent_68%)] md:block" />
              <svg
                viewBox="0 0 640 440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative h-auto w-full overflow-visible"
                focusable="false"
              >
                <ellipse cx="327" cy="381" rx="263" ry="24" fill="var(--brand-primary-light)" />
                <path d="M66 381H588" stroke="var(--border-color)" strokeWidth="1.5" />
                <path d="M112 381V236L193 189V381" fill="var(--bg-card)" stroke="var(--text-tertiary)" strokeWidth="2" />
                <path d="M112 236L193 281" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                <path d="M145 218V365M169 204V378" stroke="var(--border-color)" strokeWidth="1.5" />
                <path d="M207 381V146L322 93L439 146V381H207Z" fill="var(--bg-card)" stroke="var(--text-secondary)" strokeWidth="2.5" />
                <path d="M207 146L322 201L439 146M322 201V381" stroke="var(--text-tertiary)" strokeWidth="2" />
                <path d="M238 161L286 183V229L238 207V161ZM358 183L408 161V207L358 229V183ZM238 239L286 261V307L238 285V239ZM358 261L408 239V285L358 307V261Z" fill="var(--brand-primary-light)" stroke="var(--brand-primary)" strokeOpacity=".62" strokeWidth="1.5" />
                <path d="M294 221L322 234L350 221V268L322 281L294 268V221ZM294 287L322 300L350 287V334L322 347L294 334V287Z" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1.5" />
                <path d="M235 325L286 347V381H235V325ZM358 347L411 325V381H358V347Z" fill="var(--brand-primary-light)" stroke="var(--brand-primary)" strokeOpacity=".62" strokeWidth="1.5" />
                <path d="M258 335V381M384 335V381" stroke="var(--text-tertiary)" strokeOpacity=".7" strokeWidth="1.5" />
                <path d="M299 381V351C299 338.297 309.297 328 322 328C334.703 328 345 338.297 345 351V381" fill="var(--brand-primary-light-hover)" stroke="var(--brand-primary)" strokeWidth="1.5" />
                <path d="M322 93V66M310 66H334" stroke="var(--text-tertiary)" strokeWidth="2" />
                <path d="M82 381V301L110 284M440 381V217L496 189V381M440 252L496 278" stroke="var(--text-tertiary)" strokeWidth="2" />
                <path d="M458 247V364M478 229V374" stroke="var(--border-color)" strokeWidth="1.5" />
                <path d="M516 381V277L561 258V381" fill="var(--bg-card)" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                <path d="M529 292V330M547 284V322" stroke="var(--brand-primary)" strokeOpacity=".55" strokeWidth="8" />
                <path d="M92 310C78 295 82 276 96 264C88 248 100 231 115 229C121 210 145 206 157 222C177 221 188 243 177 258C187 276 175 297 157 300C148 320 119 322 108 305" stroke="var(--brand-primary)" strokeOpacity=".65" strokeWidth="2" />
                <path d="M131 269V381" stroke="var(--text-tertiary)" strokeOpacity=".7" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Navegación del directorio"
        className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] sm:text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-light)]">
              <MapPin aria-hidden="true" className="h-4 w-4 text-[var(--brand-primary)]" />
            </span>
            <span>Encuentra agencias por nombre o ciudad</span>
          </div>
          <a
            href="#directorio"
            onClick={scrollToDirectory}
            className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[var(--brand-primary-hover)] transition-colors hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            Explorar el directorio
            <ArrowDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
            />
          </a>
        </div>
      </nav>
    </>
  );
}
