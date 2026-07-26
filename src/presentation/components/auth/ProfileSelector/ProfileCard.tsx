'use client';
import React from 'react';
import { UserRole } from '@/core/domain/entities';
import { Card, Badge } from '@/presentation/components/ui';
import { Building, Check, Home, Shield, Users } from 'lucide-react';


// Iconos SVG para cada perfil
const ICONS: Record<string, React.ReactElement> = {
  USER: (
    <Home className="w-8 h-8" />
  ),
  AGENT: (
    <Users className="w-8 h-8" />
  ),
  DEVELOPER: (
    <Building className="w-8 h-8" />
  ),
  ADMIN: (
    <Shield className="w-8 h-8" />
  )
};


// Config local (no PROFILES_CONFIG)
const ROLES_CONFIG: Record<UserRole, any> = {
  USER: {
    title: 'Usuario',
    description: 'Busca tu hogar ideal',
    icon: 'home',
    color: 'bg-blue-500',
    features: ['Guardar favoritos', 'Contactar agentes', 'Alertas']
  },
  AGENT: {
    title: 'Agente Inmobiliario',
    description: 'Publica propiedades y gestiona clientes',
    icon: 'user-group',
    color: 'bg-green-500',
    features: ['Publicar propiedades', 'Gestionar leads', 'Dashboard ventas']
  },
  DEVELOPER: {
    title: 'Desarrollador',
    description: 'Proyectos ilimitados - Trial 30 días',
    icon: 'building-office',
    color: 'bg-purple-500',
    features: ['999 publicaciones', 'Proyectos ilimitados', 'Trial gratis']
  },
  ADMIN: {
    title: 'Administrador',
    description: 'Gestión completa de la plataforma',
    icon: 'shield-check',
    color: 'bg-red-500',
    features: ['Gestión usuarios', 'Aprobaciones', 'Analíticas']
  },
  SUPER_ADMIN: {
    title: 'Super Administrador',
    description: 'Control total del sistema',
    icon: 'shield-check',
    color: 'bg-red-500',
    features: ['Control total', 'Gestión del sistema', 'Auditoría']
  },
  SUPPORT: {
    title: 'Soporte',
    description: 'Atención y soporte técnico',
    icon: 'shield-check',
    color: 'bg-red-500',
    features: ['Soporte usuarios', 'Gestión tickets', 'Monitoreo']
  }
};


interface ProfileCardProps {
  profile: UserRole;  // ← UserRole
  isSelected?: boolean;
  onClick: (profile: UserRole) => void;
}


export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isSelected, onClick }) => {
  const config = ROLES_CONFIG[profile];


  return (
    <Card hover onClick={() => onClick(profile)} className={`${isSelected ? 'ring-4 ring-[var(--brand-primary)] ring-offset-2 ring-offset-[var(--bg-primary)]' : ''} p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl relative`}>
      {profile === 'DEVELOPER' && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <Badge variant="warning" size="sm">30 días gratis</Badge>
        </div>
      )}

      <div className="flex items-center justify-center mb-4 sm:mb-6">
        {profile === 'USER' && (
          <Home className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-[var(--brand-primary)]" />
        )}
        {profile === 'AGENT' && (
          <Users className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-[var(--brand-primary)]" />
        )}
        {profile === 'DEVELOPER' && (
          <Building className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-[var(--brand-primary)]" />
        )}
        {profile === 'ADMIN' && (
          <Shield className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-[var(--brand-primary)]" />
        )}
      </div>

      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3">{config.title}</h3>
      <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4 sm:mb-6 leading-relaxed">{config.description}</p>
      
      <ul className="space-y-2 sm:space-y-3">
        {config.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center gap-2 sm:gap-3 text-[var(--text-secondary)]">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[var(--brand-primary)] flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      {isSelected && (
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--brand-primary)] rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
      )}
    </Card>
  );
};
