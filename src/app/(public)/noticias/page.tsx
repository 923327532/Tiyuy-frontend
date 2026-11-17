'use client';

import { Newspaper, ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const NEWS = [
  {
    date: 'Junio 2026',
    title: 'Lanzamiento de Tiyuy Analytics',
    desc: 'Presentamos nuestro módulo de inteligencia de mercado con datos agregados de precio por m², tendencias por distrito y radar de actividad.',
    tag: 'Producto',
  },
  {
    date: 'Mayo 2026',
    title: 'Alianza con principales inmobiliarias de Lima',
    desc: 'Más de 15 inmobiliarias se suman a Tiyuy para publicar y gestionar su portafolio de propiedades en nuestra plataforma.',
    tag: 'Alianzas',
  },
  {
    date: 'Abril 2026',
    title: 'Nuevo sistema de perfiles para agentes',
    desc: 'Los agentes inmobiliarios ahora cuentan con perfiles profesionales verificados, reseñas y métricas de desempeño.',
    tag: 'Producto',
  },
  {
    date: 'Marzo 2026',
    title: 'Integración con Mercado Pago',
    desc: 'Los usuarios pueden pagar sus planes y suscripciones de forma segura a través de Mercado Pago, Yape y Plin.',
    tag: 'Tecnología',
  },
];

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      <div className="relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-light)]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-20 items-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-3xl relative z-10 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />
              <Newspaper className="w-3.5 h-3.5" /> Sala de prensa
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-[var(--text-primary)] text-balance">
              Noticias y <span className="text-[var(--brand-primary)] relative inline-block">comunicados<span className="absolute bottom-1 left-0 w-full h-[6px] bg-[var(--brand-primary)]/20 -skew-x-12" /></span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] mt-6 leading-relaxed font-medium">
              Entérate de los últimos anuncios, lanzamientos y novedades de Tiyuy.
            </p>
          </div>
          <div
            className="relative z-10 min-h-[260px] sm:min-h-[340px] rounded-[2rem] bg-cover bg-center shadow-2xl shadow-slate-900/10"
            style={{ backgroundImage: "url('/assets/News.png')" }}
            aria-label="Periódico con noticias y comunicados"
          />
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {NEWS.map((item, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[var(--brand-primary)]/30 transition-all duration-300 group cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{item.date}</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-light)] group-hover:bg-[var(--brand-primary)]/10 group-hover:border-[var(--brand-primary)]/30 transition-colors mt-2 shrink-0">
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors" />
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[var(--bg-card)] rounded-3xl p-8 sm:p-12 text-center border border-[var(--border-light)] shadow-sm mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-primary)]/5 blur-3xl rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-3 relative z-10">Contacto para medios</h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium max-w-lg mx-auto mb-6 relative z-10">
              Si eres periodista o medio de comunicación y deseas más información sobre Tiyuy, escríbenos.
            </p>
            <a href="mailto:tiyuy@saberoconsulting.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm relative z-10">
              tiyuy@saberoconsulting.com <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
