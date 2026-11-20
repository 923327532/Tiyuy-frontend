export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(value);
}

export function calculatePercentage(value: number, total: number): number | undefined {
  if (total <= 0) return undefined;
  return Math.round((value / total) * 100);
}

export function getInitials(name?: string | null): string {
  if (!name) return 'PR';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function truncate(text: string, max = 64): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
