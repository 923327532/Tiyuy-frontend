import { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/presentation/components/auth';
import { User, Home, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - TIYUY | Bienes Raíces en Perú',
  description: 'Inicia sesión en tu cuenta TIYUY y accede a la mejor plataforma de bienes raíces en Perú. Encuentra tu hogar ideal.',
  keywords: ['iniciar sesión tiyuy', 'login bienes raíces perú', 'cuenta tiyuy', 'acceso tiyuy'],
  openGraph: {
    title: 'Iniciar Sesión - TIYUY | Bienes Raíces en Perú',
    description: 'Accede a tu cuenta TIYUY y descubre las mejores propiedades en Perú.',
    type: 'website',
    locale: 'es_PE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iniciar Sesión - TIYUY | Bienes Raíces en Perú',
    description: 'Accede a tu cuenta TIYUY y descubre las mejores propiedades en Perú.',
  },
  robots: { index: true, follow: true },
};

const LOGIN_FEATURES = [
  { id: 'auth', text: 'Acceso personalizado', icon: <User size={18} /> },
  { id: 'exclusive', text: 'Propiedades exclusivas', icon: <Home size={18} /> },
  { id: 'security', text: 'Seguridad garantizada', icon: <Shield size={18} /> },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="flex flex-col lg:flex-row min-h-screen">

        <section className="lg:w-[45%] relative flex items-center justify-center p-8 lg:p-12 min-h-[40vh] lg:min-h-screen overflow-hidden">
          <Image src="/assets/images/login/login1.jpg"alt="Casas de lujo en Perú - TIYUY"fill priority className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 45vw"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          <div className="relative z-10 text-center text-white max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 drop-shadow-lg">
              Bienvenido a TIYUY
            </h1>
            <p className="text-xl mb-8 drop-shadow-lg">
              Inicia sesión y descubre las mejores propiedades en Perú
            </p>

            <div className="space-y-4 text-left">
              {LOGIN_FEATURES.map(({ id, text, icon }) => (
                <div key={id} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center shrink-0 text-white transition-transform group-hover:scale-105">
                    {icon}
                  </div>
                  <span className="text-lg drop-shadow-lg font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <main className="lg:w-[55%] flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-lg">
            <LoginForm />
          </div>
        </main>

      </div>
    </div>
  );
}