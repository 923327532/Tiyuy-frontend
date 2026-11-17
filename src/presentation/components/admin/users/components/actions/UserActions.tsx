'use client';

import { useRef, useEffect, useState } from 'react';
import { MoreVertical, UserX, UserCheck, Trash2, Eye, Home, Building2 } from 'lucide-react';
import type { UserActionsProps } from '@/presentation/components/admin/users/types/users.types';

import './styles/UserActions.css';

export function UserActions({
  user,
  onViewDetail,
  onToggleStatus,
  onDelete,
  onViewProperties,
  onViewProjects,
  canManage,
  canDelete,
  isTogglePending,
  isDeletePending,
}: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
  const role = user.role ?? 'USER';
  const showProduction =
    role === 'AGENT' || role === 'DEVELOPER' || (user.publishedPropertiesCount ?? 0) > 0 || (user.publishedProjectsCount ?? 0) > 0;

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="user-actions" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={`user-actions__trigger ${isOpen ? 'user-actions__trigger--open' : ''}`}
        aria-label={`Acciones para ${fullName}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical className="user-actions__trigger-icon" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="user-actions__dropdown" role="menu">
          <div className="user-actions__dropdown-inner">
            <div className="user-actions__group">
              <button onClick={() => handleAction(onViewDetail)} className="user-actions__item user-actions__item--view" role="menuitem">
                <Eye className="user-actions__item-icon" aria-hidden="true" />
                <span className="user-actions__item-label">Ver detalle</span>
              </button>

              {showProduction && (user.publishedPropertiesCount ?? 0) > 0 && (
                <button onClick={() => handleAction(onViewProperties)} className="user-actions__item user-actions__item--properties" role="menuitem">
                  <Home className="user-actions__item-icon" aria-hidden="true" />
                  <span className="user-actions__item-label">Ver propiedades</span>
                  <span className="user-actions__item-count">{user.publishedPropertiesCount}</span>
                </button>
              )}

              {showProduction && (user.publishedProjectsCount ?? 0) > 0 && (
                <button onClick={() => handleAction(onViewProjects)} className="user-actions__item user-actions__item--projects" role="menuitem">
                  <Building2 className="user-actions__item-icon" aria-hidden="true" />
                  <span className="user-actions__item-label">Ver proyectos</span>
                  <span className="user-actions__item-count">{user.publishedProjectsCount}</span>
                </button>
              )}
            </div>

            {(canManage || canDelete) && <div className="user-actions__divider" aria-hidden="true" />}

            {(canManage || canDelete) && (
              <div className="user-actions__group">
                {canManage && (
                  <button
                    onClick={() => handleAction(onToggleStatus)}
                    disabled={isTogglePending}
                    className={`user-actions__item ${user.enabled ? 'user-actions__item--suspend' : 'user-actions__item--activate'}`}
                    role="menuitem"
                  >
                    {user.enabled ? <UserX className="user-actions__item-icon" aria-hidden="true" /> : <UserCheck className="user-actions__item-icon" aria-hidden="true" />}
                    <span className="user-actions__item-label">
                      {isTogglePending ? 'Procesando...' : user.enabled ? 'Suspender' : 'Reactivar'}
                    </span>
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => handleAction(onDelete)}
                    disabled={isDeletePending}
                    className="user-actions__item user-actions__item--delete"
                    role="menuitem"
                  >
                    <Trash2 className="user-actions__item-icon" aria-hidden="true" />
                    <span className="user-actions__item-label">
                      {isDeletePending ? 'Eliminando...' : 'Eliminar'}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
