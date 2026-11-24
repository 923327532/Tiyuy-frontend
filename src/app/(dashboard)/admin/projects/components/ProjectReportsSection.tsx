'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProjectReports, useReviewReport } from '@/presentation/hooks/useAdmin';

interface ProjectReportsSectionProps {
  projectId: number;
  compact?: boolean;
}

export function ProjectReportsSection({ projectId, compact = false }: ProjectReportsSectionProps) {
  const { data: reports, isLoading, error } = useProjectReports(projectId);
  const reviewMutation = useReviewReport();
  const queryClient = useQueryClient();
  const [reviewingReport, setReviewingReport] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleReview = async (reportId: number, approve: boolean) => {
    await reviewMutation.mutateAsync({
      reportId,
      approve,
      notes: reviewNotes
    });
    setReviewingReport(null);
    setReviewNotes('');
    queryClient.invalidateQueries({ queryKey: ['admin', 'projects', projectId, 'reports'] });
  };

  if (isLoading) {
    return (
      <div className={compact ? '' : 'mt-6'}>
        {!compact && <h4 className="font-medium text-gray-900 mb-3">Reportes de Usuarios</h4>}
        <div className="text-xs text-gray-500">Cargando reportes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={compact ? '' : 'mt-6'}>
        {!compact && <h4 className="font-medium text-gray-900 mb-3">Reportes de Usuarios</h4>}
        <div className="text-xs text-red-500">Error al cargar reportes</div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className={compact ? '' : 'mt-6'}>
        {!compact && <h4 className="font-medium text-gray-900 mb-3">Reportes de Usuarios</h4>}
        <p className="text-xs text-slate-500">No hay reportes para este proyecto</p>
      </div>
    );
  }

  const reasonLabels: Record<string, string> = {
    'SPAM': 'Spam',
    'FRAUD': 'Fraude',
    'INCORRECT_INFO': 'Información Incorrecta',
    'INAPPROPRIATE_CONTENT': 'Contenido Inapropiado',
    'FAKE_PROPERTY': 'Proyecto Falso',
    'OTHER': 'Otro'
  };

  const statusLabels: Record<string, string> = {
    'PENDING': 'Pendiente',
    'APPROVED': 'Aprobado',
    'REJECTED': 'Rechazado'
  };

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800'
  };

  return (
    <div className={compact ? '' : 'mt-6'}>
      {!compact && (
        <h4 className="font-medium text-gray-900 mb-3">
          Reportes de Usuarios ({reports.length})
        </h4>
      )}
      <div className={compact ? 'space-y-2' : 'space-y-3 max-h-64 overflow-y-auto'}>
        {reports.map((report: any) => (
          <div key={report.id} className={`${compact ? 'bg-white p-3' : 'bg-gray-50 p-4'} rounded-lg border border-gray-200`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{report.reporterName}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[report.status] || 'bg-gray-100'}`}>
                  {statusLabels[report.status] || report.status}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <strong>Motivo:</strong> {reasonLabels[report.reason] || report.reason}
            </div>
            <div className="text-sm text-gray-700">
              {report.description}
            </div>

            {report.status === 'PENDING' && reviewingReport?.id !== report.id && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setReviewingReport(report)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Revisar Reporte
                </button>
              </div>
            )}

            {reviewingReport?.id === report.id && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Agregar notas de revisión (opcional)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReview(report.id, true)}
                    disabled={reviewMutation.isPending}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Aprobar (Suspender Proyecto)
                  </button>
                  <button
                    onClick={() => handleReview(report.id, false)}
                    disabled={reviewMutation.isPending}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Rechazar Reporte
                  </button>
                  <button
                    onClick={() => setReviewingReport(null)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {report.reviewedBy && (
              <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                Revisado por: {report.reviewerName} - {statusLabels[report.status]}
                {report.reviewNotes && (
                  <div className="mt-1 italic">"{report.reviewNotes}"</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
