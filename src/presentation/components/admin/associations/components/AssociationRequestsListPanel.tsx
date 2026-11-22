'use client';

import type { useAssociationRequests } from '../hooks/useAssociationRequests';
import { AssociationRequestsFilters } from './AssociationRequestsFilters';
import { AssociationRequestsTable } from './AssociationRequestsTable';
import { AssociationRequestCardView } from './AssociationRequestCardView';
import { UsersViewToggle } from '@/presentation/components/admin/users/components/view-toolbar';
import { UsersPagination } from '@/presentation/components/admin/users/components/pagination';
import {
  UsersLoadingState,
  UsersErrorState,
  UsersEmptyState,
} from '@/presentation/components/admin/users/components/page-feedback';

interface Props {
  data: ReturnType<typeof useAssociationRequests>;
}

export function AssociationRequestsListPanel({ data }: Props) {
  const hasRequests = data.requests.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <AssociationRequestsFilters
        searchQuery={data.searchQuery}
        onSearchChange={data.setSearchQuery}
        statusFilter={data.statusFilter}
        onStatusChange={data.setStatusFilter}
        sortBy={data.sortBy}
        onSortChange={data.setSortBy}
        onClear={data.clearFilters}
      />

      {!data.isLoading && hasRequests && (
        <UsersViewToggle value={data.viewMode} onChange={data.setViewMode} />
      )}

      {data.isLoading && <UsersLoadingState message="Cargando solicitudes de asociación..." />}
      {Boolean(data.error) && <UsersErrorState error={data.error} onRetry={data.refetch} />}
      {!data.isLoading && !data.error && !hasRequests && (
        <UsersEmptyState
          onClear={data.clearFilters}
          title="No se encontraron solicitudes de asociación"
          description="Intenta ajustar tu búsqueda o cambiar el estado seleccionado."
        />
      )}

      {!data.isLoading && !data.error && hasRequests && data.viewMode === 'table' && (
        <>
          <AssociationRequestsTable
            requests={data.requests}
            isLoading={data.isLoading}
            isReviewing={data.isReviewing}
            onApprove={data.handleApprove}
            onReject={data.handleReject}
          />
          <UsersPagination
            currentPage={data.currentPage}
            pageSize={data.pageSize}
            totalElements={data.totalElements}
            onPageChange={data.setCurrentPage}
            onPageSizeChange={data.setPageSize}
            itemLabel="solicitudes"
          />
        </>
      )}

      {!data.isLoading && !data.error && hasRequests && data.viewMode === 'cards' && (
        <>
          <AssociationRequestCardView
            requests={data.requests}
            isReviewing={data.isReviewing}
            onApprove={data.handleApprove}
            onReject={data.handleReject}
          />
          <UsersPagination
            currentPage={data.currentPage}
            pageSize={data.pageSize}
            totalElements={data.totalElements}
            onPageChange={data.setCurrentPage}
            onPageSizeChange={data.setPageSize}
            itemLabel="solicitudes"
          />
        </>
      )}
    </div>
  );
}
