'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const INSPIRATION_SECTIONS = [
  {
    title: 'En Venta',
    links: [
      { label: 'Casas', href: '/sale/casas/peru' },
      { label: 'Departamentos', href: '/sale/departamentos/peru' },
      { label: 'Terrenos', href: '/sale/terrenos/peru' },
      { label: 'Oficinas', href: '/sale/oficinas/peru' },
      { label: 'Locales Comerciales', href: '/sale/locales/peru' },
    ],
  },
  {
    title: 'En Alquiler',
    links: [
      { label: 'Casas', href: '/rent/casas/peru' },
      { label: 'Departamentos', href: '/rent/departamentos/peru' },
      { label: 'Habitaciones', href: '/rent/habitaciones/peru' },
      { label: 'Locales Comerciales', href: '/rent/locales/peru' },
      { label: 'Oficinas', href: '/rent/oficinas/peru' },
    ],
  },
];

const FOOTER_COLUMNS = [
  {
    title: 'Asistencia',
    links: [
      { label: 'Opciones de seguridad', href: '/seguridad' },
      { label: 'Nuestra política antidiscriminación', href: '/antidiscriminacion' },
      { label: 'Apoyo a personas con discapacidad', href: '/discapacidad' },
      { label: 'Opciones de cancelación', href: '/cancelacion' },
      { label: 'Libro de Reclamaciones', href: '/libro-de-reclamaciones' },
      { label: 'Políticas de Cambio o Devoluciones', href: '/politicas-de-cambio' },

      { label: 'Centro de Soporte', href: '/soporte' },
    ],
  },
  {
    title: 'Descubre TIYUY',
    links: [
      { label: 'Publicar tu inmueble', href: '/my-properties/new' },
      { label: 'TIYUY para Inmobiliarias', href: '/inmobiliarias' },
      { label: 'TIYUY para Corredores', href: '/corredores' },
      { label: 'Blog inmobiliario', href: '/blog' },
      { label: 'Servicios', href: '/servics' },
    ],
  },
  {
    title: 'Acerca de nosotros',
    links: [
      { label: 'Por qué elegir TIYUY', href: '/about-tiyuy' },
      { label: 'Trabaja con nosotros', href: '/trabaja-con-nosotros' },
      { label: 'Inversores', href: '/inversores' },
      { label: 'Noticias y comunicados', href: '/noticias' },
      { label: 'Impacto comunitario', href: '/impacto-comunitario' },
      { label: 'Contacto', href: '/contact' },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    href: 'https://www.instagram.com/tiyuyperu/',
    icon: 'fa6-brands:instagram',
    label: 'Instagram',
    hoverBg: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]',
  },
  {
    href: 'https://web.facebook.com/profile.php?id=61592199742048',
    icon: 'fa6-brands:facebook',
    label: 'Facebook',
    hoverBg: 'hover:bg-[#1877F2]',
  },
  {
    href: 'https://x.com/tiyuy6y',
    icon: 'fa6-brands:x-twitter',
    label: 'X (Twitter)',
    hoverBg: 'hover:bg-[#000000]',
  },

  {
    href: 'https://www.tiktok.com/@tiyuyperu_oficial',
    icon: 'fa6-brands:tiktok',
    label: 'TikTok',
    hoverBg: 'hover:bg-[#000000]',
  },
  {
    href: 'https://www.youtube.com/@TiyuyTiyuy-r8s',
    icon: 'fa6-brands:youtube',
    label: 'YouTube',
    hoverBg: 'hover:bg-[#FF0000]',
  },

  {
    href: 'https://www.linkedin.com/company/143109038/admin/dashboard/',
    icon: 'fa6-brands:linkedin',
    label: 'LinkedIn',
    hoverBg: 'hover:bg-[#0077B5]',
  },

];

