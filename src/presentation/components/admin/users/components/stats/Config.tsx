'use client';

import type { ReactNode } from 'react';
import { ShieldCheck, Building2, Code2, UserRound } from 'lucide-react';

export interface RoleConfig {
  icon: ReactNode;
  tone: 'admin' | 'agent' | 'developer' | 'user';
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  AGENT: 'Agente',
  DEVELOPER: 'Promotor',
  USER: 'Usuario',
};

export const ROLE_CONFIG: Record<string, RoleConfig> = {
  ADMIN: {
    icon: <ShieldCheck aria-hidden="true" />,
    tone: 'admin',
  },
  AGENT: {
    icon: <Building2 aria-hidden="true" />,
    tone: 'agent',
  },
  DEVELOPER: {
    icon: <Code2 aria-hidden="true" />,
    tone: 'developer',
  },
  USER: {
    icon: <UserRound aria-hidden="true" />,
    tone: 'user',
  },
};