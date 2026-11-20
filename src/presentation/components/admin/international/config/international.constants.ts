export type InternationalStatusFilter = 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export const DOC_TYPE_LABELS: Record<string, string> = {
  PASSPORT: 'Pasaporte',
  NATIONAL_ID: 'Documento nacional de identidad',
  RESIDENCE_PERMIT: 'Documento de residencia',
};

export const STATUS_META: Record<
  string,
  { label: string; variant: 'pending' | 'verified' | 'rejected' | 'manual' }
> = {
  PENDING: { label: 'En revisión', variant: 'pending' },
  VERIFIED: { label: 'Aprobado', variant: 'verified' },
  REJECTED: { label: 'Rechazado', variant: 'rejected' },
  MANUAL_REVIEW: { label: 'Revisión manual', variant: 'manual' },
};

export const FILTER_TABS: { key: InternationalStatusFilter; label: string }[] = [
  { key: 'ALL', label: 'Todos' },
  { key: 'PENDING', label: 'En revisión' },
  { key: 'VERIFIED', label: 'Aprobados' },
  { key: 'REJECTED', label: 'Rechazados' },
];
