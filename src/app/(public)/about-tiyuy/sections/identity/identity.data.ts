
import {
  HeartHandshake,
  Lightbulb,
  Shield,
  Users2,
  type LucideIcon,
} from 'lucide-react';

export interface Purpose {
  id: 'mision' | 'vision';
  title: string;
  description: string;
  keywords: string[];
}

export interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const purposes: Purpose[] = [
  {
    id: 'mision',
    title: 'Nuestra misión',
    description:
      'Transformar la experiencia inmobiliaria en el Perú mediante una plataforma digital accesible, intuitiva y transparente que facilite la conexión entre personas, propietarios y agentes, eliminando barreras en la búsqueda y publicación de propiedades.',
    keywords: ['Accesibilidad', 'Transparencia', 'Conectividad'],
  },
  {
    id: 'vision',
    title: 'Nuestra visión',
    description:
      'Convertirnos en un referente de innovación inmobiliaria en Latinoamérica, transformando la manera en que las personas descubren, ofrecen y conectan con espacios para vivir, mediante tecnología diseñada alrededor de sus necesidades.',
    keywords: ['Innovación', 'Transformación', 'Proyección global'],
  },
];

export const identityMedia = {
  image:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
  alt: 'Interior residencial contemporáneo con materiales naturales, iluminación cálida y arquitectura moderna',
  caption: 'Arquitectura / Personas / Futuro',
};

export const values: Value[] = [
  {
    icon: Shield,
    title: 'Confianza',
    description:
      'Promovemos relaciones inmobiliarias basadas en la transparencia, la responsabilidad y la seguridad durante cada interacción.',
  },
  {
    icon: Users2,
    title: 'Inclusión',
    description:
      'Creemos que todas las personas deben tener oportunidades de acceder a herramientas que faciliten su participación en el mercado inmobiliario.',
  },
  {
    icon: Lightbulb,
    title: 'Innovación',
    description:
      'Aplicamos tecnología y pensamiento creativo para desarrollar experiencias inmobiliarias más simples, eficientes y accesibles.',
  },
  {
    icon: HeartHandshake,
    title: 'Compromiso',
    description:
      'Trabajamos para comprender las necesidades de nuestros usuarios y mejorar continuamente los servicios y experiencias que ofrecemos.',
  },
];
