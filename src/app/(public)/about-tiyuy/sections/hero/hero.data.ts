
import {
  ShieldCheck,
  Zap,
  Banknote,
  type LucideIcon,
} from 'lucide-react';

export const HERO_CONFIG = {
  image:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
  alt: 'Arquitectura residencial contemporánea con iluminación cálida al atardecer',
  parallaxSpeed: 0.08,
} as const;

export const HERO_COPY = {
  chip: 'Sobre TIYUY',
  location: 'Tecnología inmobiliaria · Perú',
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
  { code: 'A-01', label: 'ADN', href: '#adn' },
  { code: 'D-02', label: 'Diagnóstico', href: '#diagnostico' },
  { code: 'O-03', label: 'Origen', href: '#origen' },
  { code: 'A-04', label: 'Alcance', href: '#alcance' },
  { code: 'C-05', label: 'Compromiso', href: '#compromiso' },
] as const;
