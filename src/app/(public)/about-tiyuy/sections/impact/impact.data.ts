
import {
  Building,
  CheckCircle,
  Home,
  ShieldCheck,
  PanelsTopLeft,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface Audience {
  id: 'owners' | 'families' | 'agents';
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: { label: string; href: string };
}

export interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const audiences: Audience[] = [
  {
    id: 'owners',
    icon: Home,
    title: 'Propietarios',
    description:
      'Facilitamos la publicación y gestión de propiedades mediante herramientas digitales sencillas que permiten conectar directamente con personas interesadas.',
    cta: { label: 'Publicar propiedad', href: '/my-properties/new' },
  },
  {
    id: 'families',
    icon: Users,
    title: 'Personas y familias',
    description:
      'Ayudamos a encontrar espacios que se adapten a sus necesidades, facilitando la búsqueda de viviendas y nuevas oportunidades para vivir.',
    cta: { label: 'Explorar propiedades', href: '/rent/departamentos/lima' },
  },
  {
    id: 'agents',
    icon: Building,
    title: 'Agentes inmobiliarios',
    description:
      'Ofrecemos herramientas digitales para organizar inventarios, gestionar publicaciones y ampliar las oportunidades de conexión con potenciales clientes.',
    cta: { label: 'Conocer nuestros planes', href: '/plans' },
  },
];

export const pillars: Pillar[] = [
  {
    icon: PanelsTopLeft,
    title: 'Experiencia intuitiva',
    description:
      'Una plataforma diseñada para simplificar la búsqueda, publicación y gestión de propiedades.',
  },
  {
    icon: CheckCircle,
    title: 'Accesibilidad inmobiliaria',
    description:
      'Facilitamos el acceso a herramientas digitales para propietarios, agentes y personas que buscan vivienda.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparencia y confianza',
    description:
      'Promovemos interacciones responsables y procesos claros durante la experiencia inmobiliaria.',
  },
];

export const stats: Stat[] = [
  { value: '3', label: 'Públicos a los que conectamos' },
  { value: '1', label: 'Plataforma inmobiliaria integrada' },
  { value: 'Perú', label: 'Nuestro punto de partida' },
];

export const impactMedia = {
  image:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
  alt: 'Arquitectura urbana contemporánea que representa el crecimiento y desarrollo de las ciudades',
};

export const commitmentValues = [
  'Confiable',
  'Humano',
  'Accesible',
  'Seguro',
  'Transparente',
];
