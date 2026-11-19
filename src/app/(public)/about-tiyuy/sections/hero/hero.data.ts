import {
  ShieldCheck,
  Zap,
  Banknote,
  type LucideIcon,
} from 'lucide-react';

export const HERO_CONFIG = {
  image:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=2400&auto=format&fit=crop',
  alt: 'Vivienda contemporánea con arquitectura moderna y luz natural al atardecer',
  parallaxSpeed: 0.06,
} as const;

export const HERO_COPY = {
  chip: 'DOSSIER / 01',
  location: 'PERÚ · TECNOLOGÍA INMOBILIARIA',
  lines: [
    'Transformamos el',
    'mercado inmobiliario',
    'peruano.',
  ],
  description:
    'Nacimos con una visión: transformar la experiencia inmobiliaria mediante tecnología, transparencia y soluciones centradas en las personas. Conectamos propietarios, agentes y personas que buscan un espacio para vivir.',
  primaryCta: {
    label: 'Conoce nuestro compromiso',
    href: '#compromiso',
  },
  secondaryCta: {
    label: 'Explora propiedades',
    href: '/',
  },
} as const;

export interface HeroHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
}

export const HERO_HIGHLIGHTS: readonly HeroHighlight[] = [
  {
    icon: ShieldCheck,
    title: 'Confianza y transparencia',
    description:
      'Promovemos conexiones inmobiliarias basadas en información clara y relaciones responsables.',
    accent: 'Confianza',
  },
  {
    icon: Zap,
    title: 'Experiencia sencilla',
    description:
      'Facilitamos la publicación y búsqueda de propiedades mediante herramientas digitales intuitivas.',
    accent: 'Innovación',
  },
  {
    icon: Banknote,
    title: 'Accesibilidad inmobiliaria',
    description:
      'Buscamos reducir las barreras económicas y digitales para participar en el mercado inmobiliario.',
    accent: 'Accesibilidad',
  },
] as const;

export const HERO_INDEX = [
  { code: 'A-01', label: 'Manifiesto', href: '#hero' },
  { code: 'A-02', label: 'ADN', href: '#adn' },
  { code: 'A-03', label: 'Diagnóstico', href: '#diagnostico' },
  { code: 'A-04', label: 'Origen', href: '#origen' },
  { code: 'A-05', label: 'Alcance', href: '#alcance' },
  { code: 'A-06', label: 'Compromiso', href: '#compromiso' },
] as const;

export const HERO_STATS = [
  { value: 'Perú', label: 'Nuestro mercado de origen' },
  { value: '3', label: 'Perfiles que conectamos' },
  { value: '1', label: 'Plataforma inmobiliaria' },
] as const;