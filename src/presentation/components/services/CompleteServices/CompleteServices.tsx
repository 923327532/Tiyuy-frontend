'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building2, Building, Home, Users, Ruler, PiggyBank, ExternalLink, ChevronRight, ShieldCheck } from 'lucide-react';
import { PublicPageHero } from '@/presentation/components/layout/PublicPageHero';

export function CompleteServices() {
  const sections = [
    {
      image: 'https://i.postimg.cc/8zXkngB6/sunat.png',
      title: 'SUNAT',
      subtitle: 'Superintendencia Nacional de Aduanas y de Administración Tributaria',
      url: 'https://www.sunat.gob.pe/',
      items: [
        { title: 'Predial Urbano', desc: 'Impuesto para propiedades urbanas', cta: 'Consultar' },
        { title: 'Alquileres', desc: 'Obligaciones tributarias', cta: 'Declarar' },
        { title: 'Autovalúo', desc: 'Determinación del valor de predios', cta: 'Realizar' },
        { title: 'Transferencia de Predio', desc: 'Requisitos para transferencia', cta: 'Ver requisitos' },
        { title: 'Declaración Jurada', desc: 'Rentas anuales de propiedades', cta: 'Presentar' },
        { title: 'ITF', desc: 'Impuesto a transacciones financieras', cta: 'Calcular' },
        { title: 'Consultas y Trámites', desc: 'Atención y asistencia virtual', cta: 'Acceder a SUNAT Virtual' },
      ],
    },
    {
      image: 'https://i.postimg.cc/65YByxP1/sunarp.png',
      imageScale: 'scale-125',
      title: 'SUNARP',
      subtitle: 'Superintendencia Nacional de los Registros Públicos',
      url: 'https://www.sunarp.gob.pe/',
      items: [
        { title: 'Búsqueda de Partidas', desc: 'Consultar registros de propiedades', cta: 'Buscar' },
        { title: 'Certificados de Propiedad', desc: 'Obtener certificados registrales', cta: 'Solicitar' },
        { title: 'Trámites en Línea', desc: 'Servicios virtuales SUNARP', cta: 'Acceso virtual' },
      ],
    },
    {
      icon: <PiggyBank className="w-7 h-7 text-[var(--brand-primary)]" />,
      title: 'Guía de Crédito Hipotecario',
      subtitle: 'Información para obtener tu crédito hipotecario',
      url: 'https://www.sbs.gob.pe/',
      items: [
        { title: 'Requisitos', desc: 'Documentos necesarios', cta: 'Ver requisitos' },
        { title: 'Tasas de Interés', desc: 'Comparar tasas hipotecarias', cta: 'Consultar tasas' },
        { title: 'Simulador', desc: 'Calcular cuota hipotecaria', cta: 'Simular crédito' },
      ],
    },
  ];

  const otrasInstituciones = [
    { icon: <Building className="w-6 h-6 text-[var(--brand-primary)]" />, title: 'CAVALI - ICB', desc: 'Tasas de interés y mercado de valores', cta: 'Consultar', url: 'https://www.cavali.com.pe/' },
    { icon: <Home className="w-6 h-6 text-[var(--brand-primary)]" />, title: 'Ministerio de Vivienda', desc: 'Programas de subsidios y financiamiento', cta: 'Ver programas', url: 'https://www.minvivienda.gob.pe/' },
    { icon: <Users className="w-6 h-6 text-[var(--brand-primary)]" />, title: 'Tasadores Peruanos', desc: 'Servicio profesional de tasación', cta: 'Tasar', url: 'https://www.tasadoresperuanos.org/' },
    { icon: <Ruler className="w-6 h-6 text-[var(--brand-primary)]" />, title: 'Colegio de Arquitectos', desc: 'Validación de planos y permisos', cta: 'Consultar', url: 'https://www.cap.org.pe/' },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      <PublicPageHero
        eyebrow="Instituciones y recursos"
        icon={<Building2 className="h-4 w-4" />}
        title="Servicios inmobiliarios"
        description="Todo lo que necesitas para tus trámites y transacciones en el Perú de manera clara y accesible."
        imageSrc="/assets/services.png"
        imageAlt="Equipo colaborando en servicios para el sector inmobiliario"
      />

      <main className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Recursos oficiales
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Avanza con información confiable
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
            Encuentra accesos útiles para tus gestiones tributarias, registrales y financieras.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((sec) => (
            <section
              key={sec.title}
              className="py-2"
            >
              <div className="relative mb-5 flex flex-col items-center gap-4 pb-5 sm:min-h-[6.5rem] sm:justify-center sm:pb-0">
                <div className="flex flex-col items-center gap-3 text-center">
                  {sec.image ? (
                    <div className="flex h-14 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                      <div className="relative h-full w-full">
                        <Image
                          src={sec.image}
                          alt={`${sec.title} logo`}
                          fill
                          sizes="144px"
                          className={`object-contain ${sec.imageScale || ''}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10">
                      {sec.icon}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                      {sec.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-5 text-[var(--text-secondary)]">
                      {sec.subtitle}
                    </p>
                  </div>
                </div>
                <Link
                  href={sec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-primary)]/40 hover:bg-[var(--brand-primary)]/5 hover:text-[var(--brand-primary)] sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2"
                >
                  Sitio oficial
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2 xl:grid-cols-3">
                {sec.items.map((item, index) => (
                  <article
                    key={item.title}
                    className="group flex min-h-40 flex-col justify-between rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)]/70 p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/30 hover:bg-[var(--bg-card)] hover:shadow-md"
                  >
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        Recurso {String(index + 1).padStart(2, '0')}
                      </p>
                      <h4 className="mt-2 font-bold text-[var(--text-primary)]">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-sm leading-5 text-[var(--text-secondary)]">
                        {item.desc}
                      </p>
                    </div>
                    <Link
                      href={sec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-fit items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-bold text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)]/10"
                    >
                      {item.cta}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Más recursos
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Otras instituciones
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Entidades y enlaces de utilidad para el sector inmobiliario.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {otrasInstituciones.map((inst) => (
              <article
                key={inst.title}
                className="group flex min-h-56 flex-col rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--brand-primary)]/30 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10">
                  {inst.icon}
                </div>
                <h3 className="mt-5 font-bold text-[var(--text-primary)]">
                  {inst.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-5 text-[var(--text-secondary)]">
                  {inst.desc}
                </p>
                <Link
                  href={inst.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-fit items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-bold text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)]/10"
                >
                  {inst.cta}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <aside className="mt-10 flex gap-4 rounded-2xl border border-[var(--brand-primary)]/15 bg-[var(--brand-primary)]/5 p-5 sm:p-6">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-primary)]" />
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Información oficial verificada</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              Los enlaces te llevan a los sitios de las instituciones. Los trámites deben gestionarse directamente en sus plataformas oficiales.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
