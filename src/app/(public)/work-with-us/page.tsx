'use client';

import {
  ArrowRight,
  Briefcase,
  Check,
  Coffee,
  Globe,
  Heart,
  Lightbulb,
  Mail,
  Shield,
  Target,
  Users,
  Zap,
} from 'lucide-react';

const TEAMS = [
  { icon: Globe, name: 'Producto y Diseño', desc: 'Creamos experiencias que hacen que comprar, vender y alquilar una propiedad sea más humano.' },
  { icon: Zap, name: 'Ingeniería', desc: 'Construimos una plataforma confiable y escalable para el futuro inmobiliario.' },
  { icon: Target, name: 'Crecimiento y Marketing', desc: 'Conectamos a las personas con los lugares que pueden llamar hogar.' },
  { icon: Users, name: 'Experiencia del Cliente', desc: 'Ayudamos a cada persona con claridad, empatía y respuestas reales.' },
  { icon: Briefcase, name: 'Alianzas', desc: 'Creamos relaciones duraderas con agentes, desarrolladores e inmobiliarias.' },
  { icon: Shield, name: 'Operaciones y Finanzas', desc: 'Mantenemos el negocio saludable, eficiente y preparado para crecer.' },
];

const BENEFITS = [
  'Trabajo remoto o híbrido',
  'Horarios flexibles enfocados en resultados',
  'Apoyo para cobertura de salud',
  'Días adicionales de descanso',
  'Presupuesto anual para aprendizaje',
  'Participación real en nuestro crecimiento',
];

const STEPS = [
  { number: '01', title: 'Postulacion', desc: 'Cuentanos que te importa y que aportarias a Tiyuy.' },
  { number: '02', title: 'Conoce al equipo', desc: 'Conversamos sobre tu experiencia, objetivos y forma de trabajar.' },
  { number: '03', title: 'Demuestra tu talento', desc: 'Segun el rol, compartimos un desafio practico para trabajar juntos.' },
  { number: '04', title: 'Genera impacto', desc: 'Si encajamos, construiremos contigo tu primera etapa en Tiyuy.' },
];

const CULTURE = [
  { icon: Heart, title: 'Las personas primero', desc: 'Resolvemos problemas reales para personas reales, con empatia en cada paso.' },
  { icon: Lightbulb, title: 'Siempre curiosos', desc: 'Hacemos mejores preguntas, aprendemos rapido y mejoramos cada dia.' },
  { icon: Coffee, title: 'Construimos juntos', desc: 'Las mejores ideas crecen cuando diferentes perspectivas comparten el espacio.' },
];

export default function WorkWithUsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--bg-secondary)] text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      <section className="relative border-b border-[var(--border-light)] bg-[var(--bg-primary)]">
        <div className="pointer-events-none absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 pb-16 pt-8 sm:px-10 sm:pb-24 sm:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-20 lg:px-16 lg:pb-28 lg:pt-16">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/8 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
              Trabaja en Tiyuy
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-[var(--text-primary)] sm:text-6xl lg:text-8xl">
              Construye el futuro del <span className="text-[var(--brand-primary)]">mercado inmobiliario.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Construimos tecnologia para que encontrar, vender y alquilar un lugar sea mas simple, claro y humano.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:tiyuy@saberoconsulting.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:bg-[var(--brand-primary-hover)]"
              >
                Inicia una conversacion <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#teams"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-3.5 text-sm font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
              >
                Conoce nuestros equipos
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#16352c] p-6 text-white shadow-2xl shadow-[#16352c]/20 sm:p-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[24px] border-white/10" />
            <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[var(--brand-primary)]/40 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-200 backdrop-blur-sm">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Invitacion abierta</span>
              </div>
              <div className="mt-24">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Un equipo, muchas perspectivas</p>
                <p className="mt-4 max-w-sm text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Tu proxima gran etapa puede comenzar aqui.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black">6</p>
                  <p className="mt-1 text-xs text-white/65">equipos para conocer</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black">1</p>
                  <p className="mt-1 text-xs text-white/65">una mision compartida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-10 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-primary)]">Nuestra razon de ser</p>
          <h2 className="mt-4 max-w-md text-3xl font-black tracking-tight sm:text-5xl">El mercado inmobiliario debe funcionar mejor para todos.</h2>
        </div>
        <div className="max-w-2xl lg:pt-8">
          <p className="text-lg leading-8 text-[var(--text-secondary)]">
            Tiyuy conecta personas, propiedades y posibilidades. Combinamos conocimiento local con tecnologia pensada para que cada paso sea mas transparente y cada busqueda de hogar mas personal.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[var(--border-light)] pt-6 sm:grid-cols-3">
            <div><p className="text-3xl font-black text-[var(--brand-primary)]">01</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Diseno humano</p></div>
            <div><p className="text-3xl font-black text-[var(--brand-primary)]">02</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Construido con confianza</p></div>
            <div><p className="text-3xl font-black text-[var(--brand-primary)]">03</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Aprendizaje constante</p></div>
          </div>
        </div>
      </section>

      <section id="teams" className="bg-[var(--bg-primary)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-primary)]">Encuentra tu lugar</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Donde puedes marcar la diferencia?</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[var(--text-secondary)]">Diferentes disciplinas. Un equipo ambicioso. Trae tu propia perspectiva.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAMS.map(({ icon: Icon, name, desc }, index) => (
              <article key={name} className={`group rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/40 hover:shadow-xl hover:shadow-[var(--brand-primary)]/8 ${index === 0 ? 'lg:row-span-2 lg:flex lg:flex-col lg:justify-between lg:p-8' : ''}`}>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] transition-colors group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-[var(--text-tertiary)]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-bold tracking-tight">{name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{desc}</p>
                </div>
                <div className="mt-7 flex items-center gap-2 text-xs font-bold text-[var(--brand-primary)] opacity-0 transition-opacity group-hover:opacity-100">Conoce el impacto <ArrowRight className="h-3.5 w-3.5" /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-[var(--brand-primary)] p-8 text-white sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100">Como trabajamos</p>
            <h2 className="mt-4 max-w-lg text-3xl font-black tracking-tight sm:text-5xl">Una cultura con espacio para dar lo mejor de ti.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">Valoramos la responsabilidad sobre el ego, la claridad sobre el ruido y el progreso sobre la perfeccion. Tendras la confianza y el contexto para tomar buenas decisiones.</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {CULTURE.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-emerald-100" />
                  <h3 className="mt-6 text-sm font-bold">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/70">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-card)] p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-primary)]">Lo que ofrecemos</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Pensado para toda tu vida.</h2>
            <div className="mt-8 space-y-4">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 border-b border-[var(--border-light)] pb-4 text-sm font-semibold text-[var(--text-secondary)] last:border-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"><Check className="h-3.5 w-3.5" /></span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-light)] bg-[var(--bg-primary)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-primary)]">Lo que sigue</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Un proceso claro, desde el primer contacto hasta tu primer dia.</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="relative rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] p-6">
                <span className="text-sm font-black text-[var(--brand-primary)]">{step.number}</span>
                <h3 className="mt-10 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#16352c] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-primary)]/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <Mail className="mx-auto h-8 w-8 text-emerald-200" />
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">No encuentras tu rol?</h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base">Siempre estamos interesados en conocer personas con talento. Envianos tu historia y cuentanos donde podrias generar impacto.</p>
            <a href="mailto:tiyuy@saberoconsulting.com" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#16352c] transition-colors hover:bg-emerald-50">Envia tu CV <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
