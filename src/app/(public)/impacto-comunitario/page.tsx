'use client';

import { Heart, Shield, Users, BookOpen, Globe, CheckCircle2, Home, Sparkles, Lightbulb } from 'lucide-react';
import { PublicPageHero } from '@/presentation/components/layout/PublicPageHero';

const IMPACT_AREAS = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Inclusión y acceso',
    desc: 'Trabajamos para que más personas puedan acceder a información clara y oportuna sobre vivienda, independientemente de su ubicación o nivel socioeconómico.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Confianza y seguridad',
    desc: 'Promovemos prácticas éticas, perfiles verificados y mecanismos de denuncia para reducir la desconfianza en el mercado inmobiliario.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Educación del mercado',
    desc: 'A través de guías, tips de decoración, análisis de precios y contenido editorial, ayudamos a que las personas tomen mejores decisiones.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Apoyo al ecosistema',
    desc: 'Impulsamos a agentes, inmobiliarias y desarrolladores con herramientas digitales que mejoran su profesionalismo y alcance.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Digitalización del sector',
    desc: 'Contribuimos a cerrar la brecha digital del mercado inmobiliario peruano, llevando tecnología a actores que antes operaban solo de forma presencial.',
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Innovación responsable',
    desc: 'Usamos datos y tecnología con responsabilidad, priorizando la privacidad, la transparencia y el beneficio real para los usuarios.',
  },
];

export default function ImpactoComunitarioPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      <PublicPageHero
        eyebrow="Impacto comunitario"
        icon={<Heart className="h-4 w-4" />}
        title={<>Impacto <span className="text-[var(--brand-primary)]">comunitario</span></>}
        description="Cómo Tiyuy genera un cambio positivo más allá del negocio."
        imageSrc="/assets/Impact.png"
        imageAlt="Personas colaborando en una iniciativa comunitaria"
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {/* Propósito */}
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--brand-primary)]/5 blur-3xl rounded-full" />
          <Sparkles className="w-10 h-10 text-[var(--brand-primary)] mx-auto mb-6 relative z-10" />
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6 relative z-10">Nuestro propósito</h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-medium relative z-10">
            En Tiyuy creemos que la tecnología puede hacer que encontrar un hogar sea más justo, transparente
            y accesible para todos. Trabajamos para reducir las barreras de información, conectar a las
            personas con oportunidades reales y fortalecer la confianza en el mercado inmobiliario.
          </p>
        </div>

        {/* Áreas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMPACT_AREAS.map((area, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 hover:border-[var(--brand-primary)]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--brand-primary)] mb-4 border border-[var(--border-light)] group-hover:bg-[var(--brand-primary)]/10 transition-colors">{area.icon}</div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">{area.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>

        {/* Iniciativas */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-8">Iniciativas destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Guía para alquilar en Perú', desc: 'Contenido educativo gratuito sobre SUNARP, SUNAT y protección contra estafas.' },
              { title: 'Índice de precio por m²', desc: 'Datos abiertos del mercado para que cualquier persona pueda tomar decisiones informadas.' },
              { title: 'Tips de decoración', desc: 'Sección editorial con recomendaciones curadas para mejorar el hogar.' },
              { title: 'Política antidiscriminación', desc: 'Compromiso público con la igualdad de trato y la inclusión en la plataforma.' },
            ].map((init, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] hover:border-[var(--brand-primary)]/30 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm mb-1">{init.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{init.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 sm:p-12 text-center border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden mt-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-primary)]/5 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[var(--brand-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Home className="w-8 h-8 text-[var(--brand-primary)]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">Construyendo un mercado más justo</h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium max-w-lg mx-auto mb-2 leading-relaxed">
              El impacto no se mide solo en transacciones, sino en cuántas personas encuentran un hogar
              de forma más segura, informada y digna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
