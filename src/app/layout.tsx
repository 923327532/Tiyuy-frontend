import type { Metadata } from 'next';
import { Hind } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';

const hind = Hind({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const baseUrl = 'https://tiyuy.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'TIYUY - Encuentra tu hogar ideal en Perú',
    template: '%s | TIYUY - Bienes Raíces en Perú',
  },
  description:
    'TIYUY es la plataforma líder de bienes raíces en Perú. Encuentra departamentos, casas, terrenos y locales en venta y alquiler en Lima, Arequipa, Trujillo y todo el Perú. Publica tu propiedad gratis.',
  keywords: [
    'bienes raíces Perú',
    'departamentos en venta Lima',
    'casas en alquiler Perú',
    'terrenos en venta',
    'propiedades Perú',
    'inmobiliaria',
    'alquiler de departamentos',
    'venta de casas',
    'TIYUY',
    'plataforma inmobiliaria',
    'publicar propiedad gratis',
  ],
  applicationName: 'TIYUY',
  authors: [{ name: 'TIYUY' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: 'TIYUY',
  publisher: 'TIYUY',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: 'TIYUY',
    url: baseUrl,
    title: 'TIYUY - Encuentra tu hogar ideal en Perú',
    description:
      'Plataforma líder de bienes raíces en Perú. Departamentos, casas, terrenos y locales en venta y alquiler.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TIYUY - Bienes Raíces',
      },
    ],
    countryName: 'Perú',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIYUY - Encuentra tu hogar ideal en Perú',
    description:
      'Plataforma líder de bienes raíces en Perú. Departamentos, casas, terrenos y locales en venta y alquiler.',
    images: ['/og-image.png'],
    creator: '@tiyuy',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'es-PE': baseUrl,
    },
  },
  category: 'bienes raíces',
  classification: 'Bienes Raíces, Inmobiliaria, Propiedades',
  icons: {
    icon: '/tiyuy.ico',
    apple: '/tiyuy.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'TIYUY',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  abstract:
    'TIYUY es la plataforma de bienes raíces que conecta a compradores, vendedores e inquilinos con las mejores propiedades de todo el Perú.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateOrganization',
  name: 'TIYUY',
  url: baseUrl,
  logo: `${baseUrl}/tiyuy.svg`,
  description:
    'Plataforma líder de bienes raíces en Perú. Encuentra y publica propiedades en venta y alquiler.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PE',
  },
  sameAs: [],
  areaServed: [
    {
      '@type': 'Country',
      name: 'Perú',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* 
          MercadoPago SDK se carga con 'async' y solo cuando se necesita.
          remove-before-adding payment pages import dynamicly using next/dynamic 
        */}
        <script
          defer
          data-mercadopago="sdk"
          src="https://sdk.mercadopago.com/js/v2"
        />
      </head>
      <body className={hind.className} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