export function Footer() {
  return (
    <footer className="w-full mt-12 bg-[#111111] text-gray-400 font-sans border-t border-white/5">
      {/* Top section: Brand + Links */}
      <div className="w-full px-6 md:px-8 xl:px-16 max-w-[1920px] mx-auto py-16 lg:py-20 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-10 gap-y-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-10">
            <Link 
              href="/" 
              className="relative inline-flex mb-8 group/logo"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
               {/* Efecto de resplandor (glow) de fondo */}
               <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4A9A3E] to-emerald-400 rounded-xl blur opacity-30 group-hover/logo:opacity-60 transition duration-500"></div>
               {/* Contenedor del logo */}
               <div className="relative bg-white p-1 rounded-lg shadow-xl flex items-center justify-center transform group-hover/logo:-translate-y-1 transition duration-300">
                 <img
                  src="/assets/images/logo.svg"
                   alt="TIYUY"
                   className="h-12 sm:h-14 w-auto object-contain"
                 />
               </div>
            </Link>
            <p className="text-[14px] leading-relaxed text-gray-400 mb-8 max-w-sm">
              Tu plataforma inmobiliaria de confianza. Encuentra, vende o alquila tu propiedad ideal de forma rápida, segura y sin complicaciones.
            </p>
            
            <div className="space-y-4 text-[14px]">
              <a href="mailto:tiyuy@saberoconsulting.com" className="flex items-center gap-3 hover:text-white transition-colors group w-fit">
                <div className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#4A9A3E]/10 group-hover:border-[#4A9A3E]/30 group-hover:text-[#4A9A3E] transition-all">
                   <Icon icon="lucide:mail" width="16" />
                </div>
                <span>tiyuy@saberoconsulting.com</span>
              </a>
              <a href="tel:+51923327532" className="flex items-center gap-3 hover:text-white transition-colors group w-fit">
                <div className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#4A9A3E]/10 group-hover:border-[#4A9A3E]/30 group-hover:text-[#4A9A3E] transition-all">
                   <Icon icon="lucide:phone" width="16" />
                </div>
                <span>+51 923 327 532</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-[15px] mb-6">Explorar</h3>
            {INSPIRATION_SECTIONS.map((section, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <p className="text-[#4A9A3E] text-[12px] font-bold uppercase tracking-wider mb-3">
                  {section.title}
                </p>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {FOOTER_COLUMNS.map((column, i) => (
            <div key={i} className="lg:col-span-1">
              <h3 className="text-white font-semibold text-[15px] mb-6">{column.title}</h3>
              <ul className="space-y-3.5">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label === 'Libro de Reclamaciones' ? (
                        <span className="flex items-center gap-2">
                          {link.label}
                          <img
                            src="/assets/images/libro_reclamaciones/libro_reclamaciones.png"
                            alt=""
                            className="w-10 h-10 object-contain shrink-0"
                          />
                        </span>
                      ) : (
                        link.label
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Middle section: Payments & Social */}
      <div className="w-full px-6 md:px-8 xl:px-16 max-w-[1920px] mx-auto py-10 border-b border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div>
            <p className="text-white font-medium text-[14px] mb-4">Métodos de pago aceptados</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors text-white text-[13px] font-medium px-4 py-2.5 rounded-xl">
                <Icon icon="simple-icons:mercadopago" width="20" className="text-[#009ee3]" />
                <span>Mercado Pago</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors text-white text-[13px] font-medium px-4 py-2.5 rounded-xl">
                <Icon icon="mdi:cellphone" width="20" className="text-[#a455df]" />
                <span>Yape / Plin</span>
              </div>
              <div className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors rounded-xl px-4 py-2.5 flex items-center justify-center">
                <Icon icon="logos:visa" width="34" height="20" />
              </div>
              <div className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors rounded-xl px-4 py-2.5 flex items-center justify-center">
                <Icon icon="logos:mastercard" width="28" height="20" />
              </div>
              <div className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors rounded-xl px-4 py-2.5 flex items-center justify-center">
                <Icon icon="logos:amex" width="28" height="20" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-white font-medium text-[14px] mb-4">Conecta con nosotros</p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`size-11 rounded-full flex items-center justify-center text-gray-400 bg-white/5 border border-white/10 hover:text-white hover:border-transparent transition-all duration-300 ${social.hoverBg}`}
                >
                  <Icon icon={social.icon} width="18" height="18" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section: Legal */}
      <div className="w-full px-6 md:px-8 xl:px-16 max-w-[1920px] mx-auto py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-gray-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2">
            <span>© {new Date().getFullYear()} Tiyuy, Inc. Todos los derechos reservados.</span>
            <span className="hidden sm:inline text-gray-700">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <span className="hidden sm:inline text-gray-700">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <span className="hidden sm:inline text-gray-700">|</span>
            <Link href="/#mapa" className="hover:text-white transition-colors">Mapa del sitio</Link>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button className="flex items-center gap-2 hover:text-white transition-colors focus:outline-none">
              <Icon icon="lucide:globe" width="15" height="15" />
              <span>Español (PE)</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none">
              <span className="text-gray-400">S/</span>
              <span>PEN</span>
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
