'use client';

import { usePropertyReports } from '@/presentation/hooks/useAdmin';
import {
  Chip,
  EmptyNote,
  ItemRow,
  ListBody,
  Panel,
  type Tone,
} from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import {
  REPORT_REASON_LABELS,
  REPORT_STATUS_LABELS,
} from '../../config/properties.constants';
import { formatDate } from '../../utils/properties.utils';

interface PropertyReportsSectionProps {
  propertyId: number;
}

const STATUS_TONES: Record<string, Tone> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};

export function PropertyReportsSection({ propertyId }: PropertyReportsSectionProps) {
  const { data: reports, isLoading, error } = usePropertyReports(propertyId);

  return (
    <Panel title={`Reportes de usuarios (${reports?.length ?? 0})`}>
      {isLoading && <EmptyNote>Cargando reportes...</EmptyNote>}
      {error && <EmptyNote>No se pudieron cargar los reportes.</EmptyNote>}
      {!isLoading && !error && reports?.length === 0 && (
        <EmptyNote>No hay reportes para esta propiedad.</EmptyNote>
      )}

      {!isLoading && !error && Boolean(reports?.length) && (
        <ListBody>
          {reports?.map((report) => (
            <ItemRow
              key={report.id}
              title={report.reporterName || 'Usuario'}
              meta={`${REPORT_REASON_LABELS[report.reason] ?? report.reason} · ${formatDate(report.createdAt)}`}
              sub={<p className="text-sm text-slate-600">{report.description}</p>}
              right={
                <Chip tone={STATUS_TONES[report.status] ?? 'neutral'}>
                  {REPORT_STATUS_LABELS[report.status] ?? report.status}
                </Chip>
              }
            />
          ))}
        </ListBody>
      )}
    </Panel>
  );
}
