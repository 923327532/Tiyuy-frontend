import { Metadata } from 'next';
import './about.css';
import { HeroSection } from './sections/hero';
import { IdentitySection } from './sections/identity';
import { ProblemSection } from './sections/problem';
import { StorySection } from './sections/story';
import { ImpactSection } from './sections/impact';
import { CommitmentSection } from './sections/commitment';
import { ReadingProgress } from './ui';

export const metadata: Metadata = {
  title: 'Sobre TIYUY | Plataforma de Bienes Raíces en Perú',
  description:
    'Conoce TIYUY, la plataforma líder de bienes raíces en Perú. Transformamos el mercado inmobiliario peruano con tecnología innovadora y accesible para todos.',
  keywords: [
    'TIYUY',
    'bienes raíces Perú',
    'plataforma inmobiliaria',
    'comprar casa Perú',
    'alquilar departamento Lima',
    'inmobiliaria digital',
  ],
  openGraph: {
    title: 'Sobre TIYUY | Plataforma de Bienes Raíces en Perú',
    description:
      'Transformando el mercado inmobiliario peruano. Publica tu propiedad en 5 minutos.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'TIYUY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre TIYUY | Plataforma de Bienes Raíces',
    description: 'Transformando el mercado inmobiliario peruano',
  },
  alternates: {
    canonical: 'https://tiyuy.com/about-tiyuy',
  },
};

export default function AboutPage() {
  return (
    <main className="about-tiyuy min-h-screen antialiased">
      <ReadingProgress />
      <HeroSection />
      <IdentitySection />
      <ProblemSection />
      <StorySection />
      <ImpactSection />
      <CommitmentSection />
    </main>
  );
}
