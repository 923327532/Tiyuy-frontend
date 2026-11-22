'use client';

import { useCallback, useMemo, useState } from 'react';
import type { DeveloperAgentAssociation } from '@/core/domain/entities/Admin';
import type { ViewMode } from '@/presentation/components/admin/users/types/users.types';
import {
  useAllAssociationRequests,
  useApproveDeveloperAssociation,
  useRejectDeveloperAssociation,
} from '@/presentation/hooks/admin/useDeveloperAssociations';
import { toast } from '@/presentation/store/toastStore';

export type AssociationStatusFilter = '' | 'PENDING' | 'ACTIVE' | 'REJECTED' | 'REMOVED';

const STATUS_PARAM = (value: AssociationStatusFilter) => value || null;

export function useAssociationRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssociationStatusFilter>('');
  const [sortBy, setSortBy] = useState('requestedAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useAllAssociationRequests(STATUS_PARAM(statusFilter), currentPage - 1, pageSize);

  // Conteos globales para los KPIs (consultas livianas de 1 elemento).
  const { data: allCount } = useAllAssociationRequests(null, 0, 1);
  const { data: pendingCount } = useAllAssociationRequests('PENDING', 0, 1);
  const { data: activeCount } = useAllAssociationRequests('ACTIVE', 0, 1);
  const { data: rejectedCount } = useAllAssociationRequests('REJECTED', 0, 1);

  const approveMutation = useApproveDeveloperAssociation();
  const rejectMutation = useRejectDeveloperAssociation();

  const counts = useMemo(
    () => ({
      ALL: allCount?.totalElements ?? 0,
      PENDING: pendingCount?.totalElements ?? 0,
      ACTIVE: activeCount?.totalElements ?? 0,
      REJECTED: rejectedCount?.totalElements ?? 0,
    }),
    [allCount?.totalElements, pendingCount?.totalElements, activeCount?.totalElements, rejectedCount?.totalElements],
  );

  const setStatus = useCallback((value: string) => {
    setStatusFilter(value as AssociationStatusFilter);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('');
    setSortBy('requestedAt');
    setCurrentPage(1);
  }, []);

  // La búsqueda y el orden se aplican sobre la página cargada (el backend
  // solo expone filtro por estado y paginación).
  const requests = useMemo(() => {
    const list = data?.content ?? [];
    const q = searchQuery.trim().toLowerCase();

    const filtered = !q
      ? [...list]
      : list.filter((item) =>
          [
            item.agentFirstName,
            item.agentLastName,
            item.agentEmail,
            item.developerName,
            item.developerRuc,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(q),
        );

    return filtered.sort((a, b) => {
      if (sortBy === 'agent') {
        return `${a.agentFirstName ?? ''} ${a.agentLastName ?? ''}`.localeCompare(
          `${b.agentFirstName ?? ''} ${b.agentLastName ?? ''}`,
        );
      }
      if (sortBy === 'developer') {
        return (a.developerName || '').localeCompare(b.developerName || '');
      }
      const dateA = a.requestedAt ? new Date(a.requestedAt).getTime() : 0;
      const dateB = b.requestedAt ? new Date(b.requestedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [data?.content, searchQuery, sortBy]);

  const totalElements = data?.totalElements ?? 0;

  const handleApprove = useCallback(
    async (item: DeveloperAgentAssociation) => {
      const name = `${item.agentFirstName ?? ''} ${item.agentLastName ?? ''}`.trim() || item.agentEmail;
      if (!window.confirm(`¿Aprobar la asociación de ${name} con ${item.developerName}?`)) return;
      try {
        await approveMutation.mutateAsync({ associationId: item.id, data: {} });
        toast.success('Solicitud aprobada correctamente');
        refetch();
      } catch {
        toast.error('No se pudo aprobar la solicitud');
      }
    },
    [approveMutation, refetch],
  );

  const handleReject = useCallback(
    async (item: DeveloperAgentAssociation) => {
      const name = `${item.agentFirstName ?? ''} ${item.agentLastName ?? ''}`.trim() || item.agentEmail;
      if (!window.confirm(`¿Rechazar la solicitud de ${name} con ${item.developerName}?`)) return;
      try {
        await rejectMutation.mutateAsync({ associationId: item.id, data: {} });
        toast.success('Solicitud rechazada correctamente');
        refetch();
      } catch {
        toast.error('No se pudo rechazar la solicitud');
      }
    },
    [rejectMutation, refetch],
  );

  return {
    requests,
    totalElements,
    counts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter: setStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    clearFilters,
    handleApprove,
    handleReject,
    isReviewing: approveMutation.isPending || rejectMutation.isPending,
    refetch,
  };
}
