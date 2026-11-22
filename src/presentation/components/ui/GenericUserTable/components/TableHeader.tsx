import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import type { GenericColumn, GenericUser } from '../types';

interface TableHeaderProps<T extends GenericUser> {
  columns: GenericColumn<T>[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (key: string) => void;
  selectAll?: {
    allSelected: boolean;
    someSelected: boolean;
    onSelectAll: (checked: boolean) => void;
  };
  showCheckboxPlaceholder?: boolean;
}

/** Shared table header (with optional select-all checkbox) */
export function TableHeader<T extends GenericUser>({
  columns,
  sortBy,
  sortOrder,
  onSort,
  selectAll,
  showCheckboxPlaceholder,
}: TableHeaderProps<T>) {
  return (
    <thead className="generic-table__head">
      <tr>
        {selectAll && (
          <th className="generic-table__th generic-table__th--checkbox" scope="col">
            <button
              type="button"
              role="checkbox"
              aria-checked={selectAll.allSelected ? 'true' : selectAll.someSelected ? 'mixed' : 'false'}
              aria-label={selectAll.allSelected ? 'Deseleccionar todas las filas' : 'Seleccionar todas las filas'}
              onClick={() => selectAll.onSelectAll(!selectAll.allSelected)}
              className="generic-table__select-all"
            >
              {selectAll.allSelected || selectAll.someSelected ? (
                <Check className={`w-4 h-4 ${selectAll.allSelected ? 'text-brand-600' : 'text-slate-400'}`} strokeWidth={3} />
              ) : (
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                </svg>
              )}
            </button>
          </th>
        )}
        {!selectAll && showCheckboxPlaceholder && <th className="generic-table__th generic-table__th--checkbox" scope="col" />}
        {columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={`generic-table__th ${col.sortable ? 'generic-table__th--sortable' : ''} ${col.align === 'center' ? 'generic-table__th--center' : col.align === 'right' ? 'generic-table__th--right' : ''} ${col.headerClassName || ''}`}
            style={{ width: col.width, minWidth: col.minWidth }}
            onClick={() => col.sortable && onSort(col.key)}
          >
            <div className="generic-table__th-content">
              {col.label}
              {col.sortable && sortBy === col.key && sortOrder && (
                <span className="generic-table__sort-icon" aria-hidden="true">
                  {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
