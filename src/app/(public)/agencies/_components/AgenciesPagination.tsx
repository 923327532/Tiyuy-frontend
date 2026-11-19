import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number; // Index basado en 0
  totalPages: number;
  onChange: (page: number) => void;
}

function getPages(current: number, total: number): (number | '…')[] {
  const nums = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const result: (number | '…')[] = [];

  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) {
      result.push('…');
    }
    result.push(n);
  });

  return result;
}

const ARROW_BUTTON_STYLES =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition-all duration-200 hover:border-[#4A9A3E] hover:text-[#4A9A3E] disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] focus-visible:ring-offset-2';

export default function AgenciesPagination({
  page,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) return null;

  const currentPage = Math.min(Math.max(page, 0), totalPages - 1);
  const pages = getPages(currentPage + 1, totalPages);

  return (
    <nav
      aria-label="Paginación del directorio de inmobiliarias"
      className="flex flex-wrap items-center justify-center gap-2 pb-8 pt-10"
    >
      {/* Página anterior */}
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={ARROW_BUTTON_STYLES}
        aria-label="Ir a la página anterior"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1.5">
        {pages.map((p, index) =>
          p === '…' ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="flex h-10 w-7 select-none items-center justify-center text-sm text-stone-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p - 1)}
              aria-label={`Ir a la página ${p}`}
              aria-current={currentPage === p - 1 ? 'page' : undefined}
              className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] focus-visible:ring-offset-2 ${
                currentPage === p - 1
                  ? 'bg-[#4A9A3E] text-white shadow-sm'
                  : 'border border-stone-200 bg-white text-stone-500 hover:border-[#4A9A3E] hover:text-[#4A9A3E]'
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Página siguiente */}
      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={ARROW_BUTTON_STYLES}
        aria-label="Ir a la página siguiente"
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </nav>
  );
}
