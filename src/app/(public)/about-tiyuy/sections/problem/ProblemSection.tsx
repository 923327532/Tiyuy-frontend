
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

function Problem({ icon: Icon, text }: (typeof PROBLEMS)[number]) {
  const { ref, isVisible } = useScrollReveal<HTMLLIElement>({
    once: false,
    threshold: 0.5,
    rootMargin: '-28% 0px -28% 0px',
  });

  return (
    <li
      ref={ref}
      className="flex items-start gap-5 border-b border-white/15 py-8 md:gap-8 md:py-10"
    >
      <span
        className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 md:mt-2 md:h-12 md:w-12 ${
          isVisible
            ? 'border-white bg-white text-neutral-950'
            : 'border-white/25 text-white/40'
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
      </span>

      <p
        className={`text-balance text-[clamp(1.6rem,3.2vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.03em] transition-colors duration-500 ${
          isVisible ? 'text-white' : 'text-white/25'
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
      className="bg-neutral-950 py-20 text-white md:py-28 lg:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <p className="text-sm font-medium text-white/50">
          Diagnóstico del sector
        </p>

        <Reveal>
          <h2
            id="problem-title"
            className="mt-6 max-w-6xl text-balance text-[clamp(2.6rem,7vw,7.5rem)] font-medium leading-[0.94] tracking-[-0.05em] text-white"
          >
            Los desafíos del mercado inmobiliario{' '}
            <span className="text-white/35">
              que buscamos transformar.
            </span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <p className="text-xl font-medium leading-snug tracking-[-0.02em] text-white md:text-2xl">
              Encontrar un espacio para vivir debería ser más sencillo.
            </p>

            <p className="mt-5 max-w-xs text-base leading-relaxed text-white/60">
              Las barreras económicas, la falta de transparencia y los
              procesos complejos afectan la experiencia de quienes
              participan en el mercado inmobiliario.
            </p>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Cuatro desafíos que evidencian la necesidad de una
              experiencia inmobiliaria más accesible y centrada en las personas.
            </p>
          </Reveal>

          <ul className="border-t border-white/15 lg:col-span-8">
            {PROBLEMS.map((problem) => (
              <Problem key={problem.text} {...problem} />
            ))}
          </ul>
        </div>

        <Reveal className="mt-14 flex items-center gap-3 lg:mt-20">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]"
          />

          <p className="text-sm leading-relaxed text-white/50">
            Una oportunidad para construir experiencias inmobiliarias
            más humanas, accesibles y transparentes.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
