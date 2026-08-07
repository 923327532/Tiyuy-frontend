'use client';

import { useState } from 'react';
import {
  FileText, Home, Search, MessageCircle, BarChart3,
  CreditCard, MapPin, AlertTriangle, X, Menu, Check
} from 'lucide-react';

const termsData = {
  lastUpdated: "1 de agosto de 2026",
  intro: {
    highlight: 'Bienvenido a Tiyuy. Estos Términos de Servicio ("Términos") constituyen un acuerdo legal entre ti ("Usuario", "tu" o "tus") y Tiyuy ("nosotros", "nuestro" o "la Plataforma") que regula el acceso y uso de nuestros servicios.',
    paragraphs: [
      "Al registrarte, acceder o utilizar cualquier servicio de Tiyuy, declaras que has leído, comprendido y aceptas estar sujeto a estos Términos, a nuestra Política de Privacidad y al tratamiento de tus datos personales. Si no aceptas estos términos, no debes utilizar la Plataforma.",
      "Nos reservamos el derecho de actualizar estos Términos en cualquier momento. Los cambios entrarán en vigor desde su publicación. El uso continuado de la Plataforma después de modificaciones constituye aceptación de los nuevos Términos."
    ]
  },
  services: [
    { icon: "Home", title: 'Publicación de inmuebles', desc: 'Permite a propietarios, agentes e inmobiliarias publicar propiedades en venta o alquiler' },
    { icon: "Search", title: 'Búsqueda y descubrimiento', desc: 'Herramientas avanzadas de búsqueda, filtros y geolocalización para encontrar inmuebles' },
    { icon: "MessageCircle", title: 'Mensajería en tiempo real', desc: 'Chats, canales, grupos, estados con expiración de 24 horas y eventos con confirmación de asistencia' },
    { icon: "BarChart3", title: 'Herramientas de gestión', desc: 'Panel de administración para gestionar propiedades, proyectos, contactos, CRM y estadísticas' },
    { icon: "CreditCard", title: 'Planes y suscripciones', desc: 'Servicios premium con funcionalidades avanzadas para profesionales del sector inmobiliario' },
    { icon: "MapPin", title: 'Mapas y ubicación', desc: 'Integración con servicios de mapas para mostrar ubicaciones de propiedades y proyectos' }
  ],
  requirements: [
    "Ser mayor de 18 años",
    "Proporcionar información veraz, exacta y actualizada",
    "Contar con un correo electrónico válido",
    "Completar el proceso de verificación de identidad (DNI/RUC/KYC) cuando sea requerido",
    "Aceptar los Términos y Condiciones, la Política de Privacidad y el tratamiento de datos personales"
  ],
  accountTypes: [
    { name: 'Usuario', desc: 'Busca propiedades y proyectos, y contacta publicantes' },
    { name: 'Agente', desc: 'Publica propiedades y gestiona clientes con CRM' },
    { name: 'Desarrollador', desc: 'Publica proyectos inmobiliarios y gestiona unidades' },
    { name: 'Inmobiliaria', desc: 'Gestión avanzada con equipo de trabajo' },
    { name: 'Administrador', desc: 'Acceso restringido a la administración de la plataforma' }
  ],
  prohibitedContent: [
    'Información falsa o engañosa',
    'Precios inflados o ficticios',
    'Fotografías de propiedades ajenas',
    'Datos de contacto en descripciones',
    'Lenguaje discriminatorio u ofensivo',
    'Spam o publicidad no solicitada',
    'Propiedades inexistentes',
    'Contenido ilegal o fraudulento'
  ],
  badConduct: [
    { title: 'Uso no autorizado', desc: 'Acceder, manipular o intentar acceder a sistemas, servidores o datos de Tiyuy sin autorización.' },
    { title: 'Suplantación de identidad', desc: 'Crear cuentas con información falsa o hacerse pasar por otra persona o entidad.' },
    { title: 'Actividades automatizadas', desc: 'Utilizar bots, scrapers o herramientas automatizadas para extraer datos de la Plataforma sin autorización.' },
    { title: 'Interferencia con el servicio', desc: 'Realizar acciones que interrumpan, dañen o sobrecargen la infraestructura de Tiyuy.' },
    { title: 'Distribución de malware', desc: 'Transmitir virus, gusanos, troyanos o cualquier código malicioso a través de la Plataforma.' }
  ]
};

