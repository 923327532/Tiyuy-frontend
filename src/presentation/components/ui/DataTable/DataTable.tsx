'use client';

import React, { useMemo } from 'react';
import { ChevronUp, ChevronDown, Check, ChevronRight } from 'lucide-react';
import { Select } from '@/presentation/components/ui/Select';
import { IconButton } from '@/presentation/components/ui/Button';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  /** Data rows */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique key for each row */
  rowKey: keyof T | ((row: T) => string);
  /** Selection */
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  /** Sorting */
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state */
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  /** Custom row className */
  rowClassName?: (row: T, index: number) => string;
  /** Striped rows */
  striped?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
  /** Custom className */
  className?: string;
  /** Additional classes for the table element */
  tableClassName?: string;
}

function SortIcon({ order }: { order: 'asc' | 'desc' }) {
  return order === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
}

function Checkbox({ checked, indeterminate, onChange, disabled, ariaLabel }: {
  checked: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange && !disabled && onChange(!checked)}
      className={`
        w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
        ${indeterminate
          ? 'bg-slate-900 border-slate-900 text-white'
          : checked
            ? 'bg-brand-500 border-brand-500 text-white'
            : 'border-slate-300 bg-white text-transparent'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-400'}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50
      `}
    >
      {checked && <Check className="w-3 h-3" strokeWidth={3} />}
    </button>
  );
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  selectedRows = [],
  onSelectionChange,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No hay datos disponibles',
  emptyIcon,
  rowClassName,
  striped = true,
  hoverable = true,
  className = '',
  tableClassName = '',
}: DataTableProps<T>) {
  const getRowKey = useMemo(() => {
    if (typeof rowKey === 'function') return rowKey;
    return (row: T) => String(row[rowKey]);
  }, [rowKey]);

  const allSelected = data.length > 0 && data.every((row) => selectedRows.some((r) => getRowKey(r) === getRowKey(row)));
  const someSelected = data.length > 0 && data.some((row) => selectedRows.some((r) => getRowKey(r) === getRowKey(row)));

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(data);
    } else {
      onSelectionChange([]);
    }
  };

  const handleRowSelect = (row: T, checked: boolean) => {
    if (!onSelectionChange) return;
    const key = getRowKey(row);
    if (checked) {
      onSelectionChange([...selectedRows, row]);
    } else {
      onSelectionChange(selectedRows.filter((r) => getRowKey(r) !== key));
    }
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {columns.map((col) => (
        <td key={col.key} className="px-4 py-3">
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
        </td>
      ))}
    </tr>
  );

  if (isLoading) {
    return (
      <div className={className}>
        <div className="overflow-x-auto">
          <table className={`w-full ${tableClassName}`} role="table">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {onSelectionChange && (
                  <th className="w-8 px-2 py-3 text-left" />
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`
                      px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
                      ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}
                      ${col.headerClassName || ''}
                    `}
                    style={{ width: col.width }}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${className} py-12 text-center`}>
        {emptyIcon && (
          <div className="mx-auto mb-4 w-16 h-16 text-slate-300">
            {emptyIcon}
          </div>
        )}
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${className} overflow-x-auto`}>
      <table className={`w-full ${tableClassName}`} role="table">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {onSelectionChange && (
              <th
                className="w-8 px-2 py-3 text-left"
                scope="col"
              >
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={handleSelectAll}
                  ariaLabel={allSelected ? 'Deseleccionar todas las filas' : 'Seleccionar todas las filas'}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
                  ${col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''}
                  ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}
                  ${col.headerClassName || ''}
                `}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortBy === col.key && sortOrder && <SortIcon order={sortOrder} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, index) => {
            const key = getRowKey(row);
            const isSelected = selectedRows.some((r) => getRowKey(r) === key);

            return (
              <tr
                key={key}
                className={`
                  transition-colors
                  ${striped && index % 2 === 1 ? 'bg-slate-50/50' : ''}
                  ${hoverable ? 'hover:bg-slate-50' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${isSelected ? 'bg-brand-50/50' : ''}
                  ${rowClassName ? rowClassName(row, index) : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {onSelectionChange && (
                  <td className="px-2 py-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={(checked) => handleRowSelect(row, checked)}
                      ariaLabel={isSelected ? `Deseleccionar fila ${index + 1}` : `Seleccionar fila ${index + 1}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      px-4 py-3 text-sm text-slate-900
                      ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}
                      ${col.className || ''}
                    `}
                  >
                    {col.render
                      ? col.render(row[col.key as keyof T], row, index)
                      : String(row[col.key as keyof T] ?? '—')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

DataTable.displayName = 'DataTable';

/** TablePagination - Pagination component for tables */
export interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function TablePagination({
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalElements / pageSize);
  const start = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalElements);

  if (totalPages <= 1 && totalElements <= pageSizeOptions[0]) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 ${className}`}>
      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-600">
          Mostrando <span className="font-medium">{start}</span> a{' '}
          <span className="font-medium">{end}</span> de{' '}
          <span className="font-medium">{totalElements}</span> resultados
        </p>

        <Select
          value={String(pageSize)}
          onChange={(value) => onPageSizeChange(Number(value))}
          options={pageSizeOptions.map((size) => ({ value: String(size), label: `${size} por página` }))}
          className="w-auto min-w-[150px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          icon={<ChevronRight className="w-4 h-4 rotate-180" />}
          ariaLabel="Página anterior"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="ghost"
          size="sm"
        />
        <span className="text-sm text-slate-600">
          Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
        </span>
        <IconButton
          icon={<ChevronRight className="w-4 h-4" />}
          ariaLabel="Página siguiente"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="ghost"
          size="sm"
        />
      </div>
    </div>
  );
}
