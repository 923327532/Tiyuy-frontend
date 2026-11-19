interface PaginationProps {
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export function Pagination({ pagination }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {pagination.hasPrevious && (
        <a
          href={`?page=${pagination.currentPage - 1}`}
          className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-tertiary)]"
        >
          ← Anterior
        </a>
      )}

      <span className="px-4 py-2 text-[var(--text-secondary)]">
        Página {pagination.currentPage + 1} de {pagination.totalPages}
      </span>

      {pagination.hasNext && (
        <a
          href={`?page=${pagination.currentPage + 1}`}
          className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-tertiary)]"
        >
          Siguiente →
        </a>
      )}
    </div>
  );
}
