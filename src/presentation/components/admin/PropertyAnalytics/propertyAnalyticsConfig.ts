/**
 * Etiquetas y colores de las distribuciones de analítica de propiedades.
 * Las claves coinciden con los enums del backend:
 * PropertyStatus, PropertyType y TransactionType.
 * La paleta es la misma del dashboard (cian, naranja, azul, azul petróleo).
 */

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PENDING: 'Pendiente',
  PUBLISHED: 'Publicada',
  PAUSED: 'Pausada',
  REJECTED: 'Rechazada',
  RENTED: 'Alquilada',
  SOLD: 'Vendida',
  EXPIRED: 'Expirada',
  SUSPENDED: 'Suspendida',
  DISABLED_BY_ADMIN: 'Deshabilitada',
};

export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  DRAFT: '#94a3b8',
  PENDING: '#f97316',
  PUBLISHED: '#06b6d4',
  PAUSED: '#64748b',
  REJECTED: '#e11d48',
  RENTED: '#1d4ed8',
  SOLD: '#0f2e3a',
  EXPIRED: '#c2410c',
  SUSPENDED: '#9a3412',
  DISABLED_BY_ADMIN: '#475569',
};

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Departamento',
  HOUSE: 'Casa',
  ROOM: 'Habitación',
  LAND: 'Terreno',
  OFFICE: 'Oficina',
  COMMERCIAL: 'Local comercial',
  WAREHOUSE: 'Almacén',
  BUILDING: 'Edificio',
  PARKING: 'Cochera',
};

export const PROPERTY_TYPE_COLORS: Record<string, string> = {
  APARTMENT: '#06b6d4',
  HOUSE: '#1d4ed8',
  ROOM: '#64748b',
  LAND: '#65a30d',
  OFFICE: '#0f2e3a',
  COMMERCIAL: '#f97316',
  WAREHOUSE: '#475569',
  BUILDING: '#0e7490',
  PARKING: '#94a3b8',
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
  TEMPORARY: 'Alquiler temporal',
  TRANSFER: 'Traspaso',
  AUCTION: 'Remate',
};

export const TRANSACTION_TYPE_COLORS: Record<string, string> = {
  SALE: '#1d4ed8',
  RENT: '#06b6d4',
  TEMPORARY: '#f97316',
  TRANSFER: '#64748b',
  AUCTION: '#9a3412',
};

const numberFormatter = new Intl.NumberFormat('es-PE');

export function formatCount(value: number): string {
  return numberFormatter.format(value ?? 0);
}

export function formatPercentage(value: number, total: number): string {
  if (!total) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toLocaleString('es-PE', {
    minimumFractionDigits: percentage > 0 && percentage < 1 ? 1 : 0,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatGeneratedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}