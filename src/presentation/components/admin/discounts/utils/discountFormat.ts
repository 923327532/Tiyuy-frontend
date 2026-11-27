const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** `YYYY-MM-DD` se trata como fecha de calendario local, no como instante UTC. */
function parseLocalDate(value?: string | null): Date | null {
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

export function formatDiscountDate(value?: string | null): string {
  const date = parseLocalDate(value);
  if (!date) return '-';
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDiscountNumber(value?: number | null): string {
  return (value ?? 0).toLocaleString('es-PE');
}

export function formatDiscountCurrency(value?: number | null): string {
  return `S/ ${(value ?? 0).toLocaleString('es-PE', { maximumFractionDigits: 2 })}`;
}