const SECTIONS = [
  { id: 'intro', title: 'Introducción' },
  { id: 'services', title: 'Servicios' },
  { id: 'accounts', title: 'Cuentas' },
  { id: 'publications', title: 'Publicaciones' },
  { id: 'conduct', title: 'Conducta del usuario' },
  { id: 'payments', title: 'Pagos y suscripciones' },
  { id: 'ip', title: 'Propiedad intelectual' },
  { id: 'liability', title: 'Limitación de responsabilidad' },
  { id: 'termination', title: 'Terminación' },
  { id: 'changes', title: 'Modificaciones' },
  { id: 'law', title: 'Legislación aplicable' },
  { id: 'contact', title: 'Contacto' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Home, Search, MessageCircle, BarChart3, CreditCard, MapPin
};

const SectionHeader = ({ num, title }: { num: number; title: string }) => (
  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
      {num}
    </span>
    {title}
  </h2>
);

export default function TermsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-card)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-primary)]/[0.02] border-b border-[var(--border-light)] transition-colors duration-300">
        <div className="w-full px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto py-8 sm:py-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[var(--brand-primary)]" strokeWidth={2} />
                <span className="text-sm font-bold text-[var(--brand-primary)] uppercase tracking-wider">
                  Términos de Servicio
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-4">
                Términos y condiciones de uso
              </h1>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                Estos términos establecen las reglas y condiciones bajo las cuales puedes utilizar la plataforma Tiyuy. Al acceder a nuestros servicios, aceptas cumplir con estos términos.
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]/60 mt-6 font-medium tracking-wide">
                Última actualización: {termsData.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-8 xl:px-16">
        <div className="max-w-[1920px] mx-auto py-8">
          <div className="flex gap-8">
            {/* Sidebar Navigation - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <nav className="sticky top-24 space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 px-3">Contenido</p>
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="space-y-8">
                {/* 1. Introducción */}
                <section id="intro" className="mb-12 scroll-mt-24">
                  <SectionHeader num={1} title="Introducción" />
                  <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      {termsData.intro.highlight}
                    </p>
                  </div>
                  {termsData.intro.paragraphs.map((para, i) => (
                    <p key={i} className="text-[var(--text-secondary)] leading-relaxed mb-4">{para}</p>
                  ))}
                </section>

                {/* 2. Servicios */}
                <section id="services" className="mb-12 scroll-mt-24">
                  <SectionHeader num={2} title="Descripción de los servicios" />
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                    Tiyuy es una plataforma digital peruana que ofrece los siguientes servicios:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {termsData.services.map((item, i) => {
                      const IconComp = ICON_MAP[item.icon];
                      return (
                        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 hover:border-green-200 transition-colors">
                          {IconComp && <IconComp className="w-5 h-5 text-green-600 mb-3" strokeWidth={1.5} />}
                          <h3 className="font-semibold text-[var(--text-primary)] mb-1">{item.title}</h3>
                          <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 3. Cuentas */}
                <section id="accounts" className="mb-12 scroll-mt-24">
                  <SectionHeader num={3} title="Registro y cuentas de usuario" />
                  <div className="space-y-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">3.1 Requisitos de registro</h3>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        {termsData.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">3.2 Seguridad de la cuenta</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente de cualquier uso no autorizado. Tiyuy no será responsable de pérdidas derivadas del incumplimiento de esta obligación.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">3.3 Tipos de cuenta</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {termsData.accountTypes.map((type, i) => (
                          <div key={i} className="bg-green-50 border border-green-100 rounded-lg p-3">
                            <h4 className="font-semibold text-green-800 text-sm">{type.name}</h4>
                            <p className="text-xs text-green-600 mt-1">{type.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Publicaciones */}
                <section id="publications" className="mb-12 scroll-mt-24">
                  <SectionHeader num={4} title="Publicaciones de propiedades" />
                  <div className="space-y-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">4.1 Responsabilidad del publicante</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        El usuario que publica una propiedad garantiza que: (a) es el propietario legítimo o cuenta con autorización para publicar; (b) la información proporcionada es veraz y actualizada; (c) las fotografías corresponden al inmueble publicado; (d) el precio reflejado es real y vigente.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">4.2 Moderación de contenido</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Tiyuy se reserva el derecho de revisar, editar o eliminar publicaciones que incumplan estos Términos, contengan información falsa, engañosa o inapropiada. Las publicaciones están sujetas a moderación previa y posterior.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 5. Conducta */}
                <section id="conduct" className="mb-12 scroll-mt-24">
                  <SectionHeader num={5} title="Conducta del usuario" />
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                    Te comprometes a utilizar la Plataforma de manera responsable y legal. Queda estrictamente prohibido:
                  </p>
                  <div className="space-y-3">
                    {termsData.badConduct.map((item, i) => (
                      <div key={i} className="flex gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)] text-sm">{item.title}</h3>
                          <p className="text-sm text-[var(--text-muted)] mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 6. Pagos */}
                <section id="payments" className="mb-12 scroll-mt-24">
                  <SectionHeader num={6} title="Pagos y suscripciones" />
                  <div className="space-y-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">6.1 Planes disponibles</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Tiyuy ofrece los siguientes planes: <strong>Básico</strong> (gratuito, incluye 3 publicaciones), <strong>Profesional</strong> (US$ 99/mes, incluye 15 publicaciones) y <strong>Empresarial</strong> (US$ 299/mes, publicaciones ilimitadas). Los desarrolladores inmobiliarios pueden acceder a un periodo de prueba (trial) empresarial de 30 días. Los detalles de cada plan, funcionalidades y límites se encuentran disponibles en nuestra página de planes. Los precios están expresados en moneda local (PEN/USD) e incluyen los impuestos aplicables.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">6.2 Facturación y renovación</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Las suscripciones de pago se facturan de forma periódica (mensual o anual) y se renuevan automáticamente salvo cancelación previa. Puedes cancelar tu suscripción en cualquier momento desde tu panel de configuración. La cancelación surtirá efecto al final del período facturado vigente.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">6.3 Política de reembolso</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Los pagos realizados son no reembolsables, salvo que se establezca lo contrario por ley o en casos excepcionales evaluados por nuestro equipo de soporte. Si tienes un problema con tu suscripción, contáctanos para buscar una solución.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">6.4 Pasarelas de pago</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Los pagos se procesan a través de pasarelas de pago certificadas PCI-DSS (MercadoPago y Culqi). Los datos de tu tarjeta son tokenizados por estas plataformas y no son almacenados en nuestros servidores.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 7. Propiedad intelectual */}
                <section id="ip" className="mb-12 scroll-mt-24">
                  <SectionHeader num={7} title="Propiedad intelectual" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">De Tiyuy</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Todo el contenido de la Plataforma (logo, diseño, código, textos, gráficos, marcas) es propiedad de Tiyuy y está protegido por leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa.
                      </p>
                    </div>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">Del usuario</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Al publicar contenido (fotos, descripciones), conservas tu propiedad pero nos otorgas una licencia no exclusiva para mostrar, distribuir y promocionar dicho contenido dentro de la Plataforma y sus canales de marketing.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 8. Limitación de responsabilidad */}
                <section id="liability" className="mb-12 scroll-mt-24">
                  <SectionHeader num={8} title="Limitación de responsabilidad" />
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-900 mb-2">Importante</h3>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          Tiyuy actúa como intermediario tecnológico entre publicantes e interesados. <strong>No somos parte</strong> en las transacciones inmobiliarias que se realizan a través de la Plataforma. No garantizamos la exactitud de la información publicada ni la legitimidad de las transacciones entre usuarios.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed mt-6">
                    En la máxima medida permitida por la ley, Tiyuy no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso de la Plataforma, incluyendo pero no limitándose a pérdidas económicas, interrupción del negocio o pérdida de datos.
                  </p>
                </section>

                {/* 9. Terminación */}
                <section id="termination" className="mb-12 scroll-mt-24">
                  <SectionHeader num={9} title="Terminación del servicio" />
                  <div className="space-y-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">9.1 Por el usuario</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Puedes cancelar tu cuenta en cualquier momento desde la configuración de tu perfil o solicitándolo a nuestro equipo de soporte. Tras la cancelación, tus datos serán tratados conforme a nuestra Política de Privacidad.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">9.2 Por Tiyuy</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Nos reservamos el derecho de suspender o terminar tu acceso a la Plataforma, sin previo aviso, si incumples estos Términos, realizas actividades fraudulentas, o si lo requiere una autoridad competente.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">9.3 Efectos de la terminación</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Tras la terminación, tus publicaciones serán eliminadas o desactivadas. Las obligaciones y limitaciones de responsabilidad establecidas en estos Términos sobrevivirán a la terminación de tu cuenta.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 10. Modificaciones */}
                <section id="changes" className="mb-12 scroll-mt-24">
                  <SectionHeader num={10} title="Modificaciones de los Términos" />
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Tiyuy puede modificar estos Términos en cualquier momento. Notificaremos a los usuarios registrados sobre cambios significativos mediante un aviso en la Plataforma o por correo electrónico. Te recomendamos revisar periódicamente esta página. El uso continuado de la Plataforma después de la publicación de modificaciones constituye tu aceptación de los nuevos Términos.
                  </p>
                </section>

                {/* 11. Legislación */}
                <section id="law" className="mb-12 scroll-mt-24">
                  <SectionHeader num={11} title="Legislación aplicable y jurisdicción" />
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                    Estos Términos se rigen por las leyes de la República del Perú. Cualquier controversia derivada de la interpretación o ejecución de estos Términos será sometida a la jurisdicción exclusiva de los jueces y tribunales de Lima, Perú.
                  </p>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <p className="text-sm text-green-800">
                      <strong>Resolución de conflictos:</strong> En caso de disputa, ambas partes se comprometen a intentar una solución amistosa antes de acudir a vías judiciales. También puedes presentar reclamos ante el Instituto Nacional de Defensa de la Competencia y de la Protección de la Propiedad Intelectual (INDECOPI).
                    </p>
                  </div>
                </section>

                {/* 12. Contacto */}
                <section id="contact" className="mb-12 scroll-mt-24">
                  <SectionHeader num={12} title="Contacto" />
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                    Si tienes preguntas sobre estos Términos de Servicio, contáctanos:
                  </p>
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <p className="text-green-100 text-xs uppercase tracking-wider mb-1">Email</p>
                        <a href="mailto:legal@tiyuy.com" className="font-semibold hover:underline">legal@tiyuy.com</a>
                      </div>
                      <div>
                        <p className="text-green-100 text-xs uppercase tracking-wider mb-1">Dirección</p>
                        <p className="font-semibold">Lima, Perú</p>
                      </div>
                      <div>
                        <p className="text-green-100 text-xs uppercase tracking-wider mb-1">Horario de atención</p>
                        <p className="font-semibold">Lun - Vie, 9:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-[var(--bg-card)] shadow-xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-bold text-[var(--text-primary)]">Contenido</p>
              <button onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
