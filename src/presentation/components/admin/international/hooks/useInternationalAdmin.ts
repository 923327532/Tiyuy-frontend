'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  useInternationalUsers,
  useApproveInternationalUser,
  useRejectInternationalUser,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { toast } from '@/presentation/store/toastStore';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';
import type { InternationalStatusFilter } from '../config/international.constants';

export function useInternationalAdmin() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSizeState] = useState(20);
  const [statusFilter, setStatusFilterState] = useState<InternationalStatusFilter>('ALL');
  const [searchQuery, setSearchQueryState] = useState('');
  const [selected, setSelected] = useState<InternationalUserListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<InternationalUserListItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data, isLoading, error, refetch } = useInternationalUsers({ page, size: pageSize });
  const approveMutation = useApproveInternationalUser();
  const rejectMutation = useRejectInternationalUser();
  const { hasPermission } = usePermissions();
  const canReview = hasPermission('USERS_VERIFY');

  const users = data?.content ?? [];
  const total = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const setStatusFilter = useCallback((value: InternationalStatusFilter) => {
    setStatusFilterState(value);
    setPage(0);
  }, []);

  const setSearchQuery = useCallback((value: string) => {
    setSearchQueryState(value);
    setPage(0);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(0);
  }, []);

  const filtered = useMemo(() => {
    const byStatus =
      statusFilter === 'ALL' ? users : users.filter((u) => u.verificationStatus === statusFilter);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter((u) => {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      return (
        name.includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.internationalDocumentNumber || '').toLowerCase().includes(q) ||
        (u.issuingCountry || '').toLowerCase().includes(q)
      );
    });
  }, [users, statusFilter, searchQuery]);

  const counts = useMemo(
    () => ({
      ALL: total,
      PENDING: users.filter((u) => u.verificationStatus === 'PENDING').length,
      VERIFIED: users.filter((u) => u.verificationStatus === 'VERIFIED').length,
      REJECTED: users.filter((u) => u.verificationStatus === 'REJECTED').length,
    }),
    [users, total],
  );

  const handleApprove = useCallback(
    async (u: InternationalUserListItem) => {
      if (!window.confirm(`¿Aprobar la identidad de ${u.firstName || ''} ${u.lastName || ''} (${u.email})?`)) return;
      try {
        await approveMutation.mutateAsync(u.userId);
        toast.success('Documento aprobado. El usuario ya puede acceder a las áreas privadas.');
        setSelected(null);
        refetch();
      } catch {
        toast.error('Error al aprobar el documento');
      }
    },
    [approveMutation, refetch],
  );

  const handleOpenReject = useCallback((u: InternationalUserListItem) => {
    setRejectTarget(u);
    setRejectReason('');
    setShowRejectModal(true);
  }, []);

  const handleReject = useCallback(async () => {
    if (!rejectTarget) return;
    try {
      await rejectMutation.mutateAsync({ userId: rejectTarget.userId, reason: rejectReason || undefined });
      toast.success('Documento rechazado');
      setShowRejectModal(false);
      setRejectTarget(null);
      setSelected((prev) => (prev?.userId === rejectTarget.userId ? null : prev));
      setRejectReason('');
      refetch();
    } catch {
      toast.error('Error al rechazar el documento');
    }
  }, [rejectTarget, rejectReason, rejectMutation, refetch]);

  const closeRejectModal = useCallback(() => {
    setShowRejectModal(false);
    setRejectTarget(null);
    setRejectReason('');
  }, []);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selected,
    setSelected,
    rejectTarget,
    rejectReason,
    setRejectReason,
    showRejectModal,
    users,
    filtered,
    total,
    totalPages,
    counts,
    isLoading,
    error,
    canReview,
    approvePending: approveMutation.isPending,
    rejectPending: rejectMutation.isPending,
    handleApprove,
    handleOpenReject,
    handleReject,
    closeRejectModal,
    refetch,
  };
}
