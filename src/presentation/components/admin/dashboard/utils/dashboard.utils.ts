/**
 * Dashboard utilities - Funciones de utilidad para el dashboard
 * Separadas para reutilización y testing
 */

const EMPTY_VALUE = '—';
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const numberFormatter = new Intl.NumberFormat('es-PE');

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  notation: 'compact',
  maximumFractionDigits: 1,
});

function isMissing(value: number | null | undefined): value is null | undefined {
  return value === null || value === undefined || Number.isNaN(value);
}

/** Formatea un número con separadores de miles (es-PE) */
export function formatNumber(value: number | null | undefined): string {
  return isMissing(value) ? EMPTY_VALUE : numberFormatter.format(value);
}

/** Formatea una moneda en PEN */
export function formatCurrency(value: number | null | undefined): string {
  return isMissing(value) ? EMPTY_VALUE : currencyFormatter.format(value);
}

/** Formatea una moneda en formato compacto (ej: S/ 1.2M) */
export function formatCompactCurrency(value: number | null | undefined): string {
  return isMissing(value) ? EMPTY_VALUE : compactCurrencyFormatter.format(value);
}

/** Calcula el porcentaje de crecimiento */
export function calculateGrowth(current: number, previous: number): number | undefined {
  if (previous <= 0) return undefined;
  return ((current - previous) / previous) * 100;
}

/** Formatea tiempo relativo en español (Perú) */
export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return 'Ahora';

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} d`;

  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Formatea fecha completa en español (Perú) */
export function formatFullDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
}

/** Obtiene el inicio del día en zona local */
function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Días de calendario entre hoy y la fecha dada (0 = hoy, 1 = mañana)
 * Devuelve null si la fecha falta o es inválida.
 */
export function daysUntil(value?: string | Date | null): number | null {
  if (!value) return null;

  let date: Date;
  if (value instanceof Date) {
    date = value;
  } else if (DATE_ONLY.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return null;

  const diffMs = startOfLocalDay(date).getTime() - startOfLocalDay(new Date()).getTime();
  return Math.round(diffMs / 86_400_000);
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

/** Saludo según hora del día */
export function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
