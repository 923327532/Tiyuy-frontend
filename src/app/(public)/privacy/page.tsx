'use client';

import { useState } from 'react';
import {
  Shield, User, Building2, BarChart3, CreditCard,
  CheckCircle, Zap, Mail, ShieldCheck, Sliders,
  Check, Menu, X, MessageCircle, Users, Heart, Database, Globe
} from 'lucide-react';

const privacyData = {
  lastUpdated: "1 de agosto de 2026",
  intro: {
    title: "Introducción",
    highlight: 'Tiyuy ("nosotros", "nuestra" o "la Plataforma") es una plataforma digital peruana que conecta a compradores, vendedores, arrendadores, arrendatarios, agentes inmobiliarios, inmobiliarias y desarrolladores de bienes raíces. Esta Política de Privacidad describe cómo tratamos tus datos personales cuando utilizas nuestros servicios.',
    paragraphs: [
      "Cumplimos con la Ley N° 29733, Ley de Protección de Datos Personales del Perú, su reglamento y las normas sectoriales aplicables, así como los principios del Reglamento General de Protección de Datos (RGPD) de la Unión Europea cuando corresponda.",
      "Al crear tu cuenta o utilizar nuestros servicios, aceptas el tratamiento de tus datos personales conforme a esta política. Si no estás de acuerdo, te pedimos que no utilices la Plataforma."
    ]
  },
  categories: [
    {
      title: "Datos de identificación y contacto",
      desc: "Nombre, apellido, correo electrónico, número de teléfono, documento de identidad (DNI de 8 dígitos), RUC (11 dígitos, opcional), rol en la plataforma (usuario, agente, desarrollador, inmobiliaria o administrador), fotografía de perfil y datos de registro de cuenta.",
      iconType: "user"
    },
    {
      title: "Datos de propiedades y proyectos",
      desc: "Información de inmuebles y proyectos publicados: dirección, características, precio y moneda (PEN/USD), tipo, área, dormitorios, baños, estacionamiento, antigüedad, ubicación y coordenadas, servicios, fotografías (hasta 20 por propiedad), video tour, renders, planos y documentos (permisos de construcción y licencias).",
      iconType: "property"
    },
    {
      title: "Datos de uso y navegación",
      desc: "Direcciones IP, tipo de navegador, páginas visitadas, tiempo de permanencia, clics, búsquedas realizadas (tipo de propiedad, tipo de transacción, distrito, rango de precios, dormitorios, baños), interacciones con publicaciones, preferencias de navegación y tipo de dispositivo (escritorio, móvil o tablet).",
      iconType: "navigation"
    },
    {
      title: "Datos de verificación de identidad (KYC)",
      desc: "DNI, RUC y documentos de identidad que subes durante el proceso de verificación de identidad (KYC). Se validan contra fuentes oficiales a través de nuestros servicios para prevenir fraudes y garantizar la seguridad de la Plataforma.",
      iconType: "kyc"
    },
    {
      title: "Datos de comunicación",
      desc: "Mensajes de chat en tiempo real (vía WebSocket), posts de canales, eventos con confirmación de asistencia (RSVP), comentarios con respuestas anidadas, estados o historias con expiración de 24 horas, contactos y documentos o imágenes compartidos en la mensajería.",
      iconType: "message"
    },
    {
      title: "Datos de pagos y facturación",
      desc: "Información de transacciones, historial de pagos, suscripciones a planes, estado del periodo de prueba (trial), saldo de billetera y datos de facturación. No almacenamos datos completos de tarjetas de crédito; estos son procesados por pasarelas de pago certificadas PCI-DSS (MercadoPago y Culqi) mediante tokenización.",
      iconType: "payment"
    },
    {
      title: "Datos de gestión comercial y CRM",
      desc: "Leads (nuevo, contactado, calificado, negociación, cerrado), interacciones con clientes, calificaciones, historial de actividad y métricas de engagement (interactionScore, engagementRate) para agentes, inmobiliarias y desarrolladores.",
      iconType: "crm"
    },
    {
      title: "Datos de favoritos y preferencias",
      desc: "Propiedades y proyectos favoritos, notas personalizadas (máximo 500 caracteres), preferencias de búsqueda, preferencias de notificaciones y configuración de la cuenta.",
      iconType: "favorite"
    }
  ],
  tracking: [
    { title: "Vistas de propiedades", desc: "Cada vez que ves una propiedad registramos el identificador de la propiedad, la sesión, la referencia de origen (referrer), el agente de usuario (userAgent) y el tipo de dispositivo (escritorio, móvil o tablet)." },
    { title: "Búsquedas realizadas", desc: "Registramos cada búsqueda (tipo de propiedad, tipo de transacción, distrito, rango de precios, dormitorios, baños) para generar notificaciones automáticas de nuevas propiedades y mejorar las recomendaciones." },
    { title: "Actividad del usuario", desc: "Registramos tus actividades dentro de la Plataforma (vistas, contactos, favoritos, publicaciones) para estadísticas, informes y mejoras del servicio." },
    { title: "Asistente virtual (AI Copilot)", desc: "Cuando usas nuestro asistente, recopilamos tus mensajes, la ruta actual dentro de la Plataforma, el historial del chat, tu estado de autenticación y tu rol para poder responderte y ayudarte a navegar." },
    { title: "Analítica administrativa", desc: "Los administradores pueden acceder a métricas globales, actividad de los usuarios y registros de auditoría (quién hizo qué y cuándo) para garantizar la seguridad y el correcto funcionamiento de la Plataforma." }
  ],
  uses: [
    { icon: "CheckCircle", title: "Prestar servicios", desc: "Gestionar tu cuenta, publicar propiedades y proyectos, facilitar conexiones entre usuarios y la mensajería en tiempo real" },
    { icon: "Zap", title: "Mejorar la plataforma", desc: "Analizar el uso para optimizar funcionalidades, rendimiento, mapas y experiencia de usuario" },
    { icon: "Mail", title: "Comunicaciones y notificaciones", desc: "Enviar notificaciones, alertas de nuevas propiedades según tus búsquedas guardadas, actualizaciones y soporte" },
    { icon: "Shield", title: "Seguridad y verificación", desc: "Prevenir fraudes, verificar identidades (DNI/RUC/KYC) y proteger la integridad de la Plataforma" },
    { icon: "BarChart3", title: "Análisis y recomendaciones", desc: "Generar estadísticas anonimizadas, informes de mercado (Market Radar) y recomendaciones personalizadas" },
    { icon: "Sliders", title: "Cumplimiento legal", desc: "Cumplir con obligaciones legales y regulatorias, incluyendo el Libro de Reclamaciones, y responder a autoridades" }
  ],
  shares: [
    { title: "Proveedores de servicios", desc: "Empresas que nos ayudan a operar la Plataforma (hosting, análisis, pasarelas de pago, envío de emails, geolocalización, autenticación), bajo estrictos acuerdos de confidencialidad." },
    { title: "Entre usuarios", desc: "Cuando publicas una propiedad o proyecto, ciertos datos (nombre, foto de perfil, teléfono) son visibles para otros usuarios interesados en contactarte." },
    { title: "Obligación legal", desc: "Cuando lo requiera la ley, una autoridad competente o para proteger los derechos y seguridad de Tiyuy y sus usuarios." },
    { title: "Transacciones comerciales", desc: "En caso de fusión, adquisición o venta de activos, tus datos podrían ser transferidos como parte de la operación, manteniendo las garantías de privacidad." }
  ],
  cookies: [
    { type: "Esenciales", purpose: "Funcionamiento básico de la Plataforma (sesión, autenticación)", duration: "Sesión" },
    { type: "Analíticas", purpose: "Entender cómo usas la Plataforma para mejorar el servicio", duration: "Hasta 2 años" },
    { type: "Funcionales", purpose: "Recordar preferencias (idioma, moneda, ubicación)", duration: "Hasta 1 año" },
    { type: "Marketing", purpose: "Mostrar anuncios relevantes y medir campañas", duration: "Hasta 6 meses" }
  ],
  storage: [
    { type: 'localStorage', name: 'tiyuy-auth-token', desc: 'Token de acceso (JWT) para mantener tu sesión iniciada' },
    { type: 'localStorage', name: 'tiyuy-user', desc: 'Datos básicos del usuario para personalizar la experiencia' },
    { type: 'localStorage', name: 'tiyuy-auth-store', desc: 'Estado de autenticación, rol, permisos y datos de sesión' },
    { type: 'localStorage', name: 'Stores de preferencias', desc: 'Favoritos, perfil, onboarding, KYC, identidad, mapas y vista de mapa' },
    { type: 'Cookie', name: 'jwt', desc: 'Token JWT de autenticación (vigencia de 1 día, SameSite=Lax)' }
  ],
  externalServices: [
    { name: 'Backend API de Tiyuy', purpose: 'Almacenamiento de todos los datos de negocio de la Plataforma', privacy: 'Servidores de Tiyuy' },
    { name: 'Firebase (Google)', purpose: 'Autenticación con correo/contraseña y con Google, y base de datos Firestore', privacy: 'Google Cloud' },
    { name: 'Google Places', purpose: 'Autocompletado de direcciones y geolocalización en búsquedas', privacy: 'Google' },
    { name: 'MercadoPago', purpose: 'Procesamiento de pagos en línea y tokenización de tarjetas', privacy: 'MercadoLibre' },
    { name: 'Culqi', purpose: 'Procesamiento de pagos en línea y tokenización de tarjetas', privacy: 'Culqi Perú' },
    { name: 'Brevo (Sendinblue)', purpose: 'Envío de correos electrónicos: bienvenida, recuperación de contraseña y notificaciones', privacy: 'Brevo' },
    { name: 'WebSocket', purpose: 'Mensajería en tiempo real dentro de la Plataforma', privacy: 'Infraestructura de Tiyuy' },
    { name: 'Notificaciones Push', purpose: 'Envío de notificaciones push en tu navegador (VAPID)', privacy: 'Infraestructura de Tiyuy' },
    { name: 'LLM (DeepSeek)', purpose: 'Asistente virtual AI Copilot para ayudarte a navegar la Plataforma', privacy: 'DeepSeek' }
  ],
  securityMeasures: [
    "Cifrado SSL/TLS para todas las comunicaciones",
    "Almacenamiento de contraseñas con hash seguro (bcrypt)",
    "Tokenización de datos de pago mediante pasarelas certificadas PCI-DSS",
    "Acceso restringido a datos personales (principio de mínimo privilegio)",
    "Verificación de identidad (KYC) para prevenir fraudes y suplantación",
    "Monitoreo continuo y detección de actividades sospechosas",
    "Registros de auditoría de las acciones administrativas",
    "Copias de seguridad cifradas y protocolos de recuperación"
  ],
  rights: [
    { title: "Acceso", desc: "Solicitar una copia de los datos que tenemos sobre ti" },
    { title: "Rectificación", desc: "Corregir datos inexactos o incompletos" },
    { title: "Supresión", desc: "Solicitar la eliminación de tus datos personales" },
    { title: "Oposición", desc: "Oponerte al tratamiento de tus datos para ciertos fines" },
    { title: "Portabilidad", desc: "Recibir tus datos en formato estructurado y transferirlos" },
    { title: "Limitación", desc: "Solicitar la restricción del tratamiento de tus datos" }
  ]
};

