/** Formateadores compartidos de Campañas (fechas locales sin desfase de zona horaria). */

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** `YYYY-MM-DD` se interpreta como fecha de calendario, no como instante UTC. */
export function parseCampaignDate(value?: string | null): Date | null {
  if (!value) return null;
  const text = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
    return null;
  }
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** `15 Mar 2026`; guion solo cuando la fecha es nula o inválida. */
export function formatCampaignDate(value?: string | null): string {
  const date = parseCampaignDate(value);
  if (!date) return '-';
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatCampaignDateRange(start?: string | null, end?: string | null): string {
  return `${formatCampaignDate(start)} – ${formatCampaignDate(end)}`;
}

export function formatNumber(value?: number | null): string {
  return (value ?? 0).toLocaleString('es-PE');
}

export function formatExactCurrency(value?: number | null): string {
  return `S/ ${(value ?? 0).toLocaleString('es-PE', { maximumFractionDigits: 2 })}`;
}

export function formatCompactCurrency(value?: number | null): string {
  const amount = value ?? 0;
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${sign}S/ ${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}S/ ${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${formatExactCurrency(abs)}`;
}

export function formatCompact(value?: number | null): string {
  const amount = value ?? 0;
  if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return formatNumber(amount);
}

export function formatPercent(value?: number | null, digits = 2): string {
  return `${(value ?? 0).toFixed(digits)}%`;
}

/** CTR calculado en cliente como respaldo cuando el backend no lo envía. */
export function calculateCtr(clicks?: number | null, impressions?: number | null): number {
  return impressions && impressions > 0 ? ((clicks ?? 0) / impressions) * 100 : 0;
}
