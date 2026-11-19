/** Etiquetas y estilos de rol compartidos por la tarjeta y el detalle de usuario. */

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super admin',
  ADMIN: 'Administrador',
  AGENT: 'Agente',
  DEVELOPER: 'Promotor',
  USER: 'Usuario',
};

export const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-[#0f2e3a] text-white ring-[#0f2e3a]',
  ADMIN: 'bg-[#0f2e3a] text-white ring-[#0f2e3a]',
  AGENT: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
  DEVELOPER: 'bg-blue-50 text-blue-800 ring-blue-200',
  USER: 'bg-slate-100 text-slate-700 ring-slate-200',
};