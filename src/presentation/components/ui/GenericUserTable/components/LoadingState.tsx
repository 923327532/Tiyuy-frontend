import type { GenericColumn, GenericUser, SearchConfig } from '../types';
import { SearchInput } from './SearchInput';
import { TableHeader } from './TableHeader';

interface LoadingStateProps<T extends GenericUser> {
  className: string;
  columns: GenericColumn<T>[];
  placeholder: string;
  searchConfig: SearchConfig;
  showSelection: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (key: string) => void;
}

/** Loading skeleton */
export function LoadingState<T extends GenericUser>({
  className,
  columns,
  placeholder,
  searchConfig,
  showSelection,
  sortBy,
  sortOrder,
  onSort,
}: LoadingStateProps<T>) {
  return (
    <div className={`generic-table__container ${className}`}>
      <div className="generic-table__search-bar">
        <SearchInput
          value=""
          onChange={() => {}}
          placeholder={placeholder}
          config={searchConfig}
        />
      </div>
      <div className="generic-table__wrapper">
        <table className="generic-table" role="table">
          <TableHeader<T>
            columns={columns}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
            showCheckboxPlaceholder={showSelection}
          />
          <tbody className="generic-table__body">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="generic-table__row animate-pulse">
                {showSelection && <td className="generic-table__td" />}
                {columns.map((col) => (
                  <td key={col.key} className="generic-table__td">
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
