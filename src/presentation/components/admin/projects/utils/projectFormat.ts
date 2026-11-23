/** Utilidades de formato para el modal de detalle de proyectos. */

const PROJECT_TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residencial',
  COMMERCIAL: 'Comercial',
  INDUSTRIAL: 'Industrial',
  MIXED_USE: 'Mixto',
};

const PROJECT_PHASE_LABELS: Record<string, string> = {
  PLANNING: 'Planificación',
  CONSTRUCTION: 'Construcción',
  PRE_SALE: 'Pre venta',
  SALE: 'En venta',
  COMPLETED: 'Completado',
};

export function formatProjectType(value?: string): string {
  if (!value) return '—';
  return PROJECT_TYPE_LABELS[value] ?? value.replace(/_/g, ' ').toLowerCase();
}

export function formatProjectPhase(value?: string): string {
  if (!value) return '—';
  return PROJECT_PHASE_LABELS[value] ?? value.replace(/_/g, ' ').toLowerCase();
}

export function getProjectInitials(name?: string): string {
  if (!name) return '—';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatProjectCurrency(min?: number, max?: number): string {
  if (!Number.isFinite(min) && !Number.isFinite(max)) return '—';
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 0,
  });
  if (Number.isFinite(min) && Number.isFinite(max) && min !== max) {
    return `${formatter.format(min as number)} - ${formatter.format(max as number)}`;
  }
  return formatter.format((min ?? max) as number);
}

function parseDate(value?: Date | string | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const raw = String(value).trim();
  if (!raw) return null;

  // Las fechas sin hora (LocalDate del backend) se interpretan en hora local;
  // new Date('2026-03-15') las parsea como UTC y puede desplazar el día.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatProjectDate(value?: Date | string | null): string {
  const date = parseDate(value);
  if (!date) return '-';

  const parts = new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  const month = part('month').replace(/\.$/, '');
  const monthLabel = month ? month.charAt(0).toUpperCase() + month.slice(1) : '';

  return `${part('day')} ${monthLabel} ${part('year')}`.trim();
}

export function formatProjectDateTime(value?: Date | string | null): string {
  const date = parseDate(value);
  if (!date) return '—';
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
