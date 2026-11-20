'use client';

import type { AgentListItem } from '@/core/domain/entities/Admin';

/*
 * Reutilizamos las primitivas visuales del modal de usuarios para garantizar
 * exactamente el mismo estilo (Panels, Rows, Chips, botones, etc.).
 */
export {
  CARD,
  LINK,
  SECONDARY_BUTTON,
  Chip,
  StatusChip,
  Panel,
  Row,
  RowList,
  EmptyNote,
  ListBody,
  ItemRow,
} from '@/presentation/components/admin/users/components/detail/ui/detailParts';
export type { Tone } from '@/presentation/components/admin/users/components/detail/ui/detailParts';

/** Pestañas del modal de detalle de agente. */
export type AgentDetailTab = 'overview' | 'security' | 'plan' | 'history';

export const AGENT_TABS: { id: AgentDetailTab; label: string }[] = [
  { id: 'overview', label: 'Resumen' },
  { id: 'security', label: 'Seguridad' },
  { id: 'plan', label: 'Plan e ingresos' },
  { id: 'history', label: 'Historial' },
];

export interface AgentInsight {
  id: string;
  text: string;
  tone: 'info' | 'warning' | 'danger';
}

export function getAgentFullName(agent: AgentListItem): string {
  return [agent.firstName, agent.lastName].filter(Boolean).join(' ').trim() || agent.email;
}

export function getAgentInitials(agent: AgentListItem): string {
  if (agent.firstName && agent.lastName) {
    return `${agent.firstName[0]}${agent.lastName[0]}`.toUpperCase();
  }
  return (agent.email?.[0] ?? '?').toUpperCase();
}

export function formatAgentMoney(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount ?? 0);
}

/** Lectura rápida del agente, con el mismo formato de insights del modal de usuarios. */
export function getAgentInsights(agent: AgentListItem): AgentInsight[] {
  const insights: AgentInsight[] = [];
  const name = agent.firstName || 'El agente';

  if (!agent.enabled) {
    insights.push({ id: 'suspended', text: 'La cuenta del agente está suspendida', tone: 'danger' });
  }
  if (!agent.emailVerified) {
    insights.push({ id: 'email', text: `${name} no ha verificado su correo`, tone: 'warning' });
  }
  if (!agent.phoneVerified) {
    insights.push({ id: 'phone', text: 'Teléfono pendiente de verificación', tone: 'info' });
  }
  if (agent.emailVerified && agent.phoneVerified) {
    insights.push({ id: 'contact-ok', text: 'Correo y teléfono verificados', tone: 'info' });
  }
  if (agent.propertiesCount > 0) {
    insights.push({
      id: 'properties',
      text: `Tiene ${agent.propertiesCount} propiedad(es) publicada(s)`,
      tone: 'info',
    });
  }
  if (agent.planExpiresAt) {
    const expired = new Date(agent.planExpiresAt).getTime() < Date.now();
    insights.push({
      id: 'plan',
      text: expired ? 'El plan vigente está vencido' : 'Plan vigente al día',
      tone: expired ? 'warning' : 'info',
    });
  }

  return insights.slice(0, 3);
}
