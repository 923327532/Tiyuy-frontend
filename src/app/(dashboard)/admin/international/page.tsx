'use client';

import { useMemo, useState } from 'react';
import {
  useInternationalUsers,
  useApproveInternationalUser,
  useRejectInternationalUser,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/Card';
import { Modal } from '@/presentation/components/ui/Modal';
import { toast } from '@/presentation/store/toastStore';
import { InternationalUserListItem } from '@/core/domain/entities/Admin';
import { ChevronLeft, ChevronRight, Globe2, ShieldCheck, ShieldX, Clock, IdCard, Camera } from 'lucide-react';

type StatusFilter = 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED';

const DOC_TYPE_LABELS: Record<string, string> = {
  PASSPORT: 'Pasaporte',
  NATIONAL_ID: 'Documento nacional de identidad',
  RESIDENCE_PERMIT: 'Documento de residencia',
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'En revisión', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  VERIFIED: { label: 'Aprobado', className: 'bg-green-100 text-green-700 border-green-200' },
  REJECTED: { label: 'Rechazado', className: 'bg-red-100 text-red-700 border-red-200' },
  MANUAL_REVIEW: { label: 'Revisión manual', className: 'bg-blue-100 text-blue-700 border-blue-200' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_BADGE[status] || STATUS_BADGE.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.className}`}>
      {status === 'VERIFIED' && <ShieldCheck className="w-3 h-3" />}
      {status === 'REJECTED' && <ShieldX className="w-3 h-3" />}
      {status === 'PENDING' && <Clock className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

function DocField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">{value || '—'}</p>
    </div>
  );
}

function ImageCard({ label, url }: { label: string; url?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
        {label.includes('Documento') ? <IdCard className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
        {label}
      </p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-[var(--brand-primary)] transition-all">
          <img src={url} alt={label} className="w-full aspect-[4/3] object-cover bg-gray-50" />
        </a>
      ) : (
        <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
          Sin imagen
        </div>
      )}
    </div>
  );
}

export default function InternationalPage() {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selected, setSelected] = useState<InternationalUserListItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data, isLoading, refetch } = useInternationalUsers({ page, size: pageSize });
  const approveMutation = useApproveInternationalUser();
  const rejectMutation = useRejectInternationalUser();
  const { hasPermission } = usePermissions();
  const canReview = hasPermission('USERS_VERIFY');

  const users = data?.content || [];
  const total = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  const filtered = useMemo(
    () => (statusFilter === 'ALL' ? users : users.filter((u) => u.verificationStatus === statusFilter)),
    [users, statusFilter]
  );

  const counts = useMemo(
    () => ({
      ALL: total,
      PENDING: users.filter((u) => u.verificationStatus === 'PENDING').length,
      VERIFIED: users.filter((u) => u.verificationStatus === 'VERIFIED').length,
      REJECTED: users.filter((u) => u.verificationStatus === 'REJECTED').length,
    }),
    [users, total]
  );

  const handleApprove = async (u: InternationalUserListItem) => {
    if (!window.confirm(`¿Aprobar la identidad de ${u.firstName || ''} ${u.lastName || ''} (${u.email})?`)) return;
    try {
      await approveMutation.mutateAsync(u.userId);
      toast.success('Documento aprobado. El usuario ya puede acceder a las áreas privadas.');
      setSelected(null);
      refetch();
    } catch {
      toast.error('Error al aprobar el documento');
    }
  };

  const handleOpenReject = (u: InternationalUserListItem) => {
    setSelected(u);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      await rejectMutation.mutateAsync({ userId: selected.userId, reason: rejectReason || undefined });
      toast.success('Documento rechazado');
      setShowRejectModal(false);
      setSelected(null);
      setRejectReason('');
      refetch();
    } catch {
      toast.error('Error al rechazar el documento');
    }
  };

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: 'ALL', label: `Todos (${counts.ALL})` },
    { key: 'PENDING', label: `En revisión (${counts.PENDING})` },
    { key: 'VERIFIED', label: `Aprobados (${counts.VERIFIED})` },
    { key: 'REJECTED', label: `Rechazados (${counts.REJECTED})` },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Usuarios Extranjeros</h1>
        <p className="text-sm text-gray-500">
          Revisa la foto del documento y la selfie, luego aprueba o rechaza la verificación de identidad.
        </p>
      </div>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="w-5 h-5 text-[var(--brand-primary)]" />
            Solicitudes de verificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">Cargando usuarios...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No hay usuarios internacionales {statusFilter !== 'ALL' ? 'con este estado' : 'aún'}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="py-2.5 pr-3 font-medium">Usuario</th>
                    <th className="py-2.5 pr-3 font-medium">País</th>
                    <th className="py-2.5 pr-3 font-medium">Documento</th>
                    <th className="py-2.5 pr-3 font-medium">N° documento</th>
                    <th className="py-2.5 pr-3 font-medium">Estado</th>
                    <th className="py-2.5 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.userId} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 pr-3">
                        <p className="font-medium text-gray-800">{u.firstName || '—'} {u.lastName || ''}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="py-3 pr-3 text-gray-600">{u.issuingCountry || '—'}</td>
                      <td className="py-3 pr-3 text-gray-600">{DOC_TYPE_LABELS[u.internationalDocumentType] || u.internationalDocumentType}</td>
                      <td className="py-3 pr-3 text-gray-600 font-mono text-xs">{u.internationalDocumentNumber}</td>
                      <td className="py-3 pr-3"><StatusBadge status={u.verificationStatus} /></td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => setSelected(u)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <span className="text-xs text-gray-500">Página {page + 1} de {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
              >
                Siguiente <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selected.firstName || ''} {selected.lastName || ''}
              </h3>
              <StatusBadge status={selected.verificationStatus} />
            </div>
            <p className="text-sm text-gray-500 mb-4">{selected.email} · {selected.phone}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <DocField label="País emisor" value={selected.issuingCountry} />
              <DocField label="Tipo de documento" value={DOC_TYPE_LABELS[selected.internationalDocumentType] || selected.internationalDocumentType} />
              <DocField label="N° de documento" value={selected.internationalDocumentNumber} />
              <DocField label="Registro" value={selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—'} />
            </div>

            {selected.verificationResult && (
              <div className="mb-5 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                <p className="text-xs text-gray-500"><span className="font-semibold">Resultado:</span> {selected.verificationResult}</p>
              </div>
            )}

            {/* Comparación de fotos: documento vs selfie */}
            <p className="text-sm font-semibold text-gray-700 mb-2">Comparar fotos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <ImageCard label="Foto del documento" url={selected.documentImageUrl} />
              <ImageCard label="Selfie" url={selected.selfieImageUrl} />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {canReview && selected.verificationStatus !== 'VERIFIED' && (
                <button
                  type="button"
                  onClick={() => handleApprove(selected)}
                  disabled={approveMutation.isPending}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  ✓ Aprobar documento
                </button>
              )}
              {canReview && selected.verificationStatus !== 'REJECTED' && (
                <button
                  type="button"
                  onClick={() => handleOpenReject(selected)}
                  disabled={rejectMutation.isPending}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  ✕ Rechazar documento
                </button>
              )}
              {!canReview && (
                <p className="text-xs text-gray-400">No tienes permiso para aprobar o rechazar documentos.</p>
              )}
            </div>
          </div>
        )}
      </Modal>


      {/* Modal de rechazo */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Rechazar documento</h3>
          <p className="text-sm text-gray-500 mb-4">
            El usuario verá el motivo del rechazo y podrá volver a subir sus documentos.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Motivo del rechazo (opcional)"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {rejectMutation.isPending ? 'Rechazando...' : 'Rechazar documento'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

