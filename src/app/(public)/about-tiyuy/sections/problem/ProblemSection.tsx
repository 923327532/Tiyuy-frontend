'use client';

import {
  CircleDollarSign,
  Puzzle,
  ShieldAlert,
  UserX,
} from 'lucide-react';

import {
  Reveal,
  useScrollReveal,
} from '../../hooks/use-scroll-reveal';

const PROBLEMS = [
  {
    icon: CircleDollarSign,
    text: 'Costos y barreras que dificultan la publicación de propiedades.',
  },
  {
    icon: ShieldAlert,
    text: 'Desconfianza y falta de transparencia durante las interacciones inmobiliarias.',
  },
  {
    icon: Puzzle,
    text: 'Procesos poco intuitivos que complican la búsqueda y publicación de inmuebles.',
  },
  {
    icon: UserX,
    text: 'Soluciones que no siempre responden a las necesidades de pequeños propietarios.',
  },
];

function Problem({
  icon: Icon,
  text,
  index,
}: (typeof PROBLEMS)[number] & { index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLLIElement>({
    once: false,
    threshold: 0.35,
    rootMargin: '-15% 0px -15% 0px',
  });

  return (
    <li
      ref={ref}
      className={`group relative flex flex-col gap-4 rounded-sm border border-white/10 bg-white/[0.02] p-6 transition-all duration-500 hover:border-[var(--brand-primary)]/30 hover:bg-white/[0.04] md:p-8 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
            isVisible
              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]'
              : 'border-white/20 text-white/40'
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </span>

        <span className="text-3xl font-light tabular-nums text-white/20">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-white/70 transition-colors duration-500 group-hover:text-white/90 md:text-base">
        {text}
      </p>
    </li>
  );
}

export function ProblemSection() {
  return (
    <section
      id="diagnostico"
      aria-labelledby="problem-title"
      className="relative isolate overflow-hidden bg-[#0f172a] py-14 text-white md:py-18 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-[var(--brand-primary)] to-transparent"
      />

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]"
          />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              A-03 / Diagnóstico
            </p>

            <h2
              id="problem-title"
              className="mt-2 max-w-3xl text-balance text-[clamp(1.4rem,3vw,2.2rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white"
            >
              Los desafíos del mercado inmobiliario{' '}
              <span className="text-white/35">
                que buscamos transformar.
              </span>
            </h2>
          </div>
        </div>

        {/* Grid de problemas */}
        <div className="mt-10">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PROBLEMS.map((problem, index) => (
              <Problem key={problem.text} {...problem} index={index} />
            ))}
          </ul>
        </div>

        {/* Cierre */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/35">
            TIYUY / A-03
          </p>

          <a
            href="#origen"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-[var(--brand-primary)]"
          >
            Nuestra historia
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}