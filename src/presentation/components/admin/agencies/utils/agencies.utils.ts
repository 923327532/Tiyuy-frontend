/**
 * Agencies Utilities - Funciones de utilidad para el panel de inmobiliarias
 */

import type { InmobiliariaWithStats, InmobiliariaAgent } from '@/core/domain/entities/Admin';

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const numberFormatter = new Intl.NumberFormat('es-PE');
const relativeFormatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

function toDate(value?: Date | string | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: Date | string | null): string {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : '—';
}

export function formatDateTime(value?: Date | string | null): string {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : '—';
}

export function formatRelative(value?: Date | string | null): string {
  const date = toDate(value);
  if (!date) return 'Sin actividad';

  const minutes = Math.round((date.getTime() - Date.now()) / 60_000);
  const abs = Math.abs(minutes);

  if (abs < 1) return 'Ahora';
  if (abs < 60) return relativeFormatter.format(minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hour');

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relativeFormatter.format(days, 'day');

  return dateFormatter.format(date);
}

export function formatLastActivity(value?: Date | string | null): string {
  return formatRelative(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(amount ?? 0);
}

export function getAgencyFullName(agency: InmobiliariaWithStats): string {
  return agency.name?.trim() || agency.ruc || 'Sin nombre';
}

export function getAgencyInitials(agency: InmobiliariaWithStats): string {
  if (agency.name) {
    const words = agency.name.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return agency.name.substring(0, 2).toUpperCase();
  }
  return agency.ruc?.substring(0, 2).toUpperCase() || 'IN';
}

export function getAgentFullName(agent: InmobiliariaAgent): string {
  return [agent.firstName, agent.lastName].filter(Boolean).join(' ').trim() || agent.email;
}

export function getAgentInitials(agent: InmobiliariaAgent): string {
  if (agent.firstName && agent.lastName) {
    return `${agent.firstName[0]}${agent.lastName[0]}`.toUpperCase();
  }
  return (agent.email?.[0] ?? '?').toUpperCase();
}

/** Formatea fecha actual en español (Perú) */
export function formatCurrentDate(): string {
  const formatted = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}