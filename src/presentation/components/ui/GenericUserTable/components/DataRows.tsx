import { Check } from 'lucide-react';
import type { GenericColumn, GenericUser } from '../types';

interface DataRowsProps<T extends GenericUser> {
  rows: T[];
  columns: GenericColumn<T>[];
  getRowKey: (row: T) => string;
  selectedRows: T[];
  onRowSelect?: (row: T, checked: boolean) => void;
  onRowClick?: (user: T) => void;
  striped: boolean;
  hoverable: boolean;
  rowClassName?: (row: T, index: number) => string;
}

/** Data rows (rendered inside tbody) */
export function DataRows<T extends GenericUser>({
  rows,
  columns,
  getRowKey,
  selectedRows,
  onRowSelect,
  onRowClick,
  striped,
  hoverable,
  rowClassName,
}: DataRowsProps<T>) {
  return (
    <>
      {rows.map((row, index) => {
        const key = getRowKey(row);
        const isSelected = selectedRows.some((r) => getRowKey(r) === key);

        return (
          <tr
            key={key}
            className={`generic-table__row ${striped && index % 2 === 1 ? 'generic-table__row--striped' : ''} ${hoverable ? 'generic-table__row--hoverable' : ''} ${onRowClick ? 'generic-table__row--clickable' : ''} ${isSelected ? 'generic-table__row--selected' : ''} ${rowClassName ? rowClassName(row, index) : ''}`}
            onClick={() => onRowClick?.(row)}
          >
            {onRowSelect && (
              <td className="generic-table__td generic-table__td--checkbox">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={isSelected ? `Deseleccionar fila ${index + 1}` : `Seleccionar fila ${index + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowSelect(row, !isSelected);
                  }}
                  className="generic-table__row-checkbox"
                >
                  {isSelected ? <Check className="w-3 h-3 text-white" strokeWidth={3} /> : null}
                </button>
              </td>
            )}
            {columns.map((col) => (
              <td
                key={col.key}
                className={`generic-table__td ${col.align === 'center' ? 'generic-table__td--center' : col.align === 'right' ? 'generic-table__td--right' : ''} ${col.className || ''}`}
              >
                {col.render
                  ? col.render(row[col.key as keyof T], row, index)
                  : String(row[col.key as keyof T] ?? '—')}
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}
