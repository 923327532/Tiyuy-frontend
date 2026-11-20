'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import './styles/InternationalPagination.css';

interface InternationalPaginationProps {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function InternationalPagination({
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
}: InternationalPaginationProps) {
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
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="intl-pagination" aria-label="Paginación de solicitudes internacionales">
      {/* Info section */}
      <div className="intl-pagination__info">
        <span className="intl-pagination__info-text">
          Mostrando <strong>{startItem}</strong> a <strong>{endItem}</strong> de{' '}
          <strong>{totalElements}</strong> solicitudes
        </span>
      </div>

      {/* Controls section */}
      <div className="intl-pagination__controls">
        {/* Page size selector */}
        <div className="intl-pagination__size">
          <label htmlFor="intl-page-size" className="intl-pagination__size-label">
            Por página:
          </label>
          <select
            id="intl-page-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="intl-pagination__size-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page navigation */}
        <div className="intl-pagination__nav">
          {/* Previous button */}
          <button
            type="button"
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage === 1}
            className="intl-pagination__btn intl-pagination__btn--prev"
            aria-label="Página anterior"
          >
            <ChevronLeft className="intl-pagination__btn-icon" aria-hidden="true" />
          </button>

          {/* Page numbers */}
          <div className="intl-pagination__pages">
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`intl-pagination__page ${safePage === page ? 'intl-pagination__page--active' : ''}`}
                  aria-label={`Página ${page}`}
                  aria-current={safePage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="intl-pagination__ellipsis">
                  {page}
                </span>
              ),
            )}
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage === totalPages}
            className="intl-pagination__btn intl-pagination__btn--next"
            aria-label="Página siguiente"
          >
            <ChevronRight className="intl-pagination__btn-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}