const SECTIONS = [
  { id: 'intro', title: 'Introducción' },
  { id: 'data-collect', title: 'Datos que recopilamos' },
  { id: 'data-tracking', title: 'Recopilación y tracking' },
  { id: 'data-use', title: 'Uso de la información' },
  { id: 'data-share', title: 'Compartir datos' },
  { id: 'cookies', title: 'Cookies y almacenamiento' },
  { id: 'external-services', title: 'Servicios externos' },
  { id: 'security', title: 'Seguridad' },
  { id: 'rights', title: 'Tus derechos' },
  { id: 'retention', title: 'Retención de datos' },
  { id: 'minors', title: 'Menores de edad' },
  { id: 'changes', title: 'Cambios en la política' },
  { id: 'contact', title: 'Contacto' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  CheckCircle, Zap, Mail, Shield, BarChart3, Sliders
};

const CategoryIcon = ({ type }: { type: string }) => {
  const baseClass = "w-5 h-5 text-green-600";
  switch (type) {
    case 'user':
      return <User className={baseClass} strokeWidth={1.5} />;
    case 'property':
      return <Building2 className={baseClass} strokeWidth={1.5} />;
    case 'navigation':
      return <BarChart3 className={baseClass} strokeWidth={1.5} />;
    case 'kyc':
      return <ShieldCheck className={baseClass} strokeWidth={1.5} />;
    case 'message':
      return <MessageCircle className={baseClass} strokeWidth={1.5} />;
    case 'payment':
      return <CreditCard className={baseClass} strokeWidth={1.5} />;
    case 'crm':
      return <Users className={baseClass} strokeWidth={1.5} />;
    case 'favorite':
      return <Heart className={baseClass} strokeWidth={1.5} />;
    default:
      return null;
  }
};

const SectionHeader = ({ num, title }: { num: number; title: string }) => (
  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
      {num}
    </span>
    {title}
  </h2>
);

export default function PrivacyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-card)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-primary)]/[0.02] border-b border-[var(--border-light)] transition-colors duration-300">
        <div className="w-full px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto py-8 sm:py-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[var(--brand-primary)]" strokeWidth={2} />
                <span className="text-sm font-bold text-[var(--brand-primary)] uppercase tracking-wider">
                  Política de Privacidad
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-4">
                Tu privacidad es nuestra prioridad
              </h1>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                En Tiyuy nos comprometemos a proteger tus datos personales. Esta política explica de manera transparente cómo recopilamos, usamos y protegemos tu información.
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]/60 mt-6 font-medium tracking-wide">
                Última actualización: {privacyData.lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto py-8 sm:py-12">
            <div className="flex gap-8 lg:gap-12">

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

              {/* Mobile Nav Button */}
              <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Menu className="w-5 h-5" strokeWidth={2} />
                  )}
                </button>
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

              {/* Main Content */}
              <main className="flex-1 min-w-0 max-w-4xl">
                <div className="prose prose-lg max-w-none">

                  {/* 1. Introducción */}
                  <section id="intro" className="mb-12 scroll-mt-24">
                    <SectionHeader num={1} title={privacyData.intro.title} />
                    <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
                      <p className="text-[var(--text-primary)] leading-relaxed">{privacyData.intro.highlight}</p>
                    </div>
                    {privacyData.intro.paragraphs.map((text, index) => (
                      <p key={index} className="text-[var(--text-secondary)] leading-relaxed mb-4">{text}</p>
                    ))}
                  </section>

                  {/* 2. Datos que recopilamos */}
                  <section id="data-collect" className="mb-12 scroll-mt-24">
                    <SectionHeader num={2} title="Datos que recopilamos" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      Recopilamos únicamente los datos necesarios para brindarte nuestros servicios. Estos se clasifican en las siguientes categorías:
                    </p>
                    <div className="space-y-4">
                      {privacyData.categories.map((cat, i) => (
                        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                          <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                            <CategoryIcon type={cat.iconType} />
                            {cat.title}
                          </h3>
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{cat.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 3. Recopilación y tracking */}
                  <section id="data-tracking" className="mb-12 scroll-mt-24">
                    <SectionHeader num={3} title="Recopilación de datos y tracking" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      Además de los datos que nos proporcionas, la Plataforma recopila automáticamente información sobre tu comportamiento para analytics, notificaciones automáticas y mejoras del producto:
                    </p>
                    <div className="space-y-3">
                      {privacyData.tracking.map((item, i) => (
                        <div key={i} className="flex gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
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

                  {/* 4. Uso de la información */}
                  <section id="data-use" className="mb-12 scroll-mt-24">
                    <SectionHeader num={4} title="Uso de la información" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      Utilizamos tus datos personales exclusivamente para las siguientes finalidades:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {privacyData.uses.map((item, i) => {
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

                  {/* 5. Compartir datos */}
                  <section id="data-share" className="mb-12 scroll-mt-24">
                    <SectionHeader num={5} title="Compartir datos con terceros" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      <strong>No vendemos tus datos personales.</strong> Solo compartimos información en los siguientes casos:
                    </p>
                    <div className="space-y-3">
                      {privacyData.shares.map((item, i) => (
                        <div key={i} className="flex gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
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

                  {/* 6. Cookies y almacenamiento */}
                  <section id="cookies" className="mb-12 scroll-mt-24">
                    <SectionHeader num={6} title="Cookies y almacenamiento local" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Puedes configurar tu navegador para rechazar cookies, aunque esto podría afectar algunas funcionalidades. Además, utilizamos almacenamiento local del navegador para mantener tu sesión y preferencias.
                    </p>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border border-[var(--border-color)] rounded-xl overflow-hidden">
                        <thead>
                          <tr className="bg-[var(--bg-secondary)]">
                            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)]">Tipo</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)]">Finalidad</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)]">Duración</th>
                          </tr>
                        </thead>
                        <tbody>
                          {privacyData.cookies.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-secondary)]/50'}>
                              <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)] border-b border-[var(--border-light)]">{row.type}</td>
                              <td className="px-4 py-3 text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">{row.purpose}</td>
                              <td className="px-4 py-3 text-sm text-[var(--text-muted)] border-b border-[var(--border-light)]">{row.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={1.5} />
                      <h3 className="font-semibold text-[var(--text-primary)]">Almacenamiento local del navegador</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-[var(--border-color)] rounded-xl overflow-hidden">
                        <thead>
                          <tr className="bg-[var(--bg-secondary)]">
                            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)]">Tipo</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)]">Clave</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)]">Contenido</th>
                          </tr>
                        </thead>
                        <tbody>
                          {privacyData.storage.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-secondary)]/50'}>
                              <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)] border-b border-[var(--border-light)]">{row.type}</td>
                              <td className="px-4 py-3 text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">{row.name}</td>
                              <td className="px-4 py-3 text-sm text-[var(--text-muted)] border-b border-[var(--border-light)]">{row.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* 7. Servicios externos */}
                  <section id="external-services" className="mb-12 scroll-mt-24">
                    <SectionHeader num={7} title="Servicios externos e integraciones" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      Para operar la Plataforma utilizamos proveedores de servicios externos que tratan tus datos en nuestro nombre bajo acuerdos de confidencialidad y conforme a esta política:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {privacyData.externalServices.map((item, i) => (
                        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={1.5} />
                            <h3 className="font-semibold text-[var(--text-primary)] text-sm">{item.name}</h3>
                          </div>
                          <p className="text-sm text-[var(--text-muted)] mb-2">{item.purpose}</p>
                          <p className="text-xs text-[var(--text-secondary)]/60">Tratamiento: {item.privacy}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 8. Seguridad */}
                  <section id="security" className="mb-12 scroll-mt-24">
                    <SectionHeader num={8} title="Seguridad de tus datos" />
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Medidas de seguridad implementadas</h3>
                          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            {privacyData.securityMeasures.map((measure, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">✓</span>
                                {measure}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 9. Tus derechos */}
                  <section id="rights" className="mb-12 scroll-mt-24">
                    <SectionHeader num={9} title="Tus derechos" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      Asumiendo la titularidad de tus datos personales, tienes los siguientes derechos:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {privacyData.rights.map((right, i) => (
                        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4" strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] text-sm">{right.title}</h3>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{right.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-6">
                      Para ejercer cualquiera de estos derechos, contáctanos a <a href="mailto:privacidad@tiyuy.com" className="text-green-600 hover:underline">privacidad@tiyuy.com</a>. Responderemos tu solicitud en un plazo máximo de 15 días hábiles.
                    </p>
                  </section>

                  {/* 10. Retención */}
                  <section id="retention" className="mb-12 scroll-mt-24">
                    <SectionHeader num={10} title="Retención de datos" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                      Conservamos tus datos personales mientras tu cuenta esté activa y durante el tiempo necesario para cumplir con las finalidades descritas en esta política, incluyendo obligaciones legales y fiscales.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm text-amber-800">
                        <strong>Nota:</strong> Tras la eliminación de tu cuenta, algunos datos pueden conservarse de forma anonimizada para fines estadísticos o durante el plazo requerido por ley (mínimo 5 años para datos de transacciones).
                      </p>
                    </div>
                  </section>

                  {/* 11. Menores */}
                  <section id="minors" className="mb-12 scroll-mt-24">
                    <SectionHeader num={11} title="Menores de edad" />
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente datos personales de menores. Si descubrimos que un menor ha proporcionado datos personales, procederemos a eliminarlos de inmediato. Si eres padre o tutor y crees que tu hijo ha compartido información con nosotros, contáctanos.
                    </p>
                  </section>

                  {/* 12. Cambios */}
                  <section id="changes" className="mb-12 scroll-mt-24">
                    <SectionHeader num={12} title="Cambios en esta política" />
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestros servicios, tecnologías o requisitos legales. Te notificaremos sobre cambios significativos mediante un aviso en la plataforma o por correo electrónico. Te recomendamos revisar esta política regularmente.
                    </p>
                  </section>

                  {/* 13. Contacto */}
                  <section id="contact" className="mb-12 scroll-mt-24">
                    <SectionHeader num={13} title="Contacto" />
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      Si tienes preguntas, dudas o solicitudes sobre esta Política de Privacidad o el tratamiento de tus datos, puedes contactarnos:
                    </p>
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Email</p>
                          <a href="mailto:privacidad@tiyuy.com" className="font-semibold hover:underline">privacidad@tiyuy.com</a>
                        </div>
                        <div>
                          <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Dirección</p>
                          <p className="font-semibold">Lima, Perú</p>
                        </div>
                        <div>
                          <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Horario de atención</p>
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
      </div>
    </div> 
  );
}
