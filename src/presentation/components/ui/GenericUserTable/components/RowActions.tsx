'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { GenericAction, GenericUser } from '../types';

/** Row actions dropdown/menu */
export function RowActions<T extends GenericUser>({
  user,
  actions,
  onRowClick,
}: {
  user: T;
  actions: GenericAction<T>[];
  onRowClick?: (user: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, actions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          const action = actions[focusedIndex];
          if (!action.disabled?.(user)) {
            // We need to create a synthetic event for the onClick
            action.onClick(user, e.nativeEvent as unknown as React.MouseEvent);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.generic-table__actions-dropdown')) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const visibleActions = actions.filter((action) => action.show?.(user) !== false);

  if (visibleActions.length === 0) return null;

  // If only one action and no row click, render it directly
  if (visibleActions.length === 1 && !onRowClick) {
    const action = visibleActions[0];
    return (
      <button
        type="button"
        className={`generic-table__action-btn generic-table__action-btn--${action.variant || 'ghost'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!action.disabled?.(user)) action.onClick(user, e);
        }}
        disabled={action.disabled?.(user)}
        aria-label={action.ariaLabel?.(user) ?? (typeof action.label === 'function' ? action.label(user) : action.label)}
      >
        {action.icon}
        <span className="generic-table__action-label">{typeof action.label === 'function' ? action.label(user) : action.label}</span>
      </button>
    );
  }

  return (
    <div className="generic-table__actions-dropdown" onKeyDown={handleKeyDown}>
      <button
        type="button"
        className="generic-table__actions-trigger"
        aria-label="Más acciones"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          setFocusedIndex(0);
        }}
      >
        <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="generic-table__actions-menu" role="menu">
          {onRowClick && (
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={`generic-table__action-item ${focusedIndex === -1 ? 'generic-table__action-item--focused' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onRowClick(user);
                setIsOpen(false);
              }}
              onFocus={() => setFocusedIndex(-1)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Ver detalle</span>
            </button>
          )}
          {visibleActions.map((action, index) => (
            <button
              key={action.key}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={`generic-table__action-item ${action.variant === 'danger' ? 'generic-table__action-item--danger' : ''} ${focusedIndex === index ? 'generic-table__action-item--focused' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!action.disabled?.(user)) {
                  action.onClick(user, e);
                }
                setIsOpen(false);
              }}
              disabled={action.disabled?.(user)}
              onFocus={() => setFocusedIndex(index)}
              aria-label={action.ariaLabel?.(user) ?? (typeof action.label === 'function' ? action.label(user) : action.label)}
            >
              {action.icon && <span className="generic-table__action-icon">{action.icon}</span>}
              <span>{typeof action.label === 'function' ? action.label(user) : action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
