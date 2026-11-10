
import {
  FileText,
  Heart,
  HeartHandshake,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Highlight {
  value: string;
  label: string;
}

export const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Confianza y transparencia',
    description:
      'Promovemos interacciones inmobiliarias basadas en información clara y relaciones responsables.',
  },
  {
    icon: FileText,
    title: 'Procesos sencillos',
    description:
      'Simplificamos la publicación y búsqueda de propiedades mediante herramientas digitales intuitivas.',
  },
  {
    icon: Heart,
    title: 'Accesibilidad para todos',
    description:
      'Buscamos reducir las barreras que dificultan la participación en el mercado inmobiliario.',
  },
  {
    icon: HeartHandshake,
    title: 'Cercanía humana',
    description:
      'Desarrollamos experiencias que ponen las necesidades de las personas en el centro.',
  },
];

export const highlights: Highlight[] = [
  { value: 'Perú', label: 'Nuestro origen' },
  { value: 'Personas', label: 'Nuestra prioridad' },
  { value: 'Tecnología', label: 'Nuestro medio de transformación' },
];

export const story = {
  image:
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
  alt: 'Interior de una vivienda contemporánea con iluminación natural y materiales cálidos',
  caption: 'Origen / Propósito / Futuro',
  code: 'O-04 / NUESTRA HISTORIA',
  quote:
    'TIYUY nace de una idea: hacer que encontrar, ofrecer y conectar con un espacio para vivir sea una experiencia más sencilla, accesible y transparente.',
  note:
    'Desarrollamos tecnología pensando en las personas, conectando necesidades inmobiliarias con soluciones digitales.',
};
