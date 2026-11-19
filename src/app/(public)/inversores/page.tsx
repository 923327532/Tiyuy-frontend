'use client';

import { TrendingUp, Target, BarChart3, ArrowRight, Building2, Globe } from 'lucide-react';
import { PublicPageHero } from '@/presentation/components/layout/PublicPageHero';

const HIGHLIGHTS = [
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Mercado total', value: 'S/ 15,000M+', desc: 'Mercado inmobiliario en Perú' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Crecimiento digital', value: '+35% anual', desc: 'Penetración digital del sector' },
  { icon: <Target className="w-5 h-5" />, label: 'Déficit habitacional', value: '1.9M', desc: 'Viviendas requeridas en Perú' },
  { icon: <Globe className="w-5 h-5" />, label: 'Cobertura', value: 'Nacional', desc: 'Operamos en todo el Perú' },
];

export default function InversoresPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      <PublicPageHero
        eyebrow="Inversores"
        icon={<TrendingUp className="h-4 w-4" />}
        title={<>Relación con <span className="text-[var(--brand-primary)]">inversores</span></>}
        description="Conoce la visión, el mercado y las oportunidades detrás de Tiyuy."
        imageSrc="/assets/Inversors.png"
        imageAlt="Reunión de asesoría para inversores"
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12 sm:py-16 space-y-12 sm:space-y-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-5 hover:border-[var(--brand-primary)]/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--brand-primary)] mb-4 border border-[var(--border-light)] group-hover:bg-[var(--brand-primary)]/10 transition-colors">{h.icon}</div>
              <p className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">{h.value}</p>
              <p className="text-sm font-bold text-[var(--text-secondary)] mt-1">{h.label}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium mt-1">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">Visión del negocio</h2>
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-medium">
              Tiyuy nace para resolver un problema enorme: el mercado inmobiliario en Perú sigue siendo
              offline, fragmentado y con poca transparencia. Mientras millones de personas buscan vivienda
              cada año, la tecnología disponible para conectar oferta y demanda sigue siendo limitada.
            </p>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-medium">
              Construimos una plataforma que no solo publica propiedades, sino que organiza, da visibilidad
              y genera confianza en todo el proceso. Desde la búsqueda hasta el contacto, pasando por
              análisis de mercado, tendencias y herramientas profesionales para agentes e inmobiliarias.
            </p>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-8">Oportunidad de mercado</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Digitalización del sector', desc: 'Menos del 10% de las transacciones inmobiliarias en Perú se inician online. Hay un espacio enorme para crecer.' },
              { title: 'Demanda insatisfecha', desc: 'Más de 1.9 millones de familias necesitan vivienda. La oferta formal no alcanza y la intermediación es limitada.' },
              { title: 'Fragmentación de actores', desc: 'Miles de agentes, inmobiliarias y desarrolladores operan sin herramientas digitales integradas. Tiyuy los unifica.' },
              { title: 'Confianza como diferencial', desc: 'En un mercado con desconfianza, Tiyuy apuesta por perfiles verificados, reseñas y métricas transparentes.' },
            ].map((item, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-6">
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[var(--brand-primary)]/5 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[var(--brand-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-[var(--brand-primary)]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-3">Contacto institucional</h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium max-w-lg mx-auto mb-8">
              Si eres inversor, fondo o institución interesada en conocer más sobre Tiyuy, escríbenos.
            </p>
            <a href="mailto:tiyuy@saberoconsulting.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--brand-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
              tiyuy@saberoconsulting.com <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
