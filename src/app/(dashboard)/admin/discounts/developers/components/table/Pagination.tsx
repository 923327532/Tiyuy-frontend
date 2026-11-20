/**
 * Pagination Component
 * Handles pagination for the discounts table
 */

import { Button } from '@/presentation/components/ui/Button';
import { Select } from '@/presentation/components/ui/Select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <span>
          Mostrando <strong>{startIndex}</strong> a <strong>{endIndex}</strong> de <strong>{totalElements}</strong>
        </span>
        <Select
          value={pageSize.toString()}
          onChange={(v: string) => onPageSizeChange(parseInt(v))}
          options={PAGE_SIZE_OPTIONS}
          placeholder="Por página"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
          {currentPage + 1} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}