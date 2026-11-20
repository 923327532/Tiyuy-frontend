'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { UsersPaginationProps } from '@/presentation/components/admin/users/types/users.types';

import './styles/UsersPagination.css';

export function UsersPagination({
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'usuarios',
}: UsersPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startItem = totalElements === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalElements);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== safePage) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    onPageSizeChange(newSize);
    onPageChange(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (safePage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (safePage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages);
    }

    return pages;
  };

  return (
    <nav className="users-pagination" aria-label={`Paginación de ${itemLabel}`}>
      <div className="users-pagination__info">
        <span className="users-pagination__info-text">
          Mostrando <strong>{startItem}</strong> a <strong>{endItem}</strong> de{' '}
          <strong>{totalElements}</strong> {itemLabel}
        </span>
      </div>

      <div className="users-pagination__controls">
        <div className="users-pagination__size">
          <label htmlFor="users-page-size" className="users-pagination__size-label">
            Por página:
          </label>
          <select
            id="users-page-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="users-pagination__size-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="users-pagination__nav">
          <button
            type="button"
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage === 1 || totalElements === 0}
            className="users-pagination__btn users-pagination__btn--prev"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <div className="users-pagination__pages">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="users-pagination__ellipsis">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === safePage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`users-pagination__page ${isActive ? 'users-pagination__page--active' : ''}`}
                  aria-label={`Página ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage === totalPages || totalElements === 0}
            className="users-pagination__btn users-pagination__btn--next"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}
