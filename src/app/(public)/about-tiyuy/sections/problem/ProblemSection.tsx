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
      className="group grid grid-cols-[auto_1fr] items-start gap-5 border-b border-white/15 py-8 md:grid-cols-[80px_1fr] md:gap-8 md:py-10"
    >
      {/* Número e icono */}
      <div className="flex flex-col items-start gap-5">
        <span className="text-xs font-medium tabular-nums text-white/35">
          0{index + 1}
        </span>

        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 md:h-12 md:w-12 ${
            isVisible
              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
              : 'border-white/25 text-white/45'
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
        </span>
      </div>

      {/* Descripción */}
      <p
        className={`max-w-3xl pt-7 text-balance text-[clamp(1.55rem,3.2vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.035em] transition-colors duration-500 ${
          isVisible ? 'text-white' : 'text-white/40'
        }`}
      >
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
      className="relative isolate overflow-hidden bg-[#0f172a] py-20 text-white md:py-28 lg:py-40"
    >
      {/* Detalle de identidad */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-[var(--brand-primary)] to-transparent"
      />

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Encabezado */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[var(--brand-primary)]"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                A-03 / Diagnóstico
              </p>
            </div>

            <p className="mt-3 text-sm text-white/40">El contexto actual</p>
          </div>

          <Reveal className="lg:col-span-9">
            <h2
              id="problem-title"
              className="max-w-6xl text-balance text-[clamp(2.6rem,7vw,7.5rem)] font-medium leading-[0.94] tracking-[-0.05em] text-white"
            >
              Los desafíos del mercado inmobiliario{' '}
              <span className="text-white/35">
                que buscamos transformar.
              </span>
            </h2>
          </Reveal>
        </div>

        {/* Contenido principal */}
        <div className="mt-16 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* Contexto lateral */}
          <Reveal className="lg:col-span-4">
            <div className="flex flex-col lg:sticky lg:top-28">
              <p className="max-w-sm text-xl font-medium leading-snug tracking-[-0.025em] text-white md:text-2xl">
                Encontrar un espacio para vivir debería ser más sencillo.
              </p>

              <p className="mt-6 max-w-sm text-base leading-relaxed text-white/60">
                Las barreras económicas, la falta de transparencia y los
                procesos complejos afectan la experiencia de quienes
                participan en el mercado inmobiliario.
              </p>

              <div className="mt-10 flex items-center gap-4 border-t border-white/15 pt-5">
                <span className="text-3xl font-medium tabular-nums text-[var(--brand-primary)]">
                  04
                </span>

                <p className="max-w-[15ch] text-xs leading-relaxed text-white/45">
                  Desafíos identificados en el sector.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Lista de problemas */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Principales barreras
              </p>

              <p className="text-xs tabular-nums text-white/35">01 — 04</p>
            </div>

            <ul>
              {PROBLEMS.map((problem, index) => (
                <Problem key={problem.text} {...problem} index={index} />
              ))}
            </ul>
          </div>
        </div>

        {/* Conclusión */}
        <Reveal className="mt-16 border-t border-white/15 pt-8 lg:mt-24">
          <div className="grid gap-6 sm:grid-cols-12 sm:items-center">
            <div className="flex items-center gap-3 sm:col-span-3">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Nuestra perspectiva
              </p>
            </div>

            <p className="max-w-3xl text-lg leading-relaxed text-white/75 sm:col-span-9 md:text-xl">
              Una oportunidad para construir experiencias inmobiliarias más
              humanas, accesibles y transparentes.
            </p>
          </div>
        </Reveal>

        {/* Identificador de sección */}
        <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-5 lg:mt-24">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
            TIYUY / A-03
          </p>

          <span className="text-xs text-white/35">
            Diagnóstico del sector inmobiliario
          </span>
        </div>
      </div>
    </section>
  );
}