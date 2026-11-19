import { Metadata } from 'next';
import { RegisterDeveloperForm } from '@/presentation/components/auth/RegisterForm/RegisterDeveloperForm';
import { Star, Building2, Check, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publica tu Proyecto Gratis - TIYUY | Desarrolladores Inmobiliarios',
  description: 'Regístra tu empresa y publica tu primer proyecto inmobiliario gratis. 30 días de prueba + unidades ilimitadas (departamentos, casas, oficinas, lotes).',
  keywords: ['publicar proyecto gratis tiyuy', 'desarrollador inmobiliario', 'proyecto departamentos', 'inmobiliaria peru', 'tiyuy developer'],
  robots: { index: false, follow: false },
};

export default function RegisterDeveloperPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        <div className="lg:w-[45%] relative flex items-center justify-center p-8 lg:p-12 min-h-[40vh] lg:min-h-screen overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url('/assets/images/registro/usuario.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          
          <div className="relative z-10 text-center lg:text-left text-white max-w-md w-full">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 mb-6 justify-center mx-auto lg:mx-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>30 días gratis · Trial Enterprise</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
              Desarrollador TIYUY
            </h1>
            <p className="text-base lg:text-lg text-gray-200 mb-8 font-medium">
              Publica proyectos inmobiliarios y alcanza miles de compradores potenciales.
            </p>
            
            <div className="space-y-4 max-w-xs mx-auto lg:mx-0">
              <div className="flex items-center gap-3.5 group">
                <div className="w-9 h-9 bg-blue-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 transition-transform group-hover:scale-110">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm lg:text-base font-semibold tracking-wide">Perfil empresarial</span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-9 h-9 bg-blue-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 transition-transform group-hover:scale-110">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm lg:text-base font-semibold tracking-wide">Proyectos ilimitados</span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-9 h-9 bg-blue-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 transition-transform group-hover:scale-110">
                  <CalendarDays className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm lg:text-base font-semibold tracking-wide">30 días gratis</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[55%] bg-gray-50 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm">
            <RegisterDeveloperForm />
          </div>
        </div>

      </div>
    </div>
  );
}