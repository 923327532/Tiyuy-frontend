'use client';

import { useAuthStore } from '@/presentation/store/authStore';

/**
 * Users Header Stats Component
 * Banner profesional con métricas de usuarios para el panel superadmin
 */

interface UsersHeaderStatsProps {
  activeUsers: number;
  pendingUsers: number;
  totalUsers?: number;
}

export function UsersHeaderStats({ activeUsers, pendingUsers, totalUsers }: UsersHeaderStatsProps) {
  const { user } = useAuthStore();
  const displayName = user?.firstName || 'Superadmin';

  // Fecha actual formateada
  const now = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const dateStr = `${dayName} ${day} ${month} ${year}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3 py-4">
      {/* Banner principal izquierdo */}
      <div className="relative bg-[#0f2a4a] rounded-xl px-8 py-7 flex flex-col justify-between min-h-[140px] overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute -right-5 -top-5 w-[180px] h-[180px] rounded-full bg-white/5" />
        <div className="absolute right-10 -bottom-10 w-[120px] h-[120px] rounded-full bg-white/5" />

        {/* Logo Tiyuy arriba a la derecha */}
        <div className="absolute top-3 right-4 opacity-25">
          <img
            src="/assets/images/logo.svg"
            alt="Tiyuy"
            className="w-20 h-auto object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Texto con efecto LED / Marquee - letra más grande */}
          <div className="overflow-hidden w-full">
            <div className="marquee-container">
              <p className="marquee-text text-white m-0 leading-tight whitespace-nowrap">
                Gestión de Usuarios · Administra cuentas, roles y permisos desde un solo lugar. ·&nbsp;
              </p>
            </div>
          </div>
        </div>

        {/* Fecha centrada */}
        <div className="flex justify-center mt-3">
          <span className="text-[12px] text-white/30 tracking-wide">{dateStr}</span>
        </div>
      </div>

      {/* Tarjetas métricas derecha */}
      <div className="flex flex-col gap-2.5">
        {/* Tarjeta Activos */}
        <div className="bg-white border border-black/10 rounded-xl px-4 py-3.5 flex items-center gap-3 flex-1 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#E6F1FB] text-[#185FA5] flex items-center justify-center flex-shrink-0">
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider m-0 mb-0.5">Activos</p>
            <p className="text-[22px] font-medium text-gray-900 m-0 leading-none">{activeUsers}</p>
            <p className="text-[11px] text-gray-400 m-0 mt-0.5">
              <span className="text-[#0F6E56]">↑ {totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0}%</span> del total
            </p>
          </div>
        </div>

        {/* Tarjeta Pendientes */}
        <div className="bg-white border border-black/10 rounded-xl px-4 py-3.5 flex items-center gap-3 flex-1 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center flex-shrink-0">
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider m-0 mb-0.5">Pendientes</p>
            <p className="text-[22px] font-medium text-gray-900 m-0 leading-none">{pendingUsers}</p>
            <p className="text-[11px] text-[#854F0B] m-0 mt-0.5">Requieren revisión</p>
          </div>
        </div>
      </div>

      {/* Estilos para el efecto LED / Marquee */}
      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
        }
        .marquee-text {
          display: inline-block;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 26px;
          letter-spacing: 0.03em;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
