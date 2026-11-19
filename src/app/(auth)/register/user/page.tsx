import { Metadata } from 'next';
import { RegisterForm } from '@/presentation/components/auth/RegisterForm';
import { UserCheck, ShieldCheck, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Registro Usuario - TIYUY | Bienes Raíces en Perú',
  description: 'Regístrate como usuario en TIYUY y encuentra tu hogar ideal. La mejor plataforma de bienes raíces en Perú.',
  keywords: ['registro usuario tiyuy', 'buscar casa perú', 'comprar propiedad', 'tiyuy usuario'],
  robots: { index: false, follow: false },
};

export default function RegisterUsuarioPage() {
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
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
              Únete a TIYUY
            </h1>
            <p className="text-base lg:text-lg text-gray-200 mb-8 font-medium">
              Encuentra tu hogar ideal con la mejor plataforma de bienes raíces en Perú.
            </p>
            
            <div className="space-y-4 max-w-xs mx-auto lg:mx-0">
              <div className="flex items-center gap-3.5 group">
                <div className="w-9 h-9 bg-blue-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 transition-transform group-hover:scale-110">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm lg:text-base font-semibold tracking-wide">Perfil verificado</span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-9 h-9 bg-blue-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 transition-transform group-hover:scale-110">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm lg:text-base font-semibold tracking-wide">Propiedades verificadas</span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-9 h-9 bg-blue-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 transition-transform group-hover:scale-110">
                  <ShieldAlert className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm lg:text-base font-semibold tracking-wide">Seguridad garantizada</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[55%] bg-gray-50 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm">
            <RegisterForm />
          </div>
        </div>

      </div>
    </div>
  );
}