'use client';

import { useState, useEffect, useRef } from 'react';

function useCounterAnimation(target: number, duration: number = 2000, start: boolean = true): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) { setCount(0); return; }
    let startTime: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration, start]);

  return count;
}

const STATS = [
  { label: 'Usuarios Activos', value: 10000, suffix: '+' },
  { label: 'Propiedades', value: 500, suffix: '+' },
  { label: 'Soporte Continuo', value: 24, suffix: '/7' },
  { label: 'Satisfacción', value: 99, suffix: '%' },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden border-b border-[var(--border-light)]">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-primary)]/[0.03] to-transparent" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-b from-[var(--brand-primary)]/[0.07] to-transparent blur-3xl rounded-full pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 xl:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] uppercase tracking-[0.15em]">
            <span className="w-1 h-1 rounded-full bg-[var(--brand-primary)]" />
            Contacto
          </span>

          <h1 className="text-[clamp(1.75rem,6vw,3.75rem)] font-black text-[var(--text-primary)] tracking-[-0.03em] leading-[1.08]">
          Hablemos sobre{' '}
            <span className="text-[var(--brand-primary)]">
              tu próximo paso
            </span>
          </h1>

          <p className="text-[var(--text-secondary)] text-sm sm:text-lg leading-relaxed max-w-xl mx-auto px-2 sm:px-0">
            Cuéntanos sobre tu proyecto o consulta. Nuestro equipo está listo para ayudarte a encontrar la mejor solución.
          </p>
        </div>

        <div className="mt-10 sm:mt-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-0 md:divide-x divide-[var(--border-light)] border-t border-[var(--border-light)]/60 pt-6 sm:pt-10">
            {STATS.map((s, i) => (
              <StatCell key={i} label={s.label} value={s.value} suffix={s.suffix} delay={i * 100} mounted={mounted} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCell({ label, value, suffix, delay, mounted }: {
  label: string;
  value: number;
  suffix: string;
  delay: number;
  mounted: boolean;
}) {
  const count = useCounterAnimation(value, 2000, mounted);

  return (
    <div
      className={`flex flex-col items-center text-center transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-[clamp(1.5rem,4vw,2.75rem)] font-black text-[var(--brand-primary)] tracking-tight flex items-baseline">
        <span className="tabular-nums">{count.toLocaleString('es-ES')}</span>
        <span className="text-[var(--text-primary)] text-lg sm:text-2xl ml-0.5">{suffix}</span>
      </div>
      <div className="mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">
        {label}
      </div>
    </div>
  );
}
