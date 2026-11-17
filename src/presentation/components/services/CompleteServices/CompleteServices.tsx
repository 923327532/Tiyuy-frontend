'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building2, Building, Home, Users, Ruler, PiggyBank, ExternalLink, ChevronRight } from 'lucide-react';

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
    <div className="bg-[var(--bg-primary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10 py-16">
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="relative isolate mb-16 grid grid-cols-1 items-center gap-8 overflow-hidden border-b-2 border-gray-200 pb-10 dark:border-gray-800 lg:grid-cols-[1fr_0.7fr] lg:gap-16">
          <div className="relative z-10 max-w-2xl text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-3">
            Instituciones & Recursos
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Servicios Inmobiliarios
          </h1>
          <p className="mt-3 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
            Todo lo que necesitas para tus trámites y transacciones en el Perú de manera clara y accesible.
          </p>
          </div>
          <div
            className="min-h-[180px] bg-contain bg-center bg-no-repeat lg:min-h-[230px]"
            style={{ backgroundImage: "url('/assets/services.png')" }}
            aria-label="Recursos y servicios inmobiliarios"
          />
        </header>

        <div className="space-y-12">
          {sections.map((sec) => (
            <section key={sec.title} className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {sec.image ? (
                    <div className="w-52 h-20 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image 
                          src={sec.image} 
                          alt={sec.title} 
                          fill
                          sizes="(max-width: 768px) 208px, 208px"
                          className={`object-contain object-center ${sec.imageScale || 'scale-110'}`}
                          priority
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border-2 border-[var(--brand-primary)]/20 flex items-center justify-center shrink-0">
                      {sec.icon}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                      {sec.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm font-medium mt-0.5">
                      {sec.subtitle}
                    </p>
                  </div>
                </div>
                <Link
                  href={sec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand-primary)] hover:underline self-start sm:self-center cursor-pointer"
                >
                  Ir al sitio oficial
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sec.items.map((item) => (
                  <div key={item.title} className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:border-[var(--brand-primary)]/40 dark:hover:border-[var(--brand-primary)]/40 transition-colors shadow-md">
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-xs font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <Link
                      href={sec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 mt-5 text-xs font-bold text-[var(--brand-primary)] hover:opacity-80 underline underline-offset-4 cursor-pointer"
                    >
                      <span>{item.cta}</span>
                      <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-800">
          <div className="mb-6 border-b-2 border-gray-200 dark:border-gray-800 pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] mb-1">
              Complementarios
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Otras Instituciones
            </h2>
            <p className="text-[var(--text-secondary)] text-sm font-medium mt-0.5">
              Entidades y enlaces de utilidad para el sector
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otrasInstituciones.map((inst) => (
              <div key={inst.title} className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:border-[var(--brand-primary)]/40 dark:hover:border-[var(--brand-primary)]/40 transition-colors shadow-md">
                <div>
                  <div className="mb-3">{inst.icon}</div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                    {inst.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-xs font-medium leading-relaxed">
                    {inst.desc}
                  </p>
                </div>
                <Link 
                  href={inst.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 mt-4 text-xs font-bold text-[var(--brand-primary)] hover:opacity-80 underline underline-offset-4 cursor-pointer"
                >
                  <span>{inst.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 bg-[var(--brand-primary)]/[0.02] dark:bg-[var(--brand-primary)]/[0.05] rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto border-2 border-[var(--brand-primary)]/10">
          <h3 className="text-base font-bold text-[var(--brand-primary)] mb-2">
            Información Oficial Verificada
          </h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
            Todos los enlaces dirigen a instituciones oficiales del Estado peruano y entidades reguladas. Facilitamos el acceso a esta información para tu comodidad y seguridad, pero recuerda que todos los trámites deben gestionarse finalmente dentro de las plataformas oficiales correspondientes.
          </p>
        </footer>

      </div>
    </div>
  );
}
