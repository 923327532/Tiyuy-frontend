import type { AgentListItem } from '@/core/domain/entities/Admin';

/** Estado de la cuenta de un agente (subconjunto del estado de usuario). */
export type AgentAccountState = 'ACTIVE' | 'SUSPENDED';

/** Metadatos visuales idénticos a los usados en el modal de usuarios. */
export const ACCOUNT_STATE_META: Record<
  AgentAccountState,
  { label: string; chip: string; dot: string }
> = {
  ACTIVE: {
    label: 'Activo',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  SUSPENDED: {
    label: 'Suspendido',
    chip: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    dot: 'bg-rose-500',
  },
};

export function getAccountState(
  agent: Pick<AgentListItem, 'enabled'>,
): AgentAccountState {
  return agent.enabled ? 'ACTIVE' : 'SUSPENDED';
}

/** El backend puede devolver el plan vacío; mostramos "Free" como valor por defecto. */
export function getPlanLabel(agent: Pick<AgentListItem, 'currentPlan'>): string {
  return agent.currentPlan?.trim() || 'Free';
}
