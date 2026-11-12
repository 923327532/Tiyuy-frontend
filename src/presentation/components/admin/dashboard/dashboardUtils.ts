import axios from 'axios';

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

// Antes un dato ausente se mostraba como "0", lo que en un dashboard se lee
// como un valor real. Ahora se muestra "—" para distinguir "sin dato" de "cero".
export function formatNumber(value: number | null | undefined): string {
  return isMissing(value) ? EMPTY_VALUE : numberFormatter.format(value);
}

export function formatCurrency(value: number | null | undefined): string {
  return isMissing(value) ? EMPTY_VALUE : currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number | null | undefined): string {
  return isMissing(value) ? EMPTY_VALUE : compactCurrencyFormatter.format(value);
}

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

export function formatFullDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Días de calendario (zona local) entre hoy y la fecha dada: 0 = hoy, 1 = mañana.
 * Devuelve null si la fecha falta o es inválida.
 *
 * Mejora: "2026-11-18" se interpreta como fecha local. Con `new Date("2026-11-18")`
 * el navegador usa UTC y en Lima (UTC-5) caía en el día anterior, desfasando
 * el conteo de "descuentos por vencer".
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

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'No hay conexión con el servidor. Revisa tu red e inténtalo de nuevo.';
    }

    const payload = error.response.data as { message?: string; error?: string } | undefined;
    const serverMessage = payload?.message ?? payload?.error;
    if (serverMessage) return serverMessage;

    if (error.response.status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    if (error.response.status === 403) return 'No tienes permisos para ver este resumen.';
    if (error.response.status >= 500) return 'El servidor tuvo un problema. Inténtalo en unos minutos.';

    return error.message;
  }

  if (error instanceof Error) return error.message;

  return 'No se pudieron cargar los datos del resumen.';
}