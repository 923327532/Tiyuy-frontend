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

const ADMIN_STATUS_STYLES = {
  total: {
    soft: 'bg-[#e3edf1] text-[#164e63] border-[#b8ced5]',
    solid: 'bg-[#164e63] text-white border-[#164e63]',
  },
  active: {
    soft: 'bg-[#dceae4] text-[#36866c] border-[#b8d8ca]',
    solid: 'bg-[#36866c] text-white border-[#36866c]',
  },
  pending: {
    soft: 'bg-[#fbefd9] text-[#a66b1d] border-[#efd8b4]',
    solid: 'bg-[#c58a3a] text-white border-[#c58a3a]',
  },
  suspended: {
    soft: 'bg-[#f9e5e8] text-[#b94b59] border-[#edc6cc]',
    solid: 'bg-[#c45d68] text-white border-[#c45d68]',
  },
} as const;

const DOC_TYPE_LABELS: Record<string, string> = {
  PASSPORT: 'Pasaporte',
  NATIONAL_ID: 'Documento nacional de identidad',
  RESIDENCE_PERMIT: 'Documento de residencia',
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'En revisión', className: ADMIN_STATUS_STYLES.pending.soft },
  VERIFIED: { label: 'Aprobado', className: ADMIN_STATUS_STYLES.active.soft },
  REJECTED: { label: 'Rechazado', className: ADMIN_STATUS_STYLES.suspended.soft },
  MANUAL_REVIEW: { label: 'Revisión manual', className: ADMIN_STATUS_STYLES.total.soft },
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
      <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-medium">{label}</p>
      <p className="text-sm font-medium text-[var(--text-primary)] break-words">{value || '—'}</p>
    </div>
  );
}

function ImageCard({ label, url }: { label: string; url?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
        {label.includes('Documento') ? <IdCard className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
        {label}
      </p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-[var(--border-color)] hover:ring-2 hover:ring-[var(--brand-primary)] transition-all">
          <img src={url} alt={label} className="w-full aspect-[4/3] object-cover bg-[var(--bg-secondary)]" />
        </a>
      ) : (
        <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-xs text-[var(--text-tertiary)]">
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

  const filterStyles: Record<StatusFilter, (typeof ADMIN_STATUS_STYLES)[keyof typeof ADMIN_STATUS_STYLES]> = {
    ALL: ADMIN_STATUS_STYLES.total,
    PENDING: ADMIN_STATUS_STYLES.pending,
    VERIFIED: ADMIN_STATUS_STYLES.active,
    REJECTED: ADMIN_STATUS_STYLES.suspended,
  };

  return (
    <div className="space-y-3 px-3 py-3 sm:space-y-4 sm:px-6 sm:py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary-light)] text-[var(--brand-primary)]">
          <Globe2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#164e63]">Usuarios Extranjeros</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Revisa la foto del documento y la selfie, luego aprueba o rechaza la verificación de identidad.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
        {/* Filtros por estado */}
        <div className="grid grid-cols-2 gap-1 border-b border-slate-100 bg-slate-50/30 px-3 py-2 sm:flex sm:flex-wrap sm:items-center sm:justify-start sm:px-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`w-full rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer sm:w-auto ${
                statusFilter === tab.key ? filterStyles[tab.key].solid : filterStyles[tab.key].soft
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        <Card padding="none" className="rounded-none border-0 bg-white shadow-none">
        <CardHeader className="mb-0 border-b border-[var(--border-light)] px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[#164e63]">
            <ShieldCheck className="h-5 w-5 text-[var(--brand-primary)]" />
            Solicitudes de verificación
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-[var(--text-secondary)]">Cargando usuarios...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-[var(--text-secondary)]">
              No hay usuarios internacionales {statusFilter !== 'ALL' ? 'con este estado' : 'aún'}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] table-fixed bg-white text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                    <th className="w-[24%] py-2.5 pr-3 font-medium">Usuario</th>
                    <th className="w-[13%] py-2.5 pr-3 font-medium">País</th>
                    <th className="w-[21%] py-2.5 pr-3 font-medium">Documento</th>
                    <th className="w-[17%] py-2.5 pr-3 font-medium">N° documento</th>
                    <th className="w-[13%] py-2.5 pr-3 font-medium">Estado</th>
                    <th className="w-[12%] py-2.5 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.userId} className="bg-white text-[var(--text-primary)] transition-colors hover:bg-[#f8fafc]">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-[#164e63]">{u.firstName || '—'} {u.lastName || ''}</p>
                        <p className="text-xs text-[#64748b]">{u.email}</p>
                      </td>
                      <td className="py-3 pr-3 text-[#334155]">{u.issuingCountry || '—'}</td>
                      <td className="py-3 pr-3 text-[#334155]">{DOC_TYPE_LABELS[u.internationalDocumentType] || u.internationalDocumentType}</td>
                      <td className="py-3 pr-3 font-mono text-xs text-[#334155]">{u.internationalDocumentNumber}</td>
                      <td className="py-3 pr-3"><StatusBadge status={u.verificationStatus} /></td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => setSelected(u)}
                          className="rounded-lg border border-[#b8ced5] bg-[#e3edf1] px-3 py-1.5 text-xs font-semibold text-[#164e63] transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-medium hover:bg-[var(--border-light)] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <span className="text-xs text-[var(--text-secondary)]">Página {page + 1} de {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-medium hover:bg-[var(--border-light)] disabled:opacity-40 cursor-pointer"
              >
                Siguiente <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </CardContent>
        </Card>
      </div>

      {/* Modal de detalle */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {selected.firstName || ''} {selected.lastName || ''}
              </h3>
              <StatusBadge status={selected.verificationStatus} />
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{selected.email} · {selected.phone}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <DocField label="País emisor" value={selected.issuingCountry} />
              <DocField label="Tipo de documento" value={DOC_TYPE_LABELS[selected.internationalDocumentType] || selected.internationalDocumentType} />
              <DocField label="N° de documento" value={selected.internationalDocumentNumber} />
              <DocField label="Registro" value={selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—'} />
            </div>

            {selected.verificationResult && (
              <div className="mb-5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] px-3 py-2.5">
                <p className="text-xs text-[var(--text-secondary)]"><span className="font-semibold">Resultado:</span> {selected.verificationResult}</p>
              </div>
            )}

            {/* Comparación de fotos: documento vs selfie */}
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Comparar fotos</p>
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
                  className="flex-1 bg-[var(--brand-primary)] text-white py-2.5 rounded-xl font-semibold hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 transition-colors cursor-pointer"
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
                <p className="text-xs text-[var(--text-tertiary)]">No tienes permiso para aprobar o rechazar documentos.</p>
              )}
            </div>
          </div>
        )}
      </Modal>


      {/* Modal de rechazo */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Rechazar documento</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            El usuario verá el motivo del rechazo y podrá volver a subir sus documentos.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="w-full border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Motivo del rechazo (opcional)"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--border-light)] transition-colors cursor-pointer"
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
