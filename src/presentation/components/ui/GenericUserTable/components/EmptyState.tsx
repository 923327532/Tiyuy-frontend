import type { ReactNode } from 'react';
import type { SearchConfig } from '../types';
import { SearchInput } from './SearchInput';

interface EmptyStateProps {
  className: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  searchConfig: SearchConfig;
  emptyMessage: string;
  emptyIcon?: ReactNode;
}

/** Empty state */
export function EmptyState({
  className,
  searchQuery,
  onSearchChange,
  placeholder,
  searchConfig,
  emptyMessage,
  emptyIcon,
}: EmptyStateProps) {
  return (
    <div className={`generic-table__container ${className}`}>
      <div className="generic-table__search-bar">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={placeholder}
          config={searchConfig}
        />
      </div>
      <div className="generic-table__empty">
        {emptyIcon && (
          <div className="generic-table__empty-icon" aria-hidden="true">
            {emptyIcon}
          </div>
        )}
        <p className="generic-table__empty-message">{emptyMessage}</p>
        {searchQuery && (
          <p className="generic-table__empty-hint">Intenta con otros términos de búsqueda</p>
        )}
      </div>
    </div>
  );
}
