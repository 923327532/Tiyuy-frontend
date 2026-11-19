'use client';

import { useEffect, useState } from 'react';
import { Globe2 } from 'lucide-react';
import type { InternationalUserListItem } from '@/core/domain/entities/Admin';
import { InternationalPagination } from '../pagination';
import { InternationalCardView } from './cards';
import { InternationalViewToggle, type InternationalViewMode } from './InternationalViewToggle';
import { InternationalTableView } from './table';

import './styles/InternationalListPanel.css';

interface Props {
  users: InternationalUserListItem[];
  isLoading: boolean;
  hasFilter: boolean;
  page: number;
  pageSize: number;
  totalElements: number;
  canReview?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetail: (user: InternationalUserListItem) => void;
  onApprove?: (user: InternationalUserListItem) => void;
  onReject?: (user: InternationalUserListItem) => void;
}

export function InternationalListPanel({
  users,
  isLoading,
  hasFilter,
  page,
  pageSize,
  totalElements,
  canReview,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onApprove,
  onReject,
}: Props) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewMode, setViewMode] = useState<InternationalViewMode>('table');

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const effectiveViewMode: InternationalViewMode = viewMode;

  return (
    <div className="intlp-panel">
      {/* Header */}
      {!isLoading && users.length > 0 && (
        <header className="intlp-panel__header">
          <div className="intlp-panel__header-info" />
          <InternationalViewToggle value={viewMode} onChange={setViewMode} />
        </header>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="intlp-panel__loading">
          <div className="intlp-panel__spinner" aria-hidden="true" />
          <span>Cargando solicitudes...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="intlp-panel__empty">
          <div className="intlp-panel__empty-icon">
            <Globe2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="intlp-panel__empty-title">No hay solicitudes</p>
          <p className="intlp-panel__empty-text">
            {hasFilter
              ? 'No hay usuarios internacionales con este estado.'
              : 'Aún no hay usuarios internacionales registrados.'}
          </p>
        </div>
      ) : effectiveViewMode === 'table' ? (
        <InternationalTableView
          users={users}
          canReview={canReview}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onReject={onReject}
        />
      ) : (
        <InternationalCardView
          users={users}
          canReview={canReview}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}

      {/* Pagination */}
      {totalElements > 0 && (
        <InternationalPagination
          currentPage={page + 1}
          pageSize={pageSize}
          totalElements={totalElements}
          onPageChange={(p) => onPageChange(p - 1)}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
